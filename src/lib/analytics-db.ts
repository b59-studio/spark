import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { AnalyticsDatabase } from "@/types/analytics-database";

const globalForAnalytics = globalThis as unknown as {
  analyticsDb: Kysely<AnalyticsDatabase> | null;
};

export function isAnalyticsDbConfigured(): boolean {
  return Boolean(process.env.ANALYTICS_DATABASE_URL?.trim());
}

/** Kysely client for the `analytics` schema. Returns null when not configured. */
export function getAnalyticsDb(): Kysely<AnalyticsDatabase> | null {
  if (!isAnalyticsDbConfigured()) return null;

  if (!globalForAnalytics.analyticsDb) {
    const pool = new Pool({
      connectionString: process.env.ANALYTICS_DATABASE_URL,
      max: 5,
    });
    globalForAnalytics.analyticsDb = new Kysely<AnalyticsDatabase>({
      dialect: new PostgresDialect({ pool }),
    }).withSchema("analytics");
  }

  return globalForAnalytics.analyticsDb;
}
