import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Pool } from "pg";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const migrationPath = join(
  root,
  "db/migrations/analytics/001_init.sql"
);

async function main() {
  const connectionString = process.env.ANALYTICS_DATABASE_URL?.trim();
  if (!connectionString) {
    console.error("Set ANALYTICS_DATABASE_URL before running analytics:migrate");
    process.exit(1);
  }

  const sql = readFileSync(migrationPath, "utf8");
  const pool = new Pool({ connectionString });
  try {
    await pool.query(sql);
    console.log("Analytics schema migrated:", migrationPath);
  } finally {
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
