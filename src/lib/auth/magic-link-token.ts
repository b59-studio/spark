import { createHash, randomBytes } from "node:crypto";

export function generateMagicLinkSecret(): string {
  return randomBytes(32).toString("base64url");
}

export function hashMagicLinkSecret(raw: string): string {
  return createHash("sha256").update(raw, "utf8").digest("hex");
}
