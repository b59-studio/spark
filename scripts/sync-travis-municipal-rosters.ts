/**
 * Builds mayors + city council lists for Travis County municipalities other than Austin.
 * Austin council members use ATX_COUNCIL_MEMBER_BY_DISTRICT; mayor uses src/data/atx-mayor.ts.
 *
 * Primary source: Open States API v3 (same key as `sync-legislator-rosters.ts`).
 * Overrides: scripts/data/travis-municipal-rosters.seed.json (manual corrections).
 *
 * Usage: npx tsx scripts/sync-travis-municipal-rosters.ts
 *
 * Output: src/data/generated/municipal/travis-municipal-rosters.ts
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { travisMunicipalSlugFromGisName } from "../src/utils/travisMunicipalSlug";

const ROOT = process.cwd();
const OUT_FILE = path.join(ROOT, "src/data/generated/municipal/travis-municipal-rosters.ts");
const SEED_PATH = path.join(ROOT, "scripts/data/travis-municipal-rosters.seed.json");

/** Full-purpose municipalities in Travis County GIS layer 0 (same order as county map legend). */
const TRAVIS_COUNTY_GIS_MUNICIPAL_NAMES_EXCEPT_AUSTIN = [
  "City of Bee Cave",
  "Village of Briarcliff",
  "City of Cedar Park",
  "Village of Creedmoor",
  "City of Elgin",
  "City of Jonestown",
  "City of Lago Vista",
  "City of Lakeway",
  "City of Leander",
  "City of Manor",
  "City of Mustang Ridge",
  "City of Pflugerville",
  "Village of Point Venture",
  "City of Rollingwood",
  "City of Round Rock",
  "Village of San Leanna",
  "City of Sunset Valley",
  "Village of The Hills",
  "Village of Volente",
  "Village of Webberville",
  "City of West Lake Hills",
] as const;

const TRAVIS_SLUGS = [...new Set(
  TRAVIS_COUNTY_GIS_MUNICIPAL_NAMES_EXCEPT_AUSTIN.map((n) => travisMunicipalSlugFromGisName(n)),
)].sort((a, b) => a.localeCompare(b));

type TravisMunicipalRoster = {
  mayor: string | null;
  councilMembers: string[];
};

type SeedFile = Record<string, Partial<TravisMunicipalRoster>>;

type OpenStatesPerson = {
  name: string;
  current_role?: {
    title?: string;
    district?: string | number;
  };
};

type OpenStatesPeopleResponse = {
  results?: OpenStatesPerson[];
};

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchJson(url: string, init?: RequestInit): Promise<unknown> {
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return res.json();
}

function roleBucket(titleRaw: string | undefined): "mayor" | "council" | null {
  const t = (titleRaw ?? "").toLowerCase();
  if (!t) return null;
  if (t.includes("mayor") && !t.includes("pro tem") && !t.includes("protem")) return "mayor";
  if (
    t.includes("council") ||
    t.includes("councilmember") ||
    t.includes("council member") ||
    t.includes("alderman") ||
    t.includes("alderwoman") ||
    t.includes("alderperson") ||
    (t.includes("commissioner") && !t.includes("county") && !t.includes("precinct"))
  ) {
    return "council";
  }
  return null;
}

function rosterFromPeople(people: OpenStatesPerson[]): TravisMunicipalRoster {
  let mayor: string | null = null;
  const council: string[] = [];

  for (const p of people) {
    const bucket = roleBucket(p.current_role?.title);
    if (bucket === "mayor") {
      if (!mayor) mayor = p.name;
      continue;
    }
    if (bucket === "council") {
      council.push(p.name);
    }
  }

  const dedupedCouncil = [...new Set(council)].sort((a, b) => a.localeCompare(b));
  return { mayor, councilMembers: dedupedCouncil };
}

