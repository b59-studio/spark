import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner Resources",
  description: "Resources from TX*Spark partner organizations.",
  alternates: { canonical: "/resources/partners" },
  openGraph: { title: "Partner Resources | TX*Spark", url: "/resources/partners" },
};

export default function ResourcesPartnersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="heading-xl">Partner Resources</h1>
    </div>
  );
}
