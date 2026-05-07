import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/get-session";
import type { UserWithRoles } from "@/lib/permissions";
import { getMapApiAccessMode } from "@/lib/map/access-mode";

type GateOk = { ok: true; user: UserWithRoles | null };
type GateDeny = { ok: false; response: NextResponse };

/**
 * Enforces `MAP_API_ACCESS`: open allows anonymous; authenticated/scoped require a session.
 */
export async function assertMapApiAccess(): Promise<GateOk | GateDeny> {
  const mode = getMapApiAccessMode();
  const user = await getSessionUser();

  if (mode === "open") {
    return { ok: true, user };
  }

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Sign in required", code: "MAP_AUTH_REQUIRED" },
        { status: 401 },
      ),
    };
  }

  return { ok: true, user };
}
