"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { HERO_BACKGROUND } from "@/lib/site-visuals";

export default function HomeHero({ children }: { children?: ReactNode }) {
  return (
    <section
      id="home-hero"
      className="relative z-0 flex min-h-[min(72vh,860px)] w-full flex-col shadow-[inset_0_-1px_0_color-mix(in_srgb,var(--color-spark-purple)_35%,transparent)]"
    >
      {/* Bleed up behind fixed header (top-4 + bar) so the same field shows in the nav strip + hero */}
      <div className="pointer-events-none absolute -top-[5.75rem] left-0 right-0 bottom-0 overflow-hidden">
        {/* Oversized box so object-position / cover don’t show hard edges at the sides */}
        <div className="home-hero-media-wrap absolute inset-[-12%]">
          <Image
            src={HERO_BACKGROUND}
            alt="Milky Way and stars across a dark night sky"
            fill
            priority
            sizes="100vw"
            className="home-hero-parallax h-full w-full object-cover"
          />
        </div>
      </div>
      {/* Fade into page sand tone */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%]"
        style={{
          background:
            "linear-gradient(to top, var(--color-spark-bg), transparent)",
        }}
      />

      {children ? (
        <div className="relative z-10 mt-auto flex w-full max-w-7xl mx-auto justify-center px-4 sm:px-6 lg:px-8 pb-10 pt-28 sm:pb-12 sm:pt-36 lg:justify-start">
          {children}
        </div>
      ) : null}
    </section>
  );
}
