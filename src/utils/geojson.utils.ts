import type mapboxgl from "mapbox-gl";
import type { DistrictFeatureProperties } from "@/types/district.types";

export function toDisplayProperties(
  properties: DistrictFeatureProperties | undefined,
  includeKeys: string[],
  aliases: Record<string, string[]> = {},
): Record<string, string> {
  if (!properties) return {};
  const rows = includeKeys
    .map((label) => {
      const candidateKeys = [label, ...(aliases[label] ?? [])];
      const matchedKey = candidateKeys.find((key) => {
        const value = properties[key];
        return value !== null && value !== undefined && value !== "";
      });
      if (!matchedKey) return null;
      const value = properties[matchedKey];
      if (value === null || value === undefined || value === "") return null;
      return [label, String(value)] as const;
    })
    .filter((entry): entry is readonly [string, string] => entry !== null);
  return Object.fromEntries(rows);
}

export function firstFeature(
  features: mapboxgl.MapboxGeoJSONFeature[] | undefined,
): mapboxgl.MapboxGeoJSONFeature | null {
  if (!features || features.length === 0) return null;
  return features[0];
}
