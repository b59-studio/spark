/**
 * Smoke-test upstream map endpoints (ArcGIS layer metadata + Socrata sample).
 * Does not prove boundaries are the latest vintage — only that services respond.
 *
 * Usage: npx tsx scripts/check-map-upstreams.ts
 */

import {
  EXTERNAL_LAYER_URLS,
  type ExternalLayerKey,
} from "../src/data/map-external-layer-urls";

function arcgisLayerRoot(endpoint: string): string | null {
  const m = endpoint.match(/^(https?:\/\/.+?\/(?:MapServer|FeatureServer)\/\d+)/i);
  return m ? m[1] : null;
}

async function main(): Promise<void> {
  const keys = Object.keys(EXTERNAL_LAYER_URLS) as ExternalLayerKey[];
  let failed = false;

  for (const key of keys) {
    const url = EXTERNAL_LAYER_URLS[key];
    try {
      if (key === "austin-city-council") {
        const sampleUrl = url.includes("$limit=")
          ? url.replace(/\$limit=\d+/, "$limit=1")
          : `${url}${url.includes("?") ? "&" : "?"}${"$limit=1"}`;
        const res = await fetch(sampleUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const j = (await res.json()) as { features?: unknown[] };
        const n = Array.isArray(j.features) ? j.features.length : 0;
        console.log(`OK ${key}: Socrata sample returned ${n} feature(s)`);
        continue;
      }

      const root = arcgisLayerRoot(url);
      if (!root) {
        console.warn(`SKIP ${key}: could not derive ArcGIS layer root`);
        continue;
      }

      const metaUrl = `${root}?f=json`;
      const res = await fetch(metaUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const j = (await res.json()) as { mapName?: string; currentVersion?: number; name?: string };
      const label = j.mapName ?? j.name ?? root;
      console.log(`OK ${key}: ${label} (ArcGIS currentVersion=${j.currentVersion ?? "?"})`);
    } catch (err) {
      console.error(`FAIL ${key}:`, err);
      failed = true;
    }
  }

  if (failed) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
