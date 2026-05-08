import { S3Client } from "@aws-sdk/client-s3";
import type { R2SnapshotCredentials } from "@/lib/r2/env";

/** Cloudflare R2 is S3-compatible; region must be `auto`. */
export function createR2S3Client(creds: R2SnapshotCredentials): S3Client {
  return new S3Client({
    region: "auto",
    endpoint: `https://${creds.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: creds.accessKeyId,
      secretAccessKey: creds.secretAccessKey,
    },
  });
}
