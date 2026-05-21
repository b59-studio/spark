import type { Metadata } from "next";
import GrowIndexContent from "@/app/grow/GrowIndexContent";

export const metadata: Metadata = {
  title: "GROW",
  description:
    "GROW | Grassroots Resources for Organizing & Winning. Six toolkits aligned to electoral and legislative calendars, built to outlast individual campaign cycles.",
  alternates: { canonical: "/solutions/grow" },
  openGraph: {
    title: "GROW | TX*SPARK",
    description:
      "Grassroots organizing toolkits in plain language. Don't reinvent the wheel every cycle.",
    url: "/solutions/grow",
  },
};

export default function SolutionsGrowPage() {
  return (
    <div className="spark-page-narrow">
      <GrowIndexContent />
    </div>
  );
}
