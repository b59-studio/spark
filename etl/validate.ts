// etl/validate.ts
// Runs integrity checks against the database after a load.
// Reports any anomalies without modifying data.
//
// Usage: npx tsx etl/validate.ts
//        npx tsx etl/validate.ts --fail-fast   (exit 1 on first failure)

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const FAIL_FAST = process.argv.includes('--fail-fast');

interface CheckResult {
  name: string;
  passed: boolean;
  detail: string;
}

const results: CheckResult[] = [];

async function check(
  name: string,
  fn: () => Promise<{ passed: boolean; detail: string }>
): Promise<void> {
  try {
    const { passed, detail } = await fn();
    results.push({ name, passed, detail });

    const icon = passed ? '✓' : '✗';
    console.log(`  ${icon} ${name}`);
    if (!passed) {
      console.log(`    → ${detail}`);
      if (FAIL_FAST) process.exit(1);
    }
  } catch (err) {
    results.push({ name, passed: false, detail: String(err) });
    console.log(`  ✗ ${name}`);
    console.log(`    → Error: ${err}`);
    if (FAIL_FAST) process.exit(1);
  }
}

async function run(): Promise<void> {
  console.log('\n🔍 Running post-load validation...\n');

  // ── Referential integrity ─────────────────────────────────────────────────

  await check('All voters have a valid household', async () => {
    const orphaned = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM "Voter" v
      WHERE NOT EXISTS (
        SELECT 1 FROM "Household" h WHERE h.id = v."householdId"
      )
    `;
    const n = Number(orphaned[0].count);
    return { passed: n === 0, detail: `${n} voters missing household` };
  });

  await check('All households have a valid precinct', async () => {
    const orphaned = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM "Household" h
      WHERE NOT EXISTS (
        SELECT 1 FROM "Precinct" p WHERE p.id = h."precinctId"
      )
    `;
    const n = Number(orphaned[0].count);
    return { passed: n === 0, detail: `${n} households missing precinct` };
  });

  await check('All election history rows have valid voter + election', async () => {
    const orphaned = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM "VoterElectionHistory" veh
      WHERE NOT EXISTS (SELECT 1 FROM "Voter" WHERE id = veh."voterId")
         OR NOT EXISTS (SELECT 1 FROM "Election" WHERE id = veh."electionId")
    `;
    const n = Number(orphaned[0].count);
    return { passed: n === 0, detail: `${n} orphaned election history rows` };
  });

  await check('All voter scores reference a valid voter', async () => {
    const orphaned = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM "VoterScore" vs
      WHERE NOT EXISTS (SELECT 1 FROM "Voter" WHERE id = vs."voterId")
    `;
    const n = Number(orphaned[0].count);
    return { passed: n === 0, detail: `${n} orphaned score rows` };
  });

  // ── Row count sanity ──────────────────────────────────────────────────────

  await check('Voter count is non-zero', async () => {
    const n = await prisma.voter.count();
    return { passed: n > 0, detail: `${n} voters in DB` };
  });

  await check('Election count matches expected (11 elections in source file)', async () => {
    const n = await prisma.election.count();
    return {
      passed: n >= 11,
      detail: `${n} elections in DB (expected at least 11 from this file)`,
    };
  });

  await check('Every voter has a score row', async () => {
    const voterCount = await prisma.voter.count();
    const scoreCount = await prisma.voterScore.count();
    return {
      passed: voterCount === scoreCount,
      detail: `${scoreCount} scores for ${voterCount} voters`,
    };
  });

  await check('Every voter has at least one election history row', async () => {
    const missing = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM "Voter" v
      WHERE NOT EXISTS (
        SELECT 1 FROM "VoterElectionHistory" WHERE "voterId" = v.id
      )
    `;
    const n = Number(missing[0].count);
    return {
      passed: n === 0,
      detail: `${n} voters with no election history`,
    };
  });

  // ── Data quality ──────────────────────────────────────────────────────────

  await check('No duplicate VUIDs', async () => {
    const dupes = await prisma.$queryRaw<{ vuid: string; cnt: bigint }[]>`
      SELECT vuid, COUNT(*) as cnt FROM "Voter"
      GROUP BY vuid HAVING COUNT(*) > 1
    `;
    return {
      passed: dupes.length === 0,
      detail:
        dupes.length > 0
          ? `Duplicate VUIDs: ${dupes.map((d) => d.vuid).join(', ')}`
          : 'None',
    };
  });

  await check('Turnout scores are in 0–1 range', async () => {
    const out = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM "VoterScore"
      WHERE "turnoutScore" IS NOT NULL
        AND ("turnoutScore" < 0 OR "turnoutScore" > 1)
    `;
    const n = Number(out[0].count);
    return { passed: n === 0, detail: `${n} out-of-range turnout scores` };
  });

  await check('Household geocoding coverage', async () => {
    const total = await prisma.household.count();
    const geocoded = await prisma.household.count({ where: { lat: { not: null } } });
    const pct = total > 0 ? Math.round((geocoded / total) * 100) : 0;
    // Not a hard failure — geocoding is a separate step
    return {
      passed: true,
      detail: `${geocoded}/${total} households geocoded (${pct}%)`,
    };
  });

  // ── Summary ───────────────────────────────────────────────────────────────

  const failed = results.filter((r) => !r.passed);
  console.log(`\n${failed.length === 0 ? '✅' : '❌'} ${results.length - failed.length}/${results.length} checks passed`);

  if (failed.length > 0) {
    console.log('\nFailed checks:');
    for (const f of failed) {
      console.log(`  - ${f.name}: ${f.detail}`);
    }
    process.exit(1);
  }
}

run()
  .catch((err) => {
    console.error('Validation error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
