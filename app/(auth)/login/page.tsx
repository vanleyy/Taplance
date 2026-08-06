"use client";
import { Button } from "@/components/ui/button";
import Google from "@/public/Google";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const Login = () => {
  const supabase = createClient();
  const signIn = async () => {
    // Use the current origin so sign-in works on localhost, previews and prod.
    // Each origin must be listed in Supabase's redirect URL allowlist.
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) toast.error("Could not sign in with Google. Please try again.");
  };
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-8">
      {/* Background */}
      <div className="absolute inset-0 -z-10 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]" />

      <div className="w-full max-w-sm rounded-xl bg-secondary p-6 sm:p-8 shadow-lg flex flex-col items-center gap-6 text-center">
        <div>
          <p className="text-2xl font-semibold tracking-tight">
            Sign in to Taplance
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back! Please sign in to continue
          </p>
        </div>

        <Button
          onClick={signIn}
          variant="outline"
          className="w-full h-11 cursor-pointer"
        >
          Continue with Google
          <Google className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default Login;
