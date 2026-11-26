import type { MarketplaceKey } from "@/components/ui/MarketplaceBadge";
import { USE_MOCKS, delay } from "@/mocks";
import * as mock from "@/mocks/pricing/gateway";
import { FEE_TABLE_VERSION, simulate as mockSimulate } from "@/mocks/pricing/fees";

/* Tipos espelhados de searchprice-master-api/app/services/pricing */

export type Restricted = { restricted: true; reason: string };

export interface PricingOffer {
  id: string;
  marketplace: MarketplaceKey;
  externalId: string;
  title: string;
  url: string | null;
  image: string | null;
  price: number;
  shippingPrice: number | null;
  logistics: string | null;
  seller: { id: string | null; name: string; tier: string | null; rating: number | null };
  condition: "new" | "used" | null;
  visits: number | Restricted;
  stock: number | Restricted;
  status: "active" | "paused" | "unknown";
  source: "live" | "demo" | "manual";
  collectedAt: string;
  isOutlier?: boolean;
  manualId?: number;
}

export interface PriceStats {
  count: number;
  min: number;
  max: number;
  mean: number;
  median: number;
  stdDev: number;
  dispersionPct: number;
  q1: number;
  q3: number;
}

export interface Position {
  myPrice: number;
  deltaPct: number;
  level: "below" | "aligned" | "above";
  rangePct: number;
}

export interface ProfitResult {
  marketplace: MarketplaceKey;
  listingType: { id: string; label: string };
  price: number;
  commissionPct: number;
  commission: number;
  fixedFee: number;
  tax: number;
  cost: number;
  extraCost: number;
  netRevenue: number;
  profit: number;
  marginPct: number;
  breakEvenPrice: number | null;
  targetPrice: number | null;
  verdict: "profit" | "loss" | "below_target";
}

export interface SourceStatus {
  marketplace: MarketplaceKey;
  mode: "live" | "demo" | "error" | "disabled";
  cached: boolean;
  latencyMs: number;
  offers: number;
  message: string | null;
}

interface PartySummary {
  price: number;
  seller: string;
  marketplace: MarketplaceKey;
  marketplaceLabel: string;
}

export interface Analysis {
  query: { ean: string | null; term: string | null; key: string };
  product: { title: string; ean: string | null };
  generatedAt: string;
  includeOutliers: boolean;
  outlierBounds: { low: number; high: number; method: string } | null;
  summary: {
    totalOffers: number;
    validOffers: number;
    outliers: number;
    distinctSellers: number;
    stats: PriceStats | null;
    cheapest: PartySummary | null;
    priciest: PartySummary | null;
    position: Position | null;
  };
  byMarketplace: {
    marketplace: MarketplaceKey;
    label: string;
    stats: PriceStats | null;
    offers: number;
    position: Position | null;
  }[];
  profitability: null | {
    input: { price: number; cost: number; taxPct: number; targetMarginPct: number; priceSource: string };
    feeTableVersion: string;
    results: ProfitResult[];
  };
  sources: SourceStatus[];
  offers: PricingOffer[];
}

export interface HistoryPoint {
  at: string;
  min: number;
  median: number;
  mean: number;
  max: number;
  offers: number;
}

export interface AnalyzeParams {
  ean?: string | null;
  q?: string | null;
  myPrice?: number | null;
  includeOutliers?: boolean;
  refresh?: boolean;
}

export interface SimulateParams {
  price: number;
  cost: number;
  tax: number;
  margin: number;
  extraCost?: number;
  mlListingType?: "gold_special" | "gold_pro";
  amazonListingType?: "dba" | "fba";
}

export interface ManualOfferInput {
  marketplace: MarketplaceKey;
  sellerName: string;
  sellerTier?: string;
  price: number;
  shippingPrice?: number;
  logistics?: string;
  externalId?: string;
  url?: string;
}

function headers(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, { ...init, headers: headers() });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const first = Array.isArray(body?.errors) ? body.errors[0]?.message : null;
    throw new Error(first || body?.message || `Erro ${res.status}`);
  }
  return (body?.data ?? body) as T;
}

