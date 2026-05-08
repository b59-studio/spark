import { EXTERNAL_LAYER_URLS } from "@/data/map-external-layer-urls";

/**
 * When `NEXT_PUBLIC_MAP_GEOJSON_CDN_BASE` is set (e.g. public R2 URL + prefix),
 * GeoJSON for layers we snapshot to R2 loads from `{base}/{layerId}.geojson`.
 *
 * Layers not in `EXTERNAL_LAYER_URLS` (e.g. static `/data/...` files) keep their configured URL.
 */
export function resolveDistrictGeoJsonUrl(layerId: string, fallbackSourceUrl: string): string {
  if (!(layerId in EXTERNAL_LAYER_URLS)) {
    return fallbackSourceUrl;
  }
  const raw = process.env.NEXT_PUBLIC_MAP_GEOJSON_CDN_BASE;
  if (!raw || !raw.trim()) {
    return fallbackSourceUrl;
  }
  const base = raw.trim().replace(/\/+$/, "");
  return `${base}/${layerId}.geojson`;
}
