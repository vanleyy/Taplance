"use client";

import NavBar from "@/components/navbar";
import { ProfileProvider } from "@/lib/context/profile-context";
import { useAuthedUserId } from "@/lib/hooks/use-authed-user";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = useAuthedUserId();

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
