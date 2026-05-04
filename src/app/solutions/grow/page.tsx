import type { Metadata } from "next";
import GrowIndexContent from "@/app/grow/GrowIndexContent";

export const metadata: Metadata = {
  title: "GROW",
  description: "GROW — Grassroots Resources for Organizing & Winning.",
  alternates: { canonical: "/solutions/grow" },
  openGraph: { title: "GROW | TX*Spark", url: "/solutions/grow" },
};

export default function SolutionsGrowPage() {
  return (
    <div className="spark-page-narrow">
      <GrowIndexContent />
    </div>
  );
}
