import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  SESSION_COOKIE_NAME,
  SESSION_EXTENDED_MAX_AGE_SEC,
  SESSION_MAX_AGE_SEC,
} from "@/lib/auth/constants";
import { hashMagicLinkSecret } from "@/lib/auth/magic-link-token";
import { signSessionCookie } from "@/lib/auth/session-cookie";

export const dynamic = "force-dynamic";

function safeInternalPath(raw: string | null, fallback: string): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return fallback;
  }
  return raw;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const raw = url.searchParams.get("token");
  const redirectPath = safeInternalPath(url.searchParams.get("next"), "/map");
  const persistentRaw = url.searchParams.get("persistent");
  const staySignedIn =
    persistentRaw === "1" ||
    persistentRaw?.toLowerCase() === "true" ||
    persistentRaw?.toLowerCase() === "yes";
  const sessionMaxAgeSec = staySignedIn
    ? SESSION_EXTENDED_MAX_AGE_SEC
    : SESSION_MAX_AGE_SEC;

  if (!raw) {
    return NextResponse.redirect(new URL("/login?error=missing_token", req.url));
  }

  const tokenHash = hashMagicLinkSecret(raw);
  const now = new Date();

  const row = await prisma.magicLinkToken.findUnique({
    where: { tokenHash },
  });

  if (
    !row ||
    row.consumedAt !== null ||
    row.expiresAt <= now
  ) {
    return NextResponse.redirect(new URL("/login?error=invalid_token", req.url));
  }

  await prisma.magicLinkToken.update({
    where: { id: row.id },
    data: { consumedAt: now },
  });

  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    return NextResponse.redirect(new URL("/login?error=server_config", req.url));
  }

  const issued = Math.floor(Date.now() / 1000);
  const signed = signSessionCookie({
    sub: row.userId,
    iat: issued,
    exp: issued + sessionMaxAgeSec,
  });

  if (!signed) {
    return NextResponse.redirect(new URL("/login?error=server_config", req.url));
  }

  const dest = new URL(redirectPath, url.origin);

  const res = NextResponse.redirect(dest);
  res.cookies.set(SESSION_COOKIE_NAME, signed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionMaxAgeSec,
  });

  return res;
}
