"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

type AuthListener = {
  data: { subscription: { unsubscribe: () => void } };
};

/**
 * Resolves the signed-in user's id, or null while loading/redirecting.
 * Redirects to /login when signed out and back to / when the session ends.
 */
export function useAuthedUserId() {
  const supabase = createClient();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let authListener: AuthListener | null = null;

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUserId(user.id);

      // Listen to auth state changes
      authListener = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session?.user) {
          router.replace("/");
        } else {
          setUserId(session.user.id);
        }
      });
    };

    getUser();

    return () => {
      // Cleanup listener on unmount
      authListener?.data?.subscription?.unsubscribe();
    };
  }, [router, supabase]);

  return userId;
}
