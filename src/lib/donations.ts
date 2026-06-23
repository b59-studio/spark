/** Shared donation constants and validation, used by the form and the API route. */

/** Preset one-time donation amounts, in whole US dollars. */
export const DONATION_PRESETS_USD = [10, 25, 50, 100] as const;

/** Minimum accepted donation, in cents ($1). */
export const MIN_DONATION_CENTS = 100;

/** Maximum accepted donation, in cents ($50,000) — guards against typos/abuse. */
export const MAX_DONATION_CENTS = 5_000_000;

export const DONATION_CURRENCY = "usd";

export type AmountValidation =
  | { ok: true; amountCents: number }
  | { ok: false; error: string };

/**
 * Validate a donation amount expressed in cents. Rejects non-finite values,
 * non-integers, and anything outside the [min, max] window.
 */
export function validateAmountCents(value: unknown): AmountValidation {
  const cents = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(cents) || !Number.isInteger(cents)) {
    return { ok: false, error: "Enter a valid donation amount." };
  }
  if (cents < MIN_DONATION_CENTS) {
    return { ok: false, error: "Minimum donation is $1." };
  }
  if (cents > MAX_DONATION_CENTS) {
    return { ok: false, error: "Maximum donation is $50,000." };
  }
  return { ok: true, amountCents: cents };
}

/**
 * Convert a user-entered dollar string (e.g. "25", "25.50") into integer cents.
 * Returns null when the input is not a clean, positive money value.
 */
export function dollarsToCents(input: string): number | null {
  const trimmed = input.trim();
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return null;
  const cents = Math.round(Number.parseFloat(trimmed) * 100);
  return Number.isFinite(cents) ? cents : null;
}

/** Lightweight email shape check for receipt collection (server still trusts Stripe). */
export function isValidDonationEmail(email: string): boolean {
  const trimmed = email.trim();
  if (trimmed.length === 0 || trimmed.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}
