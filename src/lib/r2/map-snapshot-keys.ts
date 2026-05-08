/**
 * Object keys inside the bucket. Default prefix keeps room for version bumps (`map/geo/v2/...`).
 *
 * Override with env `MAP_GEOJSON_R2_KEY_PREFIX` (no leading slash; trailing slash optional).
 */
export function getMapGeoJsonKeyPrefix(): string {
  const raw = process.env.MAP_GEOJSON_R2_KEY_PREFIX?.trim();
  return (raw || "map/geo/v1").replace(/^\/+/, "").replace(/\/+$/, "");
}

export function objectKeyForDistrictLayer(layerId: string): string {
  return `${getMapGeoJsonKeyPrefix()}/${layerId}.geojson`;
}
