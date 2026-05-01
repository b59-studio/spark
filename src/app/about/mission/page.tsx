import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mission",
  description: "TX*Spark mission.",
  alternates: { canonical: "/about/mission" },
  openGraph: { title: "Mission | TX*Spark", url: "/about/mission" },
};

export default function AboutMissionPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="heading-xl">Mission</h1>
    </div>
  );
}
