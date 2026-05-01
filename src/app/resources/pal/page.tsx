import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PAL",
  description: "PAL — People's Advocacy Lobby.",
  alternates: { canonical: "/resources/pal" },
  openGraph: { title: "PAL | TX*Spark", url: "/resources/pal" },
};

export default function ResourcesPalPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="heading-xl">PAL</h1>
    </div>
  );
}
