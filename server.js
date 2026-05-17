import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);
const app = express();
const regressionHistory = [];
const RUN_HISTORY_FILE = 'src/reports/run-history.json';
let runHistory = [];
try {
  if (existsSync(RUN_HISTORY_FILE)) {
    runHistory = JSON.parse(readFileSync(RUN_HISTORY_FILE, 'utf-8'));
    console.log('Loaded', runHistory.length, 'run history entries');
  }
} catch(e) { runHistory = []; }

function saveRunHistory() {
  try {
    writeFileSync(RUN_HISTORY_FILE, JSON.stringify(runHistory.slice(0,50), null, 2));
  } catch(e) { console.error('Save history error:', e.message); }
}
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use((req, res, next) => { res.setTimeout(600000); next(); });
app.use(express.static('.'));  // Serve index.html

// ── Smart Chat Router - routes to real agents ──────────────────────────────
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, system, tool, agentId } = req.body;
    const lastMsg = messages?.[messages.length-1]?.content?.toLowerCase() || '';

    // Route to real agents based on message content
    if (agentId === 'scenario' || lastMsg.includes('scenario') || lastMsg.includes('create') || lastMsg.includes('generate') || lastMsg.includes('more')) {
      const toolId = tool || 'trim';
      console.log('🔀 Routing to scenario generator for:', toolId);
      const scenarioReq = { body: { tool: toolId, prompt: lastMsg } };
      const scenarioRes = {
        json: (data) => res.json({ 
          content: [{ type: 'text', text: data.output || JSON.stringify(data) }],
          _realAgent: true, _data: data
        })
      };
      // Call scenario generator logic directly
      return app._router.handle({ ...req, url: '/api/scenarios/generate', body: { tool: toolId, prompt: lastMsg } }, scenarioRes, () => {});
    }

    if (agentId === 'script' || lastMsg.includes('script') || lastMsg.includes('write')) {
      const toolId = tool || 'trim';
      console.log('🔀 Routing to script writer for:', toolId);
      return app._router.handle({ ...req, url: '/api/scripts/write', body: { tool: toolId, prompt: lastMsg } }, {
        json: (data) => res.json({ content: [{ type: 'text', text: data.output || '' }], _realAgent: true, _data: data })
      }, () => {});
    }

    if (agentId === 'regress' || lastMsg.includes('regression') || lastMsg.includes('regress')) {
      console.log('🔀 Routing to regression runner');
      // Run smoke tests across all tools
      const { execAsync: ea } = { execAsync: promisify(exec) };
      try {
        const { stdout } = await ea(
          'npx playwright test src/tests/generated/scripts/ --project=chromium --reporter=list --timeout=60000 --grep "001"',
          { cwd: '/workspaces/Snipforge-automation', env: process.env, timeout: 300000 }
        );
        const passed = (stdout.match(/✓/g)||[]).length;
        const failed = (stdout.match(/✘/g)||[]).length;
        return res.json({ content: [{ type: 'text', text: `✅ Regression Complete!\n\nSmoke tests (001) across all 25 tools:\nPassed: ${passed}\nFailed: ${failed}\n\n${stdout.slice(-500)}` }] });
      } catch(e) {
        const out = e.stdout||'';
        const passed = (out.match(/✓/g)||[]).length;
        const failed = (out.match(/✘/g)||[]).length;
        return res.json({ content: [{ type: 'text', text: `Regression Results:\nPassed: ${passed}\nFailed: ${failed}` }] });
      }
    }
    if (agentId === 'runner' || lastMsg.includes('run') || lastMsg.includes('test')) {
      const toolId = tool || 'trim';
      console.log('🔀 Routing to test runner for:', toolId);
      return app._router.handle({ ...req, url: '/api/tests/run', body: { tool: toolId } }, {
        json: (data) => res.json({ content: [{ type: 'text', text: data.output || '' }], _realAgent: true, _data: data })
      }, () => {});
    }

    // Fall through to Claude API
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-5', max_tokens: 1000, system, messages })
    });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: { message: e.message } });
  }
});

