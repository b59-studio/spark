import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const TRUSTEE_KML_URL =
  "https://www.austinisd.org/modules/custom/schools/maps/Trustees_20241217.kml";
const OUTPUT_PATH = resolve(process.cwd(), "public/data/aisd-trustee.geojson");

type Position = [number, number];
type Ring = Position[];
type Polygon = Ring[];
type MultiPolygon = Polygon[];

type GeoJsonFeature = {
  type: "Feature";
  properties: Record<string, string | number | null>;
  geometry: {
    type: "MultiPolygon";
    coordinates: MultiPolygon;
  };
};

type GeoJsonFeatureCollection = {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
};

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function parseCoordinateText(text: string): Position[] {
  return text
    .trim()
    .split(/\s+/)
    .map((triplet) => {
      const [lngRaw, latRaw] = triplet.split(",");
      return [Number(lngRaw), Number(latRaw)] as Position;
    })
    .filter(([lng, lat]) => Number.isFinite(lng) && Number.isFinite(lat));
}

function ensureClosedRing(ring: Position[]): Position[] {
  if (ring.length < 4) return ring;
  const [firstLng, firstLat] = ring[0];
  const [lastLng, lastLat] = ring[ring.length - 1];
  if (firstLng === lastLng && firstLat === lastLat) {
    return ring;
  }
  return [...ring, ring[0]];
}

function collectPolygonsFromPlacemark(placemarkXml: string): MultiPolygon {
  const polygons: MultiPolygon = [];
  const polygonBlocks = [...placemarkXml.matchAll(/<Polygon\b[\s\S]*?<\/Polygon>/g)].map(
    (m) => m[0],
  );

  for (const polygonXml of polygonBlocks) {
    const outerMatch = polygonXml.match(
      /<outerBoundaryIs>[\s\S]*?<coordinates>([\s\S]*?)<\/coordinates>[\s\S]*?<\/outerBoundaryIs>/,
    );
    if (!outerMatch) continue;
    const outerRing = ensureClosedRing(parseCoordinateText(outerMatch[1]));
    if (outerRing.length < 4) continue;

    const innerRings = [...polygonXml.matchAll(/<innerBoundaryIs>[\s\S]*?<coordinates>([\s\S]*?)<\/coordinates>[\s\S]*?<\/innerBoundaryIs>/g)]
      .map((m) => ensureClosedRing(parseCoordinateText(m[1])))
      .filter((ring) => ring.length >= 4);

    polygons.push([outerRing, ...innerRings]);
  }

  return polygons;
}

function parseDistrictFromName(name: string): string {
  const match = name.match(/(\d+)/);
  return match ? match[1] : name.trim();
}

function buildGeoJsonFromKml(kmlText: string): GeoJsonFeatureCollection {
  const placemarks = [...kmlText.matchAll(/<Placemark\b[\s\S]*?<\/Placemark>/g)].map((m) => m[0]);
  const features: GeoJsonFeature[] = [];

  for (const placemark of placemarks) {
    const nameMatch = placemark.match(/<name>([\s\S]*?)<\/name>/);
    const rawName = decodeEntities((nameMatch?.[1] ?? "").trim());
    if (!rawName) continue;

    const polygons = collectPolygonsFromPlacemark(placemark);
    if (polygons.length === 0) continue;

    const district = parseDistrictFromName(rawName);
    features.push({
      type: "Feature",
      properties: {
        DISTRICT: district,
        TRUSTEE: rawName,
      },
      geometry: {
        type: "MultiPolygon",
        coordinates: polygons,
      },
    });
  }

  return { type: "FeatureCollection", features };
}

async function main() {
  console.log("Downloading AISD trustee KML...");
  const response = await fetch(TRUSTEE_KML_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to download KML (${response.status}).`);
  }

  const kmlText = await response.text();
  const geojson = buildGeoJsonFromKml(kmlText);
  if (geojson.features.length === 0) {
    throw new Error("No trustee polygons found in source KML.");
  }

  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, JSON.stringify(geojson, null, 2), "utf8");
  console.log(`Wrote ${geojson.features.length} trustee features -> ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
