"use client";

import { useTheme } from "next-themes";
import Image from "next/image";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const next = resolvedTheme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Mudar para tema ${next === "dark" ? "escuro" : "claro"}`}
      aria-pressed={resolvedTheme === "dark"}
      title={`Trocar para ${next === "dark" ? "escuro" : "claro"}`}
      className="focus:outline-none transition-transform duration-200 hover:scale-110 z-10 grid place-items-center size-9 rounded-full"
    >
      <Image
        src="/half-moon.png"
        alt="Alterar tema"
        width={36}
        height={36}
        priority
        sizes="36px"
      />
    </button>
  );
}
