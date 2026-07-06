import type { Metadata } from "next";
import HomeHero from "@/components/HomeHero";
import HomeContent from "./HomeContent";

export const metadata: Metadata = {
  title: {
    absolute: "TX*SPARK",
  },
  description:
    "Free, plain-language organizing tools for Texans — the kind of civic data people can actually use, built to outlast any one campaign. No inside baseball required.",
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
          For the Texans who do the organizing.
          <span className="block text-spark-green">Built to outlast the cycle.</span>
        </h1>
      </HomeHero>
      <HomeContent />
    </>
  );
}