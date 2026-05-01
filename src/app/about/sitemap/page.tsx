import type { Metadata } from "next";
import Link from "next/link";

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
  const primaryRoutes = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/events", label: "Events" },
    { href: "/resources", label: "Resources" },
    { href: "/work", label: "Our Work" },
    { href: "/contact", label: "Contact" },
  ];

  const aboutSubRoutes = [
    { href: "/about/mission", label: "Mission" },
    { href: "/about/people", label: "People" },
    { href: "/about/partners", label: "Partners" },
  ];

  const resourceRoutes = [
    { href: "/resources/grow", label: "GROW" },
    { href: "/resources/pal", label: "PAL" },
    { href: "/resources/partners", label: "Partner Resources" },
    { href: "/grow", label: "GROW toolkits" },
    { href: "/branding", label: "Brand Guidelines" },
  ];

  const legalRoutes = [
    { href: "/about/sitemap", label: "Sitemap" },
    { href: "/about/privacy", label: "Privacy Policy" },
    { href: "/about/terms", label: "Terms of Use" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="heading-xl">Sitemap</h1>
        <p className="body-lg">
          Browse all key TX*Spark pages in one place.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid gap-6 sm:grid-cols-2">
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
            {resourceRoutes.map((route) => (
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

      <div className="flex gap-4 justify-center flex-wrap mt-12">
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