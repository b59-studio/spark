import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Partner Resources",
  description:
    "Resources from trusted partner organizations working to advance democratic initiatives across Texas communities.",
  openGraph: {
    title: "Partner Resources | TX*SPARK",
    description:
      "Discover partner organization resources that complement TX*SPARK tools and support democratic community action.",
    url: "/partners",
  },
  alternates: { canonical: "/partners" },
};

export default function PartnersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="heading-xl mb-6">Partner Resources</h1>
      <p className="body-lg mb-6">
        Resources from trusted organizations aligned with democratic
        initiatives.
      </p>
      <p className="body-md mb-8">
        This section features materials from our trusted partners who are also
        pushing democratic initiatives and supporting grassroots efforts in
        Texas.
      </p>
      <Link href="/resources" className="btn-primary">
        Back to Resources
      </Link>
    </div>
  );
}
