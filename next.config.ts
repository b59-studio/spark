import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
