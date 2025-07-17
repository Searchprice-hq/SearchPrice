"use client";

import { ReactNode } from "react";
import { useTheme } from "@/hooks/useTheme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  // opcional: se quiser, poderia colocar data-theme no <body> ou numa div
  return <div data-theme={theme}>{children}</div>;
}
