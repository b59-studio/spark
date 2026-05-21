import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Grassroots Tech for Texans. Explore TX*SPARK's free, plain-language solutions and customizable tools built with and for Texans. Data people can actually use.",
  openGraph: {
    title: "Solutions | TX*SPARK",
    description:
      "Practical TX*SPARK solutions and organizing tools that support coalition partners year-round. Make power legible. No inside baseball required.",
    url: "/solutions",
  },
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  return (
    <div className="spark-page-wide">
      <header className="max-w-4xl mx-auto text-center">
        <h1 className="heading-xl mb-6">Solutions</h1>
        <p className="body-md">
          Explore TX*SPARK solutions designed to support grassroots action, legislative advocacy, and collaboration with trusted partner organizations. We fill civic infrastructure gaps, not campaign stages. We build systems that outlast any single campaign cycle.
        </p>
      </header>

      <section className="mt-12 grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
        <article className="callout-blue h-full flex flex-col">
          <h2 className="heading-md">GROW</h2>
          <p className="body-md mb-6 flex-1">
            Grassroots Resources for Organizing &amp; Winning. TX*SPARK toolkits offer customizable tools and resources based on a framework aligned with electoral and legislative calendars and focused on helping neighbors take meaningful action year-round. Don&apos;t reinvent the wheel every cycle. Work through proven packets in plain language.
          </p>
          <Link href="/solutions/grow" className="btn-primary self-start">
            Explore GROW
          </Link>
        </article>

        <article className="callout-gray h-full flex flex-col">
          <h2 className="heading-md">PAL</h2>
          <p className="body-md mb-6 flex-1">
            People&apos;s Advocacy Lobby. Bill analysis and tracking tools support organizing, advocacy, and rapid response strategies. Plain-language summaries tied to Texas Legislature Online so public information is actually public, without the inside baseball.
          </p>
          <Link href="/solutions/pal" className="btn-primary self-start">
            Explore PAL
          </Link>
        </article>
      </section>

      <section className="mt-14 max-w-4xl mx-auto text-left">
        <div className="spark-panel rounded-2xl border border-spark-gold/40 p-6 sm:p-8">
          <h2 className="heading-md mb-3">Built on data you can trust</h2>
          <p className="body-md">
            GROW and PAL are only as useful as the information behind them. We
            invest in clean pipelines, timely updates, and clear presentation so
            what you act on matches the Capitol and the field, not a stale
            export. Accountability over opacity. Data people can actually use,
            week to week.
          </p>
          <Link
            href="/about/data"
            className="btn-secondary mt-5 inline-block"
          >
            How we keep information current
          </Link>
        </div>
      </section>
    </div>
  );
}
