"use client";

import Link from "next/link";
import { useCart } from "@/components/shop/CartContext";

/**
 * Header link to the cart with a live item-count badge. Lives inside the shop
 * layout (which provides the cart context), so it only appears on /shop routes.
 */
export default function CartLink({ className = "" }: { className?: string }) {
  const { itemCount, status } = useCart();
  const showBadge = status === "ready" && itemCount > 0;

  return (
    <Link
      href="/shop/cart"
      className={["nav-link relative inline-flex items-center gap-2", className]
        .filter(Boolean)
        .join(" ")}
    >
      <span>Cart</span>
      {showBadge ? (
        <span
          className="inline-flex min-w-5 items-center justify-center rounded-full bg-spark-gold px-1.5 text-xs font-bold text-spark-void"
          aria-label={`${itemCount} item${itemCount === 1 ? "" : "s"} in cart`}
        >
          {itemCount}
        </span>
      ) : null}
    </Link>
  );
}
