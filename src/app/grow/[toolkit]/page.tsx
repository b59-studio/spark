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

      <p className="body-md mb-6">{currentToolkit.summary}</p>

      <GatedOutboundLinks
        signupSource={`grow-toolkit:${toolkit}`}
        heading="Get the free toolkit"
        className="spark-panel spark-carousel-slide-outline mb-14"
        headingClassName="heading-md mb-4"
        intro="Get the whole toolkit for free below!"
        introClassName="body-md mb-5 max-w-prose"
        loadingClassName="body-md text-secondary"
        links={[
          {
            label: "Toolkit packet",
            href: currentToolkit.toolkitPacketHref,
          },
        ]}
      />

      <h2 className="heading-lg mb-6">Summary</h2>

      <div className="space-y-14">
        <section className="spark-panel spark-carousel-slide-outline rounded-2xl p-6 sm:p-7">
          <h2 className="heading-md mb-4">Target</h2>
          <ul className="body-md list-disc pl-6 space-y-2">
            {currentToolkit.target.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="spark-panel spark-carousel-slide-outline rounded-2xl p-6 sm:p-7">
          <h2 className="heading-md mb-4">Timeframe</h2>
          <ul className="body-md list-disc pl-6 space-y-2">
            {currentToolkit.timeframe.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="spark-panel spark-carousel-slide-outline rounded-2xl p-6 sm:p-7">
          <h2 className="heading-md mb-4">Tools</h2>
          <ul className="body-md list-disc pl-6 space-y-2">
            {currentToolkit.tools.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="spark-panel spark-carousel-slide-outline rounded-2xl p-6 sm:p-7">
          <h2 className="heading-md mb-4">Tasks</h2>
          <ul className="body-md list-disc pl-6 space-y-2">
            {currentToolkit.tasks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
