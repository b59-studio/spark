import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Grassroots Tech for Texans. Explore TX*Spark's free, people-centered solutions and customizable tools built with and for Texans.",
  openGraph: {
    title: "Solutions | TX*Spark",
    description:
      "Find practical TX*Spark solutions and organizing tools that support coalition partners and year-round civic engagement in Texas.",
    url: "/solutions",
  },
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  return (
    <div className="spark-page-wide">
      <header className="max-w-4xl mx-auto text-center">
        <h1 className="heading-xl mb-6">Solutions</h1>
        <p className="body-lg">
          Explore TX*SPARK solutions designed to support grassroots action,
          legislative advocacy, and collaboration with trusted partner
          organizations.
        </p>
      </header>

      <section className="mt-14 grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
        <article className="callout-blue h-full flex flex-col">
          <h2 className="heading-md">GROW</h2>
          <p className="body-md mb-6 flex-1">
            Grassroots Resources for Organizing &amp; Winning. TX*SPARK toolkits
            offer customizable tools and resources based on a framework aligned
            with electoral and legislative calendars and focused on helping
            neighbors take meaningful action year-round.
          </p>
          <Link href="/solutions/grow" className="btn-primary self-start">
            Explore GROW
          </Link>
        </article>

        <article className="callout-gray h-full flex flex-col">
          <h2 className="heading-md">PAL</h2>
          <p className="body-md mb-6 flex-1">
            People&apos;s Advocacy Lobby. Bill analysis and tracking tools support
            organizing, advocacy, and rapid response strategies.
          </p>
          <Link href="/solutions/pal" className="btn-primary self-start">
            Explore PAL
          </Link>
        </article>
      </section>
    </div>
  );
}
