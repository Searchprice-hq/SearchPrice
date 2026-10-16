"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu, X } from "lucide-react";
import clsx from "clsx";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { buttonClass } from "@/components/ui/button";

// Todas as entradas apontam para seções da home: na própria home o navegador
// rola suavemente (scroll-behavior: smooth); nas outras páginas, navega e posiciona.
const NAV = [
  { label: "Como funciona", id: "como-funciona" },
  { label: "Canais", id: "canais" },
  { label: "Diferenciais", id: "diferenciais" },
  { label: "Depoimentos", id: "depoimentos" },
  { label: "Sobre", id: "sobre" },
];

/** Destaca no menu a seção que está no meio da tela. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(
      (el): el is HTMLElement => !!el
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [enabled]);

  return enabled ? active : null;
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const active = useActiveSection(isHome);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu aberto: trava a rolagem do fundo e fecha com Esc ou ao voltar para desktop.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  const hrefOf = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <header
      className={clsx(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled || open
          ? "border-b border-border bg-bg/85 shadow-card backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="hidden lg:block" aria-label="Principal">
          <ul className="flex items-center gap-1 rounded-full border border-border bg-surface/70 p-1 backdrop-blur">
            {NAV.map((item) => (
              <li key={item.id}>
                <a
                  href={hrefOf(item.id)}
                  aria-current={active === item.id ? "true" : undefined}
                  className={clsx(
                    "block rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200",
                    active === item.id
                      ? "bg-brand text-brand-contrast shadow-sm"
                      : "text-muted hover:bg-surface-2 hover:text-fg"
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          {/* Wrapper controla a visibilidade: buttonClass já traz inline-flex. */}
          <div className="hidden items-center gap-1.5 sm:flex">
            <ThemeToggle />
            <Link href="/login" className={buttonClass("ghost", "sm")}>
              Entrar
            </Link>
            <Link href="/register" className={buttonClass("primary", "sm")}>
              Testar grátis
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="grid size-10 place-items-center rounded-xl border border-border bg-surface text-fg transition-colors hover:bg-surface-2 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Principal"
          className="absolute inset-x-0 top-full h-[calc(100dvh-4rem)] animate-[fade-in_0.2s_ease-out] overflow-y-auto border-t border-border bg-bg px-4 pb-6 lg:hidden"
        >
          <ul className="flex flex-col py-3">
            {NAV.map((item) => (
              <li key={item.id}>
                <a
                  href={hrefOf(item.id)}
                  onClick={() => {
                    // libera a rolagem antes do salto para a âncora
                    document.body.style.overflow = "";
                    setOpen(false);
                  }}
                  className={clsx(
                    "flex items-center justify-between rounded-xl px-3 py-3.5 text-lg font-semibold transition-colors hover:bg-surface-2",
                    active === item.id ? "text-brand" : "text-fg"
                  )}
                >
                  {item.label}
                  <ChevronRight className="size-5 text-subtle" />
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between rounded-xl border border-border px-3 py-2">
            <span className="text-sm font-medium text-muted">Tema</span>
            <ThemeToggle />
          </div>
          <div className="mt-4 grid gap-2 sm:hidden">
            <Link href="/register" onClick={() => setOpen(false)} className={buttonClass("primary", "md")}>
              Testar grátis
            </Link>
            <Link href="/login" onClick={() => setOpen(false)} className={buttonClass("secondary", "md")}>
              Entrar
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
