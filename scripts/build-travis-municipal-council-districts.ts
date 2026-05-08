/**
 * Merges non-Austin municipal council district polygons from `travis-municipal-council-sources.ts`.
 * Austin council districts are merged in `travis-city-government.geojson` from the same Open Data feed.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import type { TravisMunicipalCouncilSource } from "./data/travis-municipal-council-sources";
import { TRAVIS_MUNICIPAL_COUNCIL_SOURCES } from "./data/travis-municipal-council-sources";

const OUTPUT_PATH = resolve(process.cwd(), "public/data/travis-municipal-council-districts.geojson");

type GeoJsonFeature = {
  type: "Feature";
  properties: Record<string, string | number | null | undefined>;
  geometry: {
    type: string;
    coordinates: unknown;
  };
};

type GeoJsonFeatureCollection = {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
};

function parseDistrictFlexible(v: unknown): number | null {
  if (v === undefined || v === null || v === "") return null;
  const n = Number.parseInt(String(v).trim(), 10);
  return Number.isFinite(n) ? n : null;
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}

function isFeatureCollection(payload: unknown): payload is GeoJsonFeatureCollection {
  return (
    typeof payload === "object" &&
    payload !== null &&
    (payload as GeoJsonFeatureCollection).type === "FeatureCollection" &&
    Array.isArray((payload as GeoJsonFeatureCollection).features)
  );
}

function pickDistrict(props: Record<string, unknown>, field: string): number | null {
  const raw = props[field] ?? props[field.toUpperCase()] ?? props[field.toLowerCase()];
  return parseDistrictFlexible(raw);
}

function normalizeCouncilFeature(
  base: GeoJsonFeature,
  citySlug: string,
  cityDisplayName: string,
  districtProperty: string,
): GeoJsonFeature {
  const props = (base.properties ?? {}) as Record<string, unknown>;
  const dn = pickDistrict(props, districtProperty);
  return {
    type: "Feature",
    properties: {
      CITY_SLUG: citySlug,
      CITY_NAME: cityDisplayName,
      DISTRICT: dn !== null ? String(dn) : "",
      DISTRICT_NUM: dn,
    },
    geometry: base.geometry,
  };
}

async function featuresFromSource(source: TravisMunicipalCouncilSource): Promise<GeoJsonFeature[]> {
  const url = source.kind === "geojson_url" ? source.url : source.queryUrl;
  const payload = await fetchJson(url);
  if (!isFeatureCollection(payload)) {
    throw new Error(`Expected GeoJSON FeatureCollection (${source.citySlug})`);
  }
  return payload.features.map((f) =>
    normalizeCouncilFeature(f as GeoJsonFeature, source.citySlug, source.cityDisplayName, source.districtProperty),
  );
}

export async function buildTravisMunicipalCouncilDistricts(): Promise<void> {
  const all: GeoJsonFeature[] = [];

  for (const source of TRAVIS_MUNICIPAL_COUNCIL_SOURCES) {
    console.log(`Municipal council source: ${source.citySlug} (${source.kind})`);
    const chunk = await featuresFromSource(source);
    all.push(...chunk);
    console.log(`  +${chunk.length} features`);
  }

  const out: GeoJsonFeatureCollection = {
    type: "FeatureCollection",
    features: all,
  };

  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, JSON.stringify(out, null, 2), "utf8");
  console.log(`Wrote ${all.length} council district features -> ${OUTPUT_PATH}`);
}

async function main(): Promise<void> {
  await buildTravisMunicipalCouncilDistricts();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
