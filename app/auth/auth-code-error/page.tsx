import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Sign in failed",
};

export default function AuthCodeErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 gap-4">
      <AlertCircle className="w-12 h-12 text-red-500" />
      <h1 className="text-2xl font-bold">Sign in failed</h1>
      <p className="text-sm text-muted-foreground max-w-sm">
        We couldn&apos;t complete your sign in. The link may have expired or
        already been used.
      </p>
      <Link href="/login">
        <Button>Back to sign in</Button>
      </Link>
    </div>
  );
}
