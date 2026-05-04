import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mission",
  description:
    "TX*Spark offers free, community-rooted resources that grow local democratic engagement and strengthen coalition partners.",
  alternates: { canonical: "/about/mission" },
  openGraph: {
    title: "Mission | TX*Spark",
    description:
      "Our mission: people-centered tools and support so neighbors can lead democratic engagement on their own terms.",
    url: "/about/mission",
  },
};

export default function AboutMissionPage() {
  return (
    <div className="spark-page">
      <div className="rounded-2xl p-6 sm:p-8">
        <h1 className="heading-xl mb-6">Mission</h1>
        <p className="body-lg mb-5">
          We offer free, people-centered, community-rooted resources that help
          neighbors learn, practice, and lead democratic engagement in ways
          that fit their realities.
        </p>
        <p className="body-md text-secondary">
          We exist to grow, strengthen, and supplement local coalition partners
          and campaigns, not supplant them.
        </p>
        <blockquote className="quote mt-7">
          Lasting civic power is built when local communities have the tools and
          confidence to organize on their own terms.
        </blockquote>
      </div>
    </div>
  );
}
