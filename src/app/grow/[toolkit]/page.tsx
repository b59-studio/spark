import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GatedOutboundLinks from "@/components/GatedOutboundLinks";
import {
  getGrowToolkitBySlug,
  getGrowToolkitNav,
  growToolkits,
} from "../toolkits";

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

  const nav = getGrowToolkitNav(toolkit);
  if (!nav) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <p className="body-sm text-secondary mb-3">
        Toolkit {nav.number} of {nav.total}
      </p>
      <h1 className="heading-xl mb-10">{currentToolkit.fullTitle}</h1>

      <p className="body-lg mb-8">{currentToolkit.summary}</p>

      <section className="mb-8">
        <h2 className="heading-sm mb-3">Target</h2>
        <ul className="list-disc pl-5 space-y-2 body-md">
          {currentToolkit.target.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="heading-sm mb-3">Timeframe</h2>
        <ul className="list-disc pl-5 space-y-2 body-md">
          {currentToolkit.timeframe.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="heading-sm mb-3">Tools</h2>
        <ul className="list-disc pl-5 space-y-2 body-md">
          {currentToolkit.tools.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
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

      <nav
        className="mb-8 border-t border-b border-spark-dark/10 py-6"
        aria-label="Previous and next toolkit"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
          <div className="min-h-[2.75rem] flex items-center sm:justify-start">
            {nav.prev ? (
              <Link
                href={`/grow/${nav.prev.slug}`}
                className="btn-secondary inline-flex w-full sm:w-auto justify-center"
              >
                ← {nav.prev.shortLabel}
              </Link>
            ) : null}
          </div>
          <div className="min-h-[2.75rem] flex items-center sm:justify-end">
            {nav.next ? (
              <Link
                href={`/grow/${nav.next.slug}`}
                className="btn-secondary inline-flex w-full sm:w-auto justify-center"
              >
                {nav.next.shortLabel} →
              </Link>
            ) : null}
          </div>
        </div>
      </nav>

      <div className="flex flex-wrap gap-3">
        <Link href="/grow" className="btn-secondary">
          Back to GROW
        </Link>
        <Link href="/resources" className="btn-primary">
          Back to Resources
        </Link>
      </div>
    </div>
  );
}
