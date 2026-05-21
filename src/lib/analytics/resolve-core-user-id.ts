import { Pool } from "pg";
import { normalizeAnalyticsEmail } from "@/lib/analytics/normalize-email";

let corePool: Pool | null = null;

function getCorePool(): Pool | null {
  const connectionString = process.env.CORE_DATABASE_URL?.trim();
  if (!connectionString) return null;

  if (!corePool) {
    corePool = new Pool({ connectionString, max: 3, idleTimeoutMillis: 30000 });
  }
  return corePool;
}

/**
 * Optional link to the core app `User` row by email.
 * Set CORE_DATABASE_URL to the map app's Neon DB (or a read replica).
 * Returns null when unset or no match — analytics still records the event.
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
      "[analytics] CORE_DATABASE_URL lookup failed:",
      e instanceof Error ? e.message : e
    );
    return null;
  }
}