/** Converte "7899961014989" em ean e qualquer outra coisa em termo de busca. */
export function splitQuery(value: string): { ean: string | null; q: string | null } {
  const v = value.trim();
  if (/^\d{8,14}$/.test(v.replace(/\D/g, "")) && /^[\d\s.-]+$/.test(v)) {
    return { ean: v.replace(/\D/g, ""), q: null };
  }
  return { ean: null, q: v || null };
}

export async function analyzeProduct(p: AnalyzeParams): Promise<Analysis> {
  if (USE_MOCKS) {
    await delay(500);
    return mock.analyze({ ean: p.ean, term: p.q, myPrice: p.myPrice, includeOutliers: p.includeOutliers }) as Analysis;
  }
  const qs = new URLSearchParams();
  if (p.ean) qs.set("ean", p.ean);
  if (p.q) qs.set("q", p.q);
  if (p.myPrice) qs.set("myPrice", String(p.myPrice));
  if (p.includeOutliers) qs.set("includeOutliers", "true");
  if (p.refresh) qs.set("refresh", "true");
  return request<Analysis>(`/pricing/analyze?${qs}`);
}

export async function simulateProfit(p: SimulateParams): Promise<{ feeTableVersion: string; results: ProfitResult[] }> {
  if (USE_MOCKS) {
    await delay(150);
    const listing: Partial<Record<MarketplaceKey, string | undefined>> = {
      mercadolivre: p.mlListingType,
      amazon: p.amazonListingType,
    };
    const keys: MarketplaceKey[] = ["mercadolivre", "amazon", "shopee", "magalu"];
    return {
      feeTableVersion: FEE_TABLE_VERSION,
      results: keys.map((mp) =>
        mockSimulate(mp, { price: p.price, cost: p.cost, taxPct: p.tax ?? 0, targetMarginPct: p.margin ?? 0, extraCost: p.extraCost }, listing[mp])
      ),
    };
  }
  return request<{ feeTableVersion: string; results: ProfitResult[] }>("/pricing/simulate", {
    method: "POST",
    body: JSON.stringify(p),
  });
}

export async function fetchHistory(p: { ean?: string | null; q?: string | null }): Promise<HistoryPoint[]> {
  if (USE_MOCKS) {
    await delay(200);
    return mock.history({ ean: mock.normalizeEan(p.ean) || null, term: p.q?.trim() || null });
  }
  const qs = new URLSearchParams();
  if (p.ean) qs.set("ean", p.ean);
  if (p.q) qs.set("q", p.q);
  return request<HistoryPoint[]>(`/pricing/history?${qs}`);
}

export async function createManualOffer(query: { ean?: string | null; q?: string | null }, input: ManualOfferInput) {
  if (USE_MOCKS) {
    await delay(150);
    const list = mock.readManual();
    const record = {
      ...input,
      id: Math.max(0, ...list.map((m) => m.id)) + 1,
      queryKey: mock.queryKeyOf({ ean: mock.normalizeEan(query.ean) || null, term: query.q?.trim() || null }),
      updatedAt: new Date().toISOString(),
    };
    mock.writeManual([...list, record]);
    return record;
  }
  return request("/pricing/offers", {
    method: "POST",
    body: JSON.stringify({ ...input, ean: query.ean ?? undefined, q: query.q ?? undefined }),
  });
}

export async function updateManualOffer(id: number, input: Partial<ManualOfferInput>) {
  if (USE_MOCKS) {
    await delay(150);
    const clean = Object.fromEntries(Object.entries(input).filter(([, v]) => v !== undefined));
    mock.writeManual(mock.readManual().map((m) => (m.id === id ? { ...m, ...clean, updatedAt: new Date().toISOString() } : m)));
    return { id };
  }
  return request(`/pricing/offers/${id}`, { method: "PATCH", body: JSON.stringify(input) });
}

export async function deleteManualOffer(id: number) {
  if (USE_MOCKS) {
    await delay(150);
    mock.writeManual(mock.readManual().filter((m) => m.id !== id));
    return { id };
  }
  return request(`/pricing/offers/${id}`, { method: "DELETE" });
}

export function isRestricted(v: number | Restricted): v is Restricted {
  return typeof v === "object" && v !== null && "restricted" in v;
}
