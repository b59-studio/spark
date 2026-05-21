import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import {
  mapWooCommerceOrderPayload,
  recordCommerceOrder,
} from "@/lib/analytics/record-commerce-order";
import { recordWebhookDelivery } from "@/lib/analytics/record-webhook-delivery";

function verifyWebhookSignature(
  body: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false;

  const expected = createHmac("sha256", secret).update(body, "utf8").digest("base64");

  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const secret = process.env.WOOCOMMERCE_WEBHOOK_SECRET?.trim();
  const signature = req.headers.get("x-wc-webhook-signature");

  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (secret) {
    if (!verifyWebhookSignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
    console.warn("[woocommerce-webhook] WOOCOMMERCE_WEBHOOK_SECRET not set in production");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const order = body as Record<string, unknown>;
  const orderId = Number(order.id);
  const topic = req.headers.get("x-wc-webhook-topic") ?? "order.unknown";

  if (!Number.isFinite(orderId)) {
    return NextResponse.json({ error: "Missing order id" }, { status: 400 });
  }

  const idempotencyKey = `woocommerce:${topic}:${orderId}`;

  const isNew = await recordWebhookDelivery({
    provider: "woocommerce",
    eventType: topic,
    externalId: String(orderId),
    idempotencyKey,
    payload: order,
  });

  if (!isNew) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  try {
    await recordCommerceOrder(mapWooCommerceOrderPayload(order));
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[woocommerce-webhook]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
