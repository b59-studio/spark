/**
 * GeoJSON types used by map API responses (subset; sufficient for Mapbox sources).
 */
export type GeoJSONPosition = [number, number];

export type GeoJSONPoint = {
  type: "Point";
  coordinates: GeoJSONPosition;
};

export type GeoJSONPolygon = {
  type: "Polygon";
  coordinates: GeoJSONPosition[][];
};

export type GeoJSONMultiPolygon = {
  type: "MultiPolygon";
  coordinates: GeoJSONPosition[][][];
};

export type GeoJSONFeature<
  G extends GeoJSONPoint | GeoJSONPolygon | GeoJSONMultiPolygon =
    | GeoJSONPoint
    | GeoJSONPolygon
    | GeoJSONMultiPolygon,
  P extends Record<string, unknown> = Record<string, unknown>,
> = {
  type: "Feature";
  id?: string;
  geometry: G;
  properties: P;
};

export type GeoJSONFeatureCollection<
  G extends GeoJSONPoint | GeoJSONPolygon | GeoJSONMultiPolygon =
    | GeoJSONPoint
    | GeoJSONPolygon
    | GeoJSONMultiPolygon,
  P extends Record<string, unknown> = Record<string, unknown>,
> = {
  type: "FeatureCollection";
  features: GeoJSONFeature<G, P>[];
};
