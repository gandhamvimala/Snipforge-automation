// scripts/full-cycle.js
// Full Automation Cycle: Generate → Write → Run → Heal → Re-run → Report
import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

const REPORTS_DIR = path.join(process.cwd(), 'src/reports');

function run(cmd, label) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`🔄 ${label}`);
  console.log(`${'─'.repeat(60)}\n`);
  try {
    execSync(cmd, { stdio: 'inherit', cwd: process.cwd() });
    return true;
  } catch (e) {
    console.warn(`⚠️  Step had errors (exit ${e.status}), continuing...`);
    return false;
  }
}

async function main() {
  const startTime = Date.now();
  const args = process.argv.slice(2);
  const skipGenerate = args.includes('--skip-generate');
  const skipWrite    = args.includes('--skip-write');
  const skipRun      = args.includes('--skip-run');

  console.log('\n' + '═'.repeat(60));
  console.log('🚀 SNIPFORGE AUTOMATION FRAMEWORK — FULL CYCLE');
  console.log(`   ${new Date().toISOString()}`);
  console.log('═'.repeat(60));
  console.log('\nSteps: Generate → Write → Run → Heal → Regression\n');

  await fs.mkdir(REPORTS_DIR, { recursive: true });

  const results = {
    generate: null,
    write: null,
    run: null,
    heal: null,
    regression: null,
  };

  // Step 1: Generate scenarios
  if (!skipGenerate) {
    results.generate = run('node src/agents/scenario-generator.js', 'STEP 1: AI Scenario Generation');
  } else {
    console.log('\n⏭️  Skipping scenario generation (--skip-generate)');
    results.generate = true;
  }

  // Step 2: Write scripts
  if (!skipWrite) {
    results.write = run('node src/agents/script-writer.js', 'STEP 2: AI Script Writing');
  } else {
    console.log('\n⏭️  Skipping script writing (--skip-write)');
    results.write = true;
  }

  // Step 3: Run tests
  if (!skipRun) {
    results.run = run('node src/agents/test-runner.js --no-heal', 'STEP 3: Test Execution');
  } else {
    console.log('\n⏭️  Skipping test run (--skip-run)');
    results.run = true;
  }

  // Step 4: Self-heal failures
  results.heal = run('node src/agents/self-healer.js', 'STEP 4: AI Self-Healing');

  // Step 5: Regression run
  results.regression = run('node src/agents/regression-runner.js daily --no-heal', 'STEP 5: Regression Run');

  // Final report
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('\n' + '═'.repeat(60));
  console.log('📊 FULL CYCLE COMPLETE');
  console.log('═'.repeat(60));
  Object.entries(results).forEach(([step, success]) => {
    const icon = success === null ? '⏭️ ' : success ? '✅' : '⚠️ ';
    console.log(`  ${icon} ${step.padEnd(15)} ${success === null ? 'skipped' : success ? 'OK' : 'had failures'}`);
  });
  console.log(`\n  ⏱️  Total time: ${duration}s`);
  console.log(`  📁 Reports: ${REPORTS_DIR}`);
  console.log('═'.repeat(60));

  // Save cycle summary
  const summary = {
    timestamp: new Date().toISOString(),
    duration: parseFloat(duration),
    results,
  };
  await fs.writeFile(path.join(REPORTS_DIR, 'cycle-summary.json'), JSON.stringify(summary, null, 2));
}

main().catch(e => { console.error('❌ Full cycle failed:', e); process.exit(1); });
