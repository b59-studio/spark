import type { Metadata } from "next";
import BrandName from "@/components/BrandName";
import ToolkitCarousel from "./ToolkitCarousel";

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

// The six-step organizing cycle — the overview the prose below expands on.
function ToolkitCycle() {
  return (
    <section className="mb-10" aria-labelledby="toolkit-cycle">
      <h2 id="toolkit-cycle" className="sr-only">
        The organizing cycle
      </h2>
      <ToolkitCarousel />
    </section>
  );
}

export default function ToolkitsPage() {
  return (
    <div className="spark-page">
      <h1 className="heading-xl mb-6">Toolkits</h1>
      <ToolkitCycle />
      <div className="space-y-6 max-w-3xl">
        <p className="body-md">
          <BrandName /> organizing runs year-round, not just in the weeks before an election. Our model breaks the work into clear, repeatable steps so local teams always know what to do next, whatever the calendar says, and so the relationships and know-how built in one cycle carry into the next instead of starting over every campaign.
        </p>
        <p className="body-md">
          A set of guided toolkits moves a community through the full cycle of organizing: getting to know your precinct and neighbors, recruiting and supporting volunteers, registering and turning out voters, thanking the people who showed up, and tracking the legislation that affects them. Each step builds on the one before it, so momentum compounds rather than resets.
        </p>
        <p className="body-md">
          Every toolkit is written in plain language and built to be used in the field. No inside baseball, no political science degree required. We are preparing each one as its own editable guide. Check back as we publish them.
        </p>
      </div>
    </div>
  );
}
