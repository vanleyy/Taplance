"use client";

import NavBar from "@/components/navbar";
import { ProfileProvider } from "@/lib/context/profile-context";
import { useAuthedUserId } from "@/lib/hooks/use-authed-user";

/**
 * Client wrapper for the protected route group: resolves the signed-in user,
 * shows a spinner while loading, and renders the navbar + page content.
 * Lives in its own component so the group layout can stay a server component
 * (and therefore export metadata).
 */
export function ProtectedShell({ children }: { children: React.ReactNode }) {
  const userId = useAuthedUserId();

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  return (
    <ProfileProvider value={{ userId }}>
      <NavBar userAuthenticated={true} />
      {children}
    </ProfileProvider>
  );
}
