import type { ReactNode } from "react";
import Link from "next/link";
import { CartProvider } from "@/components/shop/CartContext";
import CartLink from "@/components/shop/CartLink";

/**
 * Shop section shell. Wraps every /shop route in the cart provider so the cart
 * survives client-side navigation between the catalog, product pages, cart, and
 * checkout. A slim sub-nav exposes the cart with a live count.
 */
export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <div className="border-b border-spark-green/20">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/shop" className="nav-link font-semibold">
            Shop
          </Link>
          <CartLink />
        </div>
      </div>
      {children}
    </CartProvider>
  );
}
