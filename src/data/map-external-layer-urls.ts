/**
 * Single source of truth for upstream URLs behind `/api/map/external-layer`.
 * Used by the route handler and `scripts/check-map-upstreams.ts`.
 */
export type ExternalLayerKey =
  | "congressional"
  | "tx-state-senate"
  | "tx-state-house"
  | "voting-precincts"
  | "commissioner-precincts"
  | "austin-city-council"
  | "tx-vtd-placeholder"
  | "austin-isd-trustee-placeholder"
  | "school-district-boundaries"
  | "mud-districts"
  | "census-tracts"
  | "fema-flood";

export const EXTERNAL_LAYER_URLS: Record<ExternalLayerKey, string> = {
  congressional:
    "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Legislative/MapServer/0/query?where=STATE%3D%2748%27&outFields=CD119%2CNAME%2CBASENAME%2CGEOID%2CPOP100&outSR=4326&f=geojson",
  "tx-state-senate":
    "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Legislative/MapServer/5/query?where=STATE%3D%2748%27&outFields=SLDU%2CNAME%2CBASENAME%2CGEOID%2CPOP100&outSR=4326&f=geojson",
  "tx-state-house":
    "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Legislative/MapServer/6/query?where=STATE%3D%2748%27&outFields=SLDL%2CNAME%2CBASENAME%2CGEOID%2CPOP100&outSR=4326&f=geojson",
  "voting-precincts":
    "https://maps.austintexas.gov/arcgis/rest/services/Shared/VoterPrecincts/MapServer/0/query?where=1%3D1&outFields=PRECINCT%2CVOTERCOUNT%2CCONGRESSIO%2CSENATE%2CLEGISLATIV&outSR=4326&f=geojson",
  "commissioner-precincts":
    "https://gis.traviscountytx.gov/server1/rest/services/Boundaries_and_Jurisdictions/Travis_County_Commissioner_Precincts/MapServer/0/query?where=1%3D1&outFields=PRECINCT%2CCOMMISSIONER&outSR=4326&f=geojson",
  "austin-city-council":
    "https://data.austintexas.gov/resource/w3v2-cj58.geojson?$limit=50000",
  "tx-vtd-placeholder":
    "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Legislative/MapServer/15/query?where=STATE%3D%2748%27%20AND%20COUNTY%3D%27453%27&outFields=VTD%2CNAME%2CBASENAME%2CGEOID%2CCOUNTY&outSR=4326&f=geojson",
  "austin-isd-trustee-placeholder":
    "https://services7.arcgis.com/ZodPOMBKsdAsTqF4/ArcGIS/rest/services/TEA_School_Districts_2025/FeatureServer/23/query?where=NAME%3D%27AUSTIN%20ISD%27&outFields=NAME%2CDISTRICT%2CNAME2%2CSDLEA%2CNCES_DISTR&outSR=4326&f=json",
  "school-district-boundaries":
    "https://services7.arcgis.com/ZodPOMBKsdAsTqF4/ArcGIS/rest/services/TEA_School_Districts_2025/FeatureServer/23/query?where=1%3D1&outFields=NAME%2CDISTRICT%2CNAME2%2CSDLEA%2CNCES_DISTR&outSR=4326&f=json",
  "mud-districts":
    "https://gisweb.tceq.texas.gov/arcgis/rest/services/Public/WaterDistricts/MapServer/0/query?where=TYPE%3D%27MUD%27&outFields=NAME%2CDISTRICT_ID%2CCOUNTY%2CTYPE%2CSTATUS&outSR=4326&f=geojson",
  "census-tracts":
    "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Tracts_Blocks/MapServer/0/query?where=STATE%3D%2748%27%20AND%20COUNTY%3D%27453%27&outFields=GEOID%2CNAME%2CBASENAME%2CCOUNTY%2CTRACT&outSR=4326&f=geojson",
  "fema-flood":
    "https://maps.austintexas.gov/arcgis/rest/services/Shared/Floodplain/MapServer/1",
};
