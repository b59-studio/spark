import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { UserWithRoles } from "@/lib/permissions";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { verifySessionCookie } from "@/lib/auth/session-cookie";

const userInclude = {
  roles: { include: { role: true } },
} as const;

export async function getSessionUser(): Promise<UserWithRoles | null> {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE_NAME)?.value;
  if (!raw) return null;
  const payload = verifySessionCookie(raw);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    include: userInclude,
  });
  return user;
}
