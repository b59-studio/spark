import type { NextConfig } from "next";

// Headless WordPress origin — the SITE ROOT (no trailing slash, no /wp-admin),
// the same value the CMS client reads to build /wp-json requests. Falls back to
// the known prod host so local builds without the env still redirect correctly.
const WORDPRESS_ORIGIN = (
  process.env.WORDPRESS_API_URL ?? "https://cms.jfseamus.com"
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Friendly entry point to the headless WordPress admin so the content
      // team can bookmark /admin instead of the bare /wp-admin/ path. Deep
      // links work too: /admin/plugins.php -> cms /wp-admin/plugins.php.
      { source: "/admin", destination: `${WORDPRESS_ORIGIN}/wp-admin/`, permanent: false },
      { source: "/admin/:path*", destination: `${WORDPRESS_ORIGIN}/wp-admin/:path*`, permanent: false },
      { source: "/solutions/partners", destination: "/about/partners", permanent: true },
      { source: "/partners", destination: "/about/partners", permanent: true },
      { source: "/resources/partners", destination: "/about/partners", permanent: true },
      { source: "/resources", destination: "/toolkits", permanent: true },
      { source: "/resources/:path*", destination: "/toolkits", permanent: true },
      // Deprecated solutions / grow / pal — folded into the year-round Toolkits section.
      { source: "/solutions", destination: "/toolkits", permanent: true },
      { source: "/solutions/:path*", destination: "/toolkits", permanent: true },
      { source: "/grow", destination: "/toolkits", permanent: true },
      { source: "/grow/:path*", destination: "/toolkits", permanent: true },
      { source: "/pal", destination: "/toolkits", permanent: true },
    ];
  },
};

export default nextConfig;
