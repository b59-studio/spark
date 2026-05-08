/**
 * Each ISD with single-member trustee polygons adds one entry. The build script merges
 * them into `public/data/travis-isd-trustee-districts.geojson`.
 *
 * Add sources as you obtain official KML / GeoJSON / ArcGIS GeoJSON URLs from each district.
 * Rosters live in `src/data/travis-isd-trustee-rosters.ts` (names keyed by ISD slug + district).
 */

export type TravisIsdTrusteeKmlSource = {
  kind: "kml_url";
  isdSlug: string;
  isdDisplayName: string;
  url: string;
};

export type TravisIsdTrusteeGeoJsonUrlSource = {
  kind: "geojson_url";
  isdSlug: string;
  isdDisplayName: string;
  url: string;
  /** Property on each feature holding district number (string or number). */
  districtProperty: string;
};

export type TravisIsdTrusteeArcgisGeoJsonSource = {
  kind: "arcgis_geojson_query";
  isdSlug: string;
  isdDisplayName: string;
  /** Full ArcGIS query URL with `f=geojson` and `outSR=4326`. */
  queryUrl: string;
  districtProperty: string;
};

export type TravisIsdTrusteeSource =
  | TravisIsdTrusteeKmlSource
  | TravisIsdTrusteeGeoJsonUrlSource
  | TravisIsdTrusteeArcgisGeoJsonSource;

/** Travis-area ISDs with single-member trustee maps — extend as boundaries are sourced. */
export const TRAVIS_ISD_TRUSTEE_SOURCES: TravisIsdTrusteeSource[] = [
  {
    kind: "kml_url",
    isdSlug: "austin_isd",
    isdDisplayName: "Austin ISD",
    url: "https://www.austinisd.org/modules/custom/schools/maps/Trustees_20241217.kml",
  },
];
