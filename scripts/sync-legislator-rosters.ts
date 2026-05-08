/**
 * Refreshes generated legislator name maps from official APIs.
 *
 * Required: CONGRESS_GOV_API_KEY — https://api.congress.gov/sign-up/
 * Optional: OPENSTATES_API_KEY — https://open.pluralpolicy.com/accounts/profile/ (Open States v3)
 *
 * Usage: npx tsx scripts/sync-legislator-rosters.ts
 */

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "src/data/generated/legislators");
const US_CONGRESS = Number(process.env.US_CONGRESS_NUMBER ?? "119");
const TX_STATE_SUBCODE = "TX";
const US_HOUSE_DISTRICTS = 38;
const INTER_REQUEST_MS = Number(process.env.CONGRESS_API_THROTTLE_MS ?? "350");

type CongressMemberBrief = {
  bioguideId?: string;
  url?: string;
};

type CongressMemberListResponse = {
  members?: CongressMemberBrief[] | { item?: CongressMemberBrief | CongressMemberBrief[] };
};

type CongressMemberDetailResponse = {
  member?: {
    directOrderName?: string;
    invertedOrderName?: string;
  };
};

function asArray<T>(v: T | T[] | undefined): T[] {
  if (v === undefined) return [];
  return Array.isArray(v) ? v : [v];
}

function normalizeMembersList(body: CongressMemberListResponse): CongressMemberBrief[] {
  const raw = body.members;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "object" && "item" in raw) {
    return asArray(raw.item as CongressMemberBrief | CongressMemberBrief[]);
  }
  return [];
}

