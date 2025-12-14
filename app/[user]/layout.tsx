"use client";

import NavBar from "@/components/navbar";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useRef, useState } from "react";

export default function UserPublicDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // prevents loading from toggling again
  const initialized = useRef(false);

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUserAuthenticated(!!user);
      setLoading(false);
      initialized.current = true;

      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        // 🔥 DO NOT touch loading here
        setUserAuthenticated(!!session?.user);
      });

      subscription = data.subscription;
    };

    if (!initialized.current) {
      init();
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  return (
    <>
      <NavBar userAuthenticated={userAuthenticated} />
      {children}
    </>
  );
}
