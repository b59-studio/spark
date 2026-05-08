import type { Metadata } from "next";
import MapViewToggle from "@/components/map/MapViewToggle";
import DistrictSection from "../DistrictSection";

export const metadata: Metadata = {
  title: "District Map",
  description:
    "Explore district overlays across Travis County, toggle boundaries, and inspect district membership.",
};

export default function DistrictMapPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-spark-bone md:text-4xl">
          District map
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-spark-bone/80">
          Use Explore mode to compare district layers and click any point to quickly see district
          details for visible overlays.
        </p>
      </header>

      <MapViewToggle />
      <DistrictSection />
    </div>
  );
}
