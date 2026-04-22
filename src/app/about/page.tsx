import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About",
  description:
    "About TX*Spark: a community-rooted, pro-democracy organizer collective building practical tools and year-round support for Texas coalitions.",
  keywords: ["TX*Spark", "TX Spark", "Grassroots Tech for Texans", "B-59", "grassroots organizing", "Texas PAC", "pro-democracy"],
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About TX*Spark",
    description:
      "Discover how TX*Spark helps local leaders turn civic energy into sustained action with practical resources, events, and community-centered collaboration.",
    url: "/about",
  },
};

export default function About() {
  return <AboutContent />;
}