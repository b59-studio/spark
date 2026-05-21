import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About",
  description:
    "About TX*SPARK: a Texas-based data and technology PAC building practical tools and year-round support for Texas coalitions. Rebellious but trustworthy, built to outlast individual campaign cycles.",
  keywords: ["TX*SPARK", "Grassroots Tech for Texans", "B-59", "grassroots organizing", "Texas PAC", "pro-democracy"],
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About TX*SPARK",
    description:
      "Discover how TX*SPARK helps local leaders make power legible with practical resources, events, and community-centered collaboration. No consultant voice. No inside baseball.",
    url: "/about",
  },
};

export default function About() {
  return <AboutContent />;
}