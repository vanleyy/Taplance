"use client";

import { createContext, useContext } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ProfileContextType = {
  userId: string;
};

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({
  value,
  children,
}: {
  value: ProfileContextType;
  children: React.ReactNode;
}) {
  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used inside ProfileProvider");
  }
  return ctx;
}
