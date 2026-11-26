import clsx from "clsx";

export type MarketplaceKey = "mercadolivre" | "amazon" | "shopee" | "magalu";

export const MARKETPLACES: Record<
  MarketplaceKey,
  { label: string; short: string }
> = {
  mercadolivre: { label: "Mercado Livre", short: "ML" },
  amazon: { label: "Amazon", short: "AMZ" },
  shopee: { label: "Shopee", short: "SHP" },
  magalu: { label: "Magalu", short: "MGL" },
};

/** Normaliza o texto livre vindo da API ("Mercado Livre", "amazon"…) para uma chave. */
export function toMarketplaceKey(value: string): MarketplaceKey | null {
  const v = value.toLowerCase();
  if (v.includes("mercado")) return "mercadolivre";
  if (v.includes("amazon")) return "amazon";
  if (v.includes("shopee")) return "shopee";
  if (v.includes("magalu") || v.includes("magazine")) return "magalu";
  return null;
}

const styles: Record<MarketplaceKey, string> = {
  mercadolivre:
    "bg-[var(--mp-mercadolivre)] text-[var(--mp-mercadolivre-ink)]",
  amazon: "bg-[var(--mp-amazon)] text-[var(--mp-amazon-ink)]",
  shopee: "bg-[var(--mp-shopee)] text-[var(--mp-shopee-ink)]",
  magalu: "bg-[var(--mp-magalu)] text-[var(--mp-magalu-ink)]",
};

export function MarketplaceDot({
  marketplace,
  className,
}: Readonly<{ marketplace: MarketplaceKey; className?: string }>) {
  return (
    <span
      aria-hidden
      className={clsx("inline-block size-2.5 rounded-full", styles[marketplace], className)}
    />
  );
}

export default function MarketplaceBadge({
  marketplace,
  size = "md",
}: Readonly<{ marketplace: MarketplaceKey; size?: "sm" | "md" }>) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full font-semibold whitespace-nowrap",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        styles[marketplace]
      )}
    >
      {MARKETPLACES[marketplace].label}
    </span>
  );
}
