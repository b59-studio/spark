import type { WooCommerceConfig } from "@/lib/integrations/woocommerce/config";

export type WooCommerceProduct = {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
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
