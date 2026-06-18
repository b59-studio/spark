import type { Metadata } from "next";
import CmsPage from "@/components/CmsPage";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Grassroots Tech for Texans. Explore TX*SPARK work across civic technology, organizing infrastructure, and practical tools for coalition-based action in Texas.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Work | TX*SPARK",
    description:
      "See how TX*SPARK builds practical technology and support tools that help Texans organize, coordinate, and take meaningful civic action.",
    url: "/work",
  },
};

export default function Work() {
  return <CmsPage slug="work" shell="spark-page-wide" fallback={<WorkFallback />} />;
}

function WorkFallback() {
  return (
    <div className="spark-page-wide">
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