import { Fragment, type ReactNode } from "react";

const BRAND = "TX*SPARK";

/**
 * The TX*SPARK wordmark as it appears in running copy — always bold and never
 * broken across lines. Stylistic bold only (a span, not <strong>), so it does
 * not pick up the light-theme emphasis color and stays the surrounding text
 * color. Centralizes the brand string so body copy has one source of truth.
 */
export default function BrandName() {
  return <span className="brand-name">{BRAND}</span>;
}

/**
 * Bold every TX*SPARK inside a plain string — for copy that lives in a data
 * array or other variable, where an inline <BrandName /> isn't an option.
 * Strings without the brand pass through unchanged.
 */
export function renderBrand(text: string): ReactNode {
  const parts = text.split(BRAND);
  if (parts.length === 1) return text;
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 ? <BrandName /> : null}
    </Fragment>
  ));
}
