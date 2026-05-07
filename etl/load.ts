// etl/load.ts
// Upserts every entity produced by transform.ts into the database.
// All operations are idempotent — running this twice won't create duplicates.
// Run order matters: parent tables must be loaded before their children.

import { PrismaClient } from '@prisma/client';
import type {
  ElectionDefinition,
  NormalizedBlock,
  NormalizedElectionHistory,
  NormalizedHousehold,
  NormalizedPrecinct,
  NormalizedScore,
  NormalizedVoter,
  TransformResult,
} from './types.js';

const BATCH_SIZE = 500; // rows per createMany call

// ---------------------------------------------------------------------------
// Batch helper
// ---------------------------------------------------------------------------

async function inBatches<T>(
  items: T[],
  batchSize: number,
  handler: (batch: T[]) => Promise<void>,
  label: string
): Promise<void> {
  const total = Math.ceil(items.length / batchSize);
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const n = Math.floor(i / batchSize) + 1;
    process.stdout.write(`  ${label}: batch ${n}/${total}...\r`);
    await handler(batch);
  }
  console.log(`  ✓ ${label}: ${items.length} records`);
}

// ---------------------------------------------------------------------------
// Individual loaders
// ---------------------------------------------------------------------------

async function loadPrecincts(
  prisma: PrismaClient,
  precincts: NormalizedPrecinct[]
): Promise<Map<string, number>> {
  // Upsert each precinct by name+county+state using find-or-create,
  // since Precinct currently has no composite unique key for Prisma upsert.
  const idMap = new Map<string, number>();
  for (const p of precincts) {
    const existing = await prisma.precinct.findFirst({
      where: { name: p.name, county: p.county, state: p.state },
    });
    if (existing) {
      idMap.set(p.name, existing.id);
    } else {
      const created = await prisma.precinct.create({
        data: { name: p.name, county: p.county, state: p.state },
      });
      idMap.set(p.name, created.id);
    }
  }
  console.log(`  ✓ Precincts: ${precincts.length} records`);
  return idMap;
}

async function loadBlocks(
  prisma: PrismaClient,
  blocks: NormalizedBlock[],
  precinctIdMap: Map<string, number>
): Promise<Map<string, number>> {
  const idMap = new Map<string, number>(); // "precinctName|blockName" → id

  for (const b of blocks) {
    const precinctId = precinctIdMap.get(b.precinctName);
    if (!precinctId) {
      console.warn(`  ⚠ Unknown precinct for block "${b.name}": ${b.precinctName}`);
      continue;
    }

    const mapKey = `${b.precinctName}|${b.name}`;
    const existing = await prisma.block.findFirst({
      where: { name: b.name, precinctId },
    });
    if (existing) {
      idMap.set(mapKey, existing.id);
    } else {
      const created = await prisma.block.create({
        data: {
          name: b.name,
          precinctId,
          region: b.region,
          zone: b.zone,
        },
      });
      idMap.set(mapKey, created.id);
    }
  }
  console.log(`  ✓ Blocks: ${blocks.length} records`);
  return idMap;
}

async function loadHouseholds(
  prisma: PrismaClient,
  households: NormalizedHousehold[],
  precinctIdMap: Map<string, number>,
  blockIdMap: Map<string, number>
): Promise<Map<string, string>> {
  // Returns: addressKey → household DB id
  const idMap = new Map<string, string>();

  await inBatches(
    households,
    BATCH_SIZE,
    async (batch) => {
      for (const h of batch) {
        const precinctId = precinctIdMap.get(h.precinctName);
        if (!precinctId) continue;

        const blockKey = h.precinctName + '|' + (h.blockName ?? 'Unknown');
        const blockId = blockIdMap.get(blockKey) ?? undefined;

        // Dedup on address+city+state+zip
        const existing = await prisma.household.findFirst({
          where: { address: h.address, city: h.city, state: h.state, zip: h.zip },
          select: { id: true },
        });

        if (existing) {
          idMap.set(h.addressKey, existing.id);
        } else {
          const created = await prisma.household.create({
            data: {
              address: h.address,
              city: h.city,
              state: h.state,
              zip: h.zip,
              sparkCode: h.sparkCode,
              precinctId,
              blockId: blockId ?? null,
              importedFrom: h.importedFrom,
            },
          });
          idMap.set(h.addressKey, created.id);
        }
      }
    },
    'Households'
  );

  return idMap;
}

