import type { Metadata } from "next";
import Link from "next/link";
import BrandName from "@/components/BrandName";

export const metadata: Metadata = {
  title: "Data integrity",
  description:
    "TX*SPARK runs clean data pipelines and regular updates for GROW, PAL, and field tools. Data people can actually use, reflecting Texas civics as it is today, not last week's export.",
  alternates: { canonical: "/about/data" },
  openGraph: {
    title: "Data integrity | TX*SPARK",
    description:
      "Why trustworthy, up-to-date data is non-negotiable for organizers, and how we design TX*SPARK for accountability over opacity.",
    url: "/about/data",
  },
};

export default function AboutDataPage() {
  return (
    <div className="spark-page">
      <div className="space-y-12 sm:space-y-14">
        <section className="rounded-2xl p-6 sm:p-8">
          <h1 className="heading-xl mb-6">Data integrity</h1>
          <p className="body-md max-w-3xl text-balance">
            <BrandName /> works to make sure you have the most up-to-date, actionable information in front of you, whether you are tracking bills, building outreach lists, or coordinating in the field. Public information should actually be public. That reliability is a core part of our promise, because your work does not get done if you cannot trust the data you are working with.
          </p>
        </section>

        <section className="spark-framed spark-panel rounded-2xl p-6 sm:p-8">
          <h2 className="heading-lg mb-4">Current, not stale</h2>
          <p className="body-md">
            Clean pipelines, regular updates, and plain-language presentation come together so you can move with confidence: what you see reflects the Capitol and your community as they are today, not a stale snapshot from last week. Data people can actually use. Accountability over opacity.
          </p>
        </section>

        <section className="spark-framed rounded-2xl p-6 sm:p-8">
          <h2 className="heading-lg mb-4">See it in our tools</h2>
          <p className="body-md mb-6 max-w-3xl">
            GROW and PAL turn that commitment into workflows you can use every week. Organizing support aligned to real calendars, and bill tracking built on fresh pulls from Texas Legislature Online. Make power legible without living inside raw portals.
          </p>
          <Link href="/toolkits" className="btn-primary">
            See how we use this data in action
          </Link>
        </section>
      </div>
    </div>
  );
}
