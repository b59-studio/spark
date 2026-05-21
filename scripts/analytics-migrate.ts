import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Pool } from "pg";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const migrationsDir = join(root, "db/migrations/analytics");

function listMigrationFiles(): string[] {
  return readdirSync(migrationsDir)
    .filter((name) => /^\d{3}_.+\.sql$/.test(name))
    .sort((a, b) => a.localeCompare(b));
}

async function main() {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) {
    console.error("Set DATABASE_URL before running analytics:migrate");
    process.exit(1);
  }

  const files = listMigrationFiles();
  if (files.length === 0) {
    console.error("No migration files found in", migrationsDir);
    process.exit(1);
  }

  const pool = new Pool({ connectionString });
  try {
    for (const file of files) {
      const migrationPath = join(migrationsDir, file);
      const sql = readFileSync(migrationPath, "utf8");
      await pool.query(sql);
      console.log("Applied:", migrationPath);
    }
  } finally {
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
