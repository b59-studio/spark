import type { Metadata } from "next";
import HomeHero from "@/components/HomeHero";
import HomeContent from "./HomeContent";

export const metadata: Metadata = {
  title: {
    absolute: "TX*SPARK",
  },
  description:
    "TX*SPARK fills civic infrastructure gaps with free, plain-language tools, training, and coalition support. Data people can actually use, built to outlast individual campaign cycles.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "TX*SPARK | Grassroots Tech for Texans",
    description:
      "Free organizing tools and plain-language resources for campaigns and communities across Texas. Make power legible. No inside baseball required.",
    url: "/",
  },
};

export default function Home() {
  return (
    <>
      <HomeHero>
        <h1 className="home-hero-heading heading-xl text-balance">
          Infrastructure for Texas Organizers.
          <span className="block text-spark-gold">Built to Outlast the Cycle.</span>
        </h1>
      </HomeHero>
      <HomeContent />
    </>
  );
}