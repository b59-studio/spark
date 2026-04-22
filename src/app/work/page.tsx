import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Grassroots Tech for Texans. Explore TX*Spark work across civic technology, organizing infrastructure, and practical tools for coalition-based action in Texas.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Work | TX*Spark",
    description:
      "See how TX*Spark builds practical technology and support tools that help Texans organize, coordinate, and take meaningful civic action.",
    url: "/work",
  },
};

export default function Work() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="heading-xl mb-6">Work</h1>
      <p className="body-lg max-w-2xl mb-6">
        We&apos;ve built voting registration platforms and designed shoes. We&apos;ll tell you more about it here soon.
      </p>
      <a href="/about" className="btn-primary">
            Work with Us
        </a>
    </div>
  );
}