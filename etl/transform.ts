// etl/transform.ts
// Converts flat RawVoterRow[] into normalized records for every table.
// Pure functions — no DB calls, no file I/O. Safe to unit test.

import { ELECTION_COLUMNS, decodeElectionValue } from './elections.js';
import type {
  ElectionDefinition,
  NormalizedBlock,
  NormalizedElectionHistory,
  NormalizedHousehold,
  NormalizedPrecinct,
  NormalizedScore,
  NormalizedVoter,
  ParsedAddress,
  ParsedName,
  RawVoterRow,
  TransformResult,
} from './types.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Parse "LAST, FIRST MIDDLE" into structured name parts.
 * Title-cases the result — source data is all-caps.
 */
export function parseName(raw: string): ParsedName {
  const [lastPart, restPart = ''] = raw.split(',', 2);
  const lastName = toTitleCase(lastPart.trim());
  const firstParts = restPart.trim().split(/\s+/);
  const firstName = toTitleCase(firstParts[0] ?? '');
  const middleName =
    firstParts.length > 1 ? toTitleCase(firstParts.slice(1).join(' ')) : null;
  return { firstName, middleName, lastName };
}

/**
 * Parse a full Texas address string like:
 *   "2422 WESTERN TRAILS BLVD AUSTIN TX 78745"
 * into its constituent parts.
 *
 * Strategy: find " TX " as the state marker, take the ZIP after it,
 * then split the remainder at the last space to separate city from street.
 * This correctly handles single-word cities (Austin, Dallas, etc.).
 * For multi-word cities (San Antonio, Fort Worth) you'd need a city lookup
 * table — add one if your data expands beyond Travis County.
 */
export function parseTexasAddress(fullAddress: string, fallbackZip?: string): ParsedAddress {
  const normalized = fullAddress.trim().toUpperCase();
  const txIdx = normalized.lastIndexOf(' TX ');

  if (txIdx === -1) {
    return {
      streetAddress: toTitleCase(fullAddress.trim()),
      city: 'Austin',
      state: 'TX',
      zip: fallbackZip ?? '',
    };
  }

  const zipRaw = normalized.slice(txIdx + 4).trim();
  const zip = zipRaw.replace(/\D/g, '').slice(0, 5);
  const beforeTx = normalized.slice(0, txIdx).trim();

  // Split city from street at last space
  const lastSpace = beforeTx.lastIndexOf(' ');
  if (lastSpace === -1) {
    return { streetAddress: toTitleCase(beforeTx), city: 'Austin', state: 'TX', zip };
  }

  const city = toTitleCase(beforeTx.slice(lastSpace + 1));
  const streetAddress = toTitleCase(beforeTx.slice(0, lastSpace));
  return { streetAddress, city, state: 'TX', zip };
}

/** Household dedup key — lowercased, whitespace-normalized composite. */
function householdKey(addr: ParsedAddress): string {
  return [addr.streetAddress, addr.city, addr.state, addr.zip]
    .map((s) => s.toLowerCase().replace(/\s+/g, ' ').trim())
    .join('|');
}

function toTitleCase(s: string): string {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

// ---------------------------------------------------------------------------
// Main transform
// ---------------------------------------------------------------------------

export function transform(rows: RawVoterRow[], sourceFileName: string): TransformResult {
  // ── 1. Precincts ──────────────────────────────────────────────────────────
  // All rows in this file share precinct 430, Travis County, TX.
  // We derive from the data so future multi-precinct files work automatically.
  const precinctMap = new Map<string, NormalizedPrecinct>();
  for (const row of rows) {
    const name = row.precinct;
    if (!precinctMap.has(name)) {
      precinctMap.set(name, {
        name,
        county: 'Travis',  // Source: "Travis County Precinct" column header
        state: 'TX',
      });
    }
  }
  const precincts = [...precinctMap.values()];

  // ── 2. Blocks ─────────────────────────────────────────────────────────────
  // Region/Zone/Block columns are empty in this file but may be populated in
  // future exports. We always create a fallback block named by street to
  // preserve the ability to group households by street.
  const blockMap = new Map<string, NormalizedBlock>();
  for (const row of rows) {
    const blockName = row.block || row.street || 'Unknown';
    const key = `${row.precinct}|${blockName}`;
    if (!blockMap.has(key)) {
      blockMap.set(key, {
        name: blockName,
        precinctName: row.precinct,
        region: row.region,
        zone: row.zone,
      });
    }
  }
  const blocks = [...blockMap.values()];

  // ── 3. Households ─────────────────────────────────────────────────────────
  // One row per voter; group by address to create households.
  const householdMap = new Map<string, NormalizedHousehold>();
  for (const row of rows) {
    const parsed = parseTexasAddress(row.address, row.zipcode);
    const key = householdKey(parsed);
    if (!householdMap.has(key)) {
      householdMap.set(key, {
        addressKey: key,
        address: parsed.streetAddress,
        city: parsed.city,
        state: parsed.state,
        zip: parsed.zip,
        sparkCode: row.sparkCode || null,
        precinctName: row.precinct,
        blockName: row.block || row.street || null,
        importedFrom: sourceFileName,
      });
    }
  }
  const households = [...householdMap.values()];
  console.log(`  → ${households.length} unique households from ${rows.length} voters`);

  // ── 4. Voters ─────────────────────────────────────────────────────────────
  const voters: NormalizedVoter[] = [];
  const seenVuids = new Set<string>();

  for (const row of rows) {
    if (seenVuids.has(row.vuid)) {
      console.warn(`  ⚠ Duplicate VUID skipped: ${row.vuid}`);
      continue;
    }
    seenVuids.add(row.vuid);

    const { firstName, middleName, lastName } = parseName(row.name);
    const parsed = parseTexasAddress(row.address, row.zipcode);
    const key = householdKey(parsed);

    voters.push({
      vuid: row.vuid,
      firstName,
      middleName,
      lastName,
      gender: row.gender || null,
      status: row.status || null,
      addressKey: key,
      importedFrom: sourceFileName,
    });
  }

  // ── 5. Elections (unique definitions) ────────────────────────────────────
  // Deduplicate across all rows — every row has the same election columns.
  const electionDefs = new Map<string, ElectionDefinition>();
  for (const def of Object.values(ELECTION_COLUMNS)) {
    electionDefs.set(def.key, def);
  }
  const elections = [...electionDefs.values()];

  // ── 6. Election history ───────────────────────────────────────────────────
  const electionHistory: NormalizedElectionHistory[] = [];

  for (const row of rows) {
    for (const [colHeader] of Object.entries(ELECTION_COLUMNS)) {
      const rawValue = row.elections[colHeader];
      const decoded = decodeElectionValue(colHeader, rawValue);
      if (decoded === null) continue; // missing or unrecognized value — skip row

      electionHistory.push({
        vuid: row.vuid,
        electionKey: ELECTION_COLUMNS[colHeader].key,
        voted: decoded.voted,
        party: decoded.party,
      });
    }
  }

  // ── 7. Scores ─────────────────────────────────────────────────────────────
  const scores: NormalizedScore[] = rows.map((row) => ({
    vuid: row.vuid,
    turnoutScore:    row.generalVotePct,
    persuasionScore: row.primaryTotalPct,   // primary participation rate
    partyConfidence: row.primaryDemPct,     // DEM primary rate
    generalVoteCount:   row.generalVoteCount,
    primaryDemCount:    row.primaryDemCount,
    primaryTotalCount:  row.primaryTotalCount,
  }));

  return { precincts, blocks, households, voters, elections, electionHistory, scores };
}
