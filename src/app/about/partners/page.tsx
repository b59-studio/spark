import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partners",
  description: "TX*Spark partners.",
  alternates: { canonical: "/about/partners" },
  openGraph: { title: "Partners | TX*Spark", url: "/about/partners" },
};

export default function AboutPartnersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="heading-xl">Partners</h1>
    </div>
  );
}
