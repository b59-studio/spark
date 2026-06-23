import type { Metadata } from "next";
import CartView from "@/components/shop/CartView";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review the items in your TX*SPARK cart before checkout.",
  alternates: { canonical: "/shop/cart" },
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="spark-page">
      <h1 className="heading-xl mb-8">Your cart</h1>
      <CartView />
    </div>
  );
}
