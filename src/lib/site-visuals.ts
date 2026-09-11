/**
 * Single source of truth for `/public` image paths used from TypeScript.
 * CSS `url(...)` must stay in sync where noted in `globals.css`.
 */
export const siteImages = {
  brand: {
    sparkLogo: "/images/brand/sparkv1.png",
    /** Dark-theme wordmark: stencil/cutout letterforms. CSS mirrors this in `--wordmark-image`. */
    wordmark: "/images/brand/wordmark2-g.png",
    /** Light-theme wordmark: stencil filled with spark-star, outlined with spark-void. */
    wordmarkLight: "/images/brand/sparkwordfilledv1.png",
    /** Standalone gold spark mark (hand-drawn). Available for spark placements. */
    sparkStar: "/images/brand/spark-left.png",
  },
  content: {
    /** Hero asset — do not change loading behavior in `HomeHero.tsx` without an explicit pass. */
    heroBackground: "/images/content/hero-background.jpg",
    /** Light-theme hero: sunlit daytime sky (the night sky reads poorly on a light page). */
    heroBackgroundLight: "/images/content/pexels-enginakyurt-7085605.jpg",
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

/** Light-theme counterpart to {@link HERO_BACKGROUND} — used by `HomeHero` only. */
export const HERO_BACKGROUND_LIGHT = siteImages.content.heroBackgroundLight;
