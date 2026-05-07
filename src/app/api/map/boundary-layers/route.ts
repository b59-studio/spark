import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertMapApiAccess } from "@/lib/map/assert-map-api-access";
import { getMapApiAccessMode } from "@/lib/map/access-mode";
import {
  getBoundarySlugGate,
} from "@/lib/map/boundary-access";

export const dynamic = "force-dynamic";

/** District overlay layers visible for this session (scoped by role permissions JSON). */
export async function GET() {
  const gate = await assertMapApiAccess();
  if (!gate.ok) {
    return gate.response;
  }

  const mode = getMapApiAccessMode();
  const slugGate = getBoundarySlugGate(gate.user, mode);

  const layers = await prisma.mapBoundaryLayer.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      sortOrder: true,
    },
  });

  const filtered =
    slugGate.kind === "all"
      ? layers
      : layers.filter((l) => slugGate.slugs.has(l.slug));

  return NextResponse.json({ layers: filtered });
}
