// etl/profile.ts
// Run this on any new voter export before committing to a full ETL run.
// It reports: column names, null rates, unique value samples, and row count.
// This catches schema drift (renamed columns, new election years, etc.) early.
//
// Usage: npx tsx etl/profile.ts path/to/voters.xlsx

import ExcelJS from 'exceljs';
import path from 'path';

interface ColumnProfile {
  header: string;
  nullCount: number;
  totalCount: number;
  nullRate: string;
  uniqueValues: Set<string>;
  sampleValues: string[];
}

async function profileFile(filePath: string): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path.resolve(filePath));

  const worksheet = workbook.worksheets[0];
  if (!worksheet) throw new Error('No worksheets found');

  // Read all rows into memory (profiling requires a full pass)
  const allRows: Array<Record<string, string>> = [];
  const headers: string[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      row.eachCell({ includeEmpty: true }, (cell) => {
        headers.push(cell.value?.toString().trim() ?? `col_${headers.length}`);
      });
      return;
    }

    const record: Record<string, string> = {};
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const header = headers[colNumber - 1];
      if (header) {
        const val = cell.value;
        record[header] = val != null ? String(val).trim() : '';
      }
    });

    // Skip empty rows
    if (Object.values(record).every((v) => v === '')) return;
    allRows.push(record);
  });

  console.log(`\n📄 File: ${path.basename(filePath)}`);
  console.log(`📊 Rows (excl. header): ${allRows.length}`);
  console.log(`📋 Columns: ${headers.length}\n`);

  // Build profile per column
  const profiles: ColumnProfile[] = headers.map((header) => {
    const values = allRows.map((r) => r[header] ?? '');
    const nullCount = values.filter((v) => v === '' || v == null).length;
    const uniqueValues = new Set(values.filter((v) => v !== ''));
    const sampleValues = [...uniqueValues].slice(0, 8);

    return {
      header,
      nullCount,
      totalCount: allRows.length,
      nullRate: ((nullCount / allRows.length) * 100).toFixed(1) + '%',
      uniqueValues,
      sampleValues,
    };
  });

  // Print results
  for (const p of profiles) {
    const uniqueCount = p.uniqueValues.size;
    const sample =
      uniqueCount <= 8
        ? `[${p.sampleValues.map((v) => `"${v}"`).join(', ')}]`
        : `[${p.sampleValues.map((v) => `"${v}"`).join(', ')}, …${uniqueCount - 8} more]`;

    console.log(`  ${p.header}`);
    console.log(`    null rate: ${p.nullRate}   unique: ${uniqueCount}   sample: ${sample}`);
  }

  // Warn about columns the ETL expects but didn't find
  const EXPECTED_COLUMNS = [
    'Vuid',
    'Name',
    'Status',
    'Gender',
    'TX*SPARK Address Code',
    'Residential Address',
    'Zipcode',
    'Travis County Precinct',
  ];

  const missing = EXPECTED_COLUMNS.filter((c) => !headers.includes(c));
  if (missing.length > 0) {
    console.log('\n⚠️  Missing expected columns:');
    missing.forEach((c) => console.log(`   - ${c}`));
    console.log('   Update extract.ts column references before running the ETL.\n');
  } else {
    console.log('\n✓ All expected columns present.\n');
  }
}

// --- CLI entry point ---
const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: npx tsx etl/profile.ts <path-to-excel-file>');
  process.exit(1);
}

profileFile(filePath).catch((err) => {
  console.error('Profile failed:', err);
  process.exit(1);
});
