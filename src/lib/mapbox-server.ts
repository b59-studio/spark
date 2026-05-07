/**
 * Server-side Mapbox API calls (geocoding, directions, etc.).
 *
 * Env: **MAPBOX_ACCESS_TOKEN** — secret default token; never exposed as NEXT_PUBLIC_*.
 * Client maps use NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN separately (see SparkMap).
 */

const MAPBOX_ORIGIN = "https://api.mapbox.com";

export function getMapboxAccessToken(): string | null {
  const token = process.env.MAPBOX_ACCESS_TOKEN;
  return token && token.length > 0 ? token : null;
}

type MapboxFetchOptions = {
  path: string;
  /** Query params forwarded to Mapbox (access_token is added automatically). */
  params?: Record<string, string | undefined>;
};

export async function fetchMapboxJson({ path, params }: MapboxFetchOptions) {
  const token = getMapboxAccessToken();
  if (!token) {
    return {
      ok: false as const,
      status: 503 as const,
      body: { error: "Mapbox is not configured (missing MAPBOX_ACCESS_TOKEN)." },
    };
  }

  const url = new URL(`${MAPBOX_ORIGIN}${path}`);
  url.searchParams.set("access_token", token);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, value);
      }
    }
  }

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 0 },
  });

  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    return {
      ok: false as const,
      status: res.status,
      body:
        typeof data === "object" && data !== null
          ? data
          : { error: "Mapbox request failed.", status: res.status },
    };
  }

  return { ok: true as const, data };
}
