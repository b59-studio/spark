import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeServerClient } from "@/lib/integrations/stripe/server";
import { recordWebhookDelivery } from "@/lib/analytics/record-webhook-delivery";
import type { JsonValue } from "@/types/analytics-database";

export async function POST(req: Request) {
  const stripe = getStripeServerClient();
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  // No-op gracefully when Stripe is unconfigured (no keys / no signing secret).
  if (!stripe || !secret) {
    if (process.env.NODE_ENV === "production") {
      console.warn("[stripe-webhook] Stripe not configured; ignoring event.");
    }
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch {
    // Signature mismatch or malformed payload — do not log the body.
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Record delivery first for idempotency; skip duplicate event ids.
  const isNew = await recordWebhookDelivery({
    provider: "stripe",
    eventType: event.type,
    externalId: event.id,
    idempotencyKey: `stripe:${event.id}`,
    payload: event as unknown as JsonValue,
  });

  if (!isNew) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  // Donation analytics retired (donation_events dropped); deliveries are still
  // recorded above for idempotency. No per-event handling remains.
  return NextResponse.json({ ok: true });
}
