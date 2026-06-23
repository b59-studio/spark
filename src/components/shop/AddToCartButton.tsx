"use client";

import { useState } from "react";
import { useCart } from "@/components/shop/CartContext";

type AddToCartButtonProps = {
  productId: number;
  /** Disable when the product can't be purchased (out of stock, etc.). */
  disabled?: boolean;
  /** Label override; defaults to "Add to cart". */
  label?: string;
  className?: string;
};

/**
 * Adds a product to the on-site cart. Inert when the shop is unconfigured: the
 * cart provider reports an "unconfigured" status and the click is a safe no-op,
 * so product pages still render without a live WooCommerce store.
 */
export default function AddToCartButton({
  productId,
  disabled = false,
  label = "Add to cart",
  className = "",
}: AddToCartButtonProps) {
  const { addItem, busy, status } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const shopUnavailable = status === "unconfigured";
  const isDisabled = disabled || busy || shopUnavailable;

  async function handleClick() {
    const ok = await addItem(productId, 1);
    if (ok) {
      setJustAdded(true);
      window.setTimeout(() => setJustAdded(false), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={["btn-primary disabled:opacity-60", className]
        .filter(Boolean)
        .join(" ")}
      aria-live="polite"
    >
      {shopUnavailable
        ? "Shop coming soon"
        : busy
          ? "Adding…"
          : justAdded
            ? "Added ✓"
            : label}
    </button>
  );
}
