import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MainFrame from "@/components/MainFrame";
import { siteImages } from "@/lib/site-visuals";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://texasspark.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TX*SPARK",
    template: "%s | TX*SPARK",
  },
  description:
    "Grassroots Tech for Texans. Free, plain-language tools and organizing support — civic data people can actually use, built to outlast any one campaign. No inside baseball required.",
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
    images: [{ url: siteImages.brand.ogCard, width: 1200, height: 630, alt: "TX*SPARK | Grassroots Tech for Texans" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TX*SPARK | Grassroots Tech for Texans",
    description:
      "Grassroots Tech for Texans. Free tools, plain-language resources, and organizing support built to outlast individual campaign cycles across Texas.",
    images: [siteImages.brand.ogCard],
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
      "Grassroots Tech for Texans. Free, plain-language tools and organizing support — civic data people can actually use, built to outlast any one campaign. No inside baseball required.",
    logo: `${siteUrl}${siteImages.brand.sparkLogo}`,
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
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