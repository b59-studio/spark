import type { Metadata } from "next";
import MapViewToggle from "@/components/map/MapViewToggle";
import MapSection from "../MapSection";

export const metadata: Metadata = {
  title: "Spark Map",
  description:
    "Explore household-level organizing signals with role-aware access and boundary overlays.",
};

export default function SparkMapPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-spark-bone md:text-4xl">
          Spark map
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-spark-bone/80">
          Households are shown by average voter score for the selected metric. Boundaries load from
          PostGIS when you add district layers to the database. Use this view to validate data and
          iterate on visuals.
        </p>
      </header>

      <MapViewToggle />
      <MapSection />
    </div>
  );
}
