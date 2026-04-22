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
      <p className="body-md mb-8">
        TX*SPARK toolkits offer customizable tools and resources based on a
        framework aligned with electoral and legislative calendars and focused
        on helping neighbors take meaningful action year-round.
      </p>
      <div className="grid gap-6 mb-12">
        {growToolkits.map((toolkit, index) => (
          <section
            key={toolkit.slug}
            className={`rounded-2xl border border-border/70 bg-background/75 shadow-sm p-6 sm:p-7 ambient-gradient ${
              index % 3 === 0
                ? "ambient-cool"
                : index % 3 === 1
                  ? "ambient-warm"
                  : "ambient-violet"
            }`}
          >
            <div className="mb-4 rounded-lg border border-dashed border-primary/35 bg-primary/5 px-4 py-5 flex items-center justify-center">
              <span className="body-sm text-secondary tracking-wide uppercase">
                Toolkit icon placeholder
              </span>
            </div>
            <h2 className="grow-toolkit-title heading-md mb-3 flex items-center gap-3">
              <span className="inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-primary/12 text-primary text-2xl font-semibold leading-none px-3">
                {index + 1}
              </span>
              <span>{toolkit.fullTitle}</span>
            </h2>
            <p className="body-md mb-5">{toolkit.summary}</p>
            <Link href={`/grow/${toolkit.slug}`} className="btn-toolkit">
              View Toolkit
            </Link>
          </section>
        ))}
      </div>
      <Link href="/resources" className="btn-primary">
        Back to Resources
      </Link>
    </div>
  );
}
