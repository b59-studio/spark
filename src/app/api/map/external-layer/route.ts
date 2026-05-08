import { NextResponse } from "next/server";
import {
  EXTERNAL_LAYER_URLS,
  type ExternalLayerKey,
} from "@/data/map-external-layer-urls";
import { fetchExternalLayerGeoJson } from "@/lib/map/external-layer-fetch";

/** GeoJSON from upstream GIS services — cache ~24h so users do not hit Census/ArcGIS on every layer toggle. */
export const revalidate = 86400;

const EMPTY_FEATURE_COLLECTION = {
  type: "FeatureCollection",
  features: [],
} as const;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const layer = url.searchParams.get("layer") as ExternalLayerKey | null;

  if (!layer || !(layer in EXTERNAL_LAYER_URLS)) {
    return NextResponse.json(
      { error: "Unknown external layer key." },
      { status: 400 },
    );
  }

  try {
    const data = await fetchExternalLayerGeoJson(layer, {
      fetchInit: { next: { revalidate } },
    });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(EMPTY_FEATURE_COLLECTION);
  }
}
