import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://b-59.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "", priority: 1, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/events", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/resources", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/work", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/grow", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/pal", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/partners", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/branding", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/about/sitemap", priority: 0.5, changeFrequency: "yearly" as const },
    { path: "/about/privacy", priority: 0.5, changeFrequency: "yearly" as const },
    { path: "/about/terms", priority: 0.5, changeFrequency: "yearly" as const },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
