import type { WordPressConfig } from "@/lib/integrations/wordpress/config";

export type WordPressPost = {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  modified: string;
  link: string;
};

function authHeader(config: WordPressConfig): HeadersInit {
  if (!config.basicAuth) return {};
  const token = Buffer.from(
    `${config.basicAuth.username}:${config.basicAuth.password}`
  ).toString("base64");
  return { Authorization: `Basic ${token}` };
}

/** WordPress "page" objects share the same core REST shape as posts. */
export type WordPressPage = WordPressPost;

type WordPressFetchOptions = { perPage?: number; slug?: string };

/**
 * Minimal headless WordPress REST client (WP core `/wp/v2` routes).
 * Handles both `posts` and `pages`; extend with menus, media, and custom
 * post types as your CMS model grows.
 */
async function fetchWordPressCollection(
  config: WordPressConfig,
  resource: "posts" | "pages",
  options?: WordPressFetchOptions
): Promise<WordPressPost[]> {
  const params = new URLSearchParams({
    per_page: String(options?.perPage ?? 10),
    _embed: "1",
  });
  if (options?.slug) params.set("slug", options.slug);

  const url = `${config.apiBaseUrl}/wp-json/wp/v2/${resource}?${params}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      ...authHeader(config),
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`WordPress API error (${res.status}) for ${resource}`);
  }

  return (await res.json()) as WordPressPost[];
}

export function fetchWordPressPosts(
  config: WordPressConfig,
  options?: WordPressFetchOptions
): Promise<WordPressPost[]> {
  return fetchWordPressCollection(config, "posts", options);
}

export async function fetchWordPressPostBySlug(
  config: WordPressConfig,
  slug: string
): Promise<WordPressPost | null> {
  const posts = await fetchWordPressCollection(config, "posts", {
    perPage: 1,
    slug,
  });
  return posts[0] ?? null;
}

export function fetchWordPressPages(
  config: WordPressConfig,
  options?: WordPressFetchOptions
): Promise<WordPressPage[]> {
  return fetchWordPressCollection(config, "pages", options);
}

/**
 * Fetch a single published WordPress Page by slug — the primitive the
 * CMS-driven content routes (team, mission, etc.) are built on.
 */
export async function fetchWordPressPageBySlug(
  config: WordPressConfig,
  slug: string
): Promise<WordPressPage | null> {
  const pages = await fetchWordPressCollection(config, "pages", {
    perPage: 1,
    slug,
  });
  return pages[0] ?? null;
}
