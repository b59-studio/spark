/**
 * Upload GeoJSON snapshots for `/api/map/external-layer` layers to Cloudflare R2.
 *
 * Prerequisites (you provide):
 * - R2 bucket + public access (custom domain or r2.dev) — see Cloudflare dashboard
 * - S3 API credentials: R2 → bucket → "Manage R2 API Tokens"
 *
 * Env (server / CI only — never commit):
 *   R2_ACCOUNT_ID
 *   R2_ACCESS_KEY_ID
 *   R2_SECRET_ACCESS_KEY
 *   R2_BUCKET_NAME
 *   MAP_GEOJSON_R2_KEY_PREFIX   (optional, default map/geo/v1)
 *
 * App env (browser — set in Vercel):
 *   NEXT_PUBLIC_MAP_GEOJSON_CDN_BASE = https://<pub-url>/<prefix-without-trailing-slash>
 *   e.g. if objects are at https://pub-xxx.r2.dev/map/geo/v1/congressional.geojson
 *        then NEXT_PUBLIC_MAP_GEOJSON_CDN_BASE=https://pub-xxx.r2.dev/map/geo/v1
 *
 * Usage:
 *   R2_SNAPSHOT_DRY_RUN=1 npx tsx scripts/snapshot-map-layers-to-r2.ts   # print keys + sizes only
 *   npx tsx scripts/snapshot-map-layers-to-r2.ts
 */

import { PutObjectCommand } from "@aws-sdk/client-s3";
import {
  EXTERNAL_LAYER_URLS,
  type ExternalLayerKey,
} from "../src/data/map-external-layer-urls";
import { fetchExternalLayerGeoJson } from "../src/lib/map/external-layer-fetch";
import { requireR2SnapshotEnv } from "../src/lib/r2/env";
import { objectKeyForDistrictLayer } from "../src/lib/r2/map-snapshot-keys";
import { createR2S3Client } from "../src/lib/r2/s3-client";

const LAYER_ORDER = Object.keys(EXTERNAL_LAYER_URLS) as ExternalLayerKey[];

async function main(): Promise<void> {
  const dryRun = process.env.R2_SNAPSHOT_DRY_RUN === "1";
  const creds = dryRun ? undefined : requireR2SnapshotEnv();
  const client = creds ? createR2S3Client(creds) : undefined;

  const snapshotTimeoutMs = Number(process.env.MAP_SNAPSHOT_FETCH_TIMEOUT_MS ?? "180000");

  for (const layer of LAYER_ORDER) {
    const fc = await fetchExternalLayerGeoJson(layer, { timeoutMs: snapshotTimeoutMs });
    const body = Buffer.from(JSON.stringify(fc), "utf8");
    const key = objectKeyForDistrictLayer(layer);

    if (dryRun) {
      console.log(`[dry-run] ${layer} -> ${key} (${body.length} bytes)`);
      continue;
    }

    await client!.send(
      new PutObjectCommand({
        Bucket: creds!.bucketName,
        Key: key,
        Body: body,
        ContentType: "application/geo+json",
        CacheControl: "public, max-age=86400, stale-while-revalidate=604800",
      }),
    );
    console.log(`Uploaded ${layer} -> ${key}`);
  }

  console.log(
    dryRun
      ? "\nDry run complete. Unset R2_SNAPSHOT_DRY_RUN and configure R2 env to upload."
      : "\nDone. Set NEXT_PUBLIC_MAP_GEOJSON_CDN_BASE to your public base URL (see script header).",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
