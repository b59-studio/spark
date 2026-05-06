import { NextResponse } from "next/server";
import { fetchMapboxJson } from "@/lib/mapbox-server";

function parseCoord(value: string | null, name: string) {
  if (value === null || value === "") return { error: `Missing ${name}` as const };
  const n = Number(value);
  if (!Number.isFinite(n)) return { error: `Invalid ${name}` as const };
  return { value: n };
}

/** Reverse geocoding: GET ?lng=...&lat=... */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lng = parseCoord(searchParams.get("lng"), "lng");
  const lat = parseCoord(searchParams.get("lat"), "lat");
  if ("error" in lng) {
    return NextResponse.json({ error: lng.error }, { status: 400 });
  }
  if ("error" in lat) {
    return NextResponse.json({ error: lat.error }, { status: 400 });
  }

  if (lng.value < -180 || lng.value > 180 || lat.value < -85.0511 || lat.value > 85.0511) {
    return NextResponse.json(
      { error: "lng must be [-180,180] and lat roughly [-85.0511,85.0511]." },
      { status: 400 }
    );
  }

  const path = `/geocoding/v5/mapbox.places/${lng.value},${lat.value}.json`;
  const passthrough = [
    "country",
    "language",
    "limit",
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
