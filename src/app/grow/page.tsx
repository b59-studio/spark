import type { Metadata } from "next";
import GrowIndexContent from "./GrowIndexContent";

export const metadata: Metadata = {
  title: "GROW",
  description:
    "GROW (Grassroots Resources for Organizing & Winning) provides TX*SPARK toolkits aligned with electoral and legislative calendars for year-round action. Plain language, no inside baseball.",
  openGraph: {
    title: "GROW | TX*SPARK",
    description:
      "Explore GROW: grassroots organizing toolkits built to outlast individual campaign cycles. Don't reinvent the wheel every cycle.",
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
