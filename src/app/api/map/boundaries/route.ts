import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { assertMapApiAccess } from "@/lib/map/assert-map-api-access";
import { getMapApiAccessMode } from "@/lib/map/access-mode";
import {
  getBoundarySlugGate,
  intersectBoundarySlugs,
} from "@/lib/map/boundary-access";
import type {
  GeoJSONFeature,
  GeoJSONFeatureCollection,
  GeoJSONMultiPolygon,
} from "@/lib/map/types";

export const dynamic = "force-dynamic";

/**
 * GeoJSON FeatureCollection of boundary polygons for one or more layer slugs.
 * GET ?layers=slug1,slug2
 *
 * Requested slugs are intersected with role-based permissions (`UserRole.permissions`:
 * `boundaryLayerSlugs`, `allBoundaryLayers`). Unknown slugs are dropped.
 */
export async function GET(req: Request) {
  const gate = await assertMapApiAccess();
  if (!gate.ok) {
    return gate.response;
  }

  const mode = getMapApiAccessMode();
  const slugGate = getBoundarySlugGate(gate.user, mode);

  const url = new URL(req.url);
  const layersParam = url.searchParams.get("layers")?.trim() ?? "";
  const requested = layersParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const slugs = intersectBoundarySlugs(slugGate, requested);

  if (slugs.length === 0) {
    const empty: GeoJSONFeatureCollection<GeoJSONMultiPolygon> = {
      type: "FeatureCollection",
      features: [],
    };
    return NextResponse.json(empty, {
      headers: {
        "Cache-Control": "private, max-age=30, stale-while-revalidate=120",
      },
    });
  }

  const rows = await prisma.$queryRaw<
    {
      id: string;
      layerSlug: string;
      label: string | null;
      externalKey: string | null;
      geojson: unknown;
    }[]
  >(Prisma.sql`
    SELECT
      f."id",
      l."slug" AS "layerSlug",
      f."label",
      f."externalKey",
      ST_AsGeoJSON(f."geom")::json AS geojson
    FROM "MapBoundaryFeature" f
    INNER JOIN "MapBoundaryLayer" l ON l."id" = f."layerId"
    WHERE l."slug" IN (${Prisma.join(slugs.map((s) => Prisma.sql`${s}`))})
  `);

  const features: GeoJSONFeature<
    GeoJSONMultiPolygon,
    {
      layerSlug: string;
      label: string | null;
      externalKey: string | null;
    }
  >[] = [];

  for (const row of rows) {
    const geom = row.geojson;
    if (
      typeof geom !== "object" ||
      geom === null ||
      !("type" in geom) ||
      (geom as { type: string }).type !== "MultiPolygon"
    ) {
      continue;
    }
    features.push({
      type: "Feature",
      id: row.id,
      geometry: geom as GeoJSONMultiPolygon,
      properties: {
        layerSlug: row.layerSlug,
        label: row.label,
        externalKey: row.externalKey,
      },
    });
  }

  const collection: GeoJSONFeatureCollection<GeoJSONMultiPolygon> = {
    type: "FeatureCollection",
    features,
  };

  return NextResponse.json(collection, {
    headers: {
      "Cache-Control": "private, max-age=30, stale-while-revalidate=120",
    },
  });
}
