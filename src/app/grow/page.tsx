import type { Metadata } from "next";
import GrowIndexContent from "./GrowIndexContent";

export const metadata: Metadata = {
  title: "GROW",
  description:
    "GROW (Grassroots Resources for Organizing & Winning) provides TX*SPARK toolkits aligned with electoral and legislative calendars for year-round action.",
  openGraph: {
    title: "GROW | TX*SPARK",
    description:
      "Explore GROW: grassroots organizing and campaign-ready toolkits designed for meaningful year-round civic action.",
    url: "/grow",
  },
  alternates: { canonical: "/grow" },
};

export default function GrowPage() {
  return (
    <div className="spark-page-narrow">
      <GrowIndexContent />
    </div>
  );
}
