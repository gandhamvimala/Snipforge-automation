import fs from 'fs/promises';
import path from 'path';

const SCENARIOS_DIR = path.join(process.cwd(), 'src/tests/generated');
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
  await fs.mkdir(SCENARIOS_DIR, { recursive: true });
  console.log('\n🤖 Generating scenarios for snipforge.video...\n');

  const scenarios = { generated: new Date().toISOString(), pages: {}, tools: [] };
  const pages = ['home', 'pricing', 'login', 'register'];

  for (const page of pages) {
    console.log(`  Generating: ${page}...`);
    const raw = await callClaude(
      'You are a QA engineer. Generate test scenarios as JSON only. No markdown. Schema: { "page": string, "scenarios": [{ "id": string, "title": string, "priority": "critical"|"high"|"medium"|"low", "category": "smoke"|"functional"|"regression"|"edge", "tags": string[], "steps": string[], "expectedResult": string }] }',
      `Generate 6 test scenarios for the ${page} page of https://snipforge.video. It is an AI video toolkit with 25 tools. Free plan: 3 videos/month max 5 minutes. Pro plan: $5/month unlimited. Return ONLY valid JSON, no explanation.`
    );
    try {
      const clean = raw.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
      scenarios.pages[page] = JSON.parse(clean);
      console.log(`  ✅ ${page}: ${scenarios.pages[page].scenarios?.length || 0} scenarios`);
    } catch(e) {
      console.log(`  ⚠️  Parse failed for ${page}: ${e.message}`);
      scenarios.pages[page] = { page, scenarios: [] };
    }
  }

  const outFile = path.join(SCENARIOS_DIR, 'scenarios.json');
  await fs.writeFile(outFile, JSON.stringify(scenarios, null, 2));
  const total = Object.values(scenarios.pages).reduce((a, p) => a + (p.scenarios?.length || 0), 0);
  console.log(`\n✅ Done! ${total} scenarios saved to src/tests/generated/scenarios.json`);
}

main().catch(e => { console.error('❌ Error:', e.message); process.exit(1); });
