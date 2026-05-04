import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/solutions/partners", destination: "/about/partners", permanent: true },
      { source: "/partners", destination: "/about/partners", permanent: true },
      { source: "/resources/partners", destination: "/about/partners", permanent: true },
      { source: "/resources", destination: "/solutions", permanent: true },
      { source: "/resources/:path*", destination: "/solutions/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
