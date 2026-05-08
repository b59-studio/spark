import mapboxgl from "mapbox-gl";
import type { GeoJSONFeatureCollection, GeoJSONPoint } from "@/lib/map/types";

/** Downtown Austin CBD — same default as the district map when there are no points to frame. */
export const AUSTIN_DEFAULT_CENTER: [number, number] = [-97.7431, 30.2672];
export const AUSTIN_DEFAULT_ZOOM = 12;

export type InitialMapViewOptions = {
  /** Used when there are no coordinates or when fitting a single point. */
  defaultCenter: mapboxgl.LngLatLike;
  defaultZoom: number;
  /** Zoom when all loaded points collapse to one location. */
  singlePointZoom: number;
  padding: number | mapboxgl.PaddingOptions;
  /** Cap zoom when multiple points are tightly clustered. */
  maxZoom: number;
};

const DEFAULT_INITIAL_VIEW: InitialMapViewOptions = {
  defaultCenter: AUSTIN_DEFAULT_CENTER,
  defaultZoom: AUSTIN_DEFAULT_ZOOM,
  singlePointZoom: 14,
  padding: 48,
  maxZoom: 15,
};

/**
 * Collect [lng, lat] from Point features (non-points ignored).
 */
export function lngLatsFromPointFeatureCollection(
  fc: GeoJSONFeatureCollection<GeoJSONPoint>,
): [number, number][] {
  const out: [number, number][] = [];
  for (const f of fc.features) {
    if (f.geometry?.type !== "Point") continue;
    const c = f.geometry.coordinates;
    if (
      Array.isArray(c) &&
      c.length >= 2 &&
      typeof c[0] === "number" &&
      typeof c[1] === "number" &&
      Number.isFinite(c[0]) &&
      Number.isFinite(c[1])
    ) {
      out.push([c[0], c[1]]);
    }
  }
  return out;
}

/**
 * One-shot initial camera: fit `lngLats` when present; otherwise jump to the Austin default.
 * Call after style/sources are ready (e.g. map `"load"` or equivalent `mapReady`).
 * Use {@link lngLatsFromPointFeatureCollection} to derive coordinates from GeoJSON.
 */
/**
 * Expand {@link mapboxgl.LngLatBounds} on each side so edge points are not clipped
 * after projection / slight bbox rounding (ratio is per side, e.g. 0.1 → ~20% wider span).
 */
export function padLngLatBounds(
  bounds: mapboxgl.LngLatBounds,
  paddingRatio = 0.12,
): { west: number; south: number; east: number; north: number } {
  const w = bounds.getWest();
  const s = bounds.getSouth();
  const e = bounds.getEast();
  const n = bounds.getNorth();
  const latSpan = Math.max(n - s, 1e-9);
  const lngSpan = Math.max(e - w, 1e-9);
  const latPad = (latSpan * paddingRatio) / 2;
  const lngPad = (lngSpan * paddingRatio) / 2;
  return {
    west: w - lngPad,
    south: s - latPad,
    east: e + lngPad,
    north: n + latPad,
  };
}

export function applyInitialMapViewFromLngLats(
  map: mapboxgl.Map,
  lngLats: ReadonlyArray<[number, number]>,
  options?: Partial<InitialMapViewOptions>,
): void {
  const o = { ...DEFAULT_INITIAL_VIEW, ...options };

  if (lngLats.length === 0) {
    map.jumpTo({ center: o.defaultCenter, zoom: o.defaultZoom });
    return;
  }

  if (lngLats.length === 1) {
    map.jumpTo({
      center: lngLats[0],
      zoom: o.singlePointZoom,
    });
    return;
  }

  const bounds = new mapboxgl.LngLatBounds(lngLats[0], lngLats[0]);
  for (let i = 1; i < lngLats.length; i++) {
    bounds.extend(lngLats[i]);
  }

  map.fitBounds(bounds, {
    padding: o.padding,
    maxZoom: o.maxZoom,
    duration: 0,
  });
}
