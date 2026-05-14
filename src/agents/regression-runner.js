import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

const SCRIPTS_DIR = path.join(process.cwd(), 'src/tests/generated/scripts');
const HEALED_DIR  = path.join(process.cwd(), 'src/tests/healed');

async function main() {
  const trigger = process.argv[2] || 'manual';
  console.log(`\n🔁 Regression Runner — trigger: ${trigger}\n`);

  const healedFiles = (await fs.readdir(HEALED_DIR).catch(() => [])).filter(f => f.endsWith('.spec.js'));
  const generatedFiles = (await fs.readdir(SCRIPTS_DIR).catch(() => [])).filter(f => f.endsWith('.spec.js'));

  const dir = healedFiles.length ? HEALED_DIR : SCRIPTS_DIR;
  const files = healedFiles.length ? healedFiles : generatedFiles;

  if (!files.length) { console.error('❌ No scripts found. Run npm run generate && npm run write'); process.exit(1); }

  console.log(`Running ${files.length} file(s) from ${healedFiles.length ? 'healed' : 'generated'} scripts\n`);
  try {
    execSync(`npx playwright test ${dir} --reporter=list --timeout=30000 --retries=1`, { stdio: 'inherit', cwd: process.cwd() });
    console.log('\n✅ Regression passed!');
  } catch {
    console.log('\n❌ Regression had failures. Check reports.');
    process.exit(1);
  }
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
