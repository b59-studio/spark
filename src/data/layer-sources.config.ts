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
    layerId: "tx-vtd-placeholder",
    layerLabel: "TX Voting Districts (VTD Placeholder)",
    publisher: "U.S. Census TIGERweb",
    geography: "Texas statewide",
    sourceFormat: "GeoJSON API",
    recency: "Census 2020 VTD layer in TIGERweb Legislative service",
    endpoint:
      "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Legislative/MapServer/15/query?where=STATE%3D%2748%27&outFields=*&outSR=4326&f=geojson",
    gap:
      "This is a placeholder for statewide precinct-like geography (VTD), not official election-admin precinct boundaries for each election cycle.",
  },
  {
    layerId: "atx-council",
    layerLabel: "Austin City Council",
    publisher: "City of Austin Open Data",
    geography: "City of Austin",
    sourceFormat: "GeoJSON API",
    recency: "Current city district dataset (verify after each redistricting cycle)",
    endpoint:
      "https://data.austintexas.gov/resource/w3v2-cj58.geojson?$limit=50000",
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
    layerId: "isd-boundaries",
    layerLabel: "School District Boundaries",
    publisher: "Texas Education Agency",
    geography: "Texas statewide",
    sourceFormat: "GeoJSON API",
    recency: "TEA School Districts 2025 service",
    endpoint:
      "https://services7.arcgis.com/ZodPOMBKsdAsTqF4/ArcGIS/rest/services/TEA_School_Districts_2025/FeatureServer/23/query?where=1%3D1&outFields=*&outSR=4326&f=geojson",
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
    layerId: "census-tracts",
    layerLabel: "Census Tracts",
    publisher: "U.S. Census TIGERweb",
    geography: "Texas statewide",
    sourceFormat: "GeoJSON API",
    recency: "Current tracts in TIGERweb Tracts_Blocks service (Jan 1, 2025 vintage)",
    endpoint:
      "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Tracts_Blocks/MapServer/0/query?where=STATE%3D%2748%27&outFields=*&outSR=4326&f=geojson",
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
