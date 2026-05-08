export type ArcGisFeature = {
  attributes?: Record<string, unknown>;
  geometry?: {
    rings?: number[][][];
    paths?: number[][][];
    x?: number;
    y?: number;
  };
};

export type ArcGisQueryResponse = {
  features?: ArcGisFeature[];
};

export function looksLikeGeoJson(payload: unknown): payload is {
  type: string;
  features: unknown[];
} {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "type" in payload &&
    "features" in payload
  );
}

export function arcGisToGeoJson(payload: ArcGisQueryResponse) {
  const features = (payload.features ?? [])
    .map((feature, index) => {
      const attrs = feature.attributes ?? {};
      const geom = feature.geometry;
      if (!geom) return null;

      if (geom.rings && geom.rings.length > 0) {
        return {
          type: "Feature",
          id: (attrs.OBJECTID as string | number | undefined) ?? index,
          properties: attrs,
          geometry: {
            type: "Polygon",
            coordinates: geom.rings,
          },
        };
      }

      if (geom.paths && geom.paths.length > 0) {
        return {
          type: "Feature",
          id: (attrs.OBJECTID as string | number | undefined) ?? index,
          properties: attrs,
          geometry: {
            type: "MultiLineString",
            coordinates: geom.paths,
          },
        };
      }

      if (typeof geom.x === "number" && typeof geom.y === "number") {
        return {
          type: "Feature",
          id: (attrs.OBJECTID as string | number | undefined) ?? index,
          properties: attrs,
          geometry: {
            type: "Point",
            coordinates: [geom.x, geom.y],
          },
        };
      }

      return null;
    })
    .filter((feature): feature is NonNullable<typeof feature> => feature !== null);

  return {
    type: "FeatureCollection",
    features,
  };
}
