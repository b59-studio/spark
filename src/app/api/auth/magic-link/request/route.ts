import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MAGIC_LINK_TTL_MS } from "@/lib/auth/constants";
import {
  generateMagicLinkSecret,
  hashMagicLinkSecret,
} from "@/lib/auth/magic-link-token";
import { sendMagicLinkEmail } from "@/lib/auth/send-magic-link-email";

export const dynamic = "force-dynamic";

type Body = {
  email?: string;
  /** When true, emailed link includes `persistent=1` for a longer cookie/session. */
  staySignedIn?: boolean;
};

function baseUrl(): string {
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (site) return site.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL;
  if (vercel) {
    return vercel.startsWith("http") ? vercel : `https://${vercel}`;
  }
  return "http://localhost:3000";
}

/**
 * POST { email, staySignedIn? } — creates a single-use magic link for an existing user.
 * Sends the link via Resend when API key + from-address env vars are set.
 * Always responds 200 with the same JSON shape to avoid email enumeration.
 */
export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: true });
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ ok: true });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  const rawSecret = generateMagicLinkSecret();
  const tokenHash = hashMagicLinkSecret(rawSecret);
  const expiresAt = new Date(Date.now() + MAGIC_LINK_TTL_MS);

  await prisma.magicLinkToken.deleteMany({
    where: { userId: user.id, consumedAt: null },
  });

  await prisma.magicLinkToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

  const staySignedIn = body.staySignedIn === true;
  const verifyParams = new URLSearchParams();
  verifyParams.set("token", rawSecret);
  if (staySignedIn) {
    verifyParams.set("persistent", "1");
  }
  const magicUrl = `${baseUrl()}/api/auth/magic-link/verify?${verifyParams.toString()}`;

  await sendMagicLinkEmail({
    to: user.email,
    magicUrl,
    staySignedIn,
  });

  const debug =
    process.env.NODE_ENV !== "production" &&
    process.env.MAGIC_LINK_DEBUG === "1";

  return NextResponse.json({
    ok: true,
    ...(debug ? { debug: { magicUrl } } : {}),
  });
}
