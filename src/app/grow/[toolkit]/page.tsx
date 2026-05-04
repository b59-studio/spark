import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GatedOutboundLinks from "@/components/GatedOutboundLinks";
import GrowToolkitCarouselNav from "../GrowToolkitCarouselNav";
import { getGrowToolkitBySlug, growToolkits } from "../toolkits";

type ToolkitPageProps = {
  params: Promise<{ toolkit: string }>;
};

export function generateStaticParams() {
  return growToolkits.map((toolkit) => ({ toolkit: toolkit.slug }));
}

export async function generateMetadata({
  params,
}: ToolkitPageProps): Promise<Metadata> {
  const { toolkit } = await params;
  const currentToolkit = getGrowToolkitBySlug(toolkit);

  if (!currentToolkit) {
    return {};
  }

  return {
    title: currentToolkit.fullTitle,
    description: currentToolkit.summary,
    openGraph: {
      title: `${currentToolkit.fullTitle} | TX*SPARK`,
      description: currentToolkit.summary,
      url: `/grow/${currentToolkit.slug}`,
    },
    alternates: { canonical: `/grow/${currentToolkit.slug}` },
  };
}

export default async function ToolkitPage({ params }: ToolkitPageProps) {
  const { toolkit } = await params;
  const currentToolkit = getGrowToolkitBySlug(toolkit);

  if (!currentToolkit) {
    notFound();
  }

  return (
    <div className="spark-page-narrow">
      <GrowToolkitCarouselNav currentSlug={toolkit} />
      <h1 className="heading-xl mb-6">{currentToolkit.fullTitle}</h1>

      <p className="body-lg mb-6">{currentToolkit.summary}</p>

      <div className="space-y-14">
        <section>
          <h2 className="heading-sm mb-3">Target</h2>
          <ul className="list-disc pl-5 space-y-2 body-md">
            {currentToolkit.target.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="heading-sm mb-3">Timeframe</h2>
          <ul className="list-disc pl-5 space-y-2 body-md">
            {currentToolkit.timeframe.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="heading-sm mb-3">Tools</h2>
          <ul className="list-disc pl-5 space-y-2 body-md">
            {currentToolkit.tools.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="heading-sm mb-3">Tasks</h2>
          <ul className="list-disc pl-5 space-y-2 body-md">
            {currentToolkit.tasks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <GatedOutboundLinks
          heading="Toolkit packet"
          intro="Click below to open the packet in a new tab. First-time visitors confirm their email in a short step so we can send toolkit updates when materials change."
          links={[
            {
              label: "Toolkit packet",
              href: currentToolkit.toolkitPacketHref,
            },
          ]}
        />
      </div>
    </div>
  );
}
