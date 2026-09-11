import type { ReactNode } from "react";
import { getWordPressConfig } from "@/lib/integrations/wordpress/config";
import { fetchWordPressPageBySlug } from "@/lib/integrations/wordpress/client";

type PageShell = "spark-page" | "spark-page-narrow" | "spark-page-wide";

type CmsPageProps = {
  /** WordPress Page slug to render (e.g. "mission"). */
  slug: string;
  /**
   * In-code content rendered when WordPress is unconfigured, unreachable, or has
   * no published page for `slug`. Keeps every route working with zero CMS deps.
   */
  fallback: ReactNode;
  /** Page shell width; defaults to the standard `spark-page`. */
  shell?: PageShell;
  /**
   * In-code content rendered between the page title and the CMS body — for a
   * route that needs an interactive block the editors can't author in WP.
   * The `fallback` owns its own copy, since it renders instead of this shell.
   */
  afterTitle?: ReactNode;
};

/**
 * Renders a headless-WordPress Page inside the site chrome, falling back to
 * in-code content whenever the CMS can't be reached. Content edited in WP admin
 * appears within the ISR window (see `revalidate` in the WordPress client) — no
 * redeploy required.
 *
 * Trust boundary: `content.rendered` is injected as HTML. WordPress sanitizes
 * author input server-side (wp_kses) and pages are authored by trusted, signed-in
 * editors. If untrusted authorship is ever introduced, add an allowlist sanitizer
 * (e.g. sanitize-html) here before shipping.
 */
export default async function CmsPage({
  slug,
  fallback,
  shell = "spark-page",
  afterTitle,
}: CmsPageProps) {
  const config = getWordPressConfig();
  if (!config) return <>{fallback}</>;

  let page;
  try {
    page = await fetchWordPressPageBySlug(config, slug);
  } catch (error) {
    console.warn(
      `[cms-page] falling back for "${slug}":`,
      error instanceof Error ? error.message : error
    );
    return <>{fallback}</>;
  }

  if (!page) return <>{fallback}</>;

  return (
    <div className={shell}>
      <h1
        className="heading-xl mb-6"
        dangerouslySetInnerHTML={{ __html: page.title.rendered }}
      />
      {afterTitle}
      <div
        className="cms-prose"
        dangerouslySetInnerHTML={{ __html: page.content.rendered }}
      />
    </div>
  );
}
