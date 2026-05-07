// etl/extract.ts
// Reads the voter Excel file and returns typed raw rows.
// Uses ExcelJS instead of SheetJS (xlsx) — SheetJS has unpatched prototype
// pollution and ReDoS vulnerabilities (GHSA-4r6h-8v6p-xvw6, GHSA-5pgg-2g8v-p4x9).
// ExcelJS is actively maintained and has no known high-severity CVEs.
//
// Install: npm install exceljs
//          npm uninstall xlsx

import ExcelJS from 'exceljs';
import path from 'path';
import { ELECTION_COLUMNS } from './elections.js';
import type { RawVoterRow } from './types.js';

const ELECTION_HEADERS = new Set(Object.keys(ELECTION_COLUMNS));

/**
 * Read a voter export Excel file and return one typed object per data row.
 * The header row is consumed automatically.
 */
export async function extractFromExcel(filePath: string): Promise<RawVoterRow[]> {
  const absolutePath = path.resolve(filePath);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(absolutePath);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error(`No worksheets found in ${filePath}`);
  }

  // --- Build header index ---
  const headerRow = worksheet.getRow(1);
  const headers: string[] = [];
  headerRow.eachCell({ includeEmpty: true }, (cell) => {
    headers.push(cell.value?.toString().trim() ?? '');
  });

  const rows: RawVoterRow[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // skip header

    // Map each cell to its column header
    const record: Record<string, ExcelJS.CellValue> = {};
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const header = headers[colNumber - 1];
      if (header) {
        // ExcelJS may return a RichText object for formatted cells
        const val = cell.value;
        record[header] =
          val !== null && typeof val === 'object' && 'richText' in val
            ? (val as ExcelJS.CellRichTextValue).richText.map((r) => r.text).join('')
            : val;
      }
    });

    // Skip completely empty rows (can appear at end of file)
    if (!record['Vuid']) return;

    // Extract election history into its own map
    const elections: Record<string, string | null> = {};
    for (const header of ELECTION_HEADERS) {
      const val = record[header];
      elections[header] = val != null ? String(val).trim() : null;
    }

    const raw: RawVoterRow = {
      vuid:              String(record['Vuid'] ?? '').trim(),
      name:              String(record['Name'] ?? '').trim(),
      status:            String(record['Status'] ?? '').trim(),
      gender:            String(record['Gender'] ?? '').trim(),
      sparkCode:         String(record['TX*SPARK Address Code'] ?? '').trim(),
      address:           String(record['Residential Address'] ?? '').trim(),
      zipcode:           String(record['Zipcode'] ?? '').trim(),
      precinct:          String(record['Travis County Precinct'] ?? '').trim(),
      region:            record['Region'] != null ? String(record['Region']).trim() || null : null,
      zone:              record['Zone'] != null ? String(record['Zone']).trim() || null : null,
      block:             record['Block'] != null ? String(record['Block']).trim() || null : null,
      street:            record['Street'] != null ? String(record['Street']).trim() || null : null,
      unit:              record['Unit #'] != null ? String(record['Unit #']).trim() || null : null,
      elections,
      generalVoteCount:  record['2016-2024 General_VOTE #/5'] != null
                           ? Number(record['2016-2024 General_VOTE #/5'])
                           : null,
      generalVotePct:    record['2016-2024 General_VOTE %'] != null
                           ? Number(record['2016-2024 General_VOTE %'])
                           : null,
      primaryDemCount:   record['2016-2026 Primary_DEM #/6'] != null
                           ? Number(record['2016-2026 Primary_DEM #/6'])
                           : null,
      primaryDemPct:     record['2016-2026 Primary_DEM %'] != null
                           ? Number(record['2016-2026 Primary_DEM %'])
                           : null,
      primaryTotalCount: record['2016-2026 Primary_Margin #/6'] != null
                           ? Number(record['2016-2026 Primary_Margin #/6'])
                           : null,
      primaryTotalPct:   record['2016-2026 Primary_Margin %'] != null
                           ? Number(record['2016-2026 Primary_Margin %'])
                           : null,
    };

    rows.push(raw);
  });

  console.log(`✓ Extracted ${rows.length} rows from ${path.basename(filePath)}`);
  return rows;
}
