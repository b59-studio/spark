import { Pool } from "pg";
import { normalizeAnalyticsEmail } from "@/lib/analytics/normalize-email";

let corePool: Pool | null = null;

function getCorePool(): Pool | null {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) return null;

  if (!corePool) {
    corePool = new Pool({ connectionString, max: 3, idleTimeoutMillis: 30000 });
  }
  return corePool;
}

/**
 * Link analytics events to the core app `User` row by email.
 * Uses `DATABASE_URL` (same Neon DB as analytics schema `analytics`).
 * Returns null when unset, no match, or lookup fails — analytics still records.
 */
export async function resolveCoreUserIdByEmail(
  email: string
): Promise<string | null> {
  const pool = getCorePool();
  if (!pool) return null;

  const normalized = normalizeAnalyticsEmail(email);

  try {
    const result = await pool.query<{ id: string }>(
      `SELECT id FROM "User" WHERE lower(email) = $1 LIMIT 1`,
      [normalized]
    );
    return result.rows[0]?.id ?? null;
  } catch (e) {
    console.warn(
      "[analytics] User lookup failed:",
      e instanceof Error ? e.message : e
    );
    return null;
  }
}
