import type mapboxgl from "mapbox-gl";
import type { DistrictLayer, DistrictLookupResult } from "@/types/district.types";
import { firstFeature, toDisplayProperties } from "@/utils/geojson.utils";
import { enrichDistrictLookupResult } from "@/utils/enrichDistrictLookup";

type Position = [number, number];
type PolygonCoordinates = Position[][];
type MultiPolygonCoordinates = Position[][][];
type RawProperties = Record<string, string | number | boolean | null>;

function isInRing(point: Position, ring: Position[]): boolean {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / ((yj - yi) || 1e-12) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

function isInPolygon(point: Position, polygon: PolygonCoordinates): boolean {
  if (polygon.length === 0) return false;
  if (!isInRing(point, polygon[0])) return false;
  for (let i = 1; i < polygon.length; i += 1) {
    if (isInRing(point, polygon[i])) return false;
  }
  return true;
}

function featureContainsPoint(feature: mapboxgl.MapboxGeoJSONFeature, point: Position): boolean {
  const geometry = feature.geometry;
  if (!geometry) return false;

  if (geometry.type === "Polygon") {
    return isInPolygon(point, geometry.coordinates as PolygonCoordinates);
  }
  if (geometry.type === "MultiPolygon") {
    return (geometry.coordinates as MultiPolygonCoordinates).some((polygon) => isInPolygon(point, polygon));
  }
  return false;
}

function getFeatureLabel(
  layer: DistrictLayer,
  properties: RawProperties | undefined,
): string {
  if (!properties) return "Unknown";
  const fields = [layer.labelProperty, ...(layer.labelPropertyFallbacks ?? [])];
  for (const field of fields) {
    const candidateKeys = [field, field.toUpperCase(), field.toLowerCase()];
    for (const key of candidateKeys) {
      const rawValue = properties[key];
      if (rawValue === undefined || rawValue === null) continue;
      const label = String(rawValue).trim();
      if (label.length > 0) return label;
    }
  }
  return "Unknown";
}

/** Pure lookup — stable reference; safe to omit from hook dependency arrays. */
export function lookupDistrictsAtPoint(
  map: mapboxgl.Map,
  point: mapboxgl.PointLike,
  layers: DistrictLayer[],
  visibleLayers: Set<string>,
): DistrictLookupResult[] {
  const activeLayers = layers.filter((layer) => visibleLayers.has(layer.id));
  if (activeLayers.length === 0) return [];

  // Only query layers that are already in the style. District fill layers are added in an
  // effect that can run after visible-layer state updates, so IDs like `tx-state-senate-fill`
  // may not exist yet — Mapbox throws if queryRenderedFeatures references a missing layer.
  const fillLayerIds = activeLayers
    .map((layer) => `${layer.id}-fill`)
    .filter((id) => Boolean(map.getLayer(id)));

  const rendered =
    fillLayerIds.length > 0
      ? map.queryRenderedFeatures(point, { layers: fillLayerIds })
      : [];
  const pointLngLat = map.unproject(point);
  const pointCoords: Position = [pointLngLat.lng, pointLngLat.lat];

  const firstFeatureBySource = new Map<string, mapboxgl.MapboxGeoJSONFeature>();
  rendered.forEach((feature) => {
    const sourceLayerId = String(feature.source);
    if (!firstFeatureBySource.has(sourceLayerId)) {
      firstFeatureBySource.set(sourceLayerId, feature);
    }
  });

  return activeLayers
    .map((layer) => {
      let feature = firstFeatureBySource.get(layer.id);
      if (!feature) {
        try {
          const sourceMatches = map
            .querySourceFeatures(layer.id)
            .filter((candidate) => featureContainsPoint(candidate, pointCoords));
          feature = firstFeature(sourceMatches) ?? undefined;
        } catch {
          feature = undefined;
        }
      }
      if (!feature) return null;
      const featureProperties = feature.properties as RawProperties | undefined;
      const base: DistrictLookupResult = {
        layerId: layer.id,
        layerLabel: layer.label,
        featureLabel: getFeatureLabel(layer, featureProperties),
        properties: toDisplayProperties(
          featureProperties,
          layer.popupProperties,
          layer.popupPropertyAliases,
        ),
      };
      return enrichDistrictLookupResult(layer, featureProperties, base);
    })
    .filter((entry): entry is DistrictLookupResult => entry !== null);
}

export function useDistrictLookup() {
  return { lookupDistrictsAtPoint };
}
