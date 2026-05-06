import { NextResponse } from "next/server";
import { fetchMapboxJson } from "@/lib/mapbox-server";

const PROFILES = new Set([
  "driving",
  "driving-traffic",
  "walking",
  "cycling",
]);

/**
 * Directions: GET ?coordinates=lng1,lat1;lng2,lat2[;lng3,lat3...]
 * Optional ?profile=driving (default) | driving-traffic | walking | cycling
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const coordinates = searchParams.get("coordinates")?.trim() ?? "";
  if (!coordinates) {
    return NextResponse.json(
      { error: "Missing required query parameter: coordinates (lng,lat pairs separated by ;)." },
      { status: 400 }
    );
  }

  const profile = searchParams.get("profile")?.trim() || "driving";
  if (!PROFILES.has(profile)) {
    return NextResponse.json(
      {
        error: `Invalid profile. Allowed: ${[...PROFILES].join(", ")}.`,
      },
      { status: 400 }
    );
  }

  const pairs = coordinates.split(";");
  if (pairs.length < 2) {
    return NextResponse.json(
      { error: "At least two coordinate pairs are required (origin and destination)." },
      { status: 400 }
    );
  }
  for (const pair of pairs) {
    const parts = pair.split(",");
    if (parts.length !== 2) {
      return NextResponse.json(
        { error: "Each coordinate must be lng,lat with a comma between." },
        { status: 400 }
      );
    }
    const [lngS, latS] = parts.map((p) => p.trim());
    const lng = Number(lngS);
    const lat = Number(latS);
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
      return NextResponse.json({ error: "Invalid coordinate number." }, { status: 400 });
    }
    if (lng < -180 || lng > 180 || lat < -85.0511 || lat > 85.0511) {
      return NextResponse.json({ error: "Coordinate out of range." }, { status: 400 });
    }
  }

  const path = `/directions/v5/mapbox/${profile}/${encodeURIComponent(coordinates)}`;
  const passthrough = [
    "alternatives",
    "annotations",
    "approaches",
    "bearings",
    "continue_straight",
    "exclude",
    "geometries",
    "language",
    "overview",
    "radiuses",
    "roundabouts",
    "steps",
    "waypoints",
    "waypoint_names",
    "waypoint_targets",
    "voice_instructions",
    "voice_units",
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
