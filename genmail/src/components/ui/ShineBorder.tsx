import React from "react";

export default function ShineBorder({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="relative overflow-hidden rounded-md w-full">
      {children}
      <div className="absolute inset-0 -translate-x-full animate-shine bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </div>
  );
}
