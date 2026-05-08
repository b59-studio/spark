import type { MapModeConfig, MapModeId } from "@/types/map-mode.types";

/**
 * Concrete mode matrix for map UX.
 * Explore is the current implementation target; Decision/Detail are scaffolded.
 */
export const MAP_MODE_MATRIX: Record<MapModeId, MapModeConfig> = {
  explore: {
    id: "explore",
    label: "Explore map",
    goal: "Quickly understand district context and inspect what area a point belongs to.",
    primaryActions: ["Toggle layers", "Show/hide categories", "Click feature for quick details"],
    ui: {
      showSearch: false,
      allowSoloLayer: true,
      showLegend: true,
      defaultPanelCollapsed: false,
    },
    allowedCategories: [
      "federal-state",
      "city-county",
      "voting",
      "education",
      "services",
      "planning",
    ],
  },
  decision: {
    id: "decision",
    label: "Decision map",
    goal: "Compare a focused set of overlays with less visual noise during planning decisions.",
    primaryActions: ["Compare 1-2 overlays", "Validate district boundaries", "Review priority areas"],
    ui: {
      showSearch: false,
      allowSoloLayer: true,
      showLegend: true,
      defaultPanelCollapsed: false,
    },
    allowedCategories: ["federal-state", "city-county", "voting"],
  },
  detail: {
    id: "detail",
    label: "Detail map",
    goal: "Drill into granular records tied to a narrow geography and specific workflow.",
    primaryActions: ["Inspect granular metadata", "Filter to narrow segment", "Validate source data"],
    ui: {
      showSearch: true,
      allowSoloLayer: false,
      showLegend: false,
      defaultPanelCollapsed: false,
    },
    allowedCategories: ["voting", "services", "planning"],
  },
};

export function getMapModeConfig(mode: MapModeId): MapModeConfig {
  return MAP_MODE_MATRIX[mode];
}
