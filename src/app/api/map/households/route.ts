import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { GeoJSONFeatureCollection } from "@/lib/map/types";
import { assertMapApiAccess } from "@/lib/map/assert-map-api-access";
import { getMapApiAccessMode } from "@/lib/map/access-mode";
import { householdScopePredicate } from "@/lib/map/household-scope-sql";

export const dynamic = "force-dynamic";

/**
 * Household points with aggregated voter scores (no PII).
 * Each feature includes turnout, persuasion, and party averages (0–1 or null).
 * Query: west/south/east/north for bbox (optional).
 *
 * Governed by `MAP_API_ACCESS` (see `src/lib/map/access-mode.ts`). `scoped` adds a
 * WHERE clause derived from the user’s roles; boundary layers are not filtered yet.
 */
export async function GET(req: Request) {
  const gate = await assertMapApiAccess();
  if (!gate.ok) {
    return gate.response;
  }

  const url = new URL(req.url);
  const mode = getMapApiAccessMode();

  const west = url.searchParams.get("west");
  const south = url.searchParams.get("south");
  const east = url.searchParams.get("east");
  const north = url.searchParams.get("north");

  let bboxClause = Prisma.empty;
  if (
    west !== null &&
    south !== null &&
    east !== null &&
    north !== null
  ) {
    const w = Number(west);
    const s = Number(south);
    const e = Number(east);
    const n = Number(north);
    if ([w, s, e, n].every(Number.isFinite)) {
      bboxClause = Prisma.sql` AND h."lng" >= ${w} AND h."lng" <= ${e} AND h."lat" >= ${s} AND h."lat" <= ${n}`;
    }
  }

  let scopeClause = Prisma.empty;
  if (mode === "scoped" && gate.user) {
    scopeClause = Prisma.sql` AND (${householdScopePredicate(gate.user)})`;
  }

  const rows = await prisma.$queryRaw<
    {
      id: string;
      lat: number;
      lng: number;
      turnout: unknown;
      persuasion: unknown;
      party: unknown;
    }[]
  >(Prisma.sql`
    SELECT
      h."id",
      h."lat",
      h."lng",
      AVG(vs."turnoutScore") AS turnout,
      AVG(vs."persuasionScore") AS persuasion,
      AVG(vs."partyConfidence") AS party
    FROM "Household" h
    INNER JOIN "Voter" v ON v."householdId" = h."id"
    LEFT JOIN "VoterScore" vs ON vs."voterId" = v."id"
    WHERE h."lat" IS NOT NULL AND h."lng" IS NOT NULL
    ${scopeClause}
    ${bboxClause}
    GROUP BY h."id", h."lat", h."lng"
  `);

  function numOrNull(v: unknown): number | null {
    if (v === null || v === undefined) return null;
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : null;
  }

  const collection: GeoJSONFeatureCollection<
    { type: "Point"; coordinates: [number, number] },
    {
      id: string;
      turnout: number | null;
      persuasion: number | null;
      party: number | null;
    }
  > = {
    type: "FeatureCollection",
    features: rows.map((r) => ({
      type: "Feature",
      id: r.id,
      geometry: {
        type: "Point",
        coordinates: [r.lng, r.lat],
      },
      properties: {
        id: r.id,
        turnout: numOrNull(r.turnout),
        persuasion: numOrNull(r.persuasion),
        party: numOrNull(r.party),
      },
    })),
  };

  return NextResponse.json(collection);
}
