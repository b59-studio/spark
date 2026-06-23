import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MainFrame from "@/components/MainFrame";
import { siteImages } from "@/lib/site-visuals";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://b-59.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TX*SPARK",
    template: "%s | TX*SPARK",
  },
  description:
    "Grassroots Tech for Texans. TX*SPARK fills civic infrastructure gaps with free, plain-language tools and organizing support. Data people can actually use, built to outlast individual campaign cycles.",
  keywords: [
    "TX*SPARK",
    "Grassroots Tech for Texans",
    "B-59",
    "civic technology",
    "grassroots organizing",
    "Texas PAC",
    "community-rooted resources",
    "B-59 technology partner",
  ],
  authors: [{ name: "TX*SPARK" }],
  creator: "TX*SPARK",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "TX*SPARK",
    title: "TX*SPARK | Grassroots Tech for Texans",
    description:
      "TX*SPARK offers free, community-rooted tools, resources, and events that help Texans organize with clarity year-round. Make power legible. No inside baseball required.",
    images: [{ url: siteImages.brand.sparkLogo, width: 1200, height: 630, alt: "TX*SPARK | Grassroots Tech for Texans" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TX*SPARK | Grassroots Tech for Texans",
    description:
      "Grassroots Tech for Texans. Free tools, plain-language resources, and organizing support built to outlast individual campaign cycles across Texas.",
    images: [siteImages.brand.sparkLogo],
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TX*SPARK",
    url: siteUrl,
    description:
      "Grassroots Tech for Texans. TX*SPARK fills civic infrastructure gaps with free, plain-language tools and organizing support. Data people can actually use, built to outlast individual campaign cycles.",
    logo: `${siteUrl}${siteImages.brand.sparkLogo}`,
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        {/* Apply a stored theme choice before first paint so the page never
            flashes the wrong palette. No stored choice → dark (the brand default). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t;}}catch(e){}})();",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <MainFrame>{children}</MainFrame>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}