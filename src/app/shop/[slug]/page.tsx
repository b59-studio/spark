import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getStorefrontProductBySlug,
  getStorefrontProducts,
} from "@/lib/integrations/woocommerce/client";
import { formatProductPrice } from "@/lib/integrations/woocommerce/format";
import AddToCartButton from "@/components/shop/AddToCartButton";

export const revalidate = 120;

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getStorefrontProductBySlug(slug);
  if (!product) {
    return { title: "Product not found" };
  }
  // short_description is HTML; strip tags for the meta description.
  const description = product.short_description
    .replace(/<[^>]+>/g, "")
    .trim()
    .slice(0, 160);

  return {
    title: product.name,
    description: description || `${product.name} — TX*SPARK shop.`,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title: `${product.name} | TX*SPARK`,
      description: description || `${product.name} — TX*SPARK shop.`,
      url: `/shop/${product.slug}`,
      images: product.images[0] ? [{ url: product.images[0].src }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getStorefrontProductBySlug(slug);

  // Unconfigured / unreachable / unpublished / missing all collapse to a 404.
  if (!product) notFound();

  const image = product.images[0];
  const price = formatProductPrice(product.price);
  const purchasable =
    (product.purchasable ?? true) &&
    (product.stock_status ?? "instock") === "instock";

  return (
    <div className="spark-page">
      <Link href="/shop" className="text-link body-sm mb-8 inline-block">
        ← Back to shop
      </Link>

      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="overflow-hidden rounded-2xl bg-spark-purple/20">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image.src}
              alt={image.alt || product.name}
              className="h-auto w-full object-cover"
            />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center">
              <span className="body-sm">No image</span>
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h1 className="heading-xl mb-4 text-left">{product.name}</h1>
          <p className="heading-md mb-6">{price ?? "Price on request"}</p>

          {product.short_description ? (
            <div
              className="cms-prose mb-8"
              // WooCommerce sanitizes product descriptions server-side (wp_kses)
              // and products are authored by trusted, signed-in store managers —
              // same trust boundary as CmsPage. Add a sanitizer here if untrusted
              // authorship is ever introduced.
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />
          ) : null}

          <AddToCartButton
            productId={product.id}
            disabled={!purchasable}
            label={purchasable ? "Add to cart" : "Out of stock"}
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      {product.description ? (
        <section className="mt-14 max-w-3xl">
          <h2 className="heading-lg mb-4">Details</h2>
          <div
            className="cms-prose"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </section>
      ) : null}
    </div>
  );
}

/**
 * Pre-render the published catalog at build for fast first paint. Empty when
 * WooCommerce is unconfigured, so unknown slugs fall through to on-demand ISR
 * and ultimately the 404 from `notFound()` above.
 */
export async function generateStaticParams() {
  const products = await getStorefrontProducts();
  return products.map((product) => ({ slug: product.slug }));
}
