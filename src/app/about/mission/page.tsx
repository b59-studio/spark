import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mission",
  description:
    "TX*Spark offers free, accurate, people-centered tools so democratic organizations can take effective action when they need to—today.",
  alternates: { canonical: "/about/mission" },
  openGraph: {
    title: "Mission | TX*Spark",
    description:
      "Free, accurate, people-centered tools for democratic organizations—plus community-rooted resources that strengthen local partners.",
    url: "/about/mission",
  },
};

export default function AboutMissionPage() {
  return (
    <div className="spark-page">
      <div className="space-y-12 sm:space-y-14">
        <section className="rounded-2xl p-6 sm:p-8">
          <h1 className="heading-xl mb-6">Mission</h1>
          <p className="body-md max-w-3xl">
            We offer free, accurate, and people-centered tools for democratic organizations to take effective action when they need to—today.
          </p>
        </section>

        <section className="spark-framed spark-panel rounded-2xl p-6 sm:p-8">
          <h2 className="heading-lg mb-4">Community-rooted practice</h2>
          <p className="body-md">
            Our free, people-centered, community-rooted resources help neighbors learn, practice, and lead democratic engagement in ways that fit their realities.
          </p>
        </section>

        <section className="spark-framed spark-panel rounded-2xl p-6 sm:p-8">
          <h2 className="heading-lg mb-4">Strengthening local partners</h2>
          <p className="body-md">
            We exist to grow, strengthen, and supplement local coalition partners and campaigns, not supplant them.
          </p>
        </section>

        <section className="spark-framed spark-panel rounded-2xl p-6 sm:p-8">
          <h2 className="heading-lg mb-4">Information when it matters</h2>
          <p className="body-md">
            Helping democratic institutions and community organizers access up-to-date, accurate information is a core part of our mission—so people can take informed action today, not after the moment has passed.
          </p>
          <p className="body-md mt-4">
            For a deeper look at pipelines, update rhythms, and why trustworthy data sits at the center of how we build tools, read our page on{" "}
            <Link href="/about/data" className="text-link">
              data integrity
            </Link>
            .
          </p>
        </section>

        <section className="spark-framed rounded-2xl p-6 sm:p-8">
          <h2 className="heading-lg mb-4">What we believe</h2>
          <blockquote className="quote">
            Lasting civic power is built when local communities have the tools and confidence to organize on their own terms.
          </blockquote>
        </section>
      </div>
    </div>
  );
}
