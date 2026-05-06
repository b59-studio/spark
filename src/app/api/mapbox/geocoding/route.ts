import { NextResponse } from "next/server";
import { fetchMapboxJson } from "@/lib/mapbox-server";

const MAX_QUERY_LEN = 512;

/** Forward geocoding: GET ?q=... (optional Mapbox query params passthrough). */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  if (!q) {
    return NextResponse.json(
      { error: "Missing required query parameter: q" },
      { status: 400 }
    );
  }
  if (q.length > MAX_QUERY_LEN) {
    return NextResponse.json(
      { error: `Query too long (max ${MAX_QUERY_LEN} characters).` },
      { status: 400 }
    );
  }

  const path = `/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json`;
  const passthrough = [
    "autocomplete",
    "bbox",
    "country",
    "fuzzyMatch",
    "language",
    "limit",
    "proximity",
    "routing",
    "types",
    "worldview",
  ] as const;

  const params: Record<string, string | undefined> = {};
  for (const key of passthrough) {
    const v = searchParams.get(key);
    if (v !== null) params[key] = v;
  }

  const result = await fetchMapboxJson({ path, params });
  if (!result.ok) {
    return NextResponse.json(result.body, { status: result.status });
  }

  return NextResponse.json(result.data);
}
