/**
 * On-site cart proxy for the WooCommerce Store API.
 *
 * The browser talks to THIS route, never to WooCommerce directly. That keeps the
 * store origin and session handling on the server, lets us validate input at the
 * boundary, and normalizes every WooCommerce outcome into a stable JSON shape.
 *
 * Session: the client holds an opaque session token (Cart-Token + optional
 * Nonce) and round-trips it in the request body. We forward it to WooCommerce and
 * return the refreshed token so the next request addresses the same cart.
 *
 * All actions no-op gracefully when WooCommerce is unconfigured (HTTP 200 with a
 * `configured: false` flag) so the storefront can render a "shop coming soon"
 * state instead of erroring.
 */

import { NextResponse } from "next/server";
import {
  addCartItem,
  getCart,
  isStoreApiConfigured,
  removeCartItem,
  updateCartItem,
  type StoreApiResponse,
  type StoreApiSession,
  type StoreCart,
} from "@/lib/integrations/woocommerce/store-client";

type CartActionBody = {
  action?: unknown;
  productId?: unknown;
  quantity?: unknown;
  key?: unknown;
  session?: unknown;
};

/** Parse the opaque session blob the client round-trips. Unknown shape → none. */
function parseSession(value: unknown): StoreApiSession | undefined {
  if (typeof value !== "object" || value === null) return undefined;
  const v = value as { cartToken?: unknown; nonce?: unknown };
  const cartToken = typeof v.cartToken === "string" ? v.cartToken : undefined;
  const nonce = typeof v.nonce === "string" ? v.nonce : undefined;
  if (!cartToken && !nonce) return undefined;
  return { cartToken, nonce };
}

function toPositiveInt(value: unknown): number | null {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(n) || n <= 0) return null;
  return n;
}

/** Quantity may be 0 (used to clear a line via update). Reject negatives / NaN. */
function toQuantity(value: unknown, { allowZero }: { allowZero: boolean }): number | null {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(n)) return null;
  if (n < 0) return null;
  if (n === 0 && !allowZero) return null;
  return n;
}

/** Shape a Store API result into the JSON envelope the client expects. */
function respond(result: StoreApiResponse<StoreCart>) {
  if (result.ok) {
    return NextResponse.json({
      configured: true,
      cart: result.data,
      session: result.session,
    });
  }
  // Map the WooCommerce failure to an HTTP status the client can branch on.
  // status 0 = transport/config problem on our side → 503; otherwise pass through.
  const status = result.status === 0 ? 503 : result.status;
  return NextResponse.json(
    { configured: true, error: result.message, code: result.code },
    { status }
  );
}

/** GET /api/shop/cart — read the current cart for a session passed as ?token=. */
export async function GET(req: Request) {
  if (!isStoreApiConfigured()) {
    return NextResponse.json({ configured: false, cart: null });
  }
  const url = new URL(req.url);
  const cartToken = url.searchParams.get("token") ?? undefined;
  const nonce = url.searchParams.get("nonce") ?? undefined;
  const session: StoreApiSession | undefined =
    cartToken || nonce ? { cartToken, nonce } : undefined;

  const result = await getCart(session);
  return respond(result);
}

/**
 * POST /api/shop/cart — mutate the cart.
 * Body: { action: "add" | "update" | "remove", ...args, session? }
 */
export async function POST(req: Request) {
  if (!isStoreApiConfigured()) {
    return NextResponse.json({ configured: false, cart: null });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { action, productId, quantity, key, session } = body as CartActionBody;
  const parsedSession = parseSession(session);

  switch (action) {
    case "add": {
      const id = toPositiveInt(productId);
      if (id === null) {
        return NextResponse.json(
          { error: "A valid product id is required." },
          { status: 400 }
        );
      }
      const qty = quantity === undefined ? 1 : toQuantity(quantity, { allowZero: false });
      if (qty === null) {
        return NextResponse.json(
          { error: "Quantity must be a positive whole number." },
          { status: 400 }
        );
      }
      return respond(await addCartItem({ id, quantity: qty }, parsedSession));
    }

    case "update": {
      if (typeof key !== "string" || key.trim() === "") {
        return NextResponse.json(
          { error: "A cart item key is required." },
          { status: 400 }
        );
      }
      // Quantity 0 removes the line — Woo accepts it on update-item.
      const qty = toQuantity(quantity, { allowZero: true });
      if (qty === null) {
        return NextResponse.json(
          { error: "Quantity must be a whole number of zero or more." },
          { status: 400 }
        );
      }
      return respond(await updateCartItem({ key, quantity: qty }, parsedSession));
    }

    case "remove": {
      if (typeof key !== "string" || key.trim() === "") {
        return NextResponse.json(
          { error: "A cart item key is required." },
          { status: 400 }
        );
      }
      return respond(await removeCartItem({ key }, parsedSession));
    }

    default:
      return NextResponse.json(
        { error: "Unknown cart action." },
        { status: 400 }
      );
  }
}
