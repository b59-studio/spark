/**
 * Import a GeoJSON file into MapBoundaryLayer + MapBoundaryFeature (PostGIS MultiPolygon).
 *
 * Prerequisites: PostGIS migration applied; GeoJSON uses coordinates in WGS84 (EPSG:4326).
 *
 * Usage:
 *   npx tsx scripts/import-boundary-layer.ts \
 *     --file=./districts.geojson \
 *     --slug=tx-senate-d35 \
 *     --name="Texas Senate D35" \
 *     [--replace] [--label-key=NAME] [--id-key=GEOID20]
 *
 * --replace : delete existing features for this layer slug before importing (idempotent re-import).
 *
 * GeoJSON: accepts FeatureCollection or a single Feature. Geometry must be Polygon or MultiPolygon.
 * Other geometry types are skipped with a warning.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type GeoJSONPosition = number[];

type GeoJSONPolygon = {
  type: "Polygon";
  coordinates: GeoJSONPosition[][];
};

type GeoJSONMultiPolygon = {
  type: "MultiPolygon";
  coordinates: GeoJSONPosition[][][];
};

type GeoJSONFeature = {
  type: "Feature";
  geometry: GeoJSONPolygon | GeoJSONMultiPolygon | { type: string };
  properties?: Record<string, unknown> | null;
};

type GeoJSONFeatureCollection = {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
};

function parseArgs() {
  const args = process.argv.slice(2);
  let file: string | null = null;
  let slug: string | null = null;
  let name: string | null = null;
  let description: string | null = null;
  let replace = false;
  let labelKey = "NAME";
  let idKey: string | null = "GEOID";

  for (const a of args) {
    if (a.startsWith("--file=")) file = resolve(a.slice("--file=".length));
    else if (a.startsWith("--slug=")) slug = a.slice("--slug=".length).trim();
    else if (a.startsWith("--name=")) name = a.slice("--name=".length).trim();
    else if (a.startsWith("--description="))
      description = a.slice("--description=".length).trim();
    else if (a === "--replace") replace = true;
    else if (a.startsWith("--label-key=")) labelKey = a.slice("--label-key=".length);
    else if (a.startsWith("--id-key=")) {
      const v = a.slice("--id-key=".length);
      idKey = v === "" ? null : v;
    }
  }

  if (!file || !slug || !name) {
    console.error(
      "Usage: npx tsx scripts/import-boundary-layer.ts --file=./x.geojson --slug=my-layer --name=\"Display name\" [--replace] [--label-key=NAME] [--id-key=GEOID]"
    );
    process.exit(1);
  }

  return { file, slug, name, description, replace, labelKey, idKey };
}

function collectFeatures(raw: unknown): GeoJSONFeature[] {
  if (typeof raw !== "object" || raw === null) {
    throw new Error("Invalid GeoJSON root");
  }
  const o = raw as Record<string, unknown>;
  if (o.type === "FeatureCollection" && Array.isArray(o.features)) {
    return (o.features as GeoJSONFeature[]).filter((f) => f?.type === "Feature");
  }
  if (o.type === "Feature") {
    return [o as GeoJSONFeature];
  }
  throw new Error("Expected FeatureCollection or Feature root object");
}

function geometryToJsonString(geom: GeoJSONPolygon | GeoJSONMultiPolygon): string {
  return JSON.stringify(geom);
}

async function main() {
  const { file, slug, name, description, replace, labelKey, idKey } = parseArgs();

  const text = readFileSync(file, "utf8");
  const parsed = JSON.parse(text) as unknown;
  const features = collectFeatures(parsed);

  const layer = await prisma.mapBoundaryLayer.upsert({
    where: { slug },
    create: {
      slug,
      name,
      description,
      sortOrder: 0,
    },
    update: {
      name,
      description,
    },
  });

  if (replace) {
    const deleted = await prisma.mapBoundaryFeature.deleteMany({
      where: { layerId: layer.id },
    });
    console.error(`Removed ${deleted.count} existing feature(s) for layer "${slug}".`);
  }

  let inserted = 0;
  let skipped = 0;

  for (const feature of features) {
    const g = feature.geometry;
    if (!g || typeof g !== "object" || !("type" in g)) {
      skipped++;
      continue;
    }

    if (g.type !== "Polygon" && g.type !== "MultiPolygon") {
      console.warn(`Skipping non-polygon geometry type: ${(g as { type: string }).type}`);
      skipped++;
      continue;
    }

    const geomJson = geometryToJsonString(g as GeoJSONPolygon | GeoJSONMultiPolygon);
    const props = feature.properties ?? {};
    const labelRaw =
      labelKey && props[labelKey] !== undefined && props[labelKey] !== null
        ? String(props[labelKey])
        : null;
    const externalRaw =
      idKey && props[idKey] !== undefined && props[idKey] !== null
        ? String(props[idKey])
        : null;

    const id = randomUUID();

    await prisma.$executeRaw`
      INSERT INTO "MapBoundaryFeature" ("id", "layerId", "externalKey", "label", "geom")
      VALUES (
        ${id},
        ${layer.id},
        ${externalRaw},
        ${labelRaw},
        ST_Multi(ST_SetSRID(ST_GeomFromGeoJSON(${geomJson}::text), 4326))
      )
    `;

    inserted++;
  }

  console.error(
    `Layer "${slug}" (${layer.id}): inserted ${inserted} polygon feature(s), skipped ${skipped}.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
