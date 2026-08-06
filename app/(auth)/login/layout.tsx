import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to Taplance with Google to manage your profile and links.",
};

const LoginLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ✅ Redirect logged-in users to dashboard
  if (user) {
    redirect("/dashboard");
  }

  return <div>{children}</div>;
};

export default LoginLayout;
