import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Grassroots Tech for Texans. Explore TX*Spark's free, people-centered resources and customizable tools built with and for Texans.",
  openGraph: {
    title: "Resources | TX*Spark",
    description:
      "Find practical TX*Spark resources and organizing tools that support coalition partners and year-round civic engagement in Texas.",
    url: "/resources",
  },
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <header className="max-w-4xl mx-auto mb-14 text-center">
        <h1 className="heading-xl">Resources</h1>
        <p className="body-lg">
          Explore TX*SPARK resources designed to support grassroots action,
          legislative advocacy, and collaboration with trusted partner
          organizations.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <article className="callout-blue h-full flex flex-col">
          <h2 className="heading-md">GROW</h2>
          <p className="body-md mb-6 flex-1">
            Grassroots Resources for Organizing &amp; Winning. TX*SPARK toolkits
            offer customizable tools and resources based on a framework aligned
            with electoral and legislative calendars and focused on helping
            neighbors take meaningful action year-round.
          </p>
          <Link href="/resources/grow" className="btn-primary self-start">
            Explore GROW
          </Link>
        </article>

        <article className="callout-gray h-full flex flex-col">
          <h2 className="heading-md">PAL</h2>
          <p className="body-md mb-6 flex-1">
            People&apos;s Advocacy Lobby. Bill analysis and tracking tools support
            organizing, advocacy, and rapid response strategies.
          </p>
          <Link href="/resources/pal" className="btn-primary self-start">
            Explore PAL
          </Link>
        </article>

        <article className="callout-alert h-full flex flex-col">
          <h2 className="heading-md">Partner Resources</h2>
          <p className="body-md mb-6 flex-1">
            Resources from our trusted partners who are also pushing democratic
            initiatives.
          </p>
          <Link href="/resources/partners" className="btn-primary self-start">
            Explore Partner Resources
          </Link>
        </article>
      </section>
    </div>
  );
}
