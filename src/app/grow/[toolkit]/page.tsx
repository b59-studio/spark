import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="heading-xl mb-4">{currentToolkit.fullTitle}</h1>
      <p className="body-lg mb-10">{currentToolkit.summary}</p>

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
