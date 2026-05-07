import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/get-session";
import { deriveMapAccess } from "@/lib/auth/map-access";
import { getMapApiAccessMode } from "@/lib/map/access-mode";
import { getBoundarySlugGate } from "@/lib/map/boundary-access";

export const dynamic = "force-dynamic";

/**
 * Returns the signed-in user, role assignments, and map scope derived from `UserRole`.
 * Use this from the map UI and future gated `/api/map/*` handlers.
 */
export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ authenticated: false as const }, { status: 401 });
  }

  const mapAccess = deriveMapAccess(user);
  const mode = getMapApiAccessMode();
  const boundaryGate = getBoundarySlugGate(user, mode);
  const boundaryLayers =
    boundaryGate.kind === "all"
      ? ({ scope: "all" as const } as const)
      : ({
          scope: "some" as const,
          slugs: [...boundaryGate.slugs],
        } as const);

  return NextResponse.json({
    authenticated: true as const,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles.map((ur) => ({
        roleName: ur.role.name,
        precinctId: ur.precinctId,
        blockId: ur.blockId,
      })),
      mapAccess,
      boundaryLayers,
    },
  });
}
