"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

function clearHomeHeroVars() {
  const root = document.documentElement;
  root.style.removeProperty("--hero-photo-anchor-y");
  root.style.removeProperty("--hero-scroll-progress");
}

/** Keeps hero image & header photo slice aligned via `--hero-photo-anchor-y` (home only). */
export default function HeroPhotoSync() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  useLayoutEffect(() => {
    if (!isHome) {
      clearHomeHeroVars();
      return;
    }

    const run = () => {
      const hero = document.getElementById("home-hero");
      const h = hero?.offsetHeight ?? 1;
      const p = Math.min(Math.max(window.scrollY / (h * 0.92), 0), 1);
      const anchorY = 26 + p * 22;
      document.documentElement.style.setProperty(
        "--hero-photo-anchor-y",
        `${anchorY}%`
      );
      document.documentElement.style.setProperty(
        "--hero-scroll-progress",
        String(p)
      );
    };

    run();

    window.addEventListener("scroll", run, { passive: true });
    window.addEventListener("resize", run, { passive: true });
    const onPageShow = () => run();
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.removeEventListener("scroll", run);
      window.removeEventListener("resize", run);
      window.removeEventListener("pageshow", onPageShow);
      clearHomeHeroVars();
    };
  }, [isHome]);

  return null;
}
