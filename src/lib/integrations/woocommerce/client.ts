import { getWooCommerceConfig } from "@/lib/integrations/woocommerce/config";
import type { WooCommerceConfig } from "@/lib/integrations/woocommerce/config";

export type WooCommerceProduct = {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  description: string;
  short_description: string;
  /** Active price as a decimal string in the store currency (e.g. "12.00"). */
  price: string;
  regular_price: string;
  sale_price: string;
  /** "publish", "draft", etc. — only `publish` products are customer-facing. */
  status?: string;
  /** "instock", "outofstock", or "onbackorder". */
  stock_status?: string;
  /** Whether the product can currently be purchased. */
  purchasable?: boolean;
  images: { src: string; alt: string }[];
};

function wooAuthHeader(config: WooCommerceConfig): string {
  const credentials = `${config.consumerKey}:${config.consumerSecret}`;
  return `Basic ${Buffer.from(credentials).toString("base64")}`;
}

/**
 * WooCommerce REST API v3 skeleton. Use for shop pages, donations, or merch
 * rendered in Next.js while checkout may still live on WordPress.
 */
export async function fetchWooCommerceProducts(
  config: WooCommerceConfig,
  options?: { perPage?: number; slug?: string }
): Promise<WooCommerceProduct[]> {
  const params = new URLSearchParams({
    per_page: String(options?.perPage ?? 12),
  });
  if (options?.slug) params.set("slug", options.slug);

  const url = `${config.apiBaseUrl}/wp-json/wc/v3/products?${params}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: wooAuthHeader(config),
    },
    next: { revalidate: 120 },
  });

  if (!res.ok) {
    throw new Error(`WooCommerce API error (${res.status})`);
  }

  return (await res.json()) as WooCommerceProduct[];
}

/**
 * Catalog read for the storefront. Resolves config internally and returns an
 * empty list whenever WooCommerce is unconfigured or unreachable, so shop pages
 * render a "coming soon" state instead of failing the request. Only published
 * products are returned.
 *
 * Trade-off: a transient Woo outage degrades to an empty catalog rather than a
 * 500. That is the right call for a marketing storefront (the page still loads);
 * the failure is logged at WARN for operators. If the shop ever drives revenue
 * directly, revisit and surface a hard error to the customer instead.
 */
export async function getStorefrontProducts(options?: {
  perPage?: number;
}): Promise<WooCommerceProduct[]> {
  const config = getWooCommerceConfig();
  if (!config) return [];

  try {
    const products = await fetchWooCommerceProducts(config, {
      perPage: options?.perPage ?? 24,
    });
    return products.filter(
      (product) => (product.status ?? "publish") === "publish"
    );
  } catch (error) {
    console.warn(
      "[woocommerce] storefront catalog fetch failed:",
      error instanceof Error ? error.message : error
    );
    return [];
  }
}

/**
 * Resolve a single published product by slug for the detail page. Returns null
 * when WooCommerce is unconfigured, unreachable, or has no matching published
 * product (drives a 404 / "not found" state at the route level).
 */
export async function getStorefrontProductBySlug(
  slug: string
): Promise<WooCommerceProduct | null> {
  const config = getWooCommerceConfig();
  if (!config) return null;

  try {
    const products = await fetchWooCommerceProducts(config, {
      perPage: 1,
      slug,
    });
    const product = products[0];
    if (!product) return null;
    if ((product.status ?? "publish") !== "publish") return null;
    return product;
  } catch (error) {
    console.warn(
      `[woocommerce] product lookup failed for "${slug}":`,
      error instanceof Error ? error.message : error
    );
    return null;
  }
}
