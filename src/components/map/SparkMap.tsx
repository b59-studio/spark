"use client";

/**
 * Browser Mapbox GL map. Requires **NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN** (URL-restrict in Mapbox).
 * Server routes prefer MAPBOX_ACCESS_TOKEN; see `src/lib/mapbox-server.ts` for fallback.
 */

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  boundaryColorsBySlug,
  boundaryPaintExpressions,
} from "@/lib/map/boundary-layer-colors";
import { MapApplicationShell } from "@/components/map/MapApplicationShell";
import { useMapFullscreen } from "@/hooks/useMapFullscreen";
import {
  AUSTIN_DEFAULT_CENTER,
  AUSTIN_DEFAULT_ZOOM,
  applyInitialMapViewFromLngLats,
  lngLatsFromPointFeatureCollection,
  padLngLatBounds,
} from "@/lib/map/initial-view";
import { attachPointClickPopup } from "@/lib/map/point-click-popup";
import type {
  GeoJSONFeatureCollection,
  GeoJSONMultiPolygon,
  GeoJSONPoint,
} from "@/lib/map/types";

type ScoreMetric = "turnout" | "persuasion" | "party";

type HouseholdScoreProps = {
  id: string;
  turnout: number | null;
  persuasion: number | null;
  party: number | null;
};

type HouseholdFeatureCollection = GeoJSONFeatureCollection<
  GeoJSONPoint,
  HouseholdScoreProps
>;

/** Empty → no bound; valid → 0–1 fraction; invalid input handled separately */
function parseOptionalPercentInput(raw: string):
  | { ok: true; bound: number | undefined }
  | { ok: false } {
  const t = raw.trim();
  if (t === "") return { ok: true, bound: undefined };
  const n = Number(t);
  if (!Number.isFinite(n) || n < 0 || n > 100) return { ok: false };
  return { ok: true, bound: n / 100 };
}

function scoreInRange(
  value: number | null,
  min?: number,
  max?: number,
): boolean {
  const hasMin = min !== undefined;
  const hasMax = max !== undefined;
  if (!hasMin && !hasMax) return true;
  if (value === null) return false;
  if (hasMin && value < min) return false;
  if (hasMax && value > max) return false;
  return true;
}

function filterHouseholdCollection(
  fc: HouseholdFeatureCollection,
  bounds: {
    turnoutMin?: number;
    turnoutMax?: number;
    persuasionMin?: number;
    persuasionMax?: number;
    partyMin?: number;
    partyMax?: number;
  },
): HouseholdFeatureCollection {
  return {
    ...fc,
    features: fc.features.filter((f) => {
      const p = f.properties;
      return (
        scoreInRange(p.turnout, bounds.turnoutMin, bounds.turnoutMax) &&
        scoreInRange(p.persuasion, bounds.persuasionMin, bounds.persuasionMax) &&
        scoreInRange(p.party, bounds.partyMin, bounds.partyMax)
      );
    }),
  };
}

const METRIC_HELP: Record<
  ScoreMetric,
  { label: string; description: string }
> = {
  turnout: {
    label: "Turnout",
    description:
      "Average share of recent general elections with a vote recorded for voters in this household (0–100%).",
  },
  persuasion: {
    label: "Persuasion",
    description:
      "Average primary-election participation rate — any primary vote counted — across voters in this household (0–100%).",
  },
  party: {
    label: "Party confidence",
    description:
      "Average Democratic primary participation rate from voter scores — higher means stronger historic Dem primary participation (0–100%).",
  },
};

/** Distinct ramps per metric so the active “Color by” choice is obvious on the basemap. */
const METRIC_COLOR_RAMPS: Record<ScoreMetric, readonly [string, string, string]> =
  {
    turnout: ["#bfdbfe", "#2563eb", "#172554"],
    persuasion: ["#a7f3d0", "#059669", "#064e3b"],
    party: ["#e9d5ff", "#9333ea", "#581c87"],
  };

function circleColorExpression(m: ScoreMetric): mapboxgl.Expression {
  const [low, mid, high] = METRIC_COLOR_RAMPS[m];
  return [
    "interpolate",
    ["linear"],
    ["coalesce", ["get", m], 0],
    0,
    low,
    0.5,
    mid,
    1,
    high,
  ];
}

