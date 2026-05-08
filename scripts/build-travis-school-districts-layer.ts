/**
 * Merges TEA ISD polygons (Travis-area bbox) + single-member trustee polygons into one layer file.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const OUT_PATH = resolve(process.cwd(), "public/data/travis-school-districts.geojson");
const TRUSTEE_FRAGMENT_PATH = resolve(process.cwd(), "public/data/travis-isd-trustee-districts.geojson");

/** Travis County–centered envelope (WGS84) — intersects regional ISDs for map scope. */
const TRAVIS_ENVELOPE = {
  xmin: -98.1,
  ymin: 29.95,
  xmax: -97.35,
  ymax: 30.75,
  spatialReference: { wkid: 4326 },
};

/** Match TEA `NAME` (uppercase) to roster slug used in trustee GeoJSON + rosters. */
const TEA_NAME_TO_SLUG: Record<string, string> = {
  "AUSTIN ISD": "austin_isd",
  "ROUND ROCK ISD": "round_rock_isd",
  "LAKE TRAVIS ISD": "lake_travis_isd",
  "LEANDER ISD": "leander_isd",
  "PFLUGERVILLE ISD": "pflugerville_isd",
  "DEL VALLE ISD": "del_valle_isd",
  "MANOR ISD": "manor_isd",
  "HAYS ISD": "hays_isd",
  "EANES ISD": "eanes_isd",
};

type GeoJsonFeature = {
  type: "Feature";
  properties: Record<string, unknown>;
  geometry: unknown;
};

type GeoJsonFeatureCollection = {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
};

function isFc(payload: unknown): payload is GeoJsonFeatureCollection {
  return (
    typeof payload === "object" &&
    payload !== null &&
    (payload as GeoJsonFeatureCollection).type === "FeatureCollection" &&
    Array.isArray((payload as GeoJsonFeatureCollection).features)
  );
}

function teaNameToSlug(name: string): string {
  const up = name.trim().toUpperCase();
  if (TEA_NAME_TO_SLUG[up]) return TEA_NAME_TO_SLUG[up];
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

async function fetchTeaTravisIsdBoundaries(): Promise<GeoJsonFeature[]> {
  const base =
    "https://services7.arcgis.com/ZodPOMBKsdAsTqF4/ArcGIS/rest/services/TEA_School_Districts_2025/FeatureServer/23/query";
  const params = new URLSearchParams({
    where: "1=1",
    geometry: JSON.stringify(TRAVIS_ENVELOPE),
    geometryType: "esriGeometryEnvelope",
    spatialRel: "esriSpatialRelIntersects",
    inSR: "4326",
    outFields: "NAME,NAME2,SDLEA,DISTRICT",
    outSR: "4326",
    f: "geojson",
  });

  const res = await fetch(`${base}?${params.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`TEA spatial query HTTP ${res.status}`);
  const payload: unknown = await res.json();
  if (!isFc(payload)) throw new Error("TEA response not GeoJSON FeatureCollection.");

  return payload.features.map((f) => {
    const name = String((f.properties as Record<string, unknown>)?.NAME ?? "").trim();
    const slug = teaNameToSlug(name);
    return {
      type: "Feature" as const,
      properties: {
        _FEATURE_KIND: "isd_boundary",
        ISD_SLUG: slug,
        ISD_NAME: name,
        NAME: name,
      },
      geometry: f.geometry,
    };
  });
}

async function loadTrusteeDistricts(): Promise<GeoJsonFeature[]> {
  const raw = await readFile(TRUSTEE_FRAGMENT_PATH, "utf8");
  const parsed: unknown = JSON.parse(raw);
  if (!isFc(parsed)) return [];

  return parsed.features.map((f) => ({
    type: "Feature" as const,
    properties: {
      ...(f.properties ?? {}),
      _FEATURE_KIND: "trustee_district",
    },
    geometry: f.geometry,
  }));
}

async function main(): Promise<void> {
  const boundaries = await fetchTeaTravisIsdBoundaries();
  const trustees = await loadTrusteeDistricts();

  const out: GeoJsonFeatureCollection = {
    type: "FeatureCollection",
    features: [...boundaries, ...trustees],
  };

  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, JSON.stringify(out, null, 2), "utf8");
  console.log(
    `Wrote ${out.features.length} features (ISD boundaries ${boundaries.length}, trustee districts ${trustees.length}) -> ${OUT_PATH}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
