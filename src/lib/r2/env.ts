/**
 * Server-side / CI only — never expose these to the browser.
 * See Cloudflare dashboard: R2 → bucket → S3 API credentials.
 */
export type R2SnapshotCredentials = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
};

export function getR2SnapshotEnv(): R2SnapshotCredentials | null {
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucketName = process.env.R2_BUCKET_NAME?.trim();

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    return null;
  }

  return { accountId, accessKeyId, secretAccessKey, bucketName };
}

export function requireR2SnapshotEnv(): R2SnapshotCredentials {
  const env = getR2SnapshotEnv();
  if (!env) {
    throw new Error(
      "Missing R2 env: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME",
    );
  }
  return env;
}
