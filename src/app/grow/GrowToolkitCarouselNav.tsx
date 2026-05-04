"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useLayoutEffect, useRef } from "react";
import { growToolkits, growToolkitCoverPaths } from "./toolkits";

type GrowToolkitCarouselNavProps = {
  currentSlug: string;
};

/** Scroll only the nav strip (never the page): align item center with scroller center. */
function scrollNavItemToCenter(
  scroller: HTMLDivElement,
  item: HTMLElement,
  behavior: ScrollBehavior,
) {
  const scRect = scroller.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();
  const itemCenter = itemRect.left + itemRect.width * 0.5;
  const scrollerCenter = scRect.left + scRect.width * 0.5;
  const delta = itemCenter - scrollerCenter;
  const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
  const nextLeft = Math.min(
    maxScroll,
    Math.max(0, scroller.scrollLeft + delta),
  );
  scroller.scrollTo({ left: nextLeft, behavior });
}

function CarouselChevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      className="text-spark-bone/85"
      aria-hidden
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d={direction === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
      />
    </svg>
  );
}

export default function GrowToolkitCarouselNav({
  currentSlug,
}: GrowToolkitCarouselNavProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useLayoutEffect(() => {
    const index = growToolkits.findIndex((t) => t.slug === currentSlug);
    const item = itemRefs.current[index];
    const scroller = scrollerRef.current;
    if (!item || !scroller) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    scrollNavItemToCenter(scroller, item, prefersReduced ? "auto" : "smooth");
  }, [currentSlug]);

  const scrollByDir = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delta = Math.max(160, Math.floor(el.clientWidth * 0.45)) * dir;
    el.scrollBy({
      left: delta,
      behavior: reduced ? "auto" : "smooth",
    });
  }, []);

  return (
    <nav className="mb-6 w-full" aria-label="Browse GROW toolkits">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-10 items-center justify-start sm:w-11">
          <button
            type="button"
            onClick={() => scrollByDir(-1)}
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full spark-carousel-nav-btn focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spark-gold"
            aria-label="Scroll toolkits left"
          >
            <CarouselChevron direction="left" />
          </button>
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 flex w-10 items-center justify-end sm:w-11"
        >
          <button
            type="button"
            onClick={() => scrollByDir(1)}
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full spark-carousel-nav-btn focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spark-gold"
            aria-label="Scroll toolkits right"
          >
            <CarouselChevron direction="right" />
          </button>
        </div>

        <div
          ref={scrollerRef}
          className={[
            "flex items-center gap-0 overflow-x-auto scroll-smooth pb-2 pt-1",
            "snap-x snap-mandatory pl-11 pr-11 sm:pl-12 sm:pr-12",
            "[scrollbar-width:thin]",
          ].join(" ")}
        >
          {/*
            Half-viewport spacers so scrollIntoView(inline: "center") can run on
            first/last items without hitting scrollLeft min/max clamp.
          */}
          <div
            className="pointer-events-none shrink-0 basis-[max(0px,calc(50%-min(26vw,7.25rem)))] sm:basis-[max(0px,calc(50%-8.25rem))]"
            aria-hidden
          />
          {growToolkits.map((toolkit, index) => {
            const isCurrent = toolkit.slug === currentSlug;
            const coverPath = growToolkitCoverPaths[index]!;
            const isLast = index === growToolkits.length - 1;

            return (
              <div key={toolkit.slug} className="flex shrink-0 items-center">
                <Link
                  href={`/grow/${toolkit.slug}`}
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  aria-current={isCurrent ? "page" : undefined}
                  className={[
                    "group relative flex snap-center flex-col items-center transition-[transform,opacity,width] duration-200",
                    "opacity-80 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spark-gold",
                    isCurrent
                      ? "w-[min(52vw,14.5rem)] opacity-100 sm:w-[16.5rem]"
                      : "w-[min(30vw,8.25rem)] sm:w-[9.25rem]",
                  ].join(" ")}
                >
                  <span className="relative aspect-square w-full overflow-hidden rounded-xl">
                    <Image
                      src={encodeURI(coverPath)}
                      alt={`${toolkit.shortLabel}: ${toolkit.fullTitle}`}
                      width={400}
                      height={400}
                      className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                      sizes={
                        isCurrent
                          ? "(max-width: 640px) 52vw, 16.5rem"
                          : "(max-width: 640px) 30vw, 9.25rem"
                      }
                      priority={isCurrent}
                    />
                  </span>
                  <span className="sr-only">
                    {toolkit.fullTitle}
                    {isCurrent ? " (current page)" : ""}
                  </span>
                </Link>

                {!isLast ? (
                  <div
                    className="flex h-24 shrink-0 flex-col items-center justify-center px-1 sm:h-28 sm:px-1.5"
                    aria-hidden
                  >
                    <div className="flex items-center">
                      <span className="h-px w-2.5 rounded-full bg-spark-bone/18 sm:w-3.5" />
                      <span className="mx-0.5 size-1.5 shrink-0 rounded-full border border-spark-gold/50 bg-gradient-to-b from-spark-bone to-spark-gold/25 shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-spark-bg)_40%,transparent)] sm:size-2" />
                      <span className="h-px w-2.5 rounded-full bg-spark-bone/18 sm:w-3.5" />
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
          <div
            className="pointer-events-none shrink-0 basis-[max(0px,calc(50%-min(26vw,7.25rem)))] sm:basis-[max(0px,calc(50%-8.25rem))]"
            aria-hidden
          />
        </div>
      </div>
    </nav>
  );
}
