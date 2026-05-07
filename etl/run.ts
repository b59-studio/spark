// etl/run.ts
// Main entry point. Runs extract → transform → load in sequence.
// Geocoding is intentionally separate (run etl/geocode.ts after this).
//
// Usage:
//   npx tsx etl/run.ts path/to/voters.xlsx
//   npx tsx etl/run.ts path/to/voters.xlsx --dry-run   (no DB writes)

import path from 'path';
import { extractFromExcel } from './extract.js';
import { transform } from './transform.js';
import { load } from './load.js';

const DRY_RUN = process.argv.includes('--dry-run');

async function run(): Promise<void> {
  const filePath = process.argv.find(
    (arg) => !arg.startsWith('--') && (arg.endsWith('.xlsx') || arg.endsWith('.xls'))
  );

  if (!filePath) {
    console.error('Usage: npx tsx etl/run.ts <path-to-excel-file> [--dry-run]');
    process.exit(1);
  }

  const sourceFileName = path.basename(filePath);
  console.log(`\n🚀 ETL pipeline starting`);
  console.log(`   File: ${filePath}`);
  console.log(`   Mode: ${DRY_RUN ? 'DRY RUN (no writes)' : 'LIVE'}\n`);

  // ── 1. Extract ──────────────────────────────────────────────────────────
  console.log('📥 Extracting...');
  const rawRows = await extractFromExcel(filePath);
  console.log(`   ${rawRows.length} rows extracted\n`);

  // ── 2. Transform ────────────────────────────────────────────────────────
  console.log('🔄 Transforming...');
  const result = transform(rawRows, sourceFileName);
  console.log(`   ${result.precincts.length} precincts`);
  console.log(`   ${result.blocks.length} blocks`);
  console.log(`   ${result.households.length} households`);
  console.log(`   ${result.voters.length} voters`);
  console.log(`   ${result.elections.length} elections`);
  console.log(`   ${result.electionHistory.length} election history rows`);
  console.log(`   ${result.scores.length} voter scores\n`);

  if (DRY_RUN) {
    console.log('⏭  DRY RUN: skipping database writes.');
    console.log('   Remove --dry-run to load.\n');
    return;
  }

  // ── 3. Load ─────────────────────────────────────────────────────────────
  await load(result);

  console.log(`
✅ Done. Next steps:
   1. Run validation:  npx tsx etl/validate.ts
   2. Geocode:         npx tsx etl/geocode.ts
   3. Re-validate:     npx tsx etl/validate.ts
`);
}

run().catch((err) => {
  console.error('\n❌ ETL failed:', err);
  process.exit(1);
});
