import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

const SCRIPTS_DIR = path.join(process.cwd(), 'src/tests/generated/scripts');
const RESULTS_DIR = path.join(process.cwd(), 'src/reports/results');

async function main() {
  await fs.mkdir(RESULTS_DIR, { recursive: true });
  const scripts = (await fs.readdir(SCRIPTS_DIR).catch(() => [])).filter(f => f.endsWith('.spec.js'));

  if (!scripts.length) {
    console.error('❌ No scripts found. Run: npm run write first');
    process.exit(1);
  }

  console.log(`\n▶️  Running ${scripts.length} test file(s)...\n`);
  const timestamp = Date.now();
  const reportFile = path.join(RESULTS_DIR, `report-${timestamp}.json`);

  try {
    execSync(`npx playwright test ${SCRIPTS_DIR} --reporter=json --timeout=30000 --retries=1 2>${reportFile}`, { stdio: 'inherit', cwd: process.cwd() });
    console.log('\n✅ All tests passed!');
  } catch {
    console.log('\n⚠️  Some tests failed. Running self-healer...');
    try { execSync('node src/agents/self-healer.js', { stdio: 'inherit', cwd: process.cwd() }); } catch {}
  }
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
