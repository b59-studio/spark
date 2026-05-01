import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "People",
  description: "TX*Spark people.",
  alternates: { canonical: "/about/people" },
  openGraph: { title: "People | TX*Spark", url: "/about/people" },
};

export default function AboutPeoplePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="heading-xl">People</h1>
    </div>
  );
}
