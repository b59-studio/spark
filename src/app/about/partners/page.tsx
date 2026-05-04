import type { Metadata } from "next";
import Link from "next/link";
import PartnersIndexContent from "@/app/partners/PartnersIndexContent";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "TX*Spark partners and resources from trusted partner organizations working to advance democratic initiatives across Texas communities.",
  alternates: { canonical: "/about/partners" },
  openGraph: {
    title: "Partners | TX*Spark",
    description:
      "Discover partner organization resources that complement TX*SPARK tools and support democratic community action.",
    url: "/about/partners",
  },
};

export default function AboutPartnersPage() {
  return (
    <div className="spark-page">
      <h1 className="heading-xl mb-6 text-left">Partners</h1>
      <section className="rounded-2xl p-6 sm:p-8">
        <PartnersIndexContent />
      </section>

      <section className="mt-14 rounded-2xl p-6 sm:p-8">
        <h2 className="heading-lg mb-6">Partner with TX*Spark</h2>
        <p className="body-md mb-6">
          Is your organization or coalition looking to deepen civic engagement
          in Texas? TX*Spark offers free toolkits, guides, and materials you can
          put to work in your programs—and we welcome conversations about
          collaboration, co-hosted events, and ways we can build alongside your
          goals.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/solutions"
            className="spark-sky-panel rounded-xl p-5 text-center transition hover:-translate-y-0.5 hover:brightness-[0.97]"
          >
            <p className="heading-sm">Solutions</p>
            <p className="body-sm mt-2">
              Toolkits, guides, and print-ready materials.
            </p>
          </Link>
          <Link
            href="/events"
            className="spark-sky-panel rounded-xl p-5 text-center transition hover:-translate-y-0.5 hover:brightness-[0.97]"
          >
            <p className="heading-sm">Events</p>
            <p className="body-sm mt-2">
              Meet-ups, canvasses, and learning spaces.
            </p>
          </Link>
          <a
            href="mailto:info@txspark.com"
            className="spark-sky-panel rounded-xl p-5 text-center transition hover:-translate-y-0.5 hover:brightness-[0.97]"
          >
            <p className="heading-sm">Partner with us</p>
            <p className="body-sm mt-2">
              Let us build alongside your community goals.
            </p>
          </a>
        </div>
      </section>
    </div>
  );
}
