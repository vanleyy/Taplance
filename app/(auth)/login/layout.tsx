import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const LoginLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  console.log("user", user);

  // ✅ Redirect logged-in users to dashboard
  if (user) {
    redirect("/dashboard");
  }

  return <div>{children}</div>;
};

export default LoginLayout;
