"use client";

import dynamic from "next/dynamic";
import MapSessionBanner from "@/components/map/MapSessionBanner";

const SparkMap = dynamic(() => import("@/components/map/SparkMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[min(70vh,560px)] min-h-[320px] items-center justify-center rounded-lg border border-spark-bone/15 bg-spark-bone/5 text-sm text-spark-bone/70">
      Loading map…
    </div>
  ),
});

export default function MapSection() {
  return (
    <>
      <MapSessionBanner />
      <SparkMap />
    </>
  );
}
