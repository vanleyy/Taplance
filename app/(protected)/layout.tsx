"use client";

import NavBar from "@/components/navbar";
import { ProfileProvider } from "@/lib/context/profile-context";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let authListener: any;

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        redirect("/login");
        return;
      }

      setUserId(user.id);
      setLoading(false);

      // Listen to auth state changes
      authListener = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session?.user) {
          redirect("/login");
        } else {
          setUserId(session.user.id);
        }
      });

      console.log("test", typeof authListener);
    };

    getUser();

    return () => {
      // Cleanup listener on unmount
      authListener?.subscription?.unsubscribe();
    };
  }, [supabase]);

  if (!userId)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );

  return (
    <ProfileProvider value={{ userId }}>
      <NavBar userAuthenticated={true} />
      {children}
    </ProfileProvider>
  );
}
