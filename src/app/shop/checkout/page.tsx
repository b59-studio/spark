import type { Metadata } from "next";
import CheckoutForm from "@/components/shop/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your TX*SPARK order.",
  alternates: { canonical: "/shop/checkout" },
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="spark-page-wide">
      <h1 className="heading-xl mb-8">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