async function loadVoters(
  prisma: PrismaClient,
  voters: NormalizedVoter[],
  householdIdMap: Map<string, string>
): Promise<Map<string, string>> {
  // Returns: vuid → voter DB id
  const idMap = new Map<string, string>();

  await inBatches(
    voters,
    BATCH_SIZE,
    async (batch) => {
      for (const v of batch) {
        const householdId = householdIdMap.get(v.addressKey);
        if (!householdId) {
          console.warn(`  ⚠ No household for voter VUID ${v.vuid}`);
          continue;
        }

        const record = await prisma.voter.upsert({
          where: { vuid: v.vuid },
          create: {
            vuid: v.vuid,
            firstName: v.firstName,
            middleName: v.middleName,
            lastName: v.lastName,
            gender: v.gender,
            status: v.status,
            householdId,
            importedFrom: v.importedFrom,
          },
          update: {
            firstName: v.firstName,
            middleName: v.middleName,
            lastName: v.lastName,
            gender: v.gender,
            status: v.status,
            householdId,
          },
        });

        idMap.set(v.vuid, record.id);
      }
    },
    'Voters'
  );

  return idMap;
}

async function loadElections(
  prisma: PrismaClient,
  elections: ElectionDefinition[]
): Promise<Map<string, number>> {
  const idMap = new Map<string, number>();

  for (const e of elections) {
    // Election has @@unique([year, type, subtype]) in the updated schema
    const record = await prisma.election.upsert({
      where: {
        year_type_subtype: { year: e.year, type: e.type, subtype: e.subtype },
      },
      create: { year: e.year, type: e.type, subtype: e.subtype },
      update: {},
    });
    idMap.set(e.key, record.id);
  }

  console.log(`  ✓ Elections: ${elections.length} records`);
  return idMap;
}

async function loadElectionHistory(
  prisma: PrismaClient,
  history: NormalizedElectionHistory[],
  voterIdMap: Map<string, string>,
  electionIdMap: Map<string, number>
): Promise<void> {
  const rows = history
    .map((h) => {
      const voterId = voterIdMap.get(h.vuid);
      const electionId = electionIdMap.get(h.electionKey);
      if (!voterId || !electionId) return null;
      return { voterId, electionId, voted: h.voted, party: h.party ?? null, method: null };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  await inBatches(
    rows,
    BATCH_SIZE,
    async (batch) => {
      // createMany with skipDuplicates respects the @@id([voterId, electionId]) constraint
      await prisma.voterElectionHistory.createMany({
        data: batch,
        skipDuplicates: true,
      });
    },
    'Election history'
  );
}

async function loadScores(
  prisma: PrismaClient,
  scores: NormalizedScore[],
  voterIdMap: Map<string, string>
): Promise<void> {
  await inBatches(
    scores,
    BATCH_SIZE,
    async (batch) => {
      for (const s of batch) {
        const voterId = voterIdMap.get(s.vuid);
        if (!voterId) continue;

        await prisma.voterScore.upsert({
          where: { voterId },
          create: {
            voterId,
            turnoutScore: s.turnoutScore,
            persuasionScore: s.persuasionScore,
            partyConfidence: s.partyConfidence,
            generalVoteCount: s.generalVoteCount,
            primaryDemCount: s.primaryDemCount,
            primaryTotalCount: s.primaryTotalCount,
          },
          update: {
            turnoutScore: s.turnoutScore,
            persuasionScore: s.persuasionScore,
            partyConfidence: s.partyConfidence,
            generalVoteCount: s.generalVoteCount,
            primaryDemCount: s.primaryDemCount,
            primaryTotalCount: s.primaryTotalCount,
          },
        });
      }
    },
    'Voter scores'
  );
}

// ---------------------------------------------------------------------------
// Orchestrated loader
// ---------------------------------------------------------------------------

export async function load(result: TransformResult): Promise<void> {
  const prisma = new PrismaClient();

  try {
    console.log('\n🔄 Loading into database...');

    const precinctIdMap = await loadPrecincts(prisma, result.precincts);
    const blockIdMap = await loadBlocks(prisma, result.blocks, precinctIdMap);
    const householdIdMap = await loadHouseholds(
      prisma, result.households, precinctIdMap, blockIdMap
    );
    const voterIdMap = await loadVoters(prisma, result.voters, householdIdMap);
    const electionIdMap = await loadElections(prisma, result.elections);
    await loadElectionHistory(
      prisma, result.electionHistory, voterIdMap, electionIdMap
    );
    await loadScores(prisma, result.scores, voterIdMap);

    console.log('\n✅ Load complete.');
  } finally {
    await prisma.$disconnect();
  }
}
