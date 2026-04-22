import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "tx_spark — Brand guidelines",
  description:
    "Internal brand guidelines deck for tx_spark — three directions: Starfield Drifter, Hill Country Heat, Live Wire.",
  robots: { index: false, follow: false },
};

export default function BrandingLayout({ children }: { children: ReactNode }) {
  return children;
}
