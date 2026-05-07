"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
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

export default function GrowIndexToolkitCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const syncActiveFromScroll = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    setActiveIndex(nearestSlideIndex(scroller, slideRefs.current));
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    syncActiveFromScroll();

    const onScroll = () => {
      syncActiveFromScroll();
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => syncActiveFromScroll());
    ro.observe(scroller);

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [syncActiveFromScroll]);

  const goToSlide = useCallback((index: number) => {
    const scroller = scrollerRef.current;
    const slides = slideRefs.current;
    const target = slides[index];
    if (!scroller || !target) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scrollCarouselToSlide(scroller, target, reduced ? "auto" : "smooth");
  }, []);

  const n = growToolkits.length;

  return (
    <div className="min-w-0 max-w-full">
      <div
        ref={scrollerRef}
        className={[
          "flex min-w-0 items-stretch gap-3 overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth pb-1 pt-1 sm:gap-4",
          "snap-x snap-mandatory px-1 sm:px-0",
          "[scrollbar-width:thin]",
        ].join(" ")}
        role="region"
        aria-label="GROW toolkits overview"
      >
        {growToolkits.map((toolkit, index) => {
          const positionLabel = `Toolkit ${index + 1} of ${n}`;

          return (
            <div
              key={toolkit.slug}
              ref={(node) => {
                slideRefs.current[index] = node;
              }}
              className="box-border flex min-h-0 min-w-0 shrink-0 snap-center snap-always flex-[0_0_100%] items-stretch justify-center sm:flex-[0_0_88%] md:flex-[0_0_86%]"
            >
              <article
                className="grow-timeline-card flex h-full min-h-0 w-full max-w-xl flex-col"
                aria-labelledby={`grow-index-toolkit-${toolkit.slug}-title`}
              >
                <span className="sr-only">{positionLabel}</span>
                <Link
                  href={`/grow/${toolkit.slug}`}
                  className="grow-toolkit-icon-slot mb-4 flex shrink-0 items-center justify-center overflow-hidden rounded-lg px-4 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spark-gold"
                  aria-label={`Open ${toolkit.panelTitle} toolkit`}
                >
                  <Image
                    src={encodeURI(growToolkitCoverPaths[index]!)}
                    alt=""
                    width={500}
                    height={500}
                    className="h-40 w-40 object-contain sm:h-48 sm:w-48"
                    sizes="(max-width: 640px) 160px, 192px"
                    priority={index === 0}
                  />
                </Link>
                <div className="spark-panel spark-carousel-slide-outline flex min-h-0 flex-1 flex-col rounded-2xl p-6 sm:p-7">
                  <h2
                    id={`grow-index-toolkit-${toolkit.slug}-title`}
                    className="grow-toolkit-title heading-md mb-3"
                  >
                    {toolkit.panelTitle}
                  </h2>
                  <p className="body-md mb-0">{toolkit.summary}</p>
                </div>
              </article>
            </div>
          );
        })}
      </div>

      <div
        className="mt-4 flex flex-wrap items-center justify-center gap-2.5"
        role="group"
        aria-label="Choose a toolkit to scroll into view"
      >
        {growToolkits.map((toolkit, index) => {
          const selected = index === activeIndex;
          return (
            <button
              key={toolkit.slug}
              type="button"
              aria-current={selected ? "true" : undefined}
              onClick={() => goToSlide(index)}
              className={[
                "flex size-2.5 shrink-0 items-center justify-center rounded-full transition-[transform,background-color,box-shadow] duration-200",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spark-gold",
                selected
                  ? "scale-110 bg-spark-gold shadow-[0_0_0_2px_color-mix(in_srgb,var(--color-spark-bg)_55%,transparent)]"
                  : "bg-spark-bone/35 hover:bg-spark-bone/55",
              ].join(" ")}
            >
              <span className="sr-only">
                {toolkit.panelTitle}
                {selected ? " (current)" : ""}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
