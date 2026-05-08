import {
  EXTERNAL_LAYER_URLS,
  type ExternalLayerKey,
} from "@/data/map-external-layer-urls";
import {
  arcGisToGeoJson,
  looksLikeGeoJson,
  type ArcGisQueryResponse,
} from "@/lib/map/external-layer-geojson";

const FLOODPLAIN_QUERY_CHUNK_SIZE = 250;
const DEFAULT_UPSTREAM_TIMEOUT_MS = 25000;

export type FetchExternalLayerOptions = {
  /** Passed through to `fetch` (e.g. Next.js `next: { revalidate }`). */
  fetchInit?: RequestInit;
  /** Default 25s; snapshots use a larger value for huge statewide layers. */
  timeoutMs?: number;
};

export type GeoJsonFeatureCollection = {
  type: "FeatureCollection";
  features: unknown[];
};

const EMPTY_FEATURE_COLLECTION: GeoJsonFeatureCollection = {
  type: "FeatureCollection",
  features: [],
};

async function fetchJsonWithTimeout(
  url: string,
  fetchInit: RequestInit | undefined,
  timeoutMs: number,
): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...fetchInit,
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

async function fetchJsonWithRetry(
  url: string,
  fetchInit: RequestInit | undefined,
  retries: number,
  timeoutMs: number,
): Promise<unknown> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fetchJsonWithTimeout(url, fetchInit, timeoutMs);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

/**
 * Returns GeoJSON for a layer key — same payload as `/api/map/external-layer?layer=`.
 */
export async function fetchExternalLayerGeoJson(
  layer: ExternalLayerKey,
  options?: FetchExternalLayerOptions,
): Promise<GeoJsonFeatureCollection> {
  const fetchInit = options?.fetchInit;
  const timeoutMs = options?.timeoutMs ?? DEFAULT_UPSTREAM_TIMEOUT_MS;

  if (layer === "fema-flood") {
    const base = EXTERNAL_LAYER_URLS[layer];
    const idsBody = (await fetchJsonWithRetry(
      `${base}/query?where=1%3D1&returnIdsOnly=true&f=json`,
      fetchInit,
      1,
      timeoutMs,
    )) as { objectIds?: number[] };
    const allObjectIds = idsBody.objectIds ?? [];
    if (allObjectIds.length === 0) {
      return EMPTY_FEATURE_COLLECTION;
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
            fetchInit,
            1,
            timeoutMs,
          )) as ArcGisQueryResponse;
          return arcGisToGeoJson(chunkBody);
        },
      ),
    );

    const features = featureCollections.flatMap((collection) => collection.features);
    return {
      type: "FeatureCollection",
      features,
    };
  }

  const body = await fetchJsonWithRetry(EXTERNAL_LAYER_URLS[layer], fetchInit, 1, timeoutMs);
  if (looksLikeGeoJson(body)) {
    return body as GeoJsonFeatureCollection;
  }

  return arcGisToGeoJson(body as ArcGisQueryResponse) as GeoJsonFeatureCollection;
}
