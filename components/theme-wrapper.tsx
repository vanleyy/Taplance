// app/theme-wrapper.tsx (Client Component)
"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";

export default function ThemeWrapper({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
