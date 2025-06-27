import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background px-4">
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-purple-400/30 via-transparent to-transparent blur-3xl" />
        <div className="absolute right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-blue-500/30 via-transparent to-transparent blur-3xl" />
        <div className="absolute inset-0 w-full h-full pointer-events-none bg-noise opacity-[0.03]"></div>
      </div>
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
