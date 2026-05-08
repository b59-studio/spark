"use client";

import dynamic from "next/dynamic";

const DistrictMap = dynamic(
  () => import("@/components/map/DistrcitMap").then((m) => m.TravisCountyMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(70vh,560px)] min-h-[320px] items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-sm text-gray-600">
        Loading district map…
      </div>
    ),
  },
);

export default function DistrictSection() {
  return <DistrictMap />;
}
