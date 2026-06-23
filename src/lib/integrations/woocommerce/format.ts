/**
 * Presentation helpers for WooCommerce money values.
 *
 * WooCommerce REST (wc/v3) returns prices as plain decimal strings in the store
 * currency (e.g. "12.00"), without a currency symbol. The Store API (wc/store/v1)
 * instead returns integer minor units plus a `currency_minor_unit` divisor. Both
 * shapes funnel through here so the storefront formats money in one place.
 */

/** Default display currency when the store currency is unknown. */
const DEFAULT_CURRENCY = "USD";

/**
 * Format a wc/v3 decimal price string (e.g. "12.00") for display. Returns null
 * for empty / non-numeric input so callers can choose their own fallback copy.
 */
export function formatProductPrice(
  price: string | null | undefined,
  currency: string = DEFAULT_CURRENCY
): string | null {
  if (price == null || price.trim() === "") return null;
  const amount = Number.parseFloat(price);
  if (Number.isNaN(amount)) return null;
  return formatCurrencyAmount(amount, currency);
}

/**
 * Format a Store API minor-unit integer (e.g. 1200 with minorUnit 2 → $12.00).
 * Used by cart/checkout where totals arrive as integer strings plus a divisor.
 */
export function formatMinorUnits(
  minorUnits: string | number | null | undefined,
  minorUnit: number = 2,
  currency: string = DEFAULT_CURRENCY
): string | null {
  if (minorUnits == null || minorUnits === "") return null;
  const raw = typeof minorUnits === "number" ? minorUnits : Number(minorUnits);
  if (Number.isNaN(raw)) return null;
  const amount = raw / 10 ** minorUnit;
  return formatCurrencyAmount(amount, currency);
}

function formatCurrencyAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    // Unknown ISO currency code → fall back to a plain 2-decimal string.
    return amount.toFixed(2);
  }
}
