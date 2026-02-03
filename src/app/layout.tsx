import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://b-59.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "B-59",
    template: "%s | B-59",
  },
  description:
    "Human-centered design and strategy. We build civic technology, advise on complex decisions, and make things that matter. Public-first.",
  keywords: ["civic technology", "design", "strategy", "government", "public sector", "B-59"],
  authors: [{ name: "B-59" }],
  creator: "B-59",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "B-59",
    title: "B-59 — Human-Centered",
    description:
      "Human-centered design and strategy. We build civic technology, advise on complex decisions, and make things that matter.",
    images: [{ url: "/b59logoblue.png", width: 1200, height: 630, alt: "B-59" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "B-59 — Human-Centered",
    description:
      "Human-centered design and strategy. We build civic technology, advise on complex decisions, and make things that matter.",
    images: ["/b59logoblue.png"],
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
    name: "B-59",
    url: siteUrl,
    description:
      "Human-centered design and strategy. We build civic technology, advise on complex decisions, and make things that matter. Public-first.",
    logo: `${siteUrl}/b59logoblue.png`,
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col transition-colors">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <Header />
          <main className="flex-1 pt-24">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}