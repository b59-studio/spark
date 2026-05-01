import type { Metadata } from "next";
import Link from "next/link";
import { growToolkits } from "./toolkits";

export const metadata: Metadata = {
  title: "GROW",
  description:
    "GROW (Grassroots Resources for Organizing & Winning) provides TX*SPARK toolkits aligned with electoral and legislative calendars for year-round action.",
  openGraph: {
    title: "GROW | TX*SPARK",
    description:
      "Explore GROW: grassroots organizing and campaign-ready toolkits designed for meaningful year-round civic action.",
    url: "/grow",
  },
  alternates: { canonical: "/grow" },
};

export default function GrowPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="heading-xl mb-6">GROW</h1>
      <p className="body-lg mb-6">
        Grassroots Resources for Organizing &amp; Winning.
      </p>
      <p className="body-md mb-6">
        TX*SPARK toolkits offer customizable tools and resources based on a
        framework aligned with electoral and legislative calendars and focused
        on helping neighbors take meaningful action year-round.
      </p>
      <p className="body-sm text-secondary mb-10 max-w-prose border-l-2 border-spark-blue/35 pl-4">
        These packets build on each other—work through them in order for the
        clearest path from precinct knowledge to turnout and follow-up.
      </p>
      <ol className="grow-timeline mb-12 space-y-8 sm:space-y-10">
        {growToolkits.map((toolkit, index) => {
          const n = growToolkits.length;
          const stepLabel = `Step ${index + 1} of ${n}`;
          const isFirst = index === 0;
          const isLast = index === n - 1;
          const only = n === 1;
          return (
            <li
              key={toolkit.slug}
              className={[
                "grow-timeline-item",
                isFirst && "grow-timeline-item--first",
                isLast && "grow-timeline-item--last",
                only && "grow-timeline-item--only",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="grow-timeline-rail" aria-hidden>
                <span className="grow-timeline-node" />
                <span className="grow-timeline-connector" />
              </div>
              <section
                className="grow-timeline-card rounded-2xl border border-spark-dark/15 spark-glass shadow-sm p-6 sm:p-7"
                aria-label={stepLabel}
              >
                <span className="sr-only">{stepLabel}</span>
                <div className="grow-toolkit-icon-slot mb-4 rounded-lg border border-dashed border-spark-dark/25 spark-glass px-4 py-5 flex items-center justify-center">
                  <span className="body-sm text-secondary tracking-wide uppercase">
                    Toolkit icon placeholder
                  </span>
                </div>
                <h2 className="grow-toolkit-title heading-md mb-3 flex items-center gap-3">
                  <span className="inline-flex h-11 min-w-11 items-center justify-center rounded-full spark-glass border border-spark-dark/12 text-spark-dark text-2xl font-semibold leading-none px-3">
                    {index + 1}
                  </span>
                  <span>{toolkit.fullTitle}</span>
                </h2>
                <p className="body-md mb-5">{toolkit.summary}</p>
                <Link href={`/grow/${toolkit.slug}`} className="btn-toolkit">
                  View Toolkit
                </Link>
              </section>
            </li>
          );
        })}
      </ol>
      <div className="pt-8">
        <Link href="/resources" className="btn-primary">
          Back to Resources
        </Link>
      </div>
    </div>
  );
}
