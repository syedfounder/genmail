"use client";

import { usePathname } from "next/navigation";

export function BetaBanner() {
  const pathname = usePathname();

  const authRoutes = ["/sign-in", "/sign-up", "/login", "/signup"];

  if (authRoutes.some((route) => pathname.startsWith(route))) {
    return null;
  }

  return (
    <div className="bg-[#372F84] text-white text-center py-2 px-4 text-sm font-sans">
      Beta Version - Features may change during development
    </div>
  );
}
