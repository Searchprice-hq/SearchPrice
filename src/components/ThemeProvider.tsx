"use client";

import { ReactNode } from "react";
import { useTheme } from "@/hooks/useTheme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  return <div data-theme={theme}>{children}</div>;
}