async function fetchJson(url: string, init?: RequestInit): Promise<unknown> {
  const maxAttempts = 8;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const res = await fetch(url, init);
    if (res.ok) return res.json();
    const retryable = res.status === 429 || res.status >= 500;
    if (retryable && attempt < maxAttempts - 1) {
      await sleep(Math.min(10_000, 700 * 2 ** attempt));
      continue;
    }
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  throw new Error(`Unreachable fetch retry exhaustion: ${url}`);
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function formatTsRecord(
  exportName: string,
  record: Record<number, string>,
  sourceLines: string[],
): string {
  const entries = Object.entries(record)
    .map(([k, v]) => Number(k))
    .sort((a, b) => a - b);
  const lines = entries.map((num) => `  ${num}: ${JSON.stringify(record[num])},`);
  const iso = new Date().toISOString();
  return [
    "/**",
    ` * AUTO-GENERATED — do not edit by hand.`,
    ` * ${sourceLines.join(" ")}`,
    ` * Generated at (UTC): ${iso}`,
    " */",
    "",
    `export const ${exportName}: Record<number, string> = {`,
    ...lines,
    "};",
    "",
  ].join("\n");
}

async function syncUsHouse(apiKey: string): Promise<void> {
  const out: Record<number, string> = {};

  for (let district = 1; district <= US_HOUSE_DISTRICTS; district += 1) {
    const listUrl = new URL(
      `https://api.congress.gov/v3/member/congress/${US_CONGRESS}/${TX_STATE_SUBCODE}/${district}`,
    );
    listUrl.searchParams.set("currentMember", "true");
    listUrl.searchParams.set("format", "json");
    listUrl.searchParams.set("api_key", apiKey);

    const listBody = (await fetchJson(listUrl.toString())) as CongressMemberListResponse;
    const members = normalizeMembersList(listBody);

    if (members.length === 0) {
      out[district] = "Vacant";
      await sleep(INTER_REQUEST_MS);
      continue;
    }

    const first = members[0];
    let detailUrl = first.url;
    if (!detailUrl && first.bioguideId) {
      detailUrl = `https://api.congress.gov/v3/member/${first.bioguideId}`;
    }
    if (!detailUrl) {
      throw new Error(`District ${district}: member missing url and bioguideId`);
    }

    const du = new URL(detailUrl.includes("?") ? detailUrl : `${detailUrl}?`);
    if (!du.searchParams.has("format")) du.searchParams.set("format", "json");
    du.searchParams.set("api_key", apiKey);

    const detailBody = (await fetchJson(du.toString())) as CongressMemberDetailResponse;
    const name =
      detailBody.member?.directOrderName ?? detailBody.member?.invertedOrderName ?? "Unknown";
    out[district] = name;

    await sleep(INTER_REQUEST_MS);
  }

  const ts = formatTsRecord(
    "TX_US_REP_BY_CONGRESSIONAL_DISTRICT",
    out,
    [`U.S. House, ${US_CONGRESS}th Congress (Congress.gov).`],
  );
  writeFileSync(path.join(OUT_DIR, "tx-us-house.ts"), ts, "utf8");
  console.log(`Wrote ${path.relative(ROOT, path.join(OUT_DIR, "tx-us-house.ts"))} (${Object.keys(out).length} districts)`);
}

type OpenStatesPerson = {
  name: string;
  current_role?: {
    org_classification?: string;
    district?: string | number;
    title?: string;
  };
};

type OpenStatesPeopleResponse = {
  results?: OpenStatesPerson[];
  pagination?: { page?: number; per_page?: number; total?: number };
};

async function fetchAllOpenStatesPeople(apiKey: string): Promise<OpenStatesPerson[]> {
  const out: OpenStatesPerson[] = [];
  let page = 1;
  const perPage = 100;
  for (;;) {
    const u = new URL("https://v3.openstates.org/people");
    u.searchParams.set("jurisdiction", "ocd-jurisdiction/country:us/state:tx/government");
    u.searchParams.set("page", String(page));
    u.searchParams.set("per_page", String(perPage));
    const body = (await fetchJson(u.toString(), {
      headers: { "X-API-KEY": apiKey },
    })) as OpenStatesPeopleResponse;
    const batch = body.results ?? [];
    out.push(...batch);
    if (batch.length < perPage) break;
    page += 1;
    await sleep(100);
  }
  return out;
}

function parseDistrictNum(raw: string | number | undefined): number | null {
  if (raw === undefined || raw === null) return null;
  const s = String(raw).trim();
  const m = s.match(/(\d+)/);
  if (!m) return null;
  const n = Number.parseInt(m[1], 10);
  return Number.isFinite(n) ? n : null;
}

async function syncTxStateLegislators(apiKey: string): Promise<void> {
  const people = await fetchAllOpenStatesPeople(apiKey);
  const house: Record<number, string> = {};
  const senate: Record<number, string> = {};

  for (const p of people) {
    const role = p.current_role;
    if (!role?.org_classification) continue;
    const dist = parseDistrictNum(role.district);
    if (dist === null) continue;

    if (role.org_classification === "lower") {
      house[dist] = p.name;
    } else if (role.org_classification === "upper") {
      senate[dist] = p.name;
    }
  }

  const houseTs = formatTsRecord(
    "TX_STATE_REP_BY_HOUSE_DISTRICT",
    house,
    ["Texas House (Open States API). Verify against house.texas.gov after redistricting."],
  );
  writeFileSync(path.join(OUT_DIR, "tx-state-house.ts"), houseTs, "utf8");
  console.log(
    `Wrote ${path.relative(ROOT, path.join(OUT_DIR, "tx-state-house.ts"))} (${Object.keys(house).length} districts)`,
  );

  const senateTs = formatTsRecord(
    "TX_STATE_SENATOR_BY_DISTRICT",
    senate,
    ["Texas Senate (Open States API). Verify against senate.texas.gov after redistricting / specials."],
  );
  writeFileSync(path.join(OUT_DIR, "tx-state-senate.ts"), senateTs, "utf8");
  console.log(
    `Wrote ${path.relative(ROOT, path.join(OUT_DIR, "tx-state-senate.ts"))} (${Object.keys(senate).length} districts)`,
  );

  if (Object.keys(house).length < 140) {
    console.warn(
      `Warning: expected ~150 Texas House districts; got ${Object.keys(house).length}. Check Open States coverage.`,
    );
  }
  if (Object.keys(senate).length < 28) {
    console.warn(
      `Warning: expected ~31 Texas Senate districts; got ${Object.keys(senate).length}. Check Open States coverage.`,
    );
  }
}

async function main(): Promise<void> {
  mkdirSync(OUT_DIR, { recursive: true });

  const congressKey = process.env.CONGRESS_GOV_API_KEY;
  if (!congressKey) {
    console.error("Missing CONGRESS_GOV_API_KEY (get one at https://api.congress.gov/sign-up/)");
    process.exit(1);
  }

  await syncUsHouse(congressKey);

  const osKey = process.env.OPENSTATES_API_KEY;
  if (osKey) {
    await syncTxStateLegislators(osKey);
  } else {
    console.log(
      "OPENSTATES_API_KEY not set — skipping Texas House/Senate (existing generated files left unchanged).",
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
