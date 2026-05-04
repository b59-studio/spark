import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "People",
  description:
    "How TX*Spark works with communities: listen first, co-design tools, activate year-round, and share ownership.",
  alternates: { canonical: "/about/people" },
  openGraph: {
    title: "People | TX*Spark",
    description:
      "Our approach to organizing support: listening, co-design, year-round action, and durable local leadership.",
    url: "/about/people",
  },
};

export default function AboutPeoplePage() {
  return (
    <div className="spark-page">
      <div className="rounded-2xl p-6 sm:p-8">
        <h1 className="heading-xl mb-6">People</h1>
        <p className="body-lg mb-8 max-w-3xl">
          Our work is shaped by the organizers and neighbors we serve. Here is how we show up together.
        </p>
        <h2 className="heading-lg mb-6">How we work</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <article className="spark-framed spark-panel rounded-xl p-5">
            <p className="heading-sm mb-2">1. Listen first</p>
            <p className="body-md">
              We map local priorities, barriers, and capacity with coalition partners before recommending any strategy.
            </p>
          </article>
          <article className="spark-framed spark-panel rounded-xl p-5">
            <p className="heading-sm mb-2">2. Co-design tools</p>
            <p className="body-md">
              We build customizable resources for different experience levels, political contexts, and community identities.
            </p>
          </article>
          <article className="spark-framed spark-panel rounded-xl p-5">
            <p className="heading-sm mb-2">3. Activate year-round</p>
            <p className="body-md">
              We align campaigns with electoral and legislative calendars so people can take meaningful action all year, not only in peak election moments.
            </p>
          </article>
          <article className="spark-framed spark-panel rounded-xl p-5">
            <p className="heading-sm mb-2">4. Share ownership</p>
            <p className="body-md">
              Our goal is durable local leadership and sustainable organizing systems communities can continue running independently.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
