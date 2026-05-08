/**
 * Merges ISD single-member trustee polygons from `scripts/data/travis-isd-trustee-sources.ts`
 * into `public/data/travis-isd-trustee-districts.geojson`.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import type { TravisIsdTrusteeSource } from "./data/travis-isd-trustee-sources";
import { TRAVIS_ISD_TRUSTEE_SOURCES } from "./data/travis-isd-trustee-sources";
import { trusteeGeoJsonFromKml } from "./lib/kml-trustee-to-geojson";

const OUTPUT_PATH = resolve(process.cwd(), "public/data/travis-isd-trustee-districts.geojson");

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
    throw new Error(`HTTP ${res.status} for ${url}`);
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

function normalizeIsdFeature(
  base: GeoJsonFeature,
  isdSlug: string,
  isdDisplayName: string,
  districtNum: number | null,
): GeoJsonFeature {
  const dStr = districtNum !== null ? String(districtNum) : "";
  return {
    type: "Feature",
    properties: {
      ISD_SLUG: isdSlug,
      ISD_NAME: isdDisplayName,
      DISTRICT: dStr,
      DISTRICT_NUM: districtNum,
    },
    geometry: base.geometry,
  };
}

function pickDistrict(props: Record<string, unknown>, field: string): number | null {
  const raw = props[field] ?? props[field.toUpperCase()] ?? props[field.toLowerCase()];
  return parseDistrictFlexible(raw);
}

async function featuresFromSource(source: TravisIsdTrusteeSource): Promise<GeoJsonFeature[]> {
  if (source.kind === "kml_url") {
    const response = await fetch(source.url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`KML HTTP ${response.status} (${source.isdSlug})`);
    }
    const kmlText = await response.text();
    const fc = trusteeGeoJsonFromKml(kmlText);
    return fc.features.map((f) => {
      const dn = parseDistrictFlexible(f.properties.DISTRICT);
      const feat: GeoJsonFeature = {
        type: "Feature",
        properties: {},
        geometry: f.geometry,
      };
      return normalizeIsdFeature(feat, source.isdSlug, source.isdDisplayName, dn);
    });
  }

  if (source.kind === "geojson_url") {
    const payload = await fetchJson(source.url);
    if (!isFeatureCollection(payload)) {
      throw new Error(`Expected GeoJSON FeatureCollection (${source.isdSlug})`);
    }
    return payload.features.map((f) => {
      const props = (f.properties ?? {}) as Record<string, unknown>;
      const dn = pickDistrict(props, source.districtProperty);
      return normalizeIsdFeature(f as GeoJsonFeature, source.isdSlug, source.isdDisplayName, dn);
    });
  }

  if (source.kind === "arcgis_geojson_query") {
    const payload = await fetchJson(source.queryUrl);
    if (!isFeatureCollection(payload)) {
      throw new Error(`Expected ArcGIS GeoJSON FeatureCollection (${source.isdSlug})`);
    }
    return payload.features.map((f) => {
      const props = (f.properties ?? {}) as Record<string, unknown>;
      const dn = pickDistrict(props, source.districtProperty);
      return normalizeIsdFeature(f as GeoJsonFeature, source.isdSlug, source.isdDisplayName, dn);
    });
  }

  return [];
}

export async function buildTravisIsdTrusteeDistricts(): Promise<void> {
  const all: GeoJsonFeature[] = [];

  for (const source of TRAVIS_ISD_TRUSTEE_SOURCES) {
    console.log(`ISD trustee source: ${source.isdSlug} (${source.kind})`);
    const chunk = await featuresFromSource(source);
    all.push(...chunk);
    console.log(`  +${chunk.length} features`);
  }

  if (all.length === 0) {
    throw new Error("No ISD trustee features — check TRAVIS_ISD_TRUSTEE_SOURCES.");
  }

  const out: GeoJsonFeatureCollection = {
    type: "FeatureCollection",
    features: all,
  };

  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, JSON.stringify(out, null, 2), "utf8");
  console.log(`Wrote ${all.length} merged ISD trustee features -> ${OUTPUT_PATH}`);
}

async function main(): Promise<void> {
  await buildTravisIsdTrusteeDistricts();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
