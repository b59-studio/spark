"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import BrandName, { renderBrand } from "@/components/BrandName";

const revealSelector = "[data-reveal]";

const ABOUT_PILLARS = [
  {
    id: "year-round",
    title: "Year-round",
    detail:
      "Continuity over chaos. TX*SPARK provides organizing support that outlasts individual campaign cycles, not just peak election windows. We preserve institutional knowledge and pass the torch without losing momentum.",
  },
  {
    id: "community-led",
    title: "Community-led",
    detail:
      "Built with partners and never instead of them. We co-design with local leadership, share ownership, and build systems that survive the people who built them.",
  },
  {
    id: "action-ready",
    title: "Action-ready",
    detail:
      "Data and tools people can actually use, right now. We translate analytics into plain language so organizers and campaign teams can move without gatekeeping or consultant-speak.",
  },
] as const;

const ABOUT_SECTIONS = [
  {
    title: "Mission",
    href: "/about/mission",
    summary:
      "Free, people-centered resources that help neighbors learn, practice, and lead democratic engagement and strengthen local coalitions without replacing them. We fill civic infrastructure gaps, not campaign stages.",
  },
  {
    title: "People",
    href: "/about/people",
    summary:
      "How we listen with partners, co-design tools for real contexts, keep work aligned with electoral and legislative calendars, and share ownership so leadership stays local. Systems survive the people who built them.",
  },
  {
    title: "Partners",
    href: "/about/partners",
    summary:
      "Trusted organizations and paths to connect: partner materials, events, and ways to build alongside communities across Texas. We supplement existing orgs. We don't compete with them.",
  },
  {
    title: "Data",
    href: "/about/data",
    summary:
      "How we keep information current and actionable through clean pipelines and regular updates so you can trust what you see when organizing and advocating. Public information should actually be public.",
  },
] as const;

function usePrefersHover() {
  const [prefersHover, setPrefersHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setPrefersHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return prefersHover;
}

function AboutPillarCards() {
  const baseId = useId();
  const prefersHover = usePrefersHover();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="relative mt-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {ABOUT_PILLARS.map((pillar) => {
          const isOpen = hoveredId === pillar.id || activeId === pillar.id;
          const panelId = `${baseId}-panel-${pillar.id}`;
          return (
            <div
              key={pillar.id}
              className={[
                "relative min-w-0",
                isOpen ? "z-40" : "z-0",
              ].join(" ")}
              onMouseEnter={() => {
                if (prefersHover) setHoveredId(pillar.id);
              }}
              onMouseLeave={() => {
                if (prefersHover) setHoveredId(null);
              }}
            >
              <button
                type="button"
                id={`${baseId}-trigger-${pillar.id}`}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() =>
                  setActiveId((prev) =>
                    prev === pillar.id ? null : pillar.id
                  )
                }
                className={[
                  "spark-panel relative w-full rounded-xl border p-4 text-left transition-[background-color,box-shadow,border-color] duration-200",
                  "border-[color-mix(in_srgb,var(--color-spark-sky)_42%,transparent)]",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spark-gold",
                  isOpen
                    ? "border-[color-mix(in_srgb,var(--color-spark-sky)_72%,transparent)] bg-[color-mix(in_srgb,var(--color-spark-gold)_8%,var(--color-spark-bg))] shadow-[0_8px_28px_color-mix(in_srgb,var(--color-spark-purple)_18%,transparent)]"
                    : "hover:border-[color-mix(in_srgb,var(--color-spark-sky)_58%,transparent)] hover:brightness-[0.97]",
                ].join(" ")}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-3xl font-bold text-spark-bone">
                    {pillar.title}
                  </span>
                  <span
                    className={[
                      "body-sm shrink-0 text-spark-gold transition-transform duration-300 ease-out",
                      isOpen ? "rotate-180" : "",
                    ].join(" ")}
                    aria-hidden
                  >
                    ▾
                  </span>
                </span>
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={`${baseId}-trigger-${pillar.id}`}
                className={[
                  "absolute left-0 right-0 top-[calc(100%-2px)] z-50",
                  "transition-[opacity,transform,visibility] duration-300 ease-out",
                  isOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible -translate-y-1 opacity-0 pointer-events-none",
                ].join(" ")}
              >
                <div className="spark-panel rounded-xl border border-[color-mix(in_srgb,var(--color-spark-sky)_55%,transparent)] p-4 shadow-[0_12px_40px_color-mix(in_srgb,var(--color-spark-purple)_28%,transparent)]">
                  <p className="body-md">{renderBrand(pillar.detail)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AboutContent() {
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
    <div className="spark-page">
      <div className="space-y-14">
        <section
          className="overflow-visible rounded-3xl p-8 sm:p-12 scroll-reveal"
          data-reveal
        >
          <h1 className="heading-xl text-balance">About TX*SPARK</h1>
          <AboutPillarCards />
          <p className="body-md mt-8 max-w-3xl">
            <BrandName /> is a Texas-based data and technology PAC rooted in Austin, building practical tools and trusted support systems so local leaders can turn civic energy into year-round impact. We are not a campaign organization. We fill civic infrastructure gaps, reduce duplicated labor, and make civic tools legible to ordinary people.
          </p>
          <p className="body-md mt-5 max-w-3xl">
            <BrandName /> gives organizers, volunteers, and coalition partners free, practical tools to move from civic frustration to coordinated action. From precinct organizing to bill tracking, we help Texans organize with clarity, consistency, and confidence. Rebellious where it counts, trustworthy where it matters.
          </p>
        </section>

        <section className="scroll-reveal" data-reveal aria-labelledby="about-sections-heading">
          <h2 id="about-sections-heading" className="heading-lg mb-6">
            Mission, people, partners &amp; data
          </h2>
          <ul className="grid gap-4 md:gap-6">
            {ABOUT_SECTIONS.map((item) => (
              <li key={item.href}>
                <div className="spark-framed spark-panel rounded-2xl p-6 sm:p-8 transition hover:-translate-y-0.5 hover:brightness-[0.97]">
                  <span className="heading-md text-spark-bone">{item.title}</span>
                  <p className="body-md mt-3">{item.summary}</p>
                  <Link
                    href={item.href}
                    className="btn-secondary mx-0 mt-4"
                  >
                    Read more
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
