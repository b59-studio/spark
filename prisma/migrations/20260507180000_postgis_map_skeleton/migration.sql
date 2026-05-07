-- PostGIS + household geography + district boundary tables (map overlays).

CREATE EXTENSION IF NOT EXISTS postgis;

-- ---------------------------------------------------------------------------
-- Household: geography point for spatial queries (kept in sync with lat/lng)
-- ---------------------------------------------------------------------------
ALTER TABLE "Household" ADD COLUMN "locationGeom" geography(Point, 4326);

CREATE INDEX "Household_locationGeom_idx" ON "Household" USING GIST ("locationGeom");

UPDATE "Household"
SET "locationGeom" = ST_SetSRID(ST_MakePoint("lng", "lat"), 4326)::geography
WHERE "lat" IS NOT NULL AND "lng" IS NOT NULL;

CREATE OR REPLACE FUNCTION sync_household_location_geom()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW."lat" IS NOT NULL AND NEW."lng" IS NOT NULL THEN
    NEW."locationGeom" := ST_SetSRID(ST_MakePoint(NEW."lng", NEW."lat"), 4326)::geography;
  ELSE
    NEW."locationGeom" := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_household_location_geom
BEFORE INSERT OR UPDATE OF "lat", "lng" ON "Household"
FOR EACH ROW
EXECUTE PROCEDURE sync_household_location_geom();

-- ---------------------------------------------------------------------------
-- District / overlay layers (multiple overlapping sets per slug)
-- ---------------------------------------------------------------------------
CREATE TABLE "MapBoundaryLayer" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MapBoundaryLayer_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MapBoundaryLayer_slug_key" ON "MapBoundaryLayer"("slug");

CREATE TABLE "MapBoundaryFeature" (
    "id" TEXT NOT NULL,
    "layerId" TEXT NOT NULL,
    "externalKey" TEXT,
    "label" TEXT,
    "geom" geometry(MultiPolygon, 4326) NOT NULL,

    CONSTRAINT "MapBoundaryFeature_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MapBoundaryFeature_layerId_idx" ON "MapBoundaryFeature"("layerId");

CREATE INDEX "MapBoundaryFeature_geom_idx" ON "MapBoundaryFeature" USING GIST ("geom");

ALTER TABLE "MapBoundaryFeature" ADD CONSTRAINT "MapBoundaryFeature_layerId_fkey" FOREIGN KEY ("layerId") REFERENCES "MapBoundaryLayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
