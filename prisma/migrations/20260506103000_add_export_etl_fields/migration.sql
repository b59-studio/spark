-- AlterTable
ALTER TABLE "Block" ADD COLUMN "region" TEXT,
ADD COLUMN "zone" TEXT;

-- AlterTable
ALTER TABLE "Household" ADD COLUMN "sparkCode" TEXT,
ADD COLUMN "importedFrom" TEXT;

-- AlterTable
ALTER TABLE "Voter" ADD COLUMN "middleName" TEXT,
ADD COLUMN "importedFrom" TEXT;

-- AlterTable
ALTER TABLE "VoterScore" ADD COLUMN "generalVoteCount" INTEGER,
ADD COLUMN "primaryDemCount" INTEGER,
ADD COLUMN "primaryTotalCount" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Election_year_type_subtype_key" ON "Election"("year", "type", "subtype");
