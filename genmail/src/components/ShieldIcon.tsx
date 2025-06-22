import { Shield } from "lucide-react";

export default function ShieldIcon() {
  return (
    <div className="relative flex items-center justify-center w-56 h-56">
      {/* Outer rings */}
      <div className="absolute w-full h-full rounded-full bg-brand-purple/10 dark:bg-brand-purple/30 animate-pulse" />
      <div className="absolute w-2/3 h-2/3 rounded-full bg-brand-purple/10 dark:bg-brand-purple/30 animate-pulse [animation-delay:0.5s]" />

      {/* Main circle */}
      <div className="relative flex items-center justify-center w-40 h-40 rounded-full bg-brand-purple/20 border-2 border-brand-purple dark:bg-brand-purple/40 dark:border-brand-purple">
        <Shield className="w-20 h-20 text-brand-purple dark:text-purple-300" />
      </div>
    </div>
  );
}
