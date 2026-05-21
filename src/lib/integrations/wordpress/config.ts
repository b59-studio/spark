export type WordPressConfig = {
  /** Public WordPress site URL (no trailing slash), e.g. https://cms.example.org */
  apiBaseUrl: string;
  /** Optional Application Password user for draft/preview fetches. */
  basicAuth?: { username: string; password: string };
};

export function getWordPressConfig(): WordPressConfig | null {
  const apiBaseUrl = process.env.WORDPRESS_API_URL?.trim().replace(/\/$/, "");
  if (!apiBaseUrl) return null;

  const username = process.env.WORDPRESS_APP_USER?.trim();
  const password = process.env.WORDPRESS_APP_PASSWORD?.trim();

  return {
    apiBaseUrl,
    basicAuth:
      username && password ? { username, password } : undefined,
  };
}
