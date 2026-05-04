"use client";

import Link from "next/link";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  TransitionEvent as ReactTransitionEvent,
} from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import NewsletterSignup from "@/components/NewsletterSignup";

const CAROUSEL_GAP_PX = 16;
const CAROUSEL_SLIDE_FRACTION = 0.85;
const CAROUSEL_AUTO_MS = 10_000;
/** Infinite track: clone last, four reals (value, coalition, p1, p2), clone first */
const CAROUSEL_TRACK = [3, 0, 1, 2, 3, 0] as const;
const CAROUSEL_LAST_INDEX = CAROUSEL_TRACK.length - 1;

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

function HomeValueCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [virtualIndex, setVirtualIndex] = useState(1);
  const [instant, setInstant] = useState(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const virtualIndexRef = useRef(1);
  const pointerRef = useRef<{ x: number; active: boolean }>({
    x: 0,
    active: false,
  });

  useEffect(() => {
    virtualIndexRef.current = virtualIndex;
  }, [virtualIndex]);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setViewportWidth(el.clientWidth);
    });
    ro.observe(el);
    setViewportWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const slideW =
    viewportWidth > 0 ? Math.round(viewportWidth * CAROUSEL_SLIDE_FRACTION) : 0;
  const step = slideW + CAROUSEL_GAP_PX;
  const translateX =
    viewportWidth > 0
      ? viewportWidth / 2 - (virtualIndex * step + slideW / 2)
      : 0;

  const clearAuto = useCallback(() => {
    if (autoRef.current) {
      clearInterval(autoRef.current);
      autoRef.current = null;
    }
  }, []);

  const scheduleAuto = useCallback(() => {
    clearAuto();
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    autoRef.current = setInterval(() => {
      setVirtualIndex((i) => {
        if (i === CAROUSEL_LAST_INDEX - 1) return CAROUSEL_LAST_INDEX;
        return Math.min(i + 1, CAROUSEL_LAST_INDEX);
      });
    }, CAROUSEL_AUTO_MS);
  }, [clearAuto]);

  useEffect(() => {
    scheduleAuto();
    return () => {
      clearAuto();
    };
  }, [scheduleAuto, clearAuto]);

  const goNext = useCallback(() => {
    scheduleAuto();
    setVirtualIndex((i) => {
      if (i === CAROUSEL_LAST_INDEX - 1) return CAROUSEL_LAST_INDEX;
      return Math.min(i + 1, CAROUSEL_LAST_INDEX);
    });
  }, [scheduleAuto]);

  const goPrev = useCallback(() => {
    scheduleAuto();
    setVirtualIndex((i) => {
      if (i === 1) return 0;
      return Math.max(i - 1, 0);
    });
  }, [scheduleAuto]);

  const onTransitionEnd = useCallback((e: ReactTransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== "transform") return;
    const vi = virtualIndexRef.current;
    if (vi === CAROUSEL_LAST_INDEX) {
      setInstant(true);
      setVirtualIndex(1);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setInstant(false));
      });
    } else if (vi === 0) {
      setInstant(true);
      setVirtualIndex(CAROUSEL_LAST_INDEX - 1);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setInstant(false));
      });
    }
  }, []);

  const onKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    },
    [goNext, goPrev],
  );

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    pointerRef.current = { x: e.clientX, active: true };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerUp = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!pointerRef.current.active) return;
      pointerRef.current.active = false;
      const dx = e.clientX - pointerRef.current.x;
      const threshold = 48;
      if (dx > threshold) goPrev();
      else if (dx < -threshold) goNext();
    },
    [goNext, goPrev],
  );

  const slideArticleClass =
    "flex h-full min-h-0 flex-col rounded-3xl spark-panel spark-carousel-slide-outline p-6 sm:p-7";
  const slideFooterClass = "mt-auto pt-6";

  const physicalSlide = (
    slot: "value" | "coalition" | "p1" | "p2",
  ) => (
    <>
      {slot === "value" && (
        <article className={slideArticleClass}>
          <h2 className="heading-md mb-4">Value for people taking action</h2>
          <ul className="body-md list-disc pl-6 space-y-2">
            <li>Know where to start, even if you are new to organizing.</li>
            <li>Use guided toolkits to build relationships, recruit volunteers, and move neighbors to action.</li>
            <li>Access plain-language civic resources that reduce overwhelm and speed up impact.</li>
          </ul>
          <div className={slideFooterClass}>
            <Link href="/solutions" className="btn-primary">
              Explore Free Tools
            </Link>
          </div>
        </article>
      )}
      {slot === "coalition" && (
        <article className={slideArticleClass}>
          <h2 className="heading-md mb-4">Building coalition through partnerships</h2>
          <ul className="body-md list-disc pl-6 space-y-2">
            <li>Expand organizing capacity with shared infrastructure and customizable tools.</li>
            <li>Coordinate faster with resources built around campaign and legislative rhythms.</li>
            <li>Strengthen long-term local leadership through a community-led, support-first model.</li>
          </ul>
          <div className={slideFooterClass}>
            <Link href="/about/partners" className="btn-primary">
              Partner with TX*Spark
            </Link>
          </div>
        </article>
      )}
      {slot === "p1" && (
        <article className={slideArticleClass}>
          <h2 className="heading-md mb-4">Legislature online, made usable</h2>
          <p className="body-md">
            If you live in bills and hearings, PAL connects People&apos;s Advocacy Lobby tools to Texas Legislature Online (TLO)—plain-language summaries and tracking so you can spot movement, compare versions, and coordinate faster than digging through raw portals alone.
          </p>
          <div className={slideFooterClass}>
            <Link href="/pal" className="btn-primary">
              Explore PAL
            </Link>
          </div>
        </article>
      )}
      {slot === "p2" && (
        <article className={slideArticleClass}>
          <h2 className="heading-md mb-4">Data quality you can act on</h2>
          <p className="body-md">
            We run clean, regularly updated data pipelines so what you see on TX*Spark reflects the Capitol and the field as they are today—not last week&apos;s export. That means you can trust your next move and know you&apos;re making the right impact immediately.
          </p>
          <div className={slideFooterClass}>
            <Link href="/about/data" className="btn-primary">
              How we keep data reliable
            </Link>
          </div>
        </article>
      )}
    </>
  );

  return (
    <div
      className="relative w-full rounded-3xl outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spark-gold"
      tabIndex={0}
      onKeyDown={onKeyDown}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured sections"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-10 items-center justify-start sm:w-11">
        <button
          type="button"
          onClick={goPrev}
          className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full spark-carousel-nav-btn focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spark-gold"
          aria-label="Previous section"
        >
          <CarouselChevron direction="left" />
        </button>
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex w-10 items-center justify-end sm:w-11">
        <button
          type="button"
          onClick={goNext}
          className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full spark-carousel-nav-btn focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spark-gold"
          aria-label="Next section"
        >
          <CarouselChevron direction="right" />
        </button>
      </div>

      <div
        ref={viewportRef}
        className="overflow-hidden pb-2 pt-1"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          pointerRef.current.active = false;
        }}
      >
        <div
          className={
            instant
              ? "flex items-stretch gap-4"
              : "flex items-stretch gap-4 transition-transform duration-300 ease-out motion-reduce:transition-none"
          }
          style={{
            transform: `translateX(${translateX}px)`,
            transition: instant ? "none" : undefined,
            willChange: "transform",
          }}
          onTransitionEnd={onTransitionEnd}
        >
          {CAROUSEL_TRACK.map((slideKind, i) => (
            <div
              key={`${slideKind}-${i}`}
              className="box-border flex min-h-0 shrink-0 flex-col rounded-3xl"
              style={{
                width: slideW > 0 ? slideW : undefined,
                flexBasis: slideW > 0 ? slideW : "85%",
                maxWidth: "100%",
              }}
            >
              <div className="flex min-h-0 flex-1 flex-col">
                {slideKind === 0 && physicalSlide("value")}
                {slideKind === 1 && physicalSlide("coalition")}
                {slideKind === 2 && physicalSlide("p1")}
                {slideKind === 3 && physicalSlide("p2")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const revealSelector = "[data-reveal]";

export default function HomeContent() {
  useEffect(() => {
    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>(revealSelector)
    );

    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.12,
      }
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="spark-page-home">
      <section
        className="rounded-3xl p-8 sm:p-12 scroll-reveal"
        data-reveal
      >
        <div className="max-w-4xl mx-auto text-center lg:text-left">
          <p className="body-md max-w-4xl mx-auto">
            People already have the motivation to act. What they need is trusted structure. TX*Spark turns civic energy into durable local power by giving communities the tools, strategy, and support to organize together all year.
          </p>

          <p className="body-md max-w-4xl mx-auto mt-6">
            TX*Spark gives organizers, volunteers, and coalition partners free, practical tools to move from civic frustration to coordinated action. From precinct organizing to bill tracking, we help Texans organize with clarity, consistency, and confidence.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <Link href="/solutions" className="btn-primary">
              Get Started
            </Link>
            <Link href="/about" className="btn-secondary">
              Our Process
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-14 scroll-reveal pl-11 pr-11 sm:pl-12 sm:pr-12" data-reveal>
        <HomeValueCarousel />
      </section>

      <section className="mt-14 scroll-reveal" data-reveal>
        <h2 className="heading-lg mb-3 text-center">Stay in the loop</h2>
        <p className="body-md mx-auto max-w-4xl text-left">
          Subscribe for occasional emails from TX*Spark—new Grow resources, advocacy signals worth watching, and ways to show up locally. No clutter; unsubscribe anytime.
        </p>
        <NewsletterSignup
          variant="panel"
          className="mt-6 max-w-4xl"
          description="We’ll send toolkit releases, PAL tracker updates, and event news as they go live."
        />
      </section>
    </div>
  );
}
