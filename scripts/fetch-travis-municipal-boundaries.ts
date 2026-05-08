/**
 * Downloads Travis County “Municipal Jurisdictions (Full Purpose)” polygons as GeoJSON.
 * Excludes the City of Austin polygon — Austin sits in the merged `travis-city-government.geojson`.
 *
 * Output: public/data/travis-municipal-full-purpose.geojson
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { travisMunicipalSlugFromGisName } from "../src/utils/travisMunicipalSlug";

const SOURCE_URL =
  "https://gis.traviscountytx.gov/server1/rest/services/Boundaries_and_Jurisdictions/Municipal_Jurisdictions_Boundaries/MapServer/0/query?where=NAME%3C%3E%27City%20of%20Austin%27&outFields=NAME%2COBJECTID&outSR=4326&f=geojson";

const OUTPUT_PATH = resolve(process.cwd(), "public/data/travis-municipal-full-purpose.geojson");

type GeoFeature = {
  type: "Feature";
  properties: Record<string, unknown>;
  geometry: unknown;
};

type GeoCollection = {
  type: "FeatureCollection";
  features: GeoFeature[];
};

function isGeoCollection(body: unknown): body is GeoCollection {
  return (
    typeof body === "object" &&
    body !== null &&
    (body as GeoCollection).type === "FeatureCollection" &&
    Array.isArray((body as GeoCollection).features)
  );
}

async function main(): Promise<void> {
  console.log("Fetching Travis County municipal boundaries…");
  const response = await fetch(SOURCE_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Upstream HTTP ${response.status}`);
  }
  const body: unknown = await response.json();
  if (!isGeoCollection(body)) {
    throw new Error("Unexpected response (not a GeoJSON FeatureCollection).");
  }

  const features = body.features.map((feature) => {
    const name = String(feature.properties?.NAME ?? "").trim();
    return {
      ...feature,
      properties: {
        ...feature.properties,
        CITY_SLUG: travisMunicipalSlugFromGisName(name),
      },
    };
  });

  const out: GeoCollection = {
    type: "FeatureCollection",
    features,
  };

  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, JSON.stringify(out, null, 2), "utf8");
  console.log(`Wrote ${features.length} features -> ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