const METRIC_RAMP_HINT: Record<ScoreMetric, string> = {
  turnout: "light blue → navy",
  persuasion: "mint → deep green",
  party: "lavender → deep purple",
};

/**
 * Layer IDs whose features render as points/circles. Each is wired up for
 * click-to-inspect popups via {@link attachPointClickHandlers}. Add new
 * point layers here so they're automatically clickable.
 */
const POINT_LAYER_IDS = ["households-circles"] as const;

const SCORE_KEYS = new Set(["turnout", "persuasion", "party"]);
const PROPERTY_LABELS: Record<string, string> = {
  id: "Household ID",
  turnout: "Turnout",
  persuasion: "Persuasion",
  party: "Party confidence",
};

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function coerceFiniteNumber(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function formatPercent(v: unknown): string {
  const n = coerceFiniteNumber(v);
  return n === null ? "—" : `${Math.round(n * 100)}%`;
}

function humanizePropertyKey(key: string): string {
  if (PROPERTY_LABELS[key]) return PROPERTY_LABELS[key];
  return key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildPointPopupHTML(props: Record<string, unknown> | null | undefined): string {
  const entries =
    props && typeof props === "object"
      ? Object.entries(props).filter(([, v]) => v !== undefined)
      : [];

  if (entries.length === 0) {
    return '<div style="font-size:12px;color:#6b7280;">No data available for this point.</div>';
  }

  const rows = entries
    .map(([key, value]) => {
      const display = SCORE_KEYS.has(key)
        ? formatPercent(value)
        : value === null || value === ""
          ? "—"
          : escapeHtml(String(value));
      return `<div style="display:flex;justify-content:space-between;gap:12px;font-size:12px;line-height:1.5;">
        <span style="color:#6b7280;">${escapeHtml(humanizePropertyKey(key))}</span>
        <span style="font-weight:600;color:#111827;text-align:right;word-break:break-all;">${display}</span>
      </div>`;
    })
    .join("");

  return `<div style="min-width:200px;max-width:280px;">
    <div style="font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.04em;color:#6b7280;margin-bottom:6px;">Point details</div>
    ${rows}
  </div>`;
}

/**
 * Wires `click` + cursor `mouseenter`/`mouseleave` for every layer in
 * `layerIds` so any rendered point feature reveals its loaded properties
 * in `popup`. Returns a detach function for use in cleanup.
 */
function attachPointClickHandlers(
  map: mapboxgl.Map,
  layerIds: readonly string[],
  popup: mapboxgl.Popup,
): () => void {
  const onClick = (event: mapboxgl.MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (!feature || !feature.geometry || feature.geometry.type !== "Point") return;
    const [lng, lat] = feature.geometry.coordinates as [number, number];
    const adjustedLng =
      Math.abs(event.lngLat.lng - lng) > 180
        ? lng + (event.lngLat.lng > lng ? 360 : -360)
        : lng;
    popup
      .setLngLat([adjustedLng, lat])
      .setHTML(buildPointPopupHTML(feature.properties as Record<string, unknown> | null))
      .addTo(map);
  };
  const onMouseEnter = () => {
    map.getCanvas().style.cursor = "pointer";
  };
  const onMouseLeave = () => {
    map.getCanvas().style.cursor = "";
  };

  for (const id of layerIds) {
    map.on("click", id, onClick);
    map.on("mouseenter", id, onMouseEnter);
    map.on("mouseleave", id, onMouseLeave);
  }

  return () => {
    for (const id of layerIds) {
      map.off("click", id, onClick);
      map.off("mouseenter", id, onMouseEnter);
      map.off("mouseleave", id, onMouseLeave);
    }
  };
}

function getPublicMapboxToken(): string | null {
  const t = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  return t && t.length > 0 ? t : null;
}

type BoundaryLayerMeta = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sortOrder: number;
};

/** Same-origin map APIs; respects Cache-Control from routes for faster repeat loads. */
const mapApiFetchInit: RequestInit = { credentials: "same-origin", cache: "default" };

async function readMapApiError(res: Response, fallback: string): Promise<string> {
  if (res.status === 401) {
    try {
      const j = (await res.json()) as { code?: string };
      if (j.code === "MAP_AUTH_REQUIRED") {
        return "Sign in required — use the Sign in link, then return to the map. (Server uses MAP_API_ACCESS=authenticated or scoped.)";
      }
    } catch {
      /* ignore */
    }
    return "Sign in required.";
  }
  return fallback;
}

export default function SparkMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const initialViewAppliedRef = useRef(false);
  const metricLabelId = useId();
  const metricDescId = useId();
  const filterLegendId = useId();

  const [metric, setMetric] = useState<ScoreMetric>("turnout");
  const [householdsRaw, setHouseholdsRaw] = useState<HouseholdFeatureCollection | null>(
    null,
  );
  const [scoreFilters, setScoreFilters] = useState<
    Record<ScoreMetric, { min: string; max: string }>
  >({
    turnout: { min: "", max: "" },
    persuasion: { min: "", max: "" },
    party: { min: "", max: "" },
  });
  const [layersMeta, setLayersMeta] = useState<BoundaryLayerMeta[]>([]);
  const [activeBoundarySlugs, setActiveBoundarySlugs] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const token = useMemo(() => getPublicMapboxToken(), []);

  const { rootRef: mapRootRef, isFullscreen, toggleFullscreen: toggleMapFullscreen } =
    useMapFullscreen(() => mapRef.current?.resize());

  const fetchHouseholdsInBounds = useCallback(
    async (
      bounds: { west: number; south: number; east: number; north: number },
      signal?: AbortSignal,
    ) => {
      const params = new URLSearchParams({
        west: String(bounds.west),
        south: String(bounds.south),
        east: String(bounds.east),
        north: String(bounds.north),
      });
      const res = await fetch(`/api/map/households?${params}`, {
        ...mapApiFetchInit,
        signal,
      });
      if (!res.ok) {
        throw new Error(
          await readMapApiError(res, `Households request failed (${res.status})`),
        );
      }
      return (await res.json()) as HouseholdFeatureCollection;
    },
    [],
  );

  const householdFilterOutcome = useMemo(() => {
    if (!householdsRaw) {
      return {
        filtered: null as HouseholdFeatureCollection | null,
        filterError: null as string | null,
        rawTotal: 0,
      };
    }

    const rawTotal = householdsRaw.features.length;
    const { min: minStr, max: maxStr } = scoreFilters[metric];
    const lo = parseOptionalPercentInput(minStr);
    const hi = parseOptionalPercentInput(maxStr);

    if (!lo.ok || !hi.ok) {
      return {
        filtered: null,
        filterError: "Use percentages from 0–100, or leave fields blank.",
        rawTotal,
      };
    }

    const a = lo.bound;
    const b = hi.bound;

    if (a !== undefined && b !== undefined && a > b) {
      const label = METRIC_HELP[metric].label;
      return {
        filtered: null,
        filterError: `${label}: minimum cannot be greater than maximum.`,
        rawTotal,
      };
    }

    const bounds: Parameters<typeof filterHouseholdCollection>[1] = {};
    if (metric === "turnout") {
      bounds.turnoutMin = a;
      bounds.turnoutMax = b;
    } else if (metric === "persuasion") {
      bounds.persuasionMin = a;
      bounds.persuasionMax = b;
    } else {
      bounds.partyMin = a;
      bounds.partyMax = b;
    }

    const filtered = filterHouseholdCollection(householdsRaw, bounds);

    return { filtered, filterError: null as string | null, rawTotal };
  }, [householdsRaw, metric, scoreFilters]);

  const mapHouseholdData = useMemo((): HouseholdFeatureCollection | null => {
    if (!householdsRaw) return null;
    if (householdFilterOutcome.filterError) {
      return { type: "FeatureCollection", features: [] };
    }
    return householdFilterOutcome.filtered;
  }, [householdsRaw, householdFilterOutcome.filterError, householdFilterOutcome.filtered]);

  const fetchBoundaries = useCallback(async (slugs: string[]) => {
    if (slugs.length === 0) {
      return {
        type: "FeatureCollection",
        features: [],
      } as GeoJSONFeatureCollection<GeoJSONMultiPolygon>;
    }
    const q = slugs.map(encodeURIComponent).join(",");
    const res = await fetch(`/api/map/boundaries?layers=${q}`, mapApiFetchInit);
    if (!res.ok) {
      throw new Error(
        await readMapApiError(res, `Boundaries request failed (${res.status})`),
      );
    }
    return (await res.json()) as GeoJSONFeatureCollection<GeoJSONMultiPolygon>;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/map/boundary-layers", mapApiFetchInit);
        if (!res.ok) {
          if (res.status === 401) {
            const msg = await readMapApiError(res, "Sign in required.");
            if (!cancelled) setError(msg);
          }
          return;
        }
        const data = (await res.json()) as { layers: BoundaryLayerMeta[] };
        if (!cancelled) {
          setLayersMeta(data.layers ?? []);
        }
      } catch {
        /* optional metadata */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /** Drop overlay selections the server no longer exposes after permissions refresh. */
  useEffect(() => {
    const allowed = new Set(layersMeta.map((l) => l.slug));
    setActiveBoundarySlugs((prev) => prev.filter((s) => allowed.has(s)));
  }, [layersMeta]);

  useEffect(() => {
    if (!token || !containerRef.current) {
      return;
    }

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: AUSTIN_DEFAULT_CENTER,
      zoom: AUSTIN_DEFAULT_ZOOM,
      renderWorldCopies: false,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current = map;

    let detachPointClicks: (() => void) | null = null;

    map.on("load", () => {
      map.addSource("households", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      map.addLayer({
        id: "households-circles",
        type: "circle",
        source: "households",
        paint: {
          "circle-radius": 6,
          "circle-color": circleColorExpression("turnout"),
          "circle-opacity": 0.85,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#ffffff",
        },
      });

      map.addSource("boundaries", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      map.addLayer({
        id: "boundaries-fill",
        type: "fill",
        source: "boundaries",
        paint: {
          "fill-color": "rgba(128, 128, 128, 0.06)",
          "fill-opacity": 1,
        },
      });

      map.addLayer({
        id: "boundaries-outline",
        type: "line",
        source: "boundaries",
        paint: {
          "line-color": "#6b7280",
          "line-width": 1.5,
          "line-opacity": 0.75,
        },
      });

      detachPointClicks = attachPointClickPopup(map, {
        layerIds: ["households-circles"],
        heading: "Household details",
        percentKeys: ["turnout", "persuasion", "party"],
        propertyLabels: {
          id: "Household ID",
          turnout: "Turnout",
          persuasion: "Persuasion",
          party: "Party confidence",
        },
        preferredOrder: ["id", "turnout", "persuasion", "party"],
      });

      setMapReady(true);
    });

    return () => {
      initialViewAppliedRef.current = false;
      setMapReady(false);
      detachPointClicks?.();
      map.remove();
      mapRef.current = null;
    };
  }, [token]);

  /**
   * Load only households inside the visible map bounds (server-side bbox filter).
   * Refetches after pan/zoom so we never download the full statewide dataset up front.
   */
  useEffect(() => {
    if (!token || !mapReady) return;
    const map = mapRef.current;
    if (!map) return;

    let cancelled = false;
    let abort = new AbortController();
    let debounceTimer: number | null = null;
    /** Avoid flashing “Loading…” on every viewport sync — first paint only. */
    let showedInitialLoading = false;

    const loadForViewport = () => {
      const rawBounds = map.getBounds();
      if (!rawBounds) return;

      abort.abort();
      abort = new AbortController();
      const signal = abort.signal;

      const bounds = padLngLatBounds(rawBounds, 0.12);

      if (!showedInitialLoading) {
        showedInitialLoading = true;
        setStatus("Loading households…");
      }
      setError(null);

      void (async () => {
        try {
          const data = await fetchHouseholdsInBounds(bounds, signal);
          if (cancelled || signal.aborted) return;
          setHouseholdsRaw(data);
        } catch (e) {
          if (cancelled || (e instanceof DOMException && e.name === "AbortError")) return;
          setError(e instanceof Error ? e.message : "Failed to load households");
          setHouseholdsRaw(null);
        } finally {
          if (!cancelled && !signal.aborted) {
            setStatus("");
          }
        }
      })();
    };

    loadForViewport();

    const scheduleReload = () => {
      if (debounceTimer !== null) window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => {
        debounceTimer = null;
        loadForViewport();
      }, 380);
    };

    map.on("moveend", scheduleReload);

    return () => {
      cancelled = true;
      abort.abort();
      if (debounceTimer !== null) window.clearTimeout(debounceTimer);
      map.off("moveend", scheduleReload);
    };
  }, [token, mapReady, fetchHouseholdsInBounds]);

  /** Frame camera to loaded household points once; empty/failed load keeps downtown Austin (constructor default). */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !householdsRaw || initialViewAppliedRef.current) return;
    initialViewAppliedRef.current = true;
    const lngLats = lngLatsFromPointFeatureCollection(householdsRaw);
    applyInitialMapViewFromLngLats(map, lngLats);
  }, [mapReady, householdsRaw]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const src = map.getSource("households") as mapboxgl.GeoJSONSource | undefined;
    if (!src) return;
    if (!mapHouseholdData) {
      src.setData({ type: "FeatureCollection", features: [] });
      return;
    }
    src.setData(mapHouseholdData);
  }, [mapHouseholdData, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    if (!map.getLayer("households-circles")) return;
    map.setPaintProperty(
      "households-circles",
      "circle-color",
      circleColorExpression(metric),
    );
  }, [metric, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !token || !mapReady) return;

    let cancelled = false;

    (async () => {
      try {
        const data = await fetchBoundaries(activeBoundarySlugs);
        if (cancelled) return;
        const src = map.getSource("boundaries") as mapboxgl.GeoJSONSource | undefined;
        if (src) {
          src.setData(data);
        }

        const catalogSlugs =
          layersMeta.length > 0
            ? layersMeta.map((l) => l.slug)
            : [
                ...new Set(
                  data.features
                    .map(
                      (f) =>
                        (f.properties as { layerSlug?: string } | null)?.layerSlug,
                    )
                    .filter((x): x is string => typeof x === "string"),
                ),
              ];

        const { fillColor, lineColor } = boundaryPaintExpressions(catalogSlugs);
        if (map.getLayer("boundaries-fill")) {
          map.setPaintProperty(
            "boundaries-fill",
            "fill-color",
            fillColor as mapboxgl.ExpressionSpecification,
          );
        }
        if (map.getLayer("boundaries-outline")) {
          map.setPaintProperty(
            "boundaries-outline",
            "line-color",
            lineColor as mapboxgl.ExpressionSpecification,
          );
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load boundaries");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    activeBoundarySlugs,
    token,
    mapReady,
    layersMeta,
    fetchBoundaries,
  ]);

  const slugDotColors = useMemo(
    () => boundaryColorsBySlug(layersMeta.map((l) => l.slug)),
    [layersMeta],
  );

  function toggleBoundarySlug(slug: string) {
    setActiveBoundarySlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  function setActiveScoreFilter(field: "min" | "max", value: string) {
    setScoreFilters((prev) => ({
      ...prev,
      [metric]: { ...prev[metric], [field]: value },
    }));
  }

  const activeScoreFilter = scoreFilters[metric];
  const ramp = METRIC_COLOR_RAMPS[metric];

  if (!token) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Add{" "}
        <code className="rounded bg-amber-100 px-1 font-mono text-xs">
          NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
        </code>{" "}
        to your environment to enable the map.
      </div>
    );
  }

  return (
    <MapApplicationShell
      rootRef={mapRootRef}
      isFullscreen={isFullscreen}
      onToggleFullscreen={toggleMapFullscreen}
      sidebar={
        <>
          <div className="flex flex-col gap-2">
            <label htmlFor={metricLabelId} className="text-sm font-medium text-gray-800">
              Color by
            </label>
            <div className="flex flex-col gap-2">
              <select
                id={metricLabelId}
                aria-describedby={metricDescId}
                value={metric}
                onChange={(e) => setMetric(e.target.value as ScoreMetric)}
                className="min-h-[44px] w-full min-w-0 rounded-lg border-2 border-neutral-400 bg-neutral-50 px-3 py-2.5 text-base font-semibold text-neutral-900 shadow-sm outline-none transition-colors hover:border-neutral-500 hover:bg-white focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/20 sm:text-sm"
              >
                <option value="turnout">{METRIC_HELP.turnout.label}</option>
                <option value="persuasion">{METRIC_HELP.persuasion.label}</option>
                <option value="party">{METRIC_HELP.party.label}</option>
              </select>
              <div
                className="flex h-10 w-full min-w-0 flex-col justify-center rounded-lg border border-neutral-300 bg-white px-1 py-1 shadow-inner shadow-neutral-200/80"
                title={`Scale: ${METRIC_RAMP_HINT[metric]}`}
              >
                <span className="px-1 text-[10px] font-medium uppercase tracking-wide text-neutral-500">
                  Scale (low → high)
                </span>
                <div
                  className="mt-0.5 h-2.5 rounded-sm ring-1 ring-neutral-200/80"
                  style={{
                    background: `linear-gradient(to right, ${ramp[0]}, ${ramp[1]}, ${ramp[2]})`,
                  }}
                />
              </div>
            </div>
            <p id={metricDescId} className="text-xs leading-snug text-neutral-600">
              {METRIC_HELP[metric].description} Map colors run{" "}
              <span className="font-medium text-neutral-800">{METRIC_RAMP_HINT[metric]}</span>{" "}
              (low to high).
            </p>
          </div>

          <fieldset
            aria-labelledby={filterLegendId}
            className="rounded-lg border border-neutral-200 bg-neutral-50/80 px-3 py-2"
          >
            <legend id={filterLegendId} className="px-1 text-sm font-medium text-gray-800">
              Limit by {METRIC_HELP[metric].label.toLowerCase()} (optional)
            </legend>
            <p className="mb-2 text-xs text-gray-600">
              Filters apply only to{" "}
              <strong className="font-medium text-gray-800">{METRIC_HELP[metric].label}</strong>{" "}
              — the same metric as &quot;Color by&quot;. Leave either bound blank to leave that side
              open.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <label className="flex items-center gap-1.5 text-xs text-gray-600">
                Min %
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  placeholder="—"
                  value={activeScoreFilter.min}
                  onChange={(e) => setActiveScoreFilter("min", e.target.value)}
                  className="w-[4.75rem] rounded-md border-2 border-neutral-300 bg-white px-2 py-1.5 text-sm font-medium text-neutral-900 shadow-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
                />
              </label>
              <label className="flex items-center gap-1.5 text-xs text-gray-600">
                Max %
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  placeholder="—"
                  value={activeScoreFilter.max}
                  onChange={(e) => setActiveScoreFilter("max", e.target.value)}
                  className="w-[4.75rem] rounded-md border-2 border-neutral-300 bg-white px-2 py-1.5 text-sm font-medium text-neutral-900 shadow-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20"
                />
              </label>
            </div>
          </fieldset>

          {layersMeta.length > 0 ? (
            <fieldset className="min-w-0">
              <legend className="text-sm font-medium text-gray-800">
                District overlays
              </legend>
              <div className="mt-2 flex flex-col gap-2">
                {layersMeta.map((layer) => (
                  <label
                    key={layer.id}
                    className="flex cursor-pointer items-center gap-2 text-sm text-gray-800"
                  >
                    <span
                      className="inline-block h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-neutral-300"
                      style={{
                        backgroundColor:
                          slugDotColors.get(layer.slug)?.line ?? "#9ca3af",
                      }}
                      aria-hidden
                    />
                    <input
                      type="checkbox"
                      checked={activeBoundarySlugs.includes(layer.slug)}
                      onChange={() => toggleBoundarySlug(layer.slug)}
                      className="rounded border-neutral-300"
                    />
                    <span>{layer.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}

          <div className="text-sm text-gray-600">
            {householdsRaw && !error ? (
              <>
                {householdFilterOutcome.filterError ? (
                  <span className="text-amber-800" role="status">
                    {householdFilterOutcome.filterError}
                  </span>
                ) : (
                  <span>
                    Showing{" "}
                    <strong className="font-medium text-gray-800">
                      {householdFilterOutcome.filtered?.features.length ?? 0}
                    </strong>{" "}
                    of {householdFilterOutcome.rawTotal} households in the current map area
                  </span>
                )}
              </>
            ) : (
              status
            )}
            {error ? (
              <span className="mt-1 block text-red-600" role="alert">
                {error}
              </span>
            ) : null}
          </div>
        </>
      }
    >
      <div ref={containerRef} className="h-full w-full overflow-hidden bg-neutral-100" />
    </MapApplicationShell>
  );
}
