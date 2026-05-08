/**
 * City council **ward / single-member district** polygons outside Austin (Austin districts are merged in `travis-city-government.geojson`).
 * Each entry is merged into `public/data/travis-municipal-council-districts.geojson`.
 *
 * Use ArcGIS `f=geojson` queries when available. Rosters: `src/data/travis-municipal-council-by-district.ts`.
 */

export type TravisMunicipalCouncilArcgisSource = {
  kind: "arcgis_geojson_query";
  citySlug: string;
  cityDisplayName: string;
  queryUrl: string;
  districtProperty: string;
};

export type TravisMunicipalCouncilGeoJsonSource = {
  kind: "geojson_url";
  citySlug: string;
  cityDisplayName: string;
  url: string;
  districtProperty: string;
};

export type TravisMunicipalCouncilSource = TravisMunicipalCouncilArcgisSource | TravisMunicipalCouncilGeoJsonSource;

/** Add entries when a city publishes council district GIS aligned with member districts. */
export const TRAVIS_MUNICIPAL_COUNCIL_SOURCES: TravisMunicipalCouncilSource[] = [];
