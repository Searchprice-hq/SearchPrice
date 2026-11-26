import { DollarSign, Store, TrendingDown, TrendingUp } from "lucide-react";
import { formatBRL } from "@/helpers/currency";
import type { Analysis } from "@/services/pricingService";

const pct = (n: number) => `${n.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;

function Card({
  label,
  Icon,
  iconClass,
  value,
  unit,
  hint,
}: Readonly<{
  label: string;
  Icon: typeof Store;
  iconClass: string;
  value: string;
  unit?: string;
  hint: string;
}>) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-card sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</p>
        <Icon className={`size-4 shrink-0 ${iconClass}`} aria-hidden />
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight text-fg tabular sm:text-[26px]">
        {value}
        {unit && <span className="ml-1.5 text-sm font-medium text-muted">{unit}</span>}
      </p>
      <p className="mt-1 truncate text-xs text-muted" title={hint}>
        {hint}
      </p>
    </div>
  );
}

export default function KpiCards({ analysis }: Readonly<{ analysis: Analysis }>) {
  const { stats, cheapest, priciest, validOffers, distinctSellers, outliers } = analysis.summary;
  return (
    <section aria-label="Resumo do mercado" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Card
        label="Menor preço"
        Icon={TrendingDown}
        iconClass="text-success"
        value={stats ? formatBRL(stats.min) : "—"}
        hint={cheapest ? `${cheapest.seller} (${cheapest.marketplaceLabel})` : "Sem ofertas"}
      />
      <Card
        label="Preço mediano"
        Icon={DollarSign}
        iconClass="text-brand"
        value={stats ? formatBRL(stats.median) : "—"}
        hint={stats ? `Média: ${formatBRL(stats.mean)}` : "—"}
      />
      <Card
        label="Maior preço & dispersão"
        Icon={TrendingUp}
        iconClass="text-danger"
        value={stats ? formatBRL(stats.max) : "—"}
        hint={
          stats
            ? `Dispersão: ${pct(stats.dispersionPct)}${priciest ? ` · ${priciest.marketplaceLabel}` : ""}`
            : "—"
        }
      />
      <Card
        label="Ofertas & lojas"
        Icon={Store}
        iconClass="text-brand"
        value={String(validOffers)}
        unit="anúncios"
        hint={`${distinctSellers} vendedores distintos${outliers ? ` · ${outliers} outliers fora` : ""}`}
      />
    </section>
  );
}
