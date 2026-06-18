import type { Metadata } from "next";
import PalContent from "./PalContent";
import CmsPage from "@/components/CmsPage";

export const metadata: Metadata = {
  title: "PAL",
  description:
    "PAL (People's Advocacy Lobby) provides bill analysis and tracking tools for organizing, advocacy, and rapid response strategies.",
  openGraph: {
    title: "TX*SPARK | PAL",
    description:
      "Explore PAL resources for bill tracking, analysis, and coordinated advocacy strategies.",
    url: "/pal",
  },
  alternates: { canonical: "/pal" },
};

export default function PalPage() {
  return <CmsPage slug="pal" shell="spark-page-narrow" fallback={<PalFallback />} />;
}

function PalFallback() {
  return (
    <div className="spark-page-narrow">
      <PalContent />
    </div>
  );
}
