import type { PriceStats } from './types'

function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return 0
  const pos = (sorted.length - 1) * q
  const base = Math.floor(pos)
  const rest = pos - base
  const next = sorted[base + 1]
  return next !== undefined ? sorted[base] + rest * (next - sorted[base]) : sorted[base]
}

const round2 = (n: number) => Math.round(n * 100) / 100

export function computeStats(prices: number[]): PriceStats | null {
  const sorted = prices.filter((p) => Number.isFinite(p) && p > 0).sort((a, b) => a - b)
  if (sorted.length === 0) return null

  const count = sorted.length
  const mean = sorted.reduce((s, p) => s + p, 0) / count
  const variance = sorted.reduce((s, p) => s + (p - mean) ** 2, 0) / count
  const min = sorted[0]
  const max = sorted[count - 1]

  return {
    count,
    min: round2(min),
    max: round2(max),
    mean: round2(mean),
    median: round2(quantile(sorted, 0.5)),
    stdDev: round2(Math.sqrt(variance)),
    dispersionPct: min > 0 ? round2(((max - min) / min) * 100) : 0,
    q1: round2(quantile(sorted, 0.25)),
    q3: round2(quantile(sorted, 0.75)),
  }
}

/**
 * Limites de outlier pelo método IQR (Tukey, k = 1.5).
 * Com menos de 4 preços o IQR não é confiável: nada é marcado.
 */
export function outlierBounds(prices: number[], k = 1.5): { low: number; high: number } | null {
  const sorted = prices.filter((p) => Number.isFinite(p) && p > 0).sort((a, b) => a - b)
  if (sorted.length < 4) return null
  const q1 = quantile(sorted, 0.25)
  const q3 = quantile(sorted, 0.75)
  const iqr = q3 - q1
  return { low: q1 - k * iqr, high: q3 + k * iqr }
}

export function isOutlier(price: number, bounds: { low: number; high: number } | null): boolean {
  if (!bounds) return false
  return price < bounds.low || price > bounds.high
}
