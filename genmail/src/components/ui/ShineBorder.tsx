import React from "react";

/**
 * @typedef ShineBorderProps
 * @property {string} borderRadius - The border radius of the component.
 * @property {React.ReactNode} children - The children of the component.
 * @property {string} color - The color of the shine effect.
 * @property {string} borderWidth - The width of the border.
 */
interface ShineBorderProps {
  borderRadius?: number;
  children: React.ReactNode;
  color?: string[];
  borderWidth?: number;
}

/**
 * @param {ShineBorderProps} props
 * @returns {JSX.Element}
 */
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
