import type { Metadata } from "next";
import PalContent from "@/app/pal/PalContent";

export const metadata: Metadata = {
  title: "PAL",
  description:
    "PAL | People's Advocacy Lobby. Plain-language Texas bill tracking tied to TLO. Public information should actually be public.",
  alternates: { canonical: "/solutions/pal" },
  openGraph: {
    title: "PAL | TX*SPARK",
    description:
      "People's Advocacy Lobby: bill analysis and tracking for organizers. Data people can actually use. No inside baseball required.",
    url: "/solutions/pal",
  },
};

export default function SolutionsPalPage() {
  return (
    <div className="spark-page-narrow">
      <PalContent />
    </div>
  );
}
