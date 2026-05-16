import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
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
Start new IDs from: ${tool}-${String(lastId+1).padStart(3,'0')}

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
    writeFileSync(scenariosPath, JSON.stringify(existing, null, 2));

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
    const toolScenarios = allScenarios[tool]?.scenarios || [];

    // Load existing spec file
    const scriptPath = `src/tests/generated/scripts/tool-${tool}.spec.js`;
    const existingScript = existsSync(scriptPath) ? readFileSync(scriptPath, 'utf-8') : '';

    // Find which scenarios don't have tests yet
    const existingIds = [...existingScript.matchAll(/["'](${tool}-\d+)["']/g)].map(m=>m[1]);
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
      const updated = existingScript.replace(/\}\);(\s*)$/, 
        `

// ── Auto-generated: ${new Date().toISOString()} ──
${newCode}
});
`
      );
      writeFileSync(scriptPath, updated);
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
    console.log(`▶️  Running tests for: ${tool}`);
    const { stdout, stderr } = await execAsync(
      `npx playwright test src/tests/generated/scripts/tool-${tool}.spec.js --project=chromium --reporter=list --timeout=60000`,
      { cwd: '/workspaces/Snipforge-automation', env: process.env, timeout: 120000 }
    );
    // Parse results
    const passed = (stdout.match(/✓/g) || []).length;
    const failed = (stdout.match(/✘/g) || []).length;
    const skipped = (stdout.match(/^\s+-/gm) || []).length;
    res.json({ success: true, output: stdout, passed, failed, skipped });
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

app.listen(PORT, () => {
  console.log(`\n🚀 SnipForge Dashboard Server running on port ${PORT}`);
  console.log(`   Open: http://localhost:${PORT}\n`);
});
