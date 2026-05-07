// etl/types.ts
// Shared types for every stage of the pipeline.
// Import from here rather than redeclaring in each file.

export interface RawVoterRow {
  vuid: string;
  name: string;
  status: string;
  gender: string;
  sparkCode: string;
  address: string;
  zipcode: string;
  precinct: string;
  region: string | null;
  zone: string | null;
  block: string | null;
  street: string | null;
  unit: string | null;
  elections: Record<string, string | null>; // col header → "V" | "N" | "D" | "R" | null
  generalVoteCount: number | null;
  generalVotePct: number | null;
  primaryDemCount: number | null;
  primaryDemPct: number | null;
  primaryTotalCount: number | null;
  primaryTotalPct: number | null;
}

export interface ParsedAddress {
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
}

export interface ParsedName {
  firstName: string;
  middleName: string | null;
  lastName: string;
}

// -------------------------------------------------------------------
// Intermediate normalized records produced by transform.ts
// These are plain objects — not Prisma types — so they can be built
// without a live DB connection and tested in isolation.
// -------------------------------------------------------------------

export interface NormalizedPrecinct {
  name: string;
  county: string;
  state: string;
}

export interface NormalizedBlock {
  name: string;
  precinctName: string; // resolved to precinctId at load time
  region: string | null;
  zone: string | null;
}

export interface NormalizedHousehold {
  addressKey: string;   // dedup key: lowercased address+city+state+zip
  address: string;
  city: string;
  state: string;
  zip: string;
  sparkCode: string | null;
  precinctName: string;
  blockName: string | null;
  importedFrom: string;
  lat?: number;
  lng?: number;
}

export interface NormalizedVoter {
  vuid: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  gender: string | null;
  status: string | null;
  addressKey: string;   // links to NormalizedHousehold
  importedFrom: string;
}

export interface NormalizedElectionHistory {
  vuid: string;         // links to NormalizedVoter
  electionKey: string;  // e.g. "2024-general-presidential"
  voted: boolean;
  party: string | null;
}

export interface NormalizedScore {
  vuid: string;
  turnoutScore: number | null;
  persuasionScore: number | null;
  partyConfidence: number | null;
  generalVoteCount: number | null;
  primaryDemCount: number | null;
  primaryTotalCount: number | null;
}

export interface TransformResult {
  precincts: NormalizedPrecinct[];
  blocks: NormalizedBlock[];
  households: NormalizedHousehold[];
  voters: NormalizedVoter[];
  elections: ElectionDefinition[];
  electionHistory: NormalizedElectionHistory[];
  scores: NormalizedScore[];
}

// Matches the Election model — resolved to DB IDs at load time
export interface ElectionDefinition {
  key: string;      // e.g. "2024-general-presidential"
  year: number;
  type: string;
  subtype: string;
}

// Result of Census Geocoder batch response
export interface GeocodeResult {
  addressKey: string;
  lat: number | null;
  lng: number | null;
  matchType: string | null;
}
