import fs from 'fs/promises';
import path from 'path';
import { AI_CONFIG } from '../../config/site-map.js';

const RESULTS_DIR = path.join(process.cwd(), 'src/reports/results');
const SCRIPTS_DIR = path.join(process.cwd(), 'src/tests/generated/scripts');
const HEALED_DIR  = path.join(process.cwd(), 'src/tests/healed');
const HEALING_LOG = path.join(process.cwd(), 'src/reports/healing-log.json');

async function callClaude(system, user) {
  const res = await fetch(AI_CONFIG.apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: AI_CONFIG.model, max_tokens: 2000, system, messages: [{ role: 'user', content: user }] }),
  });
  const data = await res.json();
  return data.content.map(b => b.text || '').join('');
}

async function main() {
  await fs.mkdir(HEALED_DIR, { recursive: true });
  console.log('\n🔧 Self-Healer running...\n');

  let failures = [];
  try {
    const files = (await fs.readdir(RESULTS_DIR)).filter(f => f.endsWith('.json'));
    if (files.length) {
      const latest = JSON.parse(await fs.readFile(path.join(RESULTS_DIR, files.sort().pop()), 'utf-8'));
      failures = latest.failures || [];
    }
  } catch {}

  if (!failures.length) {
    console.log('✅ No failures to heal!');
    return;
  }

  console.log(`Found ${failures.length} failure(s) to heal\n`);
  const log = [];

  for (const failure of failures) {
    console.log(`🔍 Healing: ${failure.testName}`);
    try {
      const scriptPath = path.join(SCRIPTS_DIR, failure.file);
      const code = await fs.readFile(scriptPath, 'utf-8');
      const fix = await callClaude(
        'You are a Playwright expert. Fix broken selectors. Respond with JSON only: { "fixed_code": string, "explanation": string }',
        `This Playwright test failed:\nTest: ${failure.testName}\nError: ${failure.error}\n\nCode:\n${code.slice(0,2000)}\n\nFix the broken selector. Return ONLY JSON.`
      );
      const clean = fix.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
      const parsed = JSON.parse(clean);
      const healed = `// HEALED ${new Date().toISOString()}\n// Fix: ${parsed.explanation}\n\n` + code;
      await fs.writeFile(path.join(HEALED_DIR, failure.file), healed);
      log.push({ timestamp: new Date().toISOString(), test: failure.testName, fix: parsed.explanation, status: 'healed' });
      console.log(`  ✅ Healed: ${parsed.explanation}`);
    } catch (e) {
      console.log(`  ⚠️  Could not heal: ${e.message}`);
      log.push({ timestamp: new Date().toISOString(), test: failure.testName, status: 'failed', error: e.message });
    }
  }

  await fs.writeFile(HEALING_LOG, JSON.stringify(log, null, 2));
  console.log(`\n✅ Healing complete. Log: ${HEALING_LOG}`);
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
