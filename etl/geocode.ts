// etl/geocode.ts
// Fills in lat/lng for households using the US Census Geocoder batch API.
//
//   Endpoint: https://geocoding.geo.census.gov/geocoder/locations/addressbatch
//   Limit:    10,000 addresses per request
//   Auth:     None required — completely free
//   Returns:  CSV with matched coordinates
//
// Run AFTER the main ETL load so households already exist in the DB.
// Run again any time new households are added without coordinates.
//
// Usage: npx tsx etl/geocode.ts
//        npx tsx etl/geocode.ts --dry-run   (prints CSV only, no DB writes)

import { PrismaClient } from '@prisma/client';
import type { GeocodeResult } from './types.js';

const prisma = new PrismaClient();

const CENSUS_GEOCODER_URL =
  'https://geocoding.geo.census.gov/geocoder/locations/addressbatch';
const BATCH_SIZE = 2000; // Stay well under the 10k limit per request
const DRY_RUN = process.argv.includes('--dry-run');

// ---------------------------------------------------------------------------
// Census API helpers
// ---------------------------------------------------------------------------

/**
 * Build the CSV payload the Census API expects:
 * id, street, city, state, zip
 *
 * Using the household DB id as the row id means we can match results back
 * to rows without an extra lookup step.
 */
function buildCensusInputCsv(
  households: Array<{ id: string; address: string; city: string; state: string; zip: string }>
): string {
  const lines = households.map(
    (h) => `"${h.id}","${h.address}","${h.city}","${h.state}","${h.zip}"`
  );
  return lines.join('\n');
}

/**
 * Send a batch of addresses to the Census Geocoder and parse the response.
 *
 * Response CSV columns (no header row):
 *   0: id
 *   1: input address
 *   2: Match Indicator (Match | No_Match | Tie)
 *   3: Match Type (Exact | Non_Exact)
 *   4: Matched address
 *   5: Coordinates ("longitude,latitude")
 *   6: TIGER Line ID
 *   7: Side of street
 */
async function geocodeBatch(
  households: Array<{ id: string; address: string; city: string; state: string; zip: string }>
): Promise<GeocodeResult[]> {
  const csvContent = buildCensusInputCsv(households);

  // Node 18+ has native FormData and Blob
  const formData = new FormData();
  formData.append(
    'addressFile',
    new Blob([csvContent], { type: 'text/plain' }),
    'addresses.csv'
  );
  formData.append('benchmark', 'Public_AR_Current');

  const response = await fetch(CENSUS_GEOCODER_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      `Census Geocoder API error: ${response.status} ${response.statusText}`
    );
  }

  const text = await response.text();
  const lines = text.trim().split('\n');

  const results: GeocodeResult[] = [];

  for (const line of lines) {
    if (!line.trim()) continue;

    const cols = parseCsvLine(line);

    const id = cols[0];
    const matchIndicator = cols[2] ?? 'No_Match';
    const matchType = cols[3] ?? null;
    const coordsStr = cols[5] ?? '';

    let lat: number | null = null;
    let lng: number | null = null;

    if (matchIndicator === 'Match' && coordsStr) {
      const [lngStr, latStr] = coordsStr.split(',');
      lat = latStr ? parseFloat(latStr) : null;
      lng = lngStr ? parseFloat(lngStr) : null;
    }

    results.push({
      addressKey: id,    // This is the household DB id we sent as the row id
      lat,
      lng,
      matchType: matchIndicator === 'Match' ? matchType : null,
    });
  }

  return results;
}

/**
 * Parse a single CSV row with support for quoted fields and escaped quotes.
 * The Census geocoder response includes commas inside quoted fields, so a
 * plain split(',') will misalign columns and produce false "No_Match" results.
 */
function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      // Escaped quote ("") inside a quoted field
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }

    if (ch === ',' && !inQuotes) {
      out.push(cur.trim());
      cur = '';
      continue;
    }

    cur += ch;
  }

  out.push(cur.trim());
  return out;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function run(): Promise<void> {
  // Fetch households that are missing coordinates
  const ungeocoded = await prisma.household.findMany({
    where: { lat: null },
    select: { id: true, address: true, city: true, state: true, zip: true },
  });

  if (ungeocoded.length === 0) {
    console.log('✓ All households already have coordinates. Nothing to do.');
    return;
  }

  console.log(`📍 Geocoding ${ungeocoded.length} households without coordinates...`);

  if (DRY_RUN) {
    console.log('\n[DRY RUN] Input CSV that would be sent to Census API:');
    console.log(buildCensusInputCsv(ungeocoded.slice(0, 5)));
    console.log(`... (${ungeocoded.length} total rows)`);
    return;
  }

  let matched = 0;
  let unmatched = 0;
  let updated = 0;

  // Process in batches
  for (let i = 0; i < ungeocoded.length; i += BATCH_SIZE) {
    const batch = ungeocoded.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(ungeocoded.length / BATCH_SIZE);

    console.log(`  Batch ${batchNum}/${totalBatches} (${batch.length} addresses)...`);

    let results: GeocodeResult[];
    try {
      results = await geocodeBatch(batch);
    } catch (err) {
      console.error(`  ✗ Batch ${batchNum} failed:`, err);
      // Continue with remaining batches rather than aborting
      continue;
    }

    // Write results to DB
    for (const result of results) {
      if (result.lat !== null && result.lng !== null) {
        await prisma.household.update({
          where: { id: result.addressKey },
          data: { lat: result.lat, lng: result.lng },
        });
        matched++;
        updated++;
      } else {
        unmatched++;
        console.warn(`  ⚠ No match for household ${result.addressKey}`);
      }
    }

    // Polite delay between batches to avoid hammering the Census API
    if (i + BATCH_SIZE < ungeocoded.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log(`\n✓ Geocoding complete:`);
  console.log(`   Matched:   ${matched}`);
  console.log(`   Unmatched: ${unmatched}`);
  console.log(`   Updated:   ${updated} household records`);
}

run()
  .catch((err) => {
    console.error('Geocoding failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
