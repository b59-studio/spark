import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sitemap",
  description:
    "Navigate B-59's website. Links to our home page, about us, work, contact, privacy policy, and terms of use. Human-centered design and civic technology.",
  alternates: { canonical: "/about/sitemap" },
  openGraph: {
    title: "Sitemap | B-59",
    description: "Find your way around B-59. Home, about, work, contact, and legal pages.",
    url: "/about/sitemap",
  },
};

export default function SiteMap() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center">
        <h1 className="heading-xl">
          B<span className="text-b59-blue">-</span>59
        </h1>
        <p className="body-lg">
          Human<span className="text-b59-blue">-</span>Centered.
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