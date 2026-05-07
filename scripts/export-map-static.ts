/**
 * Daily export: household GeoJSON for CDN / Tippecanoe / Mapbox tile pipelines.
 *
 * Usage:
 *   npx tsx scripts/export-map-static.ts [--metric=turnout] [--out=./households.geojson]
 *
 * Requires DATABASE_URL (same as Prisma). Run after migrations so PostGIS + households exist.
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type Metric = "turnout" | "persuasion" | "party";

function metricAgg(metric: Metric): Prisma.Sql {
  switch (metric) {
    case "persuasion":
      return Prisma.sql`AVG(vs."persuasionScore")`;
    case "party":
      return Prisma.sql`AVG(vs."partyConfidence")`;
    default:
      return Prisma.sql`AVG(vs."turnoutScore")`;
  }
}

async function main() {
  const args = process.argv.slice(2);
  let metric: Metric = "turnout";
  let outPath: string | null = null;

  for (const a of args) {
    if (a.startsWith("--metric=")) {
      const m = a.slice("--metric=".length) as Metric;
      if (m === "turnout" || m === "persuasion" || m === "party") {
        metric = m;
      }
    }
    if (a.startsWith("--out=")) {
      outPath = resolve(a.slice("--out=".length));
    }
  }

  const agg = metricAgg(metric);

  const rows = await prisma.$queryRaw<
    { id: string; lat: number; lng: number; score: unknown }[]
  >(Prisma.sql`
    SELECT
      h."id",
      h."lat",
      h."lng",
      ${agg} AS score
    FROM "Household" h
    INNER JOIN "Voter" v ON v."householdId" = h."id"
    LEFT JOIN "VoterScore" vs ON vs."voterId" = v."id"
    WHERE h."lat" IS NOT NULL AND h."lng" IS NOT NULL
    GROUP BY h."id", h."lat", h."lng"
  `);

  const collection = {
    type: "FeatureCollection" as const,
    features: rows.map((r) => {
      const scoreVal = r.score;
      const score =
        scoreVal === null || scoreVal === undefined
          ? null
          : typeof scoreVal === "number"
            ? scoreVal
            : Number(scoreVal);
      return {
        type: "Feature" as const,
        id: r.id,
        geometry: {
          type: "Point" as const,
          coordinates: [r.lng, r.lat],
        },
        properties: {
          id: r.id,
          metric,
          score: Number.isFinite(score as number) ? (score as number) : null,
        },
      };
    }),
  };

  const json = JSON.stringify(collection);
  if (outPath) {
    writeFileSync(outPath, json, "utf8");
    console.error(`Wrote ${collection.features.length} features to ${outPath}`);
  } else {
    console.log(json);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
