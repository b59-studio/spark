export type WooCommerceConfig = {
  /** Same host as WordPress with WooCommerce installed. */
  apiBaseUrl: string;
  consumerKey: string;
  consumerSecret: string;
};

export function getWooCommerceConfig(): WooCommerceConfig | null {
  const apiBaseUrl = process.env.WOOCOMMERCE_API_URL?.trim().replace(/\/$/, "");
  const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY?.trim();
  const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET?.trim();

  if (!apiBaseUrl || !consumerKey || !consumerSecret) return null;

  return { apiBaseUrl, consumerKey, consumerSecret };
}
