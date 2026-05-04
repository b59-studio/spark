"use client";

import Link from "next/link";
import { useEffect } from "react";

const revealSelector = "[data-reveal]";

const ABOUT_SECTIONS = [
  {
    title: "Mission",
    href: "/about/mission",
    summary:
      "Free, people-centered resources that help neighbors learn, practice, and lead democratic engagement—and strengthen local coalitions without replacing them.",
  },
  {
    title: "People",
    href: "/about/people",
    summary:
      "How we listen with partners, co-design tools for real contexts, keep work aligned with electoral and legislative calendars, and share ownership so leadership stays local.",
  },
  {
    title: "Partners",
    href: "/about/partners",
    summary:
      "Trusted organizations and paths to connect—partner materials, events, and ways to build alongside communities across Texas.",
  },
  {
    title: "Data",
    href: "/about/data",
    summary:
      "How we keep information current and actionable—clean pipelines and regular updates so you can trust what you see when organizing and advocating.",
  },
] as const;

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
          className="rounded-3xl p-8 sm:p-12 scroll-reveal"
          data-reveal
        >
          <h1 className="heading-xl text-balance">About TX*Spark</h1>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="spark-panel rounded-xl p-4">
              <p className="text-3xl font-bold text-spark-bone">Year-round</p>
              <p className="body-sm mt-1">Organizing support beyond elections.</p>
            </div>
            <div className="spark-panel rounded-xl p-4">
              <p className="text-3xl font-bold text-spark-bone">Community-led</p>
              <p className="body-sm mt-1">Built with partners, never for them.</p>
            </div>
            <div className="spark-panel rounded-xl p-4">
              <p className="text-3xl font-bold text-spark-bone">Action-ready</p>
              <p className="body-sm mt-1">Tools people can use immediately.</p>
            </div>
          </div>
          <p className="body-lg mt-8 max-w-3xl">
            We are a pro-democracy political action committee and organizer collective rooted in Austin, building practical tools and trusted support systems so local leaders can turn civic energy into year-round impact.
          </p>
          <p className="body-lg mt-5 max-w-3xl">
            TX*Spark gives organizers, volunteers, and coalition partners free, practical tools to move from civic frustration to coordinated action. From precinct organizing to bill tracking, we help Texans organize with clarity, consistency, and confidence.
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
