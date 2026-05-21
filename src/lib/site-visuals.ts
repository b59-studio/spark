/**
 * Single source of truth for `/public` image paths used from TypeScript.
 * CSS `url(...)` must stay in sync where noted in `globals.css`.
 */
export const siteImages = {
  brand: {
    sparkLogo: "/images/brand/sparkv1.png",
    wordmark: "/images/brand/wordmark2-g.png",
  },
  content: {
    /** Hero asset — do not change loading behavior in `HomeHero.tsx` without an explicit pass. */
    heroBackground: "/images/content/hero-background.jpg",
    electionPrecinctMap: "/images/content/Election_Precinct_305.pdf.png",
    francescaTeaching: "/images/content/francescateaching.jpg",
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
