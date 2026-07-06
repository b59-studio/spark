/**
 * Single source of truth for `/public` image paths used from TypeScript.
 * CSS `url(...)` must stay in sync where noted in `globals.css`.
 */
export const siteImages = {
  brand: {
    /** Carpenter's-wheel spark mark (green + weathered brass). Used for small logo/OG placements. */
    sparkLogo: "/images/brand/spark-solo.svg",
    /** Full horizontal wordmark (TEXAS ✦ SPARK). CSS mirrors this in `--wordmark-image`. */
    wordmark: "/images/brand/wm-full-v3.png",
    /** Standalone spark mark — the ✦ that must appear on every screen. */
    sparkStar: "/images/brand/spark-solo.svg",
    /** Social/OG card — quilt-scatter wordmark on the warm-bone background, 1200×630. */
    ogCard: "/images/brand/og-card.png",
  },
  content: {
    /** Hero asset — sunlit daytime sky. Do not change loading behavior in `HomeHero.tsx` without an explicit pass. */
    heroBackground: "/images/content/pexels-enginakyurt-7085605.jpg",
  },
  /** Order matches `growToolkits` in `src/data/grow-toolkits.ts`. */
  growToolkitCovers: [
    "/images/toolkits/1-trans2.png",
    "/images/toolkits/2-trans2.png",
    "/images/toolkits/3-trans2.png",
    "/images/toolkits/4-trans2.png",
    "/images/toolkits/5-trans2.png",
    "/images/toolkits/6-trans2.png",
  ] as const,
} as const;

/** Same file as `siteImages.content.heroBackground` — used by `HomeHero` only. */
export const HERO_BACKGROUND = siteImages.content.heroBackground;
