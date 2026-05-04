"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef } from "react";
import { growToolkits, growToolkitCoverPaths } from "./toolkits";

/** Scroll the carousel only (never the page): align slide center with scroller visible center. */
function scrollCarouselToSlide(
  scroller: HTMLDivElement,
  slide: HTMLDivElement,
  behavior: ScrollBehavior,
) {
  const scRect = scroller.getBoundingClientRect();
  const slideRect = slide.getBoundingClientRect();
  const slideCenter = slideRect.left + slideRect.width * 0.5;
  const scrollerCenter = scRect.left + scRect.width * 0.5;
  const delta = slideCenter - scrollerCenter;
  const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
  const nextLeft = Math.min(
    maxScroll,
    Math.max(0, scroller.scrollLeft + delta),
  );
  scroller.scrollTo({ left: nextLeft, behavior });
}

/** Viewport center in scroll coordinates; used to pick the current slide. */
function nearestSlideIndex(
  scroller: HTMLDivElement,
  slides: (HTMLDivElement | null)[],
): number {
  const anchor = scroller.scrollLeft + scroller.clientWidth * 0.5;
  const scRect = scroller.getBoundingClientRect();
  let best = 0;
  let bestDist = Infinity;
  slides.forEach((slide, i) => {
    if (!slide) return;
    const left =
      slide.getBoundingClientRect().left -
      scRect.left +
      scroller.scrollLeft;
    const mid = left + slide.offsetWidth * 0.5;
    const d = Math.abs(mid - anchor);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  });
  return best;
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

export default function GrowIndexToolkitCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  /** Discrete: adjacent toolkit, centered in the carousel (no window scroll). */
  const goToAdjacentSlide = useCallback((dir: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const slides = slideRefs.current;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const i = nearestSlideIndex(scroller, slides);
    const next = Math.min(Math.max(0, i + dir), slides.length - 1);
    const target = slides[next];
    if (!target) return;
    scrollCarouselToSlide(scroller, target, reduced ? "auto" : "smooth");
  }, []);

  const n = growToolkits.length;

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-10 items-center justify-start sm:w-11">
        <button
          type="button"
          onClick={() => goToAdjacentSlide(-1)}
          className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full spark-carousel-nav-btn focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spark-gold"
          aria-label="Previous toolkit"
        >
          <CarouselChevron direction="left" />
        </button>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex w-10 items-center justify-end sm:w-11">
        <button
          type="button"
          onClick={() => goToAdjacentSlide(1)}
          className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full spark-carousel-nav-btn focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spark-gold"
          aria-label="Next toolkit"
        >
          <CarouselChevron direction="right" />
        </button>
      </div>

      <div
        ref={scrollerRef}
        className={[
          "flex items-stretch gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth pb-2 pt-1 sm:gap-4",
          "snap-x snap-mandatory pl-11 pr-11 sm:pl-12 sm:pr-12",
          "scroll-pl-11 scroll-pr-11 sm:scroll-pl-12 sm:scroll-pr-12",
          "[scrollbar-width:thin]",
        ].join(" ")}
        role="region"
        aria-label="GROW toolkits overview"
      >
        {growToolkits.map((toolkit, index) => {
          const stepLabel = `Step ${index + 1} of ${n}`;

          return (
            <div
              key={toolkit.slug}
              ref={(node) => {
                slideRefs.current[index] = node;
              }}
              className="box-border flex min-h-0 min-w-0 shrink-0 snap-center snap-always flex-[0_0_88%] items-stretch justify-center sm:flex-[0_0_86%]"
            >
              <article
                className="grow-timeline-card flex h-full min-h-0 w-full max-w-xl flex-col"
                aria-labelledby={`grow-index-toolkit-${toolkit.slug}-title`}
              >
                <span className="sr-only">{stepLabel}</span>
                <Link
                  href={`/grow/${toolkit.slug}`}
                  className="grow-toolkit-icon-slot mb-4 flex shrink-0 items-center justify-center overflow-hidden rounded-lg px-4 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spark-gold"
                  aria-label={`Open ${toolkit.fullTitle} toolkit`}
                >
                  <Image
                    src={encodeURI(growToolkitCoverPaths[index]!)}
                    alt=""
                    width={500}
                    height={500}
                    className="h-44 w-44 object-contain sm:h-48 sm:w-48"
                    sizes="(max-width: 640px) 176px, 192px"
                    priority={index === 0}
                  />
                </Link>
                <div className="spark-panel spark-carousel-slide-outline flex min-h-0 flex-1 flex-col rounded-2xl p-6 sm:p-7">
                  <h2
                    id={`grow-index-toolkit-${toolkit.slug}-title`}
                    className="grow-toolkit-title heading-md mb-3 flex flex-wrap items-center gap-3"
                  >
                    <span className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center rounded-full border-2 border-spark-gold/50 bg-spark-purple/25 px-3 text-2xl font-semibold leading-none text-spark-bone">
                      {index + 1}
                    </span>
                    <span>{toolkit.fullTitle}</span>
                  </h2>
                  <p className="body-md mb-0">{toolkit.summary}</p>
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </div>
  );
}
