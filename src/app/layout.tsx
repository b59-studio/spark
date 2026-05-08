import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MainFrame from "@/components/MainFrame";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://b-59.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TX*Spark",
    template: "%s | TX*Spark",
  },
  description:
    "Grassroots Tech for Texans. TX*Spark provides free, people-centered tools, resources, and organizing support to strengthen pro-democracy action across Texas.",
  keywords: [
    "TX*Spark",
    "TX Spark",
    "Grassroots Tech for Texans",
    "B-59",
    "civic technology",
    "grassroots organizing",
    "Texas PAC",
    "community-rooted resources",
    "B-59 technology partner",
  ],
  authors: [{ name: "TX*Spark" }],
  creator: "TX*Spark",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "TX*Spark",
    title: "TX*Spark — Grassroots Tech for Texans",
    description:
      "TX*Spark offers free, community-rooted tools, resources, and events that help Texans organize and take pro-democracy action year-round.",
    images: [{ url: "/sparkv1.png", width: 1200, height: 630, alt: "TX*Spark — Grassroots Tech for Texans" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TX*Spark — Grassroots Tech for Texans",
    description:
      "Grassroots Tech for Texans. Free tools, resources, and organizing support for pro-democracy action across Texas.",
    images: ["/sparkv1.png"],
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
    name: "TX*Spark",
    url: siteUrl,
    description:
      "Grassroots Tech for Texans. TX*Spark provides free, people-centered tools, resources, and organizing support to strengthen pro-democracy action across Texas.",
    logo: `${siteUrl}/sparkv1.png`,
  };

  return (
    <html lang="en">
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