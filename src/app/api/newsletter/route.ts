import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NEWSLETTER_COOKIE } from "@/lib/newsletter-cookie";
import { sendNewsletterWelcomeEmail } from "@/lib/newsletter-welcome";
import { syncNewsletterSubscriber } from "@/lib/newsletter-subscribe";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email =
    typeof body === "object" &&
    body !== null &&
    "email" in body &&
    typeof (body as { email: unknown }).email === "string"
      ? (body as { email: string }).email
      : "";

  const result = await syncNewsletterSubscriber(email);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error ?? "Signup failed." },
      { status: result.error === "Invalid email address." ? 400 : 502 }
    );
  }

  await sendNewsletterWelcomeEmail(email).catch(() => {});

  const jar = await cookies();
  jar.set(NEWSLETTER_COOKIE, "1", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
  });

  return NextResponse.json({ ok: true });
}
