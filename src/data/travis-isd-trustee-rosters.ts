/**
 * Trustee names by ISD slug and single-member district number.
 * Geometry sources: `scripts/data/travis-isd-trustee-sources.ts` → merged GeoJSON build.
 *
 * Extend `OTHER_ISD_TRUSTEE_BY_DISTRICT` as you add ISD boundary sources (Lake Travis, Del Valle, …).
 */

import { AISD_TRUSTEE_NAME_BY_DISTRICT } from "@/data/aisd-trustees";

/** Districts not drawn on the boundary layer (e.g. AISD at-large seats) stay unset here. */
export const OTHER_ISD_TRUSTEE_BY_DISTRICT: Record<string, Record<number, string>> = {
  // Example once polygons exist:
  // lake_travis_isd: { 1: "…", 2: "…" },
};

export function trusteeNameForIsdDistrict(isdSlug: string, district: number): string | undefined {
  if (isdSlug === "austin_isd") {
    return AISD_TRUSTEE_NAME_BY_DISTRICT[district];
  }
  return OTHER_ISD_TRUSTEE_BY_DISTRICT[isdSlug]?.[district];
}

/** Multi-line summary for whole-district (outer boundary) popups when roster rows exist. */
export function trusteeRollcallForIsdSlug(isdSlug: string): string | undefined {
  if (isdSlug === "austin_isd") {
    const entries = Object.entries(AISD_TRUSTEE_NAME_BY_DISTRICT).sort(
      (a, b) => Number(a[0]) - Number(b[0]),
    );
    return entries.length ? entries.map(([d, n]) => `District ${d}: ${n}`).join("\n") : undefined;
  }
  const other = OTHER_ISD_TRUSTEE_BY_DISTRICT[isdSlug];
  if (!other || Object.keys(other).length === 0) return undefined;
  return Object.entries(other)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([d, n]) => `District ${d}: ${n}`)
    .join("\n");
}
