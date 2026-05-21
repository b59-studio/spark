import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { NEWSLETTER_COOKIE } from "@/lib/newsletter-cookie";
import { sendNewsletterWelcomeEmail } from "@/lib/newsletter-welcome";
import { recordNewsletterSignup } from "@/lib/analytics/record-newsletter-signup";
import { getMailPoetConfig } from "@/lib/integrations/mailpoet/config";
import { syncNewsletterSubscriber } from "@/lib/newsletter-subscribe";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

type NewsletterBody = {
  email?: unknown;
  source?: unknown;
  resourceLabel?: unknown;
};

function parseBody(body: unknown): {
  email: string;
  source?: string;
  resourceLabel?: string;
} {
  if (typeof body !== "object" || body === null) {
    return { email: "" };
  }
  const b = body as NewsletterBody;
  const email = typeof b.email === "string" ? b.email : "";
  const source = typeof b.source === "string" ? b.source : undefined;
  const resourceLabel =
    typeof b.resourceLabel === "string" ? b.resourceLabel : undefined;
  return { email, source, resourceLabel };
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { email, source, resourceLabel } = parseBody(body);

  const result = await syncNewsletterSubscriber(email, {
    source,
    resourceLabel,
  });
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error ?? "Signup failed." },
      { status: result.error === "Invalid email address." ? 400 : 502 }
    );
  }

  await sendNewsletterWelcomeEmail(email).catch(() => {});

  const mailpoet = getMailPoetConfig();
  await recordNewsletterSignup({
    email,
    source,
    resourceLabel,
    mailpoetListId: mailpoet?.listId,
    mailpoetSubscriberId: result.mailpoetSubscriberId,
    payload: { site: "txspark-marketing" },
  }).catch((e) => {
    console.error(
      "[analytics] newsletter signup record failed:",
      e instanceof Error ? e.message : e
    );
  });

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
