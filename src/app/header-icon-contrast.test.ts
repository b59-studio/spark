import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Icon colour is non-text contrast (WCAG 1.4.11) and needs 3:1. axe cannot see
 * this: its `color-contrast` rule inspects text nodes, and an SVG stroke is not
 * one — a header full of unreadable icons passes an axe sweep cleanly. So the
 * ratio is pinned here, read off the tokens, rather than asserted in a comment.
 */

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

/** Pull a hex-valued custom property out of globals.css. */
function token(name: string): string {
  const match = css.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match) throw new Error(`token ${name} not found or not a plain hex`);
  return match[1];
}

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const n = Number.parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const ICON_MINIMUM = 3;

describe("header icon contrast", () => {
  // The icon accent resolves to the brand gold on the dark bar and to the
  // darker "space" value on the light frost — gold is too light on paper.
  const darkIcon = token("--color-spark-star");
  const darkGround = token("--color-spark-void");
  const lightIcon = token("--light-link");
  const lightGround = token("--light-spark-void");

  it("clears 3:1 on the dark bar", () => {
    expect(contrast(darkIcon, darkGround)).toBeGreaterThanOrEqual(ICON_MINIMUM);
  });

  it("clears 3:1 on the light bar", () => {
    expect(contrast(lightIcon, lightGround)).toBeGreaterThanOrEqual(ICON_MINIMUM);
  });

  it("would fail if the light bar used the raw gold accent", () => {
    // Guards the reason the icon accent is its own token: swapping it back to
    // the brand gold on paper is the regression this test exists to catch.
    expect(contrast(darkIcon, lightGround)).toBeLessThan(ICON_MINIMUM);
  });
});
