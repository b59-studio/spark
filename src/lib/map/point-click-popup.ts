/**
 * Reusable click-to-inspect popup wiring for any Mapbox layer that renders
 * point/circle/symbol features. Use this from any map component so we don't
 * re-implement the same listeners and HTML formatting per map.
 *
 * Example:
 *   const detach = attachPointClickPopup(map, {
 *     layerIds: ["households-circles"],
 *     heading: "Point details",
 *     percentKeys: ["turnout", "persuasion", "party"],
 *     propertyLabels: { id: "Household ID", party: "Party confidence" },
 *   });
 *   // later, in cleanup: detach();
 */

import mapboxgl from "mapbox-gl";

export type PointPopupValueFormatter = (
  key: string,
  value: unknown,
) => string | undefined;

export interface PointPopupOptions {
  /** Layer IDs whose features trigger the popup; must render point geometries. */
  layerIds: readonly string[];
  /** Optional small-caps title shown above the property rows. */
  heading?: string;
  /** Property keys whose numeric values format as percentages (0–1 → 0–100%). */
  percentKeys?: readonly string[];
  /** Override the human-readable label for specific property keys. */
  propertyLabels?: Record<string, string>;
  /** Property keys to render first, in this order. Remaining keys append. */
  preferredOrder?: readonly string[];
  /** Property keys to omit from the popup (e.g. internal join columns). */
  excludeKeys?: readonly string[];
  /** Per-field override formatter; return `undefined` to fall through to defaults. */
  formatValue?: PointPopupValueFormatter;
  /** Mapbox popup options forwarded to the `Popup` constructor. */
  popupOptions?: Omit<mapboxgl.PopupOptions, "closeOnClick">;
}

const DEFAULT_POPUP_OPTIONS: mapboxgl.PopupOptions = {
  closeButton: true,
  closeOnClick: true,
  maxWidth: "300px",
  offset: 10,
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function coerceFiniteNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function formatPercent(value: unknown): string {
  const n = coerceFiniteNumber(value);
  return n === null ? "—" : `${Math.round(n * 100)}%`;
}

function humanizeKey(key: string, overrides?: Record<string, string>): string {
  if (overrides?.[key]) return overrides[key];
  return key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function defaultFormat(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  return escapeHtml(String(value));
}

function orderEntries(
  entries: Array<[string, unknown]>,
  preferredOrder?: readonly string[],
): Array<[string, unknown]> {
  if (!preferredOrder || preferredOrder.length === 0) return entries;
  const lookup = new Map(entries);
  const ordered: Array<[string, unknown]> = [];
  const used = new Set<string>();
  for (const key of preferredOrder) {
    if (lookup.has(key)) {
      ordered.push([key, lookup.get(key)]);
      used.add(key);
    }
  }
  for (const entry of entries) {
    if (!used.has(entry[0])) ordered.push(entry);
  }
  return ordered;
}

export function buildPointPopupHTML(
  properties: Record<string, unknown> | null | undefined,
  options: PointPopupOptions,
): string {
  const percentKeys = new Set(options.percentKeys ?? []);
  const excludeKeys = new Set(options.excludeKeys ?? []);

  const baseEntries =
    properties && typeof properties === "object"
      ? Object.entries(properties).filter(
          ([key, value]) => value !== undefined && !excludeKeys.has(key),
        )
      : [];

  const entries = orderEntries(baseEntries, options.preferredOrder);

  const heading = options.heading
    ? `<div style="font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.04em;color:#6b7280;margin-bottom:6px;">${escapeHtml(options.heading)}</div>`
    : "";

  if (entries.length === 0) {
    return `<div style="min-width:200px;max-width:280px;">
      ${heading}
      <div style="font-size:12px;color:#6b7280;">No data available for this point.</div>
    </div>`;
  }

  const rows = entries
    .map(([key, value]) => {
      const overridden = options.formatValue?.(key, value);
      const display =
        overridden !== undefined
          ? overridden
          : percentKeys.has(key)
            ? formatPercent(value)
            : defaultFormat(value);
      const label = humanizeKey(key, options.propertyLabels);
      return `<div style="display:flex;justify-content:space-between;gap:12px;font-size:12px;line-height:1.5;">
        <span style="color:#6b7280;">${escapeHtml(label)}</span>
        <span style="font-weight:600;color:#111827;text-align:right;word-break:break-all;">${display}</span>
      </div>`;
    })
    .join("");

  return `<div style="min-width:200px;max-width:280px;">
    ${heading}
    ${rows}
  </div>`;
}

/**
 * Wires `click` and cursor `mouseenter`/`mouseleave` for every layer in
 * `options.layerIds` so any rendered point feature reveals its loaded
 * properties in a popup. Returns a detach function to call from cleanup.
 *
 * Safe to call before the layers exist — Mapbox queues per-layer listeners
 * by ID, but you should still register after `map.on("load")` to ensure
 * the layers are present when users interact.
 */
export function attachPointClickPopup(
  map: mapboxgl.Map,
  options: PointPopupOptions,
): () => void {
  const popup = new mapboxgl.Popup({
    ...DEFAULT_POPUP_OPTIONS,
    ...options.popupOptions,
  });

  const onClick = (event: mapboxgl.MapLayerMouseEvent) => {
    const feature = event.features?.[0];
    if (!feature || !feature.geometry) return;
    if (feature.geometry.type !== "Point") return;
    const [lng, lat] = feature.geometry.coordinates as [number, number];
    const adjustedLng =
      Math.abs(event.lngLat.lng - lng) > 180
        ? lng + (event.lngLat.lng > lng ? 360 : -360)
        : lng;
    popup
      .setLngLat([adjustedLng, lat])
      .setHTML(
        buildPointPopupHTML(
          feature.properties as Record<string, unknown> | null,
          options,
        ),
      )
      .addTo(map);
  };

  const onMouseEnter = () => {
    map.getCanvas().style.cursor = "pointer";
  };
  const onMouseLeave = () => {
    map.getCanvas().style.cursor = "";
  };

  for (const layerId of options.layerIds) {
    map.on("click", layerId, onClick);
    map.on("mouseenter", layerId, onMouseEnter);
    map.on("mouseleave", layerId, onMouseLeave);
  }

  return () => {
    for (const layerId of options.layerIds) {
      map.off("click", layerId, onClick);
      map.off("mouseenter", layerId, onMouseEnter);
      map.off("mouseleave", layerId, onMouseLeave);
    }
    popup.remove();
  };
}
