"use client";

import Link from "next/link";
import { useCart } from "@/components/shop/CartContext";
import { formatMinorUnits } from "@/lib/integrations/woocommerce/format";
import type { StoreCartItem } from "@/lib/integrations/woocommerce/store-client";

/**
 * Renders the current cart with quantity controls and a totals summary. Pure
 * presentation over the cart context — used by the cart page and the checkout
 * order summary. Degrades to a "shop coming soon" / empty state.
 */
export default function CartView({
  showCheckoutLink = true,
}: {
  showCheckoutLink?: boolean;
}) {
  const { cart, status, busy, error, updateItem, removeItem } = useCart();

  if (status === "unconfigured") {
    return (
      <div className="spark-panel spark-framed rounded-2xl p-8 text-center">
        <p className="body-md">The shop is coming soon. Check back shortly.</p>
      </div>
    );
  }

  if (status === "loading" || status === "idle") {
    return (
      <div className="spark-panel rounded-2xl p-8 text-center">
        <p className="body-md">Loading your cart…</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="spark-panel spark-framed rounded-2xl p-8 text-center">
        <p className="body-md mb-6">Your cart is empty.</p>
        <Link href="/shop" className="btn-primary">
          Browse the shop
        </Link>
      </div>
    );
  }

  const currency = cart.totals.currency_code;
  const minorUnit = cart.totals.currency_minor_unit;

  return (
    <div className="space-y-6">
      {error ? (
        <p className="callout-alert body-sm" role="alert">
          {error}
        </p>
      ) : null}

      <ul className="space-y-4">
        {cart.items.map((item) => (
          <CartLine
            key={item.key}
            item={item}
            busy={busy}
            onUpdate={updateItem}
            onRemove={removeItem}
          />
        ))}
      </ul>

      <div className="spark-panel spark-framed rounded-2xl p-6">
        <dl className="space-y-2">
          <div className="flex items-center justify-between">
            <dt className="body-md">Subtotal</dt>
            <dd className="body-md">
              {formatMinorUnits(cart.totals.total_items, minorUnit, currency)}
            </dd>
          </div>
          {Number(cart.totals.total_tax) > 0 ? (
            <div className="flex items-center justify-between">
              <dt className="body-md">Tax</dt>
              <dd className="body-md">
                {formatMinorUnits(cart.totals.total_tax, minorUnit, currency)}
              </dd>
            </div>
          ) : null}
          <div className="flex items-center justify-between border-t border-spark-gold/30 pt-2">
            <dt className="heading-sm">Total</dt>
            <dd className="heading-sm">
              {formatMinorUnits(cart.totals.total_price, minorUnit, currency)}
            </dd>
          </div>
        </dl>

        {showCheckoutLink ? (
          <Link href="/shop/checkout" className="btn-primary mt-6 w-full text-center">
            Proceed to checkout
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function CartLine({
  item,
  busy,
  onUpdate,
  onRemove,
}: {
  item: StoreCartItem;
  busy: boolean;
  onUpdate: (key: string, quantity: number) => Promise<boolean>;
  onRemove: (key: string) => Promise<boolean>;
}) {
  const image = item.images[0];
  const lineTotal = formatMinorUnits(
    item.totals.line_total,
    item.totals.currency_minor_unit,
    item.totals.currency_code
  );

  return (
    <li className="spark-panel flex items-center gap-4 rounded-2xl p-4">
      {/* Remote product image from WooCommerce; plain <img> avoids needing a
          configured remote-image host in next.config for an unknown Woo origin. */}
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image.src}
          alt={image.alt || item.name}
          className="h-16 w-16 shrink-0 rounded-lg object-cover"
          loading="lazy"
        />
      ) : (
        <div className="h-16 w-16 shrink-0 rounded-lg bg-spark-purple/30" aria-hidden />
      )}

      <div className="min-w-0 flex-1">
        <p className="heading-sm truncate">{item.name}</p>
        <p className="body-sm">{lineTotal}</p>
      </div>

      <div className="flex items-center gap-3">
        <QuantityStepper
          item={item}
          busy={busy}
          onUpdate={onUpdate}
        />
        <button
          type="button"
          className="text-link body-sm inline-flex min-h-11 items-center px-1"
          disabled={busy}
          onClick={() => onRemove(item.key)}
        >
          Remove
        </button>
      </div>
    </li>
  );
}

const MAX_QUANTITY = 10;

/**
 * Quantity control for a cart line. A stepper rather than a dropdown: a native
 * `<select>` hands its option list to the OS, which draws a modal wheel on iOS
 * and an unstyleable list elsewhere, and a quantity is adjusted far more often
 * by one step than set to an arbitrary value.
 *
 * The live value is a real `<output>` so assistive tech is told the new
 * quantity when a step lands, without moving focus off the button being pressed.
 */
function QuantityStepper({
  item,
  busy,
  onUpdate,
}: {
  item: StoreCartItem;
  busy: boolean;
  onUpdate: (key: string, quantity: number) => Promise<boolean>;
}) {
  const atMin = item.quantity <= 1;
  const atMax = item.quantity >= MAX_QUANTITY;

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        className="qty-step"
        disabled={busy || atMin}
        aria-label={`Decrease quantity of ${item.name}`}
        onClick={() => onUpdate(item.key, item.quantity - 1)}
      >
        <span aria-hidden>&minus;</span>
      </button>
      <output
        className="min-w-8 text-center tabular-nums"
        aria-label={`Quantity of ${item.name}`}
      >
        {item.quantity}
      </output>
      <button
        type="button"
        className="qty-step"
        disabled={busy || atMax}
        aria-label={`Increase quantity of ${item.name}`}
        onClick={() => onUpdate(item.key, item.quantity + 1)}
      >
        <span aria-hidden>+</span>
      </button>
    </div>
  );
}
