/**
 * GeoJSON for regional municipal government outside Austin’s dedicated council layer:
 * council wards (manifest-driven) + Travis County municipal limits (mayor / at-large council).
 * Austin council districts stay on the live Open Data layer (`atx-council` → API proxy).
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const OUT = resolve(process.cwd(), "public/data/travis-city-government.geojson");
const MUNICIPAL_PATH = resolve(process.cwd(), "public/data/travis-municipal-full-purpose.geojson");
const REGIONAL_WARDS_PATH = resolve(process.cwd(), "public/data/travis-municipal-council-districts.geojson");

type GeoJsonFeatureCollection = {
  type: "FeatureCollection";
  features: Array<{ type: "Feature"; properties?: Record<string, unknown>; geometry: unknown }>;
};

function isFc(x: unknown): x is GeoJsonFeatureCollection {
  return typeof x === "object" && x !== null && (x as GeoJsonFeatureCollection).type === "FeatureCollection";
}

async function main(): Promise<void> {
  const wardRaw = await readFile(REGIONAL_WARDS_PATH, "utf8");
  const wardParsed: unknown = JSON.parse(wardRaw);
  const wardFeatures = isFc(wardParsed)
    ? wardParsed.features.map((f) => ({
        ...f,
        properties: {
          ...(f.properties ?? {}),
          _REGION_KIND: "municipal_ward",
        },
      }))
    : [];

  const muniRaw = await readFile(MUNICIPAL_PATH, "utf8");
  const muniParsed: unknown = JSON.parse(muniRaw);
  const muniFeatures = isFc(muniParsed)
    ? muniParsed.features.map((f) => ({
        ...f,
        properties: {
          ...(f.properties ?? {}),
          _REGION_KIND: "municipal_limits",
        },
      }))
    : [];

  const out: GeoJsonFeatureCollection = {
    type: "FeatureCollection",
    features: [...wardFeatures, ...muniFeatures],
  };

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(out, null, 2), "utf8");
  console.log(
    `Wrote travis-city-government.geojson (${out.features.length} features: wards ${wardFeatures.length}, municipalities ${muniFeatures.length})`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
