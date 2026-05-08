"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MAP_VIEWS = [
  { href: "/map/district", label: "District map" },
  { href: "/map/spark", label: "Spark map" },
] as const;

export default function MapViewToggle() {
  const pathname = usePathname();

  return (
    <nav aria-label="Map view selector" className="mb-5">
      <div className="inline-flex rounded-lg border border-spark-bone/20 bg-spark-bone/5 p-1">
        {MAP_VIEWS.map((view) => {
          const isActive = pathname === view.href;
          return (
            <Link
              key={view.href}
              href={view.href}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                isActive
                  ? "bg-spark-bone text-spark-void shadow-sm"
                  : "text-spark-bone/85 hover:bg-spark-bone/10"
              }`}
            >
              {view.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