async function fetchPeopleForJurisdiction(
  apiKey: string,
  slug: string,
): Promise<OpenStatesPerson[]> {
  const out: OpenStatesPerson[] = [];
  const jurisdiction = `ocd-jurisdiction/country:us/state:tx/place:${slug}`;
  let page = 1;
  const perPage = 100;
  for (;;) {
    const u = new URL("https://v3.openstates.org/people");
    u.searchParams.set("jurisdiction", jurisdiction);
    u.searchParams.set("page", String(page));
    u.searchParams.set("per_page", String(perPage));
    const body = (await fetchJson(u.toString(), {
      headers: { "X-API-KEY": apiKey },
    })) as OpenStatesPeopleResponse;
    const batch = body.results ?? [];
    out.push(...batch);
    if (batch.length < perPage) break;
    page += 1;
    await sleep(120);
  }
  return out;
}

function loadSeed(): SeedFile {
  try {
    const raw = readFileSync(SEED_PATH, "utf8");
    return JSON.parse(raw) as SeedFile;
  } catch {
    return {};
  }
}

function mergeRoster(base: TravisMunicipalRoster, patch: Partial<TravisMunicipalRoster> | undefined): TravisMunicipalRoster {
  if (!patch) return base;
  return {
    mayor: patch.mayor !== undefined ? patch.mayor : base.mayor,
    councilMembers:
      patch.councilMembers !== undefined ? [...patch.councilMembers] : [...base.councilMembers],
  };
}

function formatGeneratedFile(
  rosterBySlug: Record<string, TravisMunicipalRoster>,
  sourceLines: string[],
): string {
  const iso = new Date().toISOString();
  const keys = Object.keys(rosterBySlug).sort((a, b) => a.localeCompare(b));
  const lines = keys.map((slug) => {
    const r = rosterBySlug[slug];
    const mayorJs = r.mayor === null ? "null" : JSON.stringify(r.mayor);
    const councilInner = r.councilMembers.map((n) => JSON.stringify(n)).join(", ");
    return `  ${JSON.stringify(slug)}: { mayor: ${mayorJs}, councilMembers: [${councilInner}] },`;
  });

  return [
    "/**",
    " * AUTO-GENERATED — do not edit by hand.",
    ` * ${sourceLines.join(" ")}`,
    ` * Generated at (UTC): ${iso}`,
    " */",
    "",
    "export type TravisMunicipalRoster = {",
    "  mayor: string | null;",
    "  councilMembers: string[];",
    "};",
    "",
    "export const TRAVIS_MUNICIPAL_ROSTER_BY_SLUG: Record<string, TravisMunicipalRoster> = {",
    ...lines,
    "};",
    "",
  ].join("\n");
}

async function main(): Promise<void> {
  mkdirSync(path.dirname(OUT_FILE), { recursive: true });

  const seed = loadSeed();
  const rosterBySlug: Record<string, TravisMunicipalRoster> = {};

  for (const slug of TRAVIS_SLUGS) {
    rosterBySlug[slug] = { mayor: null, councilMembers: [] };
  }

  const apiKey = process.env.OPENSTATES_API_KEY;
  const sourceLines: string[] = [];

  if (apiKey) {
    sourceLines.push("Open States API v3 (Texas municipal jurisdictions).");
    console.log("Fetching municipal rosters from Open States…");
    for (const slug of TRAVIS_SLUGS) {
      try {
        const people = await fetchPeopleForJurisdiction(apiKey, slug);
        rosterBySlug[slug] = rosterFromPeople(people);
        await sleep(150);
      } catch (e) {
        console.warn(`Warning: ${slug}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  } else {
    console.log(
      "OPENSTATES_API_KEY not set — writing empty rosters (use seed file or set key to populate).",
    );
    sourceLines.push("Defaults + seed file only (no OPENSTATES_API_KEY).");
  }

  if (Object.keys(seed).length > 0) {
    sourceLines.push("Merged scripts/data/travis-municipal-rosters.seed.json.");
  }

  for (const slug of TRAVIS_SLUGS) {
    rosterBySlug[slug] = mergeRoster(rosterBySlug[slug], seed[slug]);
  }

  const ts = formatGeneratedFile(rosterBySlug, sourceLines);
  writeFileSync(OUT_FILE, ts, "utf8");
  console.log(`Wrote ${path.relative(ROOT, OUT_FILE)} (${TRAVIS_SLUGS.length} cities)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
