"use client";

import dynamic from "next/dynamic";

const DistrictMap = dynamic(
  () => import("@/components/map/DistrcitMap").then((m) => m.TravisCountyMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(70vh,560px)] min-h-[320px] items-center justify-center rounded-lg border border-spark-bone/15 bg-spark-bone/5 text-sm text-spark-bone/70">
        Loading district map…
      </div>
    ),
  },
);

export default function DistrictSection() {
  return <DistrictMap />;
}
