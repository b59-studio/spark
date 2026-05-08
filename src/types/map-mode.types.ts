import type { LayerCategory } from "@/types/district.types";

export type MapModeId = "explore" | "decision" | "detail";

export interface MapModeConfig {
  id: MapModeId;
  label: string;
  goal: string;
  primaryActions: string[];
  ui: {
    showSearch: boolean;
    allowSoloLayer: boolean;
    showLegend: boolean;
    defaultPanelCollapsed: boolean;
  };
  allowedCategories: LayerCategory[];
}
