import type { Metadata } from "next";
import PalContent from "./PalContent";

export const metadata: Metadata = {
  title: "PAL",
  description:
    "PAL (People's Advocacy Lobby) provides bill analysis and tracking tools for organizing, advocacy, and rapid response strategies.",
  openGraph: {
    title: "TX*Spark | PAL",
    description:
      "Explore PAL resources for bill tracking, analysis, and coordinated advocacy strategies.",
    url: "/pal",
  },
  alternates: { canonical: "/pal" },
};

export default function PalPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <PalContent />
    </div>
  );
}
