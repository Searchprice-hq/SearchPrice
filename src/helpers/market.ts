export interface MarketStats {
  min: number;
  median: number;
  max: number;
  count: number;
}

export type PositionLevel = "below" | "aligned" | "above";

export interface PricePosition {
  level: PositionLevel;
  /** Diferença percentual do seu preço em relação à mediana (ex.: 0.08 = 8% acima). */
  deltaPct: number;
  /** Posição de 0 a 1 do seu preço dentro da faixa mín–máx (limitada). */
  rangePct: number;
}

/** Faixa em torno da mediana considerada "alinhada ao mercado". */
export const ALIGNED_TOLERANCE = 0.03;

export function marketStats(prices: number[]): MarketStats | null {
  const sorted = prices.filter((p) => Number.isFinite(p) && p > 0).sort((a, b) => a - b);
  if (sorted.length === 0) return null;
  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  return { min: sorted[0], median, max: sorted[sorted.length - 1], count: sorted.length };
}

export function pricePosition(myPrice: number, stats: MarketStats): PricePosition {
  const deltaPct = (myPrice - stats.median) / stats.median;
  const span = stats.max - stats.min;
  const rangePct = span > 0 ? Math.min(1, Math.max(0, (myPrice - stats.min) / span)) : 0.5;
  let level: PositionLevel = "aligned";
  if (deltaPct > ALIGNED_TOLERANCE) level = "above";
  else if (deltaPct < -ALIGNED_TOLERANCE) level = "below";
  return { level, deltaPct, rangePct };
}

export function formatPct(value: number): string {
  return `${Math.abs(value * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
}
