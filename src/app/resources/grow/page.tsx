import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GROW",
  description: "GROW — Grassroots Resources for Organizing & Winning.",
  alternates: { canonical: "/resources/grow" },
  openGraph: { title: "GROW | TX*Spark", url: "/resources/grow" },
};

export default function ResourcesGrowPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="heading-xl">GROW</h1>
    </div>
  );
}
