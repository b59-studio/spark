// etl/mappings/elections.ts
// Maps every election column header from the TX voter export to a structured
// Election record. Add rows here as new election cycles appear — the ETL
// will pick them up automatically.
//
// Value encoding in the source file:
//   General elections  → "V" (voted) | "N" (did not vote)
//   Primary elections  → "D" (voted Democrat) | "R" (voted Republican) | "N" (did not vote)
//
// "party" is set on primary rows only. For generals, party is null — the file
// doesn't capture which-party for general election voters.

import type { ElectionDefinition } from './types.js';

export const ELECTION_COLUMNS: Record<string, ElectionDefinition> = {
  '2016 General-Presidential': {
    key: '2016-general-presidential',
    year: 2016,
    type: 'general',
    subtype: 'presidential',
  },
  '2016 Primary': {
    key: '2016-primary-party',
    year: 2016,
    type: 'primary',
    subtype: 'party',
  },
  '2018 General - Midterms': {
    key: '2018-general-midterm',
    year: 2018,
    type: 'general',
    subtype: 'midterm',
  },
  '2018 Primary': {
    key: '2018-primary-party',
    year: 2018,
    type: 'primary',
    subtype: 'party',
  },
  '2020 General - Presidential': {
    key: '2020-general-presidential',
    year: 2020,
    type: 'general',
    subtype: 'presidential',
  },
  '2020 Primary': {
    key: '2020-primary-party',
    year: 2020,
    type: 'primary',
    subtype: 'party',
  },
  '2022 General - Midterms': {
    key: '2022-general-midterm',
    year: 2022,
    type: 'general',
    subtype: 'midterm',
  },
  '2022 Primary': {
    key: '2022-primary-party',
    year: 2022,
    type: 'primary',
    subtype: 'party',
  },
  '2024 General - Presidential': {
    key: '2024-general-presidential',
    year: 2024,
    type: 'general',
    subtype: 'presidential',
  },
  '2024 Primary': {
    key: '2024-primary-party',
    year: 2024,
    type: 'primary',
    subtype: 'party',
  },
  '2026 Primary': {
    key: '2026-primary-party',
    year: 2026,
    type: 'primary',
    subtype: 'party',
  },
};

/**
 * Decode an election cell value into voted + party fields.
 * Returns null if the column value is missing or unrecognized.
 */
export function decodeElectionValue(
  colHeader: string,
  value: string | null | undefined
): { voted: boolean; party: string | null } | null {
  if (!value || value.trim() === '') return null;

  const def = ELECTION_COLUMNS[colHeader];
  if (!def) return null;

  const v = value.trim().toUpperCase();

  if (def.type === 'general') {
    return {
      voted: v === 'V',
      party: null,
    };
  }

  // Primary
  if (v === 'D') return { voted: true, party: 'Democratic' };
  if (v === 'R') return { voted: true, party: 'Republican' };
  if (v === 'N') return { voted: false, party: null };

  return null;
}
