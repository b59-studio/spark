export type SourceFormat = "GeoJSON API" | "Shapefile" | "WMS";

export interface LayerSourceReference {
  layerId: string;
  layerLabel: string;
  publisher: string;
  geography: string;
  sourceFormat: SourceFormat;
  recency: string;
  endpoint: string;
  notes?: string;
  gap?: string;
}

// POC defaults: prefer direct GeoJSON query endpoints for fast map interactivity.
// For production scale, mirror into your own vector-tile or cached GeoJSON pipeline.
export const LAYER_SOURCE_REFERENCES: LayerSourceReference[] = [
  {
    layerId: "voting-precincts",
    layerLabel: "Voting Precincts",
    publisher: "City of Austin GIS / Travis County elections mapping",
    geography: "Travis County (gap for statewide precincts)",
    sourceFormat: "GeoJSON API",
    recency: "Service-driven; verify election-cycle updates",
    endpoint:
      "https://maps.austintexas.gov/arcgis/rest/services/Shared/VoterPrecincts/MapServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=geojson",
    notes: "Good local POC layer; not statewide.",
  },
  {
    layerId: "atx-council",
    layerLabel: "Austin City Council",
    publisher: "City of Austin Open Data",
    geography: "City of Austin council districts (granular polygons)",
    sourceFormat: "GeoJSON API",
    recency: "Current district dataset — verify after redistricting",
    endpoint:
      "https://data.austintexas.gov/resource/w3v2-cj58.geojson?$limit=50000 (via /api/map/external-layer?layer=austin-city-council)",
    notes: "Council member roster: src/data/atx-council-members.ts; mayor: src/data/atx-mayor.ts.",
  },
  {
    layerId: "travis-city-government",
    layerLabel: "Other cities & municipalities",
    publisher: "Travis County GIS + optional ward manifests",
    geography: "Non-Austin municipal limits + regional council wards when published",
    sourceFormat: "GeoJSON API",
    recency: "Checked-in build — no Austin polygons",
    endpoint: "/data/travis-city-government.geojson (scripts/build-travis-city-government.ts)",
    notes:
      "Mayor/council for whole-city boundaries: Open States + seed + travis-municipal-rosters-overrides.ts.",
  },
  {
    layerId: "travis-school-districts",
    layerLabel: "School districts & trustees",
    publisher: "Texas Education Agency + per-ISD trustee maps",
    geography: "TEA districts intersecting Travis-area envelope + trustee polygons",
    sourceFormat: "GeoJSON API",
    recency: "Built file; extend scripts/data/travis-isd-trustee-sources.ts for more trustee maps",
    endpoint: "/data/travis-school-districts.geojson (scripts/build-travis-school-districts-layer.ts)",
    notes: "Outer boundaries show trustee roll call when roster rows exist; interior polygons show single-member trustees.",
  },
  {
    layerId: "travis-census-vtd-and-tracts",
    layerLabel: "Census tracts & voting tabulation districts",
    publisher: "U.S. Census TIGERweb",
    geography: "Travis County (combined VTD + tract queries)",
    sourceFormat: "GeoJSON API",
    recency: "Same vintages as Legislative / Tracts_Blocks services used in build script",
    endpoint: "/data/travis-census-vtd-and-tracts.geojson (scripts/build-travis-census-vtd-tract.ts)",
    gap: "Census statistical geographies—not election-admin precincts.",
  },
  {
    layerId: "tx-state-senate",
    layerLabel: "TX State Senate",
    publisher: "U.S. Census TIGERweb (authoritative geometry mirror for current districts)",
    geography: "Texas statewide",
    sourceFormat: "GeoJSON API",
    recency: "2024 district layer in ACS 2025 service (Jan 1, 2025 vintage)",
    endpoint:
      "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Legislative/MapServer/5/query?where=STATE%3D%2748%27&outFields=*&outSR=4326&f=geojson",
    notes:
      "TLC shapefiles remain canonical for Texas legislative plans; this endpoint is best for direct app loading.",
  },
  {
    layerId: "tx-state-house",
    layerLabel: "TX State House",
    publisher: "U.S. Census TIGERweb (authoritative geometry mirror for current districts)",
    geography: "Texas statewide",
    sourceFormat: "GeoJSON API",
    recency: "2024 district layer in ACS 2025 service (Jan 1, 2025 vintage)",
    endpoint:
      "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Legislative/MapServer/6/query?where=STATE%3D%2748%27&outFields=*&outSR=4326&f=geojson",
    notes:
      "TLC shapefiles remain canonical for Texas legislative plans; this endpoint is best for direct app loading.",
  },
  {
    layerId: "congressional",
    layerLabel: "Congressional Districts",
    publisher: "U.S. Census TIGERweb",
    geography: "Texas statewide",
    sourceFormat: "GeoJSON API",
    recency: "119th Congressional Districts (Jan 1, 2025 vintage)",
    endpoint:
      "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Legislative/MapServer/0/query?where=STATE%3D%2748%27&outFields=*&outSR=4326&f=geojson",
  },
  {
    layerId: "mud-districts",
    layerLabel: "MUD Districts",
    publisher: "Texas Commission on Environmental Quality",
    geography: "Texas statewide",
    sourceFormat: "GeoJSON API",
    recency: "Service-driven; verify quarterly/annual district updates",
    endpoint:
      "https://gisweb.tceq.texas.gov/arcgis/rest/services/Public/WaterDistricts/MapServer/0/query?where=TYPE%3D%27MUD%27&outFields=*&outSR=4326&f=geojson",
  },
  {
    layerId: "fema-flood",
    layerLabel: "FEMA Flood Zones",
    publisher: "FEMA National Flood Hazard Layer",
    geography: "National coverage (filter client-side or by bbox)",
    sourceFormat: "GeoJSON API",
    recency: "NFHL live service; recency varies by county map revisions",
    endpoint:
      "https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/27/query?where=1%3D1&outFields=*&outSR=4326&f=geojson",
    notes:
      "WMS endpoint is also available and can be better for rendering-only flood overlays at large scales.",
    gap:
      "Endpoint can be flaky from some clients due to TLS/network edge cases; a server-side cache/proxy is recommended for mobile reliability.",
  },
  {
    layerId: "capmetro-service-area",
    layerLabel: "Capital Metro",
    publisher: "City of Austin GIS / Capital Metro ecosystem",
    geography: "Austin metro area",
    sourceFormat: "Shapefile",
    recency: "January 2026 release noted in open data catalog",
    endpoint: "https://data.austintexas.gov/d/bnxp-9nme",
    gap:
      "Not yet wired in `DISTRICT_LAYERS` because current map renderer expects polygon GeoJSON endpoints; this dataset is distributed as shapefile bundle.",
  },
];
