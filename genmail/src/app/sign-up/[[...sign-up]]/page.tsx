import { SignUp } from "@clerk/nextjs";
import AuthLayout from "@/components/AuthLayout";
import Link from "next/link";

export default function Page() {
  return (
    <AuthLayout>
      <div className="flex flex-col items-center text-center">
        <div id="clerk-captcha" className="mb-4"></div>
        <SignUp />
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-4"
        >
          &larr; Return to Home
        </Link>
      </div>
    </AuthLayout>
  );
}
