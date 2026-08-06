import type { Metadata } from "next";
import { ProtectedShell } from "@/features/dashboard/protected-shell";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your Taplance profile and links.",
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedShell>{children}</ProtectedShell>;
}
