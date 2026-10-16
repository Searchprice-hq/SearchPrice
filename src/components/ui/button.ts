import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-brand-contrast shadow-sm hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-lift active:translate-y-0",
  secondary:
    "bg-surface text-fg border border-border hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-card active:translate-y-0",
  ghost: "text-muted hover:text-fg hover:bg-surface-2",
  danger: "bg-danger text-white hover:opacity-90",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-6 text-base",
};

/** Classes de botão reutilizáveis tanto em <button> quanto em <Link>. */
export function buttonClass(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string
) {
  return clsx(base, variants[variant], sizes[size], className);
}
