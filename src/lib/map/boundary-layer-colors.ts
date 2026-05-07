/**
 * Deterministic fill + line colors for boundary overlays (multi-layer on first paint).
 */
export type BoundaryLayerColors = {
  fill: string;
  line: string;
};

const PAIRS: BoundaryLayerColors[] = [
  { fill: "rgba(99, 102, 241, 0.16)", line: "#4338ca" }, // indigo
  { fill: "rgba(234, 88, 12, 0.14)", line: "#c2410c" }, // orange
  { fill: "rgba(5, 150, 105, 0.14)", line: "#047857" }, // emerald
  { fill: "rgba(180, 83, 9, 0.14)", line: "#b45309" }, // amber
  { fill: "rgba(147, 51, 234, 0.12)", line: "#7e22ce" }, // purple
  { fill: "rgba(220, 38, 38, 0.12)", line: "#b91c1c" }, // red
  { fill: "rgba(2, 132, 199, 0.14)", line: "#0369a1" }, // sky
  { fill: "rgba(180, 83, 9, 0.12)", line: "#a16207" }, // yellow-brown
  { fill: "rgba(79, 70, 229, 0.12)", line: "#4f46e5" }, // violet
  { fill: "rgba(190, 24, 93, 0.12)", line: "#be185d" }, // pink
  { fill: "rgba(217, 119, 6, 0.13)", line: "#d97706" }, // amber-600
  { fill: "rgba(59, 130, 246, 0.14)", line: "#2563eb" }, // blue
];

/**
 * Stable slug → colors using sorted order so hues stay consistent as toggles change.
 */
export function boundaryColorsBySlug(allLayerSlugs: string[]): Map<string, BoundaryLayerColors> {
  const sorted = [...new Set(allLayerSlugs)].sort((a, b) =>
    a.localeCompare(b, "en"),
  );
  const map = new Map<string, BoundaryLayerColors>();
  sorted.forEach((slug, i) => {
    map.set(slug, PAIRS[i % PAIRS.length]!);
  });
  return map;
}

/** Mapbox GL paint expressions for fill-color and line-color. */
export function boundaryPaintExpressions(layerSlugs: string[]): {
  fillColor: unknown;
  lineColor: unknown;
} {
  const bySlug = boundaryColorsBySlug(layerSlugs);
  const sorted = [...bySlug.keys()].sort((a, b) => a.localeCompare(b, "en"));

  const fillExpr: unknown[] = ["match", ["get", "layerSlug"]];
  const lineExpr: unknown[] = ["match", ["get", "layerSlug"]];

  for (const slug of sorted) {
    const c = bySlug.get(slug)!;
    fillExpr.push(slug, c.fill);
    lineExpr.push(slug, c.line);
  }

  fillExpr.push("rgba(128, 128, 128, 0.08)");
  lineExpr.push("#6b7280");

  return { fillColor: fillExpr, lineColor: lineExpr };
}
