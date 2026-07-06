"use client";

import Image from "next/image";
import Link from "next/link";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useEffect, useId, useState } from "react";
import NewsletterSignup from "@/components/NewsletterSignup";
import BrandName, { renderBrand } from "@/components/BrandName";
import QuiltDivider from "@/components/QuiltDivider";
import { siteImages } from "@/lib/site-visuals";

const HOME_VALUE_TABS = [
  {
    id: "build-community",
    title: "Build Community",
    summary:
      "You shouldn't have to build everything from scratch every election. We keep the shared tools and hard-won know-how in one place, so the next campaign picks up where the last one left off — and the people who show up cycle after cycle finally get some backup. We're here to support the folks already doing the work, not to replace them.",
    features: [
      "Tools and know-how that don't get tossed when the campaign ends",
      "Built around how organizing actually runs — election season and the long stretch between",
      "We back up local partners. We don't take over.",
    ],
    cta: { href: "/about/partners", label: "Partner with TX*SPARK" },
  },
  {
    id: "take-action",
    title: "Take Action",
    summary:
      "Not sure where to start? Our toolkits walk you through it — meeting your neighbors, signing up volunteers, getting people to the polls — one clear step at a time, minus the jargon. You don't need a political science degree to understand your own district.",
    features: [
      "A clear first step, whether it's your first door or your thousandth",
      "Guided toolkits that follow the real rhythm of an election year",
      "Plain-language guides that turn data into something you can actually use",
    ],
    cta: { href: "/toolkits", label: "Explore Free Tools" },
  },
  {
    id: "track-movements",
    title: "Track Movements",
    summary:
      "Keeping tabs on the bills that hit your community shouldn't mean living inside a government website. We put the legislation in plain English, show you what's actually moving, and keep it current — so what you hear at the Capitol and what you see on the ground don't drift apart. Public information should actually be public.",
    features: [
      "Plain-language summaries of the bills that affect your community, updated daily",
      "See what's really moving — no inside baseball required",
      "Legislative data kept current enough to trust when you're knocking doors",
    ],
    cta: { href: "/toolkits", label: "Explore Toolkits" },
    secondaryCta: { href: "/about/data", label: "How we keep the data honest" },
  },
] as const;

function TabIconBubble() {
  return (
    <span
      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-spark-green)_42%,transparent)] shadow-[inset_0_0_0_2px_color-mix(in_srgb,var(--color-spark-green)_70%,transparent),0_0_0_1px_color-mix(in_srgb,var(--color-spark-green)_25%,transparent)] sm:size-9 md:size-10"
      aria-hidden
    >
      <Image
        src={siteImages.brand.sparkLogo}
        alt=""
        width={22}
        height={22}
        sizes="28px"
        className="size-[1.1rem] object-contain sm:size-5 md:size-[1.35rem]"
      />
    </span>
  );
}

