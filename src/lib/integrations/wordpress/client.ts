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

/**
 * Minimal headless WordPress REST client (WP core `/wp/v2` routes).
 * Extend with menus, media, and custom post types as your CMS model grows.
 */
export async function fetchWordPressPosts(
  config: WordPressConfig,
  options?: { perPage?: number; slug?: string }
): Promise<WordPressPost[]> {
  const params = new URLSearchParams({
    per_page: String(options?.perPage ?? 10),
    _embed: "1",
  });
  if (options?.slug) params.set("slug", options.slug);

  const url = `${config.apiBaseUrl}/wp-json/wp/v2/posts?${params}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      ...authHeader(config),
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`WordPress API error (${res.status})`);
  }

  return (await res.json()) as WordPressPost[];
}

export async function fetchWordPressPostBySlug(
  config: WordPressConfig,
  slug: string
): Promise<WordPressPost | null> {
  const posts = await fetchWordPressPosts(config, { perPage: 1, slug });
  return posts[0] ?? null;
}
