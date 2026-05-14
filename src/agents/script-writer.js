import fs from 'fs/promises';
import path from 'path';

const SCENARIOS_FILE = path.join(process.cwd(), 'src/tests/generated/scenarios.json');
const SCRIPTS_DIR = path.join(process.cwd(), 'src/tests/generated/scripts');
const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-5';

async function callClaude(system, user) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4000,
      system,
      messages: [{ role: 'user', content: user }]
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.content.map(b => b.text || '').join('');
}

async function main() {
  await fs.mkdir(SCRIPTS_DIR, { recursive: true });
  const allScenarios = JSON.parse(await fs.readFile(SCENARIOS_FILE, 'utf-8'));
  console.log('\n✍️  Writing Playwright scripts...\n');

  for (const [page, data] of Object.entries(allScenarios.pages || {})) {
    const scenarios = data?.scenarios;
    if (!scenarios || !scenarios.length) {
      console.log(`  ⏭️  Skipping ${page} — no scenarios`);
      continue;
    }
    console.log(`  Writing: ${page}.spec.js (${scenarios.length} scenarios)`);
    try {
      const code = await callClaude(
        'You are a Playwright expert. Write a complete executable Playwright test file using @playwright/test with ESM imports. Return ONLY valid JavaScript code, no markdown fences, no explanation.',
        `Write a Playwright test file for https://snipforge.video for the ${page} page.
Scenarios:
${JSON.stringify(scenarios, null, 2)}

Requirements:
- import { test, expect } from '@playwright/test'
- test.use({ baseURL: 'https://snipforge.video' })
- One test() per scenario
- Use page.goto(), expect(page).toHaveTitle(), getByRole(), getByText()
- Wrap all in test.describe('SnipForge - ${page}', () => { ... })
- Return ONLY the JavaScript code, nothing else`
      );
      const clean = code
        .replace(/^```(javascript|js)?\n?/m, '')
        .replace(/\n?```$/m, '')
        .trim();
      await fs.writeFile(path.join(SCRIPTS_DIR, `${page}.spec.js`), clean);
      console.log(`  ✅ ${page}.spec.js saved`);
    } catch(e) {
      console.log(`  ⚠️  Failed for ${page}: ${e.message}`);
    }
  }
  console.log('\n✅ All scripts written to src/tests/generated/scripts/');
}

main().catch(e => { console.error('❌ Error:', e.message); process.exit(1); });
