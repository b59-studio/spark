import type { Metadata } from "next";
import CmsPage from "@/components/CmsPage";
import Link from "next/link";
import PartnersIndexContent from "@/app/partners/PartnersIndexContent";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "TX*SPARK partners and resources from trusted organizations working to advance democratic initiatives across Texas communities. We supplement, never supplant.",
  alternates: { canonical: "/about/partners" },
  openGraph: {
    title: "Partners | TX*SPARK",
    description:
      "Partner organization resources that complement TX*SPARK tools and support democratic community action. Building alongside existing orgs, not competing with them.",
    url: "/about/partners",
  },
};

export default function AboutPartnersPage() {
  return <CmsPage slug="partners" fallback={<AboutPartnersFallback />} />;
}

function AboutPartnersFallback() {
  return (
    <div className="spark-page">
      <h1 className="heading-xl mb-6 text-left">Partners</h1>
      <section className="spark-framed rounded-2xl p-6 sm:p-8">
        <PartnersIndexContent />
      </section>

      <section className="spark-framed mt-14 rounded-2xl p-6 sm:p-8">
        <h2 className="heading-lg mb-6">Partner with TX*SPARK</h2>
        <p className="body-md mb-6">
          Is your organization or coalition looking to deepen civic engagement in Texas? TX*SPARK offers free toolkits, guides, and materials you can put to work in your programs, and we welcome conversations about collaboration, co-hosted events, and ways we can build alongside your goals. We fill infrastructure gaps. We don&apos;t compete with the orgs already doing the work.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/solutions"
            className="spark-framed spark-panel rounded-xl p-5 text-center transition hover:-translate-y-0.5 hover:brightness-[0.97]"
          >
            <p className="heading-sm">Solutions</p>
            <p className="body-sm mt-2">
              Toolkits, guides, and print-ready materials.
            </p>
          </Link>
          <Link
            href="/events"
            className="spark-framed spark-panel rounded-xl p-5 text-center transition hover:-translate-y-0.5 hover:brightness-[0.97]"
          >
            <p className="heading-sm">Events</p>
            <p className="body-sm mt-2">
              Meet-ups, canvasses, and learning spaces.
            </p>
          </Link>
          <a
            href="mailto:info@txspark.com"
            className="spark-framed spark-panel rounded-xl p-5 text-center transition hover:-translate-y-0.5 hover:brightness-[0.97]"
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
