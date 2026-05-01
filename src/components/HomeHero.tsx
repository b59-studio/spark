"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { ENCHANTED_ROCK_HERO } from "@/lib/site-visuals";

function scrollTimelineSupported() {
  try {
    return (
      typeof CSS !== "undefined" &&
      Boolean(CSS.supports?.("animation-timeline", "scroll()"))
    );
  } catch {
    return false;
  }
}

export default function HomeHero({ children }: { children?: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = sectionRef.current;
    if (!hero) return;

    const wrap = hero.querySelector<HTMLElement>(".home-hero-media-wrap");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion || !wrap || scrollTimelineSupported()) return;

    const tick = () => {
      const scrollY = window.scrollY;
      const h = hero.offsetHeight || 1;
      const travel = Math.min(scrollY / (h * 1.05), 1);
      const lift = scrollY * -0.2;
      const scale = 1 + travel * 0.05;
      wrap.style.transform = `translate3d(0, ${lift}px, 0) scale(${scale})`;
    };

    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick, { passive: true });
    tick();
    return () => {
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home-hero"
      className="relative z-0 flex min-h-[min(72vh,860px)] w-full flex-col overflow-hidden shadow-[inset_0_-1px_0_color-mix(in_srgb,var(--color-spark-sage)_35%,transparent)]"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Oversized box so scroll-driven translate doesn’t reveal edges */}
        <div className="home-hero-media-wrap absolute inset-[-12%]">
          <Image
            src={ENCHANTED_ROCK_HERO}
            alt="Enchanted Rock — Texas hill country granite dome under open sky"
            fill
            priority
            sizes="100vw"
            className="home-hero-parallax h-full w-full object-cover will-change-transform"
          />
        </div>
      </div>
      {/* Fade into page sand tone */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%]"
        style={{
          background:
            "linear-gradient(to top, var(--color-spark-background), transparent)",
        }}
      />

      {children ? (
        <div className="relative z-10 mt-auto flex justify-center px-4 pb-10 pt-28 sm:pb-12 sm:pt-36 lg:justify-start lg:px-8">
          {children}
        </div>
      ) : null}
    </section>
  );
}
