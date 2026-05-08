# Map Mode Matrix

This project uses one shared map foundation (layers, lookup, popup, legend, hooks) with multiple task-focused modes.

## Shared Foundation

- `src/data/layers.config.ts`
- `src/hooks/useMapLayers.ts`
- `src/hooks/useDistrictLookup.ts`
- `src/components/map/LayerPanel.tsx`
- `src/components/map/LayerToggle.tsx`
- `src/components/map/Legend.tsx`
- `src/components/map/InfoPopup.tsx`

## Mode Matrix

### Explore

- **Goal:** Quickly understand district context and inspect what district a point belongs to.
- **Primary actions:** Toggle overlays, scan categories, click for summary details.
- **UI profile:** Search on, solo-layer on, legend on, panel expanded.
- **Current status:** Implemented via `ACTIVE_MODE = getMapModeConfig("explore")` in `src/components/map/DistrcitMap.tsx`.

### Decision

- **Goal:** Compare fewer, high-signal overlays while making planning decisions.
- **Primary actions:** Compare 1-2 overlays, validate coverage, reduce noise.
- **UI profile:** Search off by default, solo-layer on, legend on.
- **Next step:** Wire this mode to a dedicated route or mode switcher using `getMapModeConfig("decision")`.

### Detail

- **Goal:** Deep drill-down into granular records and workflow-specific data.
- **Primary actions:** Inspect detailed metadata, apply narrow filters, validate source-level records.
- **UI profile:** Search on, solo-layer off, legend optional/off.
- **Next step:** Add detail-only panels and data cards while reusing shared map primitives.

## Implementation Notes

- Mode configuration lives in `src/data/map-modes.config.ts`.
- Mode type contracts live in `src/types/map-mode.types.ts`.
- `LayerPanel` now accepts mode-driven props (`title`, `subtitle`, `showSearch`, `allowSoloLayer`, `defaultCollapsed`).
- `Legend` accepts a mode-specific title.
