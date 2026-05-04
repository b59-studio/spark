"use client";

import { usePathname } from "next/navigation";

export default function MainFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <main className={`flex-1 overflow-x-hidden ${isHome ? "pt-0" : "pt-24"}`}>{children}</main>
  );
}
