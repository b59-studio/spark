import type { Metadata } from "next";
import CmsPage from "@/components/CmsPage";

export const metadata: Metadata = {
  title: "Toolkits",
  description:
    "TX*SPARK's year-round organizing model, supported by nine toolkits that move local teams through the full cycle of community organizing in Texas.",
  alternates: { canonical: "/toolkits" },
  openGraph: {
    title: "Toolkits | TX*SPARK",
    description:
      "A year-round organizing model supported by nine toolkits, from getting to know your precinct to turning out voters and tracking legislation.",
    url: "/toolkits",
  },
};

function ToolkitsFallback() {
  return (
    <div className="spark-page">
      <h1 className="heading-xl mb-6">Toolkits</h1>
      <div className="space-y-6 max-w-3xl">
        <p className="body-md">
          TX*SPARK organizing runs year-round, not just in the weeks before an election. Our toolkits break the work into clear, repeatable steps so local teams always know what to do next, whatever the calendar says.
        </p>
        <p className="body-md">
          The model is supported by nine toolkits that move a community through the full cycle of organizing: getting to know your precinct and neighbors, recruiting volunteers, registering and turning out voters, thanking the people who showed up, and tracking the legislation that affects them.
        </p>
        <h2 className="heading-lg">The nine toolkits</h2>
        <ul className="list-disc pl-6 space-y-2 body-md">
          <li>Get To Know Your Precinct</li>
          <li>Get Out The Volunteers</li>
          <li>Get To Know Your Voters</li>
          <li>Get Our Texas Voters Registered</li>
          <li>Get Out The Vote</li>
          <li>Thank Y&apos;all So Much</li>
          <li>Bill tracking (PAL) &mdash; part 1</li>
          <li>Bill tracking (PAL) &mdash; part 2</li>
          <li>Bill tracking (PAL) &mdash; part 3</li>
        </ul>
        <p className="body-md">
          Each toolkit is being prepared as its own editable guide. Check back as we publish them.
        </p>
      </div>
    </div>
  );
}

export default function ToolkitsPage() {
  return <CmsPage slug="toolkits" fallback={<ToolkitsFallback />} />;
}
