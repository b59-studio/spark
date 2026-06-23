import type { Metadata } from "next";
import { getStorefrontProducts } from "@/lib/integrations/woocommerce/client";
import ProductCard from "@/components/shop/ProductCard";
import BrandName from "@/components/BrandName";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse TX*SPARK merch and supplies. Every purchase helps fund free, plain-language civic tools and organizing support across Texas.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Shop | TX*SPARK",
    description:
      "Browse TX*SPARK merch and supplies. Every purchase helps fund grassroots tech for Texans.",
    url: "/shop",
  },
};

// Catalog reflects WooCommerce edits within the client revalidate window (120s).
export const revalidate = 120;

export default async function ShopPage() {
  const products = await getStorefrontProducts();

  return (
    <div className="spark-page-wide">
      <header className="mb-10 text-center">
        <h1 className="heading-xl mb-4">Shop</h1>
        <p className="body-md mx-auto max-w-2xl">
          Every purchase helps fund free, plain-language civic tools and
          organizing support across Texas.
        </p>
      </header>

      {products.length === 0 ? (
        <ShopEmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Shown when WooCommerce is unconfigured, unreachable, or has no published
 * products. Keeps the route live with on-brand "coming soon" copy.
 */
function ShopEmptyState() {
  return (
    <div className="spark-panel spark-framed mx-auto max-w-2xl rounded-2xl p-10 text-center">
      <h2 className="heading-lg mb-4">Shop coming soon</h2>
      <p className="body-md">
        We&apos;re setting up the store. Check back shortly for <BrandName /> merch
        and supplies.
      </p>
    </div>
  );
}
