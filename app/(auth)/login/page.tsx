"use client";
import { Button } from "@/components/ui/button";
import Google from "@/public/Google";
import { createClient } from "@/utils/supabase/client";

const Login = () => {
  const supabase = createClient();
  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `http://localhost:3000/auth/callback`,
      },
    });
  };
  return (
    <div className="flex h-screen justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-5 text-center bg-secondary p-4 md:w-1/4  h-48 rounded-xl">
        <div>
          <p className="croll-m-20 text-xl font-semibold tracking-tight">
            Sign in to Taplance
          </p>
          <p className="text-xs text-gray-500">
            Welcome back! Please sign in to continue
          </p>
        </div>

        <Button onClick={signIn} variant={"outline"} className="cursor-pointer">
          <p>Continue with google</p>
          <Google />
        </Button>
      </div>

      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
    </div>
  );
};

export default Login;
