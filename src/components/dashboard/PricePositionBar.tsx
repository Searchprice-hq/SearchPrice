import clsx from "clsx";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { formatBRL } from "@/helpers/currency";
import {
  formatPct,
  pricePosition,
  type MarketStats,
  type PositionLevel,
} from "@/helpers/market";

const LEVEL: Record<
  PositionLevel,
  { label: (pct: string) => string; chip: string; marker: string; Icon: typeof Minus }
> = {
  above: {
    label: (pct) => `${pct} acima da mediana`,
    chip: "bg-danger-soft text-danger",
    marker: "bg-danger",
    Icon: TrendingUp,
  },
  aligned: {
    label: () => "Alinhado ao mercado",
    chip: "bg-warning-soft text-warning",
    marker: "bg-warning",
    Icon: Minus,
  },
  below: {
    label: (pct) => `${pct} abaixo da mediana`,
    chip: "bg-success-soft text-success",
    marker: "bg-success",
    Icon: TrendingDown,
  },
};

export function PositionChip({
  myPrice,
  stats,
}: Readonly<{ myPrice: number; stats: MarketStats }>) {
  const pos = pricePosition(myPrice, stats);
  const cfg = LEVEL[pos.level];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        cfg.chip
      )}
    >
      <cfg.Icon className="size-3.5" aria-hidden />
      {cfg.label(formatPct(pos.deltaPct))}
    </span>
  );
}

/**
 * Régua mín → mediana → máx do mercado com o marcador do seu preço.
 * Sem `myPrice`, mostra apenas a faixa.
 */
export default function PricePositionBar({
  stats,
  myPrice,
}: Readonly<{ stats: MarketStats; myPrice?: number | null }>) {
  const span = stats.max - stats.min;
  const medianPct = span > 0 ? ((stats.median - stats.min) / span) * 100 : 50;
  const pos = myPrice ? pricePosition(myPrice, stats) : null;

  return (
    <div className="w-full">
      <div className="relative h-2.5 rounded-full bg-gradient-to-r from-success/35 via-warning/35 to-danger/35">
        <span
          className="absolute top-1/2 h-4 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded bg-fg/50 transition-[left] duration-700 ease-out"
          style={{ left: `${medianPct}%` }}
          title="Mediana"
        />
        {pos && (
          <span
            className={clsx(
              "absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface shadow transition-[left,background-color] duration-700 ease-out",
              LEVEL[pos.level].marker
            )}
            style={{ left: `${pos.rangePct * 100}%` }}
            title={`Seu preço: ${formatBRL(myPrice!)}`}
          />
        )}
      </div>
      <div className="mt-2 grid grid-cols-3 text-xs text-muted tabular">
        <span>
          <span className="block text-[11px] uppercase tracking-wide text-subtle">Mín</span>
          {formatBRL(stats.min)}
        </span>
        <span className="text-center">
          <span className="block text-[11px] uppercase tracking-wide text-subtle">Mediana</span>
          <span className="font-semibold text-fg">{formatBRL(stats.median)}</span>
        </span>
        <span className="text-right">
          <span className="block text-[11px] uppercase tracking-wide text-subtle">Máx</span>
          {formatBRL(stats.max)}
        </span>
      </div>
    </div>
  );
}
