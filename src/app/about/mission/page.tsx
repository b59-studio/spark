import type { Metadata } from "next";
import Link from "next/link";
import CmsPage from "@/components/CmsPage";
import BrandName from "@/components/BrandName";

export const metadata: Metadata = {
  title: "Mission",
  description:
    "TX*SPARK offers free, accurate, people-centered tools so democratic organizations can take effective action when they need to, today. Built to outlast individual campaign cycles, with no inside baseball required.",
  alternates: { canonical: "/about/mission" },
  openGraph: {
    title: "Mission | TX*SPARK",
    description:
      "Free, accurate, people-centered tools for democratic organizations, plus community-rooted resources that strengthen local partners without supplanting them.",
    url: "/about/mission",
  },
};

/**
 * In-code fallback shown when WordPress is unconfigured, unreachable, or has no
 * published `mission` page. Mirrors the original static layout so the route
 * always renders. Edit copy in WP admin once the CMS is live; this stays as the
 * safety net.
 */
function MissionFallback() {
  return (
    <div className="spark-page">
      <div className="space-y-12 sm:space-y-14">
        <section className="rounded-2xl p-6 sm:p-8">
          <h1 className="heading-xl mb-6">Mission</h1>
          <p className="body-md max-w-3xl">
            We offer free, accurate, and people-centered tools for democratic organizations to take effective action when they need to, today. Our work is built to outlast individual campaign cycles. We preserve institutional knowledge, pass the torch without losing momentum, and make power legible to the people doing the work.
          </p>
        </section>

        <section className="spark-framed spark-panel rounded-2xl p-6 sm:p-8">
          <h2 className="heading-lg mb-4">Community-rooted practice</h2>
          <p className="body-md">
            Our free, people-centered, community-rooted resources help neighbors learn, practice, and lead democratic engagement in ways that fit their realities. Plain language over gatekeeping. Analytics translated into human-readable insights.
          </p>
        </section>

        <section className="spark-framed spark-panel rounded-2xl p-6 sm:p-8">
          <h2 className="heading-lg mb-4">Strengthening local partners</h2>
          <p className="body-md">
            We exist to grow, strengthen, and supplement local coalition partners and campaigns, not supplant them. <BrandName /> is civic infrastructure, not a competing campaign. We democratize access to information and reduce duplicated labor across the movement.
          </p>
        </section>

        <section className="spark-framed spark-panel rounded-2xl p-6 sm:p-8">
          <h2 className="heading-lg mb-4">Information when it matters</h2>
          <p className="body-md">
            Helping democratic institutions and community organizers access up-to-date, accurate information is a core part of our mission, so people can take informed action today, not after the moment has passed. Public information should actually be public. Accountability over opacity is how we operate.
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
          <p className="body-md max-w-3xl">
            People already have the motivation to act. What they need is trusted structure, the kind that survives the people who built it. <BrandName /> turns civic energy into durable local power by giving communities the tools, strategy, and support to organize together all year, without reinventing the wheel every cycle.
          </p>
          <blockquote className="quote mt-6">
            Lasting civic power is built when local communities have the tools and confidence to organize on their own terms. Understand your district without a political science degree.
          </blockquote>
        </section>
      </div>
    </div>
  );
}

export default function AboutMissionPage() {
  return <CmsPage slug="mission" fallback={<MissionFallback />} />;
}
