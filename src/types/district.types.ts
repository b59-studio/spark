export type LayerCategory =
  | "federal-state"
  | "city-county"
  | "voting"
  | "education"
  | "services"
  | "planning";

export interface DistrictLayer {
  id: string;
  label: string;
  category: LayerCategory;
  sourceUrl: string;
  sourceLayer?: string;
  color: string;
  labelProperty: string;
  labelPropertyFallbacks?: string[];
  popupProperties: string[];
  popupPropertyAliases?: Record<string, string[]>;
  defaultVisible: boolean;
  minZoom?: number;
  maxZoom?: number;
}

export type DistrictFeatureProperties = Record<string, string | number | boolean | null>;

export interface DistrictLookupResult {
  layerId: string;
  layerLabel: string;
  featureLabel: string;
  properties: Record<string, string>;
}