function HomeValueTabs() {
  const baseId = useId();
  const [active, setActive] = useState(0);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div
        role="tablist"
        aria-label="What TX*SPARK offers"
        className="flex flex-row gap-2 md:gap-3 md:items-stretch"
      >
        {HOME_VALUE_TABS.map((tab, index) => {
          const selected = index === active;
          const tabId = `${baseId}-tab-${tab.id}`;
          const panelId = `${baseId}-panel-${tab.id}`;
          return (
            <button
              key={tab.id}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(e: ReactKeyboardEvent<HTMLButtonElement>) => {
                const k = e.key;
                if (
                  k !== "ArrowRight" &&
                  k !== "ArrowLeft" &&
                  k !== "ArrowDown" &&
                  k !== "ArrowUp"
                ) {
                  return;
                }
                e.preventDefault();
                const len = HOME_VALUE_TABS.length;
                const delta =
                  k === "ArrowRight" || k === "ArrowDown" ? 1 : -1;
                const next = (index + delta + len) % len;
                setActive(next);
                requestAnimationFrame(() => {
                  document
                    .getElementById(`${baseId}-tab-${HOME_VALUE_TABS[next].id}`)
                    ?.focus();
                });
              }}
              className={[
                "flex min-h-[3.25rem] min-w-0 items-center gap-2.5 rounded-2xl border py-2.5 text-left transition-[background-color,border-color,box-shadow] duration-200 sm:gap-3 sm:py-3",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spark-green",
                selected
                  ? "min-w-0 flex-1 border-[color-mix(in_srgb,var(--color-spark-green)_55%,transparent)] bg-[color-mix(in_srgb,var(--color-spark-green)_14%,var(--color-spark-bone))] px-3 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-spark-green)_35%,transparent)] sm:px-4 md:flex-1"
                  : "shrink-0 justify-center border-[color-mix(in_srgb,var(--color-spark-brass)_40%,transparent)] bg-[color-mix(in_srgb,var(--color-spark-brass)_10%,var(--color-spark-bone))] px-2.5 hover:border-[color-mix(in_srgb,var(--color-spark-green)_38%,transparent)] md:flex-1 md:justify-start md:px-4",
              ].join(" ")}
            >
              <TabIconBubble />
              <span
                className={[
                  "body-md min-w-0 font-semibold leading-snug text-spark-ink sm:text-[1.05rem]",
                  selected
                    ? "flex-1"
                    : "max-md:sr-only md:flex-1 md:min-w-0",
                ].join(" ")}
              >
                {tab.title}
              </span>
            </button>
          );
        })}
      </div>

      {HOME_VALUE_TABS.map((tab, index) => {
        const panelId = `${baseId}-panel-${tab.id}`;
        const tabId = `${baseId}-tab-${tab.id}`;
        const selected = index === active;
        return (
          <div
            key={tab.id}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            hidden={!selected}
            className="mt-4 md:mt-5"
          >
            {selected ? (
              <article className="flex flex-col rounded-3xl spark-panel spark-carousel-slide-outline p-5 sm:p-7">
                <div className="min-w-0 flex-1">
                  <h2 className="heading-lg mb-4 text-balance">{tab.title}</h2>
                  <p className="body-md mb-5 text-pretty">{tab.summary}</p>
                  <h3 className="heading-md mb-3 text-spark-green">
                    Highlights
                  </h3>
                  <ul className="body-md list-disc space-y-2 pl-5 sm:pl-6">
                    {tab.features.map((item, featureIndex) => (
                      <li key={featureIndex}>{item}</li>
                    ))}
                  </ul>
                  <div
                    className={[
                      "mt-6 flex flex-col gap-3 sm:mt-8",
                      "secondaryCta" in tab && tab.secondaryCta
                        ? ""
                        : "sm:flex-row sm:flex-wrap sm:items-center sm:gap-4",
                    ].join(" ")}
                  >
                    <Link href={tab.cta.href} className="btn-primary w-fit">
                      {renderBrand(tab.cta.label)}
                    </Link>
                    {"secondaryCta" in tab && tab.secondaryCta ? (
                      <Link
                        href={tab.secondaryCta.href}
                        className="btn-secondary w-fit"
                      >
                        {tab.secondaryCta.label}
                      </Link>
                    ) : null}
                  </div>
                </div>
              </article>
            ) : null}
          </div>
        );
      })}
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
      <section className="mt-10 scroll-reveal sm:mt-12" data-reveal>
        <HomeValueTabs />
      </section>

      <QuiltDivider className="mt-16" />

      <section className="mt-12 scroll-reveal" data-reveal>
        <h2 className="heading-lg mb-3 text-center">Stay in the loop</h2>
        <p className="body-md mx-auto max-w-4xl text-left">
          Every so often, <BrandName /> will drop you an email: new toolkits, legislation worth watching, and real ways to show up where you live. No clutter, no consultant-speak — just the people keeping the lights on after everyone else heads home. Unsubscribe anytime.
        </p>
        <NewsletterSignup
          variant="panel"
          className="mt-6 max-w-4xl"
          signupSource="home"
          description="Toolkit releases, bill-tracking updates, and event news as they happen. Plain language, no consultant-speak."
        />
      </section>
    </div>
  );
}
