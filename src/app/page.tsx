import type { Metadata } from "next";
import HomeHero from "@/components/HomeHero";
import HomeContent from "./HomeContent";

export const metadata: Metadata = {
  title: {
    absolute: "TX*Spark",
  },
  description:
    "TX*Spark helps Texans build local power with free, people-centered tools, practical training, and coalition support for year-round civic action.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "TX*Spark — Grassroots Tech for Texans",
    description:
      "Build local civic power in Texas with free organizing tools, practical resources, and coalition support aligned to legislative and election calendars.",
    url: "/",
  },
};

export default function Home() {
  return (
    <>
      <HomeHero>
        <h1 className="home-hero-heading heading-xl text-balance">
          Build Local Power.
          <span className="block text-spark-sage">Win Year-Round.</span>
        </h1>
      </HomeHero>
      <HomeContent />
    </>
  );
}