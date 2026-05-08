/**
 * Server-side Mapbox API calls (geocoding, directions, etc.).
 *
 * Env: **MAPBOX_ACCESS_TOKEN** preferred (secret default token for server-only calls).
 * If unset, falls back to **NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN** (or NEXT_PUBLIC_MAPBOX_TOKEN)
 * so production matches local setups that only configure the public token. Client maps
 * still need NEXT_PUBLIC_* for mapbox-gl; URL-restricted pk tokens may fail from
 * serverless unless you add MAPBOX_ACCESS_TOKEN.
 */

const MAPBOX_ORIGIN = "https://api.mapbox.com";

export function getMapboxAccessToken(): string | null {
  const secret = process.env.MAPBOX_ACCESS_TOKEN?.trim();
  if (secret) return secret;
  const pub =
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN?.trim() ??
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim();
  return pub && pub.length > 0 ? pub : null;
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
      body: {
        error:
          "Mapbox is not configured (set MAPBOX_ACCESS_TOKEN or NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN).",
      },
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
