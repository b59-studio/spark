import type { Metadata } from "next";
import PalContent from "@/app/pal/PalContent";

export const metadata: Metadata = {
  title: "PAL",
  description: "PAL — People's Advocacy Lobby.",
  alternates: { canonical: "/solutions/pal" },
  openGraph: { title: "PAL | TX*Spark", url: "/solutions/pal" },
};

export default function SolutionsPalPage() {
  return (
    <div className="spark-page-narrow">
      <PalContent />
    </div>
  );
}
