import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type ExternalLayerKey =
  | "commissioner-precincts"
  | "austin-city-council"
  | "tx-vtd-placeholder"
  | "austin-isd-trustee-placeholder"
  | "school-district-boundaries"
  | "mud-districts"
  | "census-tracts"
  | "fema-flood";

type ArcGisFeature = {
  attributes?: Record<string, unknown>;
  geometry?: {
    rings?: number[][][];
    paths?: number[][][];
    x?: number;
    y?: number;
  };
};

type ArcGisQueryResponse = {
  features?: ArcGisFeature[];
};

const EXTERNAL_LAYER_URLS: Record<ExternalLayerKey, string> = {
  "commissioner-precincts":
    "https://gis.traviscountytx.gov/server1/rest/services/Boundaries_and_Jurisdictions/Travis_County_Commissioner_Precincts/MapServer/0/query?where=1%3D1&outFields=PRECINCT%2CCOMMISSIONER&outSR=4326&f=geojson",
  "austin-city-council":
    "https://data.austintexas.gov/resource/w3v2-cj58.geojson?$limit=50000",
  // Travis County slice for visible POC rendering in current map bounds.
  "tx-vtd-placeholder":
    "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Legislative/MapServer/15/query?where=STATE%3D%2748%27%20AND%20COUNTY%3D%27453%27&outFields=VTD%2CNAME%2CBASENAME%2CGEOID%2CCOUNTY&outSR=4326&f=geojson",
  // Temporary substitute until AISD trustee KML is ETL-converted to GeoJSON.
  "austin-isd-trustee-placeholder":
    "https://services7.arcgis.com/ZodPOMBKsdAsTqF4/ArcGIS/rest/services/TEA_School_Districts_2025/FeatureServer/23/query?where=NAME%3D%27AUSTIN%20ISD%27&outFields=NAME%2CDISTRICT%2CNAME2%2CSDLEA%2CNCES_DISTR&outSR=4326&f=json",
  "school-district-boundaries":
    "https://services7.arcgis.com/ZodPOMBKsdAsTqF4/ArcGIS/rest/services/TEA_School_Districts_2025/FeatureServer/23/query?where=1%3D1&outFields=NAME%2CDISTRICT%2CNAME2%2CSDLEA%2CNCES_DISTR&outSR=4326&f=json",
  "mud-districts":
    "https://gisweb.tceq.texas.gov/arcgis/rest/services/Public/WaterDistricts/MapServer/0/query?where=TYPE%3D%27MUD%27&outFields=NAME%2CDISTRICT_ID%2CCOUNTY%2CTYPE%2CSTATUS&outSR=4326&f=geojson",
  "census-tracts":
    "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Tracts_Blocks/MapServer/0/query?where=STATE%3D%2748%27%20AND%20COUNTY%3D%27453%27&outFields=GEOID%2CNAME%2CBASENAME%2CCOUNTY%2CTRACT&outSR=4326&f=geojson",
  "fema-flood":
    "https://maps.austintexas.gov/arcgis/rest/services/Shared/Floodplain/MapServer/1",
};

const FLOODPLAIN_QUERY_CHUNK_SIZE = 250;
const UPSTREAM_TIMEOUT_MS = 25000;

const EMPTY_FEATURE_COLLECTION = {
  type: "FeatureCollection",
  features: [],
} as const;

function looksLikeGeoJson(payload: unknown): payload is {
  type: string;
  features: unknown[];
} {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "type" in payload &&
    "features" in payload
  );
}

function arcGisToGeoJson(payload: ArcGisQueryResponse) {
  const features = (payload.features ?? [])
    .map((feature, index) => {
      const attrs = feature.attributes ?? {};
      const geom = feature.geometry;
      if (!geom) return null;

      if (geom.rings && geom.rings.length > 0) {
        return {
          type: "Feature",
          id: (attrs.OBJECTID as string | number | undefined) ?? index,
          properties: attrs,
          geometry: {
            type: "Polygon",
            coordinates: geom.rings,
          },
        };
      }

      if (geom.paths && geom.paths.length > 0) {
        return {
          type: "Feature",
          id: (attrs.OBJECTID as string | number | undefined) ?? index,
          properties: attrs,
          geometry: {
            type: "MultiLineString",
            coordinates: geom.paths,
          },
        };
      }

      if (typeof geom.x === "number" && typeof geom.y === "number") {
        return {
          type: "Feature",
          id: (attrs.OBJECTID as string | number | undefined) ?? index,
          properties: attrs,
          geometry: {
            type: "Point",
            coordinates: [geom.x, geom.y],
          },
        };
      }

      return null;
    })
    .filter((feature): feature is NonNullable<typeof feature> => feature !== null);

  return {
    type: "FeatureCollection",
    features,
  };
}

async function fetchJsonWithTimeout(url: string): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`Upstream returned ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchJsonWithRetry(url: string, retries = 1): Promise<unknown> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fetchJsonWithTimeout(url);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const layer = url.searchParams.get("layer") as ExternalLayerKey | null;

  if (!layer || !(layer in EXTERNAL_LAYER_URLS)) {
    return NextResponse.json(
      { error: "Unknown external layer key." },
      { status: 400 },
    );
  }

  try {
    if (layer === "fema-flood") {
      const base = EXTERNAL_LAYER_URLS[layer];
      const idsBody = (await fetchJsonWithRetry(
        `${base}/query?where=1%3D1&returnIdsOnly=true&f=json`,
      )) as { objectIds?: number[] };
      const allObjectIds = idsBody.objectIds ?? [];
      if (allObjectIds.length === 0) {
        return NextResponse.json(EMPTY_FEATURE_COLLECTION);
      }

      const featureCollections = await Promise.all(
        Array.from({ length: Math.ceil(allObjectIds.length / FLOODPLAIN_QUERY_CHUNK_SIZE) }).map(
          async (_, chunkIndex) => {
            const start = chunkIndex * FLOODPLAIN_QUERY_CHUNK_SIZE;
            const ids = allObjectIds.slice(start, start + FLOODPLAIN_QUERY_CHUNK_SIZE);
            const query = new URLSearchParams({
              objectIds: ids.join(","),
              outFields: "OBJECTID,FLOOD_ZONE,EFFECTIVE_DATE",
              outSR: "4326",
              f: "json",
            });
            const chunkBody = (await fetchJsonWithRetry(
              `${base}/query?${query.toString()}`,
            )) as ArcGisQueryResponse;
            return arcGisToGeoJson(chunkBody);
          },
        ),
      );

      const features = featureCollections.flatMap((collection) => collection.features);
      return NextResponse.json({
        type: "FeatureCollection",
        features,
      });
    }

    const body = await fetchJsonWithRetry(EXTERNAL_LAYER_URLS[layer]);
    if (looksLikeGeoJson(body)) {
      return NextResponse.json(body);
    }

    const converted = arcGisToGeoJson(body as ArcGisQueryResponse);
    return NextResponse.json(converted);
  } catch {
    return NextResponse.json(EMPTY_FEATURE_COLLECTION);
  }
}
