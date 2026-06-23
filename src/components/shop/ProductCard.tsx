import Link from "next/link";
import { formatProductPrice } from "@/lib/integrations/woocommerce/format";
import type { WooCommerceProduct } from "@/lib/integrations/woocommerce/client";

/**
 * Catalog card: image, name, price, and a link to the product detail page.
 * Server-rendered — the interactive add-to-cart lives on the detail page.
 *
 * Product images come from the (env-driven) WooCommerce host. We use a plain
 * <img> rather than next/image so the storefront needs no `images.remotePatterns`
 * entry for an origin that isn't known at build time.
 */
export default function ProductCard({ product }: { product: WooCommerceProduct }) {
  const image = product.images[0];
  const price = formatProductPrice(product.price);

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="spark-panel spark-framed group flex flex-col overflow-hidden rounded-2xl transition-transform duration-150 hover:-translate-y-1 focus-visible:-translate-y-1"
    >
      <div className="aspect-square w-full overflow-hidden bg-spark-purple/20">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.src}
            alt={image.alt || product.name}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="body-sm">No image</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="heading-sm">{product.name}</h2>
        <p className="body-md mt-auto">
          {price ?? "Price on request"}
        </p>
      </div>
    </Link>
  );
}
