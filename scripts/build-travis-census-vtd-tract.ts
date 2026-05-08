/**
 * Merges Travis County VTD + census tract GeoJSON into one file for a single map layer.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { EXTERNAL_LAYER_URLS } from "../src/data/map-external-layer-urls";

const OUTPUT_PATH = resolve(process.cwd(), "public/data/travis-census-vtd-and-tracts.geojson");

type GeoJsonFeature = {
  type: "Feature";
  properties: Record<string, unknown>;
  geometry: unknown;
};

type GeoJsonFeatureCollection = {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
};

function isFeatureCollection(payload: unknown): payload is GeoJsonFeatureCollection {
  return (
    typeof payload === "object" &&
    payload !== null &&
    (payload as GeoJsonFeatureCollection).type === "FeatureCollection" &&
    Array.isArray((payload as GeoJsonFeatureCollection).features)
  );
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function main(): Promise<void> {
  const vtdUrl = EXTERNAL_LAYER_URLS["tx-vtd-placeholder"];
  const tractUrl = EXTERNAL_LAYER_URLS["census-tracts"];

  const [vtdPayload, tractPayload] = await Promise.all([fetchJson(vtdUrl), fetchJson(tractUrl)]);
  if (!isFeatureCollection(vtdPayload) || !isFeatureCollection(tractPayload)) {
    throw new Error("Unexpected census upstream payload.");
  }

  const vtdFeatures = vtdPayload.features.map((f) => ({
    ...f,
    properties: {
      ...(f.properties ?? {}),
      _CENSUS_KIND: "VTD",
    },
  }));

  const tractFeatures = tractPayload.features.map((f) => ({
    ...f,
    properties: {
      ...(f.properties ?? {}),
      _CENSUS_KIND: "CENSUS_TRACT",
    },
  }));

  const out: GeoJsonFeatureCollection = {
    type: "FeatureCollection",
    features: [...vtdFeatures, ...tractFeatures],
  };

  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, JSON.stringify(out, null, 2), "utf8");
  console.log(
    `Wrote ${out.features.length} features (VTD ${vtdFeatures.length}, tracts ${tractFeatures.length}) -> ${OUTPUT_PATH}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