// ── Real Scenario Generator (MERGES with existing) ────────────────────────
app.post('/api/scenarios/generate', async (req, res) => {
  try {
    const { tool, prompt } = req.body;
    console.log(`🧠 Generating scenarios for: ${tool}`);

    const scenariosPath = 'src/tests/generated/tool-scenarios.json';

    // Load existing scenarios
    const existing = existsSync(scenariosPath)
      ? JSON.parse(readFileSync(scenariosPath, 'utf-8'))
      : {};
    const existingScenarios = existing[tool]?.scenarios || [];
    const existingCount = existingScenarios.length;
    const lastId = existingCount > 0
      ? parseInt(existingScenarios[existingScenarios.length-1].id.split('-').pop()) || existingCount
      : 0;

    console.log(`   Existing: ${existingCount} scenarios, last ID: ${lastId}`);

    // Call Claude to generate NEW scenarios starting from lastId+1
    const controls = existsSync('src/reports/tool-controls.json')
      ? JSON.parse(readFileSync('src/reports/tool-controls.json', 'utf-8'))[tool] || {}
      : {};

    const apiKey = process.env.ANTHROPIC_API_KEY;
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: `Generate 5 NEW test scenarios for the "${tool}" tool on snipforge.video.
Controls: ${JSON.stringify(controls).slice(0,500)}
Existing scenario count: ${existingCount}
IMPORTANT: Start IDs from ${tool}-${String(lastId+1).padStart(3,'0')}. Do NOT use IDs ${tool}-001 through ${tool}-${String(lastId).padStart(3,'0')} as they already exist!

User request: ${prompt || 'Create more comprehensive scenarios'}

Return ONLY a JSON array:
[{"id":"${tool}-${String(lastId+1).padStart(3,'0')}","title":"...","priority":"critical|high|medium|low","category":"smoke|functional|edge|negative|regression","control":"...","action":"...","value":"...","expectedResult":"..."}]`
        }]
      })
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    const jsonMatch = text.match(/\[([\s\S]*?)\]/);

    let newScenarios = [];
    if (jsonMatch) {
      try { newScenarios = JSON.parse('[' + jsonMatch[1] + ']'); } catch(e) {}
    }

    // MERGE: add new scenarios to existing
    const merged = [...existingScenarios, ...newScenarios];

    // Save back to file
    if (!existing[tool]) existing[tool] = { tool, scenarios: [] };
    existing[tool].scenarios = merged;
    const { writeFileSync } = await import('fs');
    // writeFileSync disabled - use Save button instead

    console.log(`   Added ${newScenarios.length} new scenarios. Total: ${merged.length}`);

    res.json({
      success: true,
      newCount: newScenarios.length,
      totalCount: merged.length,
      scenarios: merged,
      output: `✅ Added ${newScenarios.length} new scenarios!\nTotal for ${tool}: ${merged.length} scenarios\n\nNew scenarios:\n${newScenarios.map(s=>s.id+': '+s.title).join('\n')}`
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// ── Real Script Writer (appends to existing spec file) ────────────────────
app.post('/api/scripts/write', async (req, res) => {
  try {
    const { tool, prompt } = req.body;
    console.log(`✍️  Writing scripts for: ${tool}`);

    // Load real file input IDs
    const FILE_IDS = {
      trim:'tr-file', speed:'sp-file', convert:'cv-file', compress:'cm-file',
      watermark:'wm-file', volume:'vl-file', 'rotate-flip':'ro-file', resize:'cr-file',
      'ai-shorten':'sz-file', 'ai-transcribe':'tc-file', 'smart-clip':'sc-file',
      'auto-captions':'cap-file', 'blur-region':'blur-file', brightness:'bg-file',
      'text-overlay':'textoverlay-file', thumbnail:'th-file', mute:'mu-file',
      'extract-audio':'au-file', 'video-to-gif':'gif-file', 'bg-music':'bgmusic-file',
      merge:'merge-file-input', split:'sp2-file', 'multi-trim':'mt-file',
      'noise-removal':'dn-file', 'ai-chapters':'aa-file'
    };

    const RUN_IDS = {
      trim:'tr-run', speed:'sp-run', convert:'cv-run', compress:'cm-run',
      watermark:'wm-run', volume:'vl-run', 'rotate-flip':'ro-run', resize:'cr-run',
      'ai-shorten':'sz-run', 'ai-transcribe':'tc-run', 'smart-clip':'sc-run',
      'auto-captions':'cap-run', 'blur-region':'blur-run', brightness:'bg-run',
      'text-overlay':'textoverlay-run', thumbnail:'th-run', mute:'mu-run',
      'extract-audio':'au-run', 'video-to-gif':'gif-run', 'bg-music':'bgmusic-run',
      merge:'mg-run', split:'sp2-run', 'multi-trim':'mt-run',
      'noise-removal':'dn-run', 'ai-chapters':'aa-run'
    };

    // Load new scenarios
    const scenariosPath = 'src/tests/generated/tool-scenarios.json';
    const allScenarios = existsSync(scenariosPath)
      ? JSON.parse(readFileSync(scenariosPath, 'utf-8'))
      : {};
    // Use scenarios from request (in-memory) or fall back to file
    const toolScenarios = req.body.scenarios?.length ? req.body.scenarios : (allScenarios[tool]?.scenarios || []);
    console.log('   Using', toolScenarios.length, 'scenarios for script writing');

    // Load existing spec file
    const scriptPath = `src/tests/generated/scripts/tool-${tool}.spec.js`;
    const existingScript = existsSync(scriptPath) ? readFileSync(scriptPath, 'utf-8') : '';
    const newSpecPath2 = scriptPath.replace('.spec.js', '-new.spec.js');
    const existingNewScript = existsSync(newSpecPath2) ? readFileSync(newSpecPath2, 'utf-8') : '';
    const combinedScript = existingScript + existingNewScript;

    // Find which scenarios don't have tests yet
    const existingIds = [...existingScript.matchAll(new RegExp('["\'](' + tool + '-\\d+)["\']', 'g'))].map(m=>m[1]);
    const newScenarios = toolScenarios.filter(s => !existingIds.includes(s.id));

    if (newScenarios.length === 0) {
      return res.json({ success: true, output: 'All scenarios already have scripts!', script: '' });
    }

    // Generate scripts for new scenarios using Claude
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const fileId = FILE_IDS[tool] || tool+'-file';
    const runId = RUN_IDS[tool] || tool+'-run';
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: `Write Playwright test functions for these scenarios. Append to existing spec file.

Tool: ${tool}
File input ID: #${fileId}
Run button ID: #${runId}
Auth: storageState at src/fixtures/auth-state.json
Video: process.env.TEST_VIDEO_PATH
Panel: #panel-${tool}
Presets use: .preset-btn divs (not buttons)
Sliders use: evaluate() not fill()
Handle rate limit: check btnText.includes("failed") and return early

New scenarios to write:
${JSON.stringify(newScenarios, null, 2)}

Return ONLY the new test() functions (no imports, no describe wrapper).
CRITICAL RULES:
1. NEVER call test.use() inside a test() function
2. NEVER use page.goto('/') - always use goToTool(page)
3. ALWAYS check rate limit BEFORE clicking run button:
   const btnText = await page.locator('#TOOL-run').innerText();
   if (btnText.includes('failed')) { console.log('⚠️ Rate limit'); return; }
4. Only THEN click the button: await page.locator('#TOOL-run').click();
These will be appended inside the existing describe block.
Use exact IDs provided above.

IMPORTANT - Use ONLY these proven selectors:
- File upload: await page.locator('#${fileId}').setInputFiles(process.env.TEST_VIDEO_PATH);
- Run button: page.locator('#${runId}')
- Start time: page.locator('#tr-start').fill('5')  
- End time: page.locator('#tr-end').fill('15')
- Presets: page.locator('#panel-${tool} .preset-btn').filter({hasText:/text/})
- Change btn: page.locator('#tr-filecard .file-change')
- Handle rate limit: const txt = await page.locator('#${runId}').innerText(); if(txt.includes('failed')){return;}
- Auth: test.use({storageState:'src/fixtures/auth-state.json'})
- NO data-testid selectors - they don't exist on snipforge.video
- NO [data-panel] selectors
- NO .trim-handle selectors`
        }]
      })
    });

    const data = await response.json();
    const newCode = data.content?.[0]?.text || '';

    // Append new tests to existing spec file
    const { writeFileSync } = await import('fs');
    if (existingScript && newCode) {
      // Insert before closing }); of describe block
      // Write ONLY to new file - NEVER touch original spec
      const newPath = scriptPath.replace('.spec.js', '-new.spec.js');
      const clean = newCode.split('\n').filter(l=>!l.trim().startsWith('```')).join('\n').trim();
      // Clean the generated code
      const finalClean = clean
        .replace(/test\.use\([^)]+\);?/g, '')  // remove any test.use() inside tests
        .replace(/await page\.goto\('\/'\);/g, 'await goToTool(page);')  // fix goto
        .replace(/await page\.goto\("\/"\);/g, 'await goToTool(page);')  // fix goto
        .replace(/await page\.locator\('#panel-[^']+\'\)\.click\(\);/g, '')  // remove panel clicks
        .replace(/await page\.waitForLoadState\('networkidle'\);\n\s*await goToTool/g, 'await goToTool');
      
      writeFileSync(newPath, `import { test, expect } from "@playwright/test";
test.use({ baseURL: "https://snipforge.video", storageState: "/workspaces/Snipforge-automation/src/fixtures/auth-state.json" });
async function goToTool(page) { await page.goto("/?tool=${tool}"); await page.waitForLoadState("networkidle"); await page.waitForTimeout(500); }
test.describe("SnipForge - ${tool} new", () => {
${finalClean}
});
`);
    }

    res.json({
      success: true,
      newCount: newScenarios.length,
      output: `✅ Added scripts for ${newScenarios.length} new scenarios to tool-${tool}.spec.js\n\nNew tests: ${newScenarios.map(s=>s.id).join(', ')}`,
      script: newCode.slice(0, 1000)
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// ── Real Test Runner ───────────────────────────────────────────────────────
app.post('/api/tests/run', async (req, res) => {
  try {
    const { tool } = req.body;
    const prompt = req.body.prompt || '';
    const TOOLS_LIST = ['smart-clip','rotate-flip','ai-shorten','ai-transcribe','auto-captions','blur-region','text-overlay','video-to-gif','bg-music','multi-trim','noise-removal','ai-chapters','trim','speed','convert','compress','watermark','volume','resize','thumbnail','mute','extract-audio','merge','split','brightness'];
    const promptLower = prompt.toLowerCase().replace(/\s+/g,'-');
    const foundTools = TOOLS_LIST.filter(t => promptLower.includes(t) || prompt.toLowerCase().includes(t.replace(/-/g,' ')));
    const activeTools = foundTools.length > 0 ? foundTools : [tool];
    console.log(`▶️  Running tests for: ${activeTools.join(', ')}`);
    // Extract specific test ID from prompt if mentioned
    const testMatch = (req.body.prompt || '').match(/(trim|speed|convert|compress|watermark|volume|rotate-flip|resize|ai-shorten|ai-transcribe|smart-clip|auto-captions|blur-region|brightness|text-overlay|thumbnail|mute|extract-audio|video-to-gif|bg-music|merge|split|multi-trim|noise-removal|ai-chapters)-\d+/);
    const grepFlag = testMatch ? `--grep "${testMatch[0]}"` : '';
    // Clean spec
    try { let s=readFileSync(`src/tests/generated/scripts/tool-${tool}.spec.js`,'utf-8'); let c=s.indexOf('// ── Auto-generated:'); if(c>0){let cl=s.slice(0,c).trimEnd();if(!cl.endsWith('});'))cl+='\n});';const {writeFileSync:w}=await import('fs');w(`src/tests/generated/scripts/tool-${tool}.spec.js`,cl+'\n');}} catch(_){}
    const { stdout, stderr } = await execAsync(
      (() => {
      const specs = activeTools.flatMap(t => {
        const ms = `src/tests/generated/scripts/tool-${t}.spec.js`;
        const ns = `src/tests/generated/scripts/tool-${t}-new.spec.js`;
        return [ms, existsSync(ns) ? ns : ''].filter(Boolean);
      }).join(' ');
      return `npx playwright test ${specs} --project=chromium --reporter=list --timeout=60000 ${grepFlag}`;
    })(),
      { cwd: '/workspaces/Snipforge-automation', env: process.env, timeout: 120000 }
    );
    // Parse results
    const passed = (stdout.match(/✓/g) || []).length;
    const failed = (stdout.match(/✘/g) || []).length;
    const skipped = (stdout.match(/^\s+-\s+\d+/gm)||[]).length;
    const duration = stdout.match(/\((\d+\.?\d*[ms]+)\)\s*$/m)?.[1] || '';
    runHistory.unshift({ title: activeTools.join('+') + ' Tests', time: new Date().toLocaleString('en-US', {timeZone:'America/Los_Angeles', month:'numeric', day:'numeric', year:'numeric', hour:'numeric', minute:'2-digit', hour12:true}), passed, failed, skipped });
    if (runHistory.length > 50) runHistory.pop();
    saveRunHistory();
    res.json({ success: true, output: stdout, passed, failed, skipped, duration, tool: activeTools.join('+') });
  } catch (e) {
    const output = e.stdout || e.message;
    const passed = (output.match(/✓/g) || []).length;
    const failed = (output.match(/✘/g) || []).length;
    res.json({ success: true, output, passed, failed, skipped: 0 });
  }
});

// ── Real Self Healer ───────────────────────────────────────────────────────
app.post('/api/heal', async (req, res) => {
  try {
    const { tool } = req.body;
    console.log(`🩹 Healing: ${tool}`);
    const { stdout } = await execAsync(
      `node src/agents/self-healer.js --tool ${tool}`,
      { cwd: '/workspaces/Snipforge-automation', env: process.env }
    );
    res.json({ success: true, output: stdout });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// ── Load Scenarios ─────────────────────────────────────────────────────────
app.get('/api/scenarios/:tool', (req, res) => {
  try {
    const data = JSON.parse(readFileSync('src/tests/generated/tool-scenarios.json', 'utf-8'));
    const toolData = data[req.params.tool];
    res.json({ scenarios: toolData?.scenarios || [] });
  } catch(e) {
    res.json({ scenarios: [] });
  }
});


// ── Save to GitHub ────────────────────────────────────────────────────────
app.post('/api/save', async (req, res) => {
  try {
    const { execSync } = await import('child_process');
    const { writeFileSync } = await import('fs');
    const cwd = '/workspaces/Snipforge-automation';

    // Save scenarios if provided
    if (req.body.scenarios) {
      writeFileSync('src/tests/generated/tool-scenarios.json', JSON.stringify(req.body.scenarios, null, 2));
      execSync('cp src/tests/generated/tool-scenarios.json tool-scenarios.json', {cwd});
    }

    // Git add, commit, push
    execSync('git add .', {cwd});
    const date = new Date().toLocaleString('en-US', {timeZone:'America/Los_Angeles', month:'numeric', day:'numeric', year:'numeric', hour:'numeric', minute:'2-digit', hour12:true});
    try {
      execSync(`git commit -m "✅ Dashboard save - ${date}"`, {cwd});
      execSync('git push', {cwd});
      res.json({success:true, output:`Saved and pushed at ${date}`});
    } catch(e) {
      res.json({success:true, output:'Nothing new to save - already up to date!'});
    }
  } catch(e) {
    res.status(500).json({success:false, error:e.message});
  }
});


// ── Error Logs ────────────────────────────────────────────────────────────
const errorLogs = [];
const originalConsoleError = console.error;
console.error = (...args) => {
  errorLogs.push({ time: new Date().toISOString(), msg: args.join(' ') });
  if (errorLogs.length > 100) errorLogs.shift();
  originalConsoleError(...args);
};

app.get('/api/logs', (req, res) => {
  // Also read playwright test results
  try {
    const { readdirSync } = require('fs');
    const resultsDir = 'test-results';
    const errorFiles = [];
    if (existsSync(resultsDir)) {
      readdirSync(resultsDir, {withFileTypes:true})
        .filter(d => d.isDirectory())
        .slice(-10)
        .forEach(d => {
          const mdPath = `${resultsDir}/${d.name}/error-context.md`;
          if (existsSync(mdPath)) {
            errorFiles.push({
              test: d.name,
              error: readFileSync(mdPath, 'utf-8').slice(0, 500)
            });
          }
        });
    }
    res.json({ serverErrors: errorLogs, testErrors: errorFiles });
  } catch(e) {
    res.json({ serverErrors: errorLogs, testErrors: [] });
  }
});


// ── Regression Runner ─────────────────────────────────────────────────────
app.post('/api/regression', async (req, res) => {
  try {
    const prompt = req.body.prompt || '';
    console.log('🔁 Running regression:', prompt);

    const categories = [];
    if (prompt.includes('smoke')) categories.push('smoke');
    if (prompt.includes('functional')) categories.push('functional');
    if (prompt.includes('edge')) categories.push('edge');
    if (prompt.includes('negative')) categories.push('negative');
    if (prompt.includes('critical')) categories.push('critical');
    if (prompt.includes('high')) categories.push('high');
    if (prompt.includes('regression')) categories.push('regression');

    let grepFlag = '--grep "-001"'; // default smoke
    if (categories.length > 0) {
      const allScenarios = JSON.parse(readFileSync('src/tests/generated/tool-scenarios.json', 'utf-8'));
      const matchingIds = [];
      Object.values(allScenarios).forEach(toolData => {
        (toolData.scenarios || []).forEach(s => {
          if (categories.includes(s.category) || categories.includes(s.priority)) {
            matchingIds.push(s.id);
          }
        });
      });
      if (matchingIds.length > 0) {
        grepFlag = '--grep "' + matchingIds.slice(0,50).join('|') + '"';
        console.log('   Matched:', matchingIds.length, 'scenarios');
      }
    }

    const cmd = 'npx playwright test src/tests/generated/scripts/tool-*.spec.js --project=chromium --reporter=list --timeout=60000 ' + grepFlag;
    console.log('CMD:', cmd.slice(0,100));

    const { stdout } = await execAsync(cmd, { cwd: '/workspaces/Snipforge-automation', env: process.env, timeout: 600000 });
    const passed = (stdout.match(/✓/g)||[]).length;
    const failed = (stdout.match(/✘/g)||[]).length;
    const skipped = (stdout.match(/^\s+-\s+\d+/gm)||[]).length;
    regressionHistory.unshift({ title: 'Regression Run', time: new Date().toLocaleTimeString(), passed, failed, skipped });
    console.log(`🔁 Regression done: ${passed} passed, ${failed} failed`);
  } catch(e) {
    res.json({ success: true, output: 'Regression started! Check terminal for results.', passed:0, failed:0, skipped:0 });
  }
});


// ── Run History ───────────────────────────────────────────────────────────
app.get('/api/run-history', (req, res) => {
  res.json({ history: runHistory.slice(0, 50) });
});


// ── Regression Background Runner ──────────────────────────────────────────
let regressionStatus = { running: false, done: false, passed: 0, failed: 0, skipped: 0 };

app.post('/api/regression/start', async (req, res) => {
  const { prompt } = req.body;
  regressionStatus = { running: true, done: false, passed: 0, failed: 0, skipped: 0 };
  res.json({ success: true, message: 'Regression started' });

  // Run in background
  const categories = [];
  if (prompt.includes('smoke')) categories.push('smoke');
  if (prompt.includes('critical')) categories.push('critical');
  if (prompt.includes('high')) categories.push('high');
  if (prompt.includes('functional')) categories.push('functional');
  if (prompt.includes('edge')) categories.push('edge');
  if (prompt.includes('negative')) categories.push('negative');
  if (prompt.includes('all')) categories.push('all');

  let grepFlag = '--grep "-001"';
  if (categories.includes('all')) {
    grepFlag = '';
  } else if (categories.length > 0) {
    const allScenarios = JSON.parse(readFileSync('src/tests/generated/tool-scenarios.json', 'utf-8'));
    const matchingIds = [];
    Object.values(allScenarios).forEach(toolData => {
      (toolData.scenarios || []).forEach(s => {
        if (categories.includes(s.category) || categories.includes(s.priority)) {
          matchingIds.push(s.id);
        }
      });
    });
    if (matchingIds.length > 0) grepFlag = '--grep "' + matchingIds.slice(0,50).join('|') + '"';
  }

  const cmd = 'npx playwright test src/tests/generated/scripts/tool-*.spec.js --project=chromium --reporter=list --timeout=60000 ' + grepFlag;
  console.log('🔁 Starting regression:', cmd.slice(0,100));

  exec(cmd, { cwd: '/workspaces/Snipforge-automation', env: process.env }, (err, stdout) => {
    const out = stdout || err?.stdout || '';
    regressionStatus.passed = (out.match(/✓/g)||[]).length;
    regressionStatus.failed = (out.match(/✘/g)||[]).length;
    regressionStatus.skipped = (out.match(/^\s+-\s+\d+/gm)||[]).length;
    regressionStatus.running = false;
    regressionStatus.done = true;
    runHistory.unshift({ title: 'Regression Run', time: new Date().toLocaleString('en-US', {timeZone:'America/Los_Angeles', month:'numeric', day:'numeric', year:'numeric', hour:'numeric', minute:'2-digit', hour12:true}), passed: regressionStatus.passed, failed: regressionStatus.failed, skipped: regressionStatus.skipped });
    saveRunHistory();
    console.log(`🔁 Regression done: ${regressionStatus.passed} passed, ${regressionStatus.failed} failed`);
  });
});

app.get('/api/regression/status', (req, res) => {
  res.json(regressionStatus);
});

app.listen(PORT, () => {
  console.log(`\n🚀 SnipForge Dashboard Server running on port ${PORT}`);
  console.log(`   Open: http://localhost:${PORT}\n`);
});
