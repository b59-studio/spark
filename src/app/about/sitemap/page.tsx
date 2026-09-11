import type { Metadata } from "next";
import Link from "next/link";
import BrandName from "@/components/BrandName";

export const metadata: Metadata = {
  title: "Sitemap",
  description:
    "Grassroots Tech for Texans. Navigate TX*SPARK pages for about, events, solutions, contact, and legal information.",
  alternates: { canonical: "/about/sitemap" },
  openGraph: {
    title: "Sitemap | TX*SPARK",
    description: "Find your way around TX*SPARK pages for programs, solutions, events, contact, and legal details.",
    url: "/about/sitemap",
  },
};

export default function SiteMap() {
  const primaryRoutes = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/events", label: "Events" },
    { href: "/toolkits", label: "Toolkits" },
    { href: "/work", label: "Our Work" },
    { href: "/contact", label: "Contact" },
  ];

  const aboutSubRoutes = [
    { href: "/about/mission", label: "Mission" },
    { href: "/about/people", label: "People" },
    { href: "/about/partners", label: "Partners" },
    { href: "/about/data", label: "Data" },
  ];

  const solutionRoutes = [
    { href: "/toolkits", label: "Toolkits" },
  ];

  const legalRoutes = [
    { href: "/about/sitemap", label: "Sitemap" },
    { href: "/about/privacy", label: "Privacy Policy" },
    { href: "/about/terms", label: "Terms of Use" },
  ];

  return (
    <div className="spark-page-wide">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="heading-xl mb-6">Sitemap</h1>
        <p className="body-lg">
          Browse all key <BrandName /> pages in one place.
        </p>
      </div>

      <div className="max-w-4xl mx-auto mt-14 grid gap-6 sm:grid-cols-2">
        <section className="callout-blue">
          <h2 className="heading-md mb-4">Main Pages</h2>
          <ul className="space-y-2 body-md">
            {primaryRoutes.map((route) => (
              <li key={route.href}>
                <Link href={route.href} className="text-link">
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="callout-gray">
          <h2 className="heading-md mb-4">About</h2>
          <ul className="space-y-2 body-md">
            {aboutSubRoutes.map((route) => (
              <li key={route.href}>
                <Link href={route.href} className="text-link">
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="callout-blue">
          <h2 className="heading-md mb-4">Programs & Tools</h2>
          <ul className="space-y-2 body-md">
            {solutionRoutes.map((route) => (
              <li key={route.href}>
                <Link href={route.href} className="text-link">
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="callout-alert sm:col-span-2">
          <h2 className="heading-md mb-4">Legal</h2>
          <ul className="space-y-2 body-md sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0">
            {legalRoutes.map((route) => (
              <li key={route.href}>
                <Link href={route.href} className="text-link">
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="flex gap-4 justify-center flex-wrap mt-14">
        <a href="/contact" className="btn-secondary">
          Talk to Us
        </a>
        <a href="/about" className="btn-primary">
          Learn More
        </a>
      </div>
    </div>
  );
}
