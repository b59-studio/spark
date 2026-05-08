/**
 * City council member names keyed by `CITY_SLUG` (see `travisMunicipalSlug.ts`) and council district number.
 * Populate when `scripts/data/travis-municipal-council-sources.ts` includes ward GIS for a city.
 *
 * Cities that elect council **at large** only use `TRAVIS_MUNICIPAL_ROSTER_BY_SLUG` on the whole-city layer instead.
 */

export const MUNICIPAL_COUNCIL_MEMBER_BY_CITY_AND_DISTRICT: Record<string, Record<number, string>> = {
  // Example: pflugerville: { 1: "…", 2: "…" },
};
