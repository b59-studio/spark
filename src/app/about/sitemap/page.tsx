import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sitemap",
  description:
    "Grassroots Tech for Texans. Navigate TX*Spark pages for about, events, resources, contact, and legal information.",
  alternates: { canonical: "/about/sitemap" },
  openGraph: {
    title: "Sitemap | TX*Spark",
    description: "Find your way around TX*Spark pages for programs, resources, events, contact, and legal details.",
    url: "/about/sitemap",
  },
};

export default function SiteMap() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center">
        <h1 className="heading-xl">
          TX*Spark
        </h1>
        <p className="body-lg">
          Grassroots Tech for Texans
        </p>
        <br/>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="/contact" className="btn-secondary">
            Talk to Us
          </a>
          <a href="/about" className="btn-primary">
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
}