/**
 * Versão no navegador do gateway de preços da API
 * (searchprice-master-api/app/services/pricing/gateway.ts).
 *
 * Mesma lógica de estatística, outliers, posição e rentabilidade, mas:
 * - ofertas sempre vêm do provider demo (determinístico por EAN/termo);
 * - ofertas manuais ficam no localStorage;
 * - o histórico é uma série sintética estável dos últimos 30 dias.
 */
import products from "../products.json";
import { demoSearch, RESTRICTED_FIELDS } from "./demo";
import { FEE_TABLE_VERSION, simulate, type ProfitResult } from "./fees";
import { computeStats, isOutlier, outlierBounds } from "./stats";
import {
  MARKETPLACE_KEYS,
  MARKETPLACE_LABELS,
  type MarketplaceKey,
  type OfferDTO,
  type PriceStats,
  type SearchQuery,
} from "./types";

export interface AnalyzeInput {
  ean?: string | null;
  term?: string | null;
  cost?: number | null;
  taxPct?: number | null;
  targetMarginPct?: number | null;
  myPrice?: number | null;
  marketplaces?: MarketplaceKey[];
  includeOutliers?: boolean;
  listingTypes?: Partial<Record<MarketplaceKey, string>>;
}

export interface ManualOfferRecord {
  id: number;
  queryKey: string;
  marketplace: MarketplaceKey;
  sellerName: string;
  sellerTier?: string | null;
  price: number;
  shippingPrice?: number | null;
  logistics?: string | null;
  externalId?: string | null;
  url?: string | null;
  updatedAt: string;
}

const MANUAL_KEY = "sp:mock:manual-offers";

export function normalizeEan(code: string | null | undefined): string {
  return String(code ?? "").replace(/\D/g, "").replace(/^0+/, "");
}

export function queryKeyOf(q: { ean: string | null; term: string | null }): string {
  return q.ean ? q.ean : `q:${(q.term ?? "").toLowerCase().trim().replace(/\s+/g, " ")}`;
}

/* ------------------------------ ofertas manuais ----------------------------- */

export function readManual(): ManualOfferRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(MANUAL_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function writeManual(list: ManualOfferRecord[]) {
  localStorage.setItem(MANUAL_KEY, JSON.stringify(list));
}

function manualToOffer(m: ManualOfferRecord): OfferDTO {
  const mp = (MARKETPLACE_KEYS as readonly string[]).includes(m.marketplace) ? m.marketplace : "mercadolivre";
  return {
    id: `manual:${m.id}`,
    manualId: m.id,
    marketplace: mp,
    externalId: m.externalId ?? `MANUAL-${m.id}`,
    title: "",
    url: m.url ?? null,
    image: null,
    price: Number(m.price),
    shippingPrice: m.shippingPrice ?? null,
    logistics: m.logistics ?? null,
    seller: { id: null, name: m.sellerName, tier: m.sellerTier ?? "Cadastro manual", rating: null },
    condition: "new",
    visits: RESTRICTED_FIELDS[mp],
    stock: RESTRICTED_FIELDS[mp],
    status: "active",
    source: "manual",
    collectedAt: m.updatedAt,
  };
}

/* -------------------------------- análise ---------------------------------- */

/** Preço/título de referência a partir dos produtos mockados. */
function seedReference(q: SearchQuery) {
  const match = products.filter((r) =>
    q.ean ? normalizeEan(r.productCode) === q.ean : !!q.term && r.name.toLowerCase().includes(q.term.toLowerCase())
  );
  if (match.length === 0) return { basePrice: null, title: null };
  const prices = match.map((r) => Number(r.price)).sort((a, b) => a - b);
  return { basePrice: prices[Math.floor(prices.length / 2)], title: match[0].name };
}

const TOLERANCE = 0.03;

function position(myPrice: number | null | undefined, stats: PriceStats | null) {
  if (!myPrice || !stats) return null;
  const deltaPct = (myPrice - stats.median) / stats.median;
  let level: "below" | "aligned" | "above" = "aligned";
  if (deltaPct > TOLERANCE) level = "above";
  else if (deltaPct < -TOLERANCE) level = "below";
  const span = stats.max - stats.min;
  const rank = span > 0 ? Math.min(1, Math.max(0, (myPrice - stats.min) / span)) : 0.5;
  return { myPrice, deltaPct: Math.round(deltaPct * 10000) / 10000, level, rangePct: Math.round(rank * 1000) / 1000 };
}

export function analyze(input: AnalyzeInput) {
  const ean = normalizeEan(input.ean) || null;
  const term = input.term?.trim() || null;
  if (!ean && !term) throw new Error("Informe um EAN ou termo de busca");

  const q: SearchQuery = { ean, term };
  const seed = seedReference(q);
  const key = queryKeyOf(q);
  const marketplaces = input.marketplaces?.length ? input.marketplaces : [...MARKETPLACE_KEYS];

  const results = marketplaces.map((mp) => {
    const result = demoSearch(mp, q, seed);
    return {
      result,
      status: {
        marketplace: mp,
        mode: "demo" as const,
        cached: false,
        latencyMs: 0,
        offers: result.offers.length,
        message: "Dados de demonstração (front sem API).",
      },
    };
  });

  const manual = readManual().filter((m) => m.queryKey === key && marketplaces.includes(m.marketplace));
  const offers: OfferDTO[] = [...results.flatMap((r) => r.result.offers), ...manual.map(manualToOffer)].filter(
    (o) => o.price > 0
  );

  const productTitle = seed.title ?? term ?? `EAN ${ean}`;
  for (const o of offers) if (!o.title) o.title = productTitle;

  const bounds = outlierBounds(offers.map((o) => o.price));
  for (const o of offers) o.isOutlier = isOutlier(o.price, bounds);

  const statsPool = (list: OfferDTO[]) =>
    (input.includeOutliers ? list : list.filter((o) => !o.isOutlier)).map((o) => o.price);

  const overall = computeStats(statsPool(offers));
  const byMarketplace: Record<string, PriceStats | null> = {};
  for (const mp of marketplaces) byMarketplace[mp] = computeStats(statsPool(offers.filter((o) => o.marketplace === mp)));

  const valid = offers.filter((o) => input.includeOutliers || !o.isOutlier);
  const cheapest = [...valid].sort((a, b) => a.price - b.price)[0] ?? null;
  const priciest = [...valid].sort((a, b) => b.price - a.price)[0] ?? null;
  const sellers = new Set(offers.map((o) => `${o.marketplace}:${o.seller.id ?? o.seller.name}`));

  const cost = input.cost ?? null;
  const taxPct = input.taxPct ?? 0;
  const targetMarginPct = input.targetMarginPct ?? 0;
  const pricePoint = input.myPrice ?? overall?.median ?? null;
  let profitability: ProfitResult[] | null = null;
  if (cost !== null && pricePoint) {
    profitability = marketplaces.map((mp) =>
      simulate(mp, { price: pricePoint, cost, taxPct, targetMarginPct }, input.listingTypes?.[mp])
    );
  }

  const party = (o: OfferDTO | null) =>
    o && {
      price: o.price,
      seller: o.seller.name,
      marketplace: o.marketplace,
      marketplaceLabel: MARKETPLACE_LABELS[o.marketplace],
    };

  return {
    query: { ean, term, key },
    product: { title: productTitle, ean },
    generatedAt: new Date().toISOString(),
    includeOutliers: !!input.includeOutliers,
    outlierBounds: bounds
      ? { low: Math.round(bounds.low * 100) / 100, high: Math.round(bounds.high * 100) / 100, method: "IQR (1.5×)" }
      : null,
    summary: {
      totalOffers: offers.length,
      validOffers: valid.length,
      outliers: offers.length - valid.length,
      distinctSellers: sellers.size,
      stats: overall,
      cheapest: party(cheapest),
      priciest: party(priciest),
      position: position(input.myPrice, overall),
    },
    byMarketplace: marketplaces.map((mp) => ({
      marketplace: mp,
      label: MARKETPLACE_LABELS[mp],
      stats: byMarketplace[mp],
      offers: offers.filter((o) => o.marketplace === mp).length,
      position: position(input.myPrice, byMarketplace[mp]),
    })),
    profitability: profitability && {
      input: {
        price: pricePoint as number,
        cost: cost as number,
        taxPct,
        targetMarginPct,
        priceSource: input.myPrice ? "my_price" : "market_median",
      },
      feeTableVersion: FEE_TABLE_VERSION,
      results: profitability,
    },
    sources: results.map((r) => r.status),
    offers: offers.sort((a, b) => a.price - b.price),
  };
}

/* -------------------------------- histórico -------------------------------- */

function seeded(seed: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 0x01000193);
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 1_000_000) / 1_000_000;
  };
}

/** 30 pontos diários que terminam no mercado atual, com tendência e ruído estáveis. */
export function history(q: { ean: string | null; term: string | null }) {
  const current = analyze({ ean: q.ean, term: q.term }).summary.stats;
  if (!current) return [];
  const r = seeded(`hist:${queryKeyOf(q)}`);
  const drift = (r() - 0.5) * 0.16; // ±8% ao longo do período
  const days = 30;
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const r2 = (n: number) => Math.round(n * 100) / 100;

  return Array.from({ length: days }, (_, i) => {
    const back = days - 1 - i;
    const trend = 1 - drift * (back / (days - 1));
    const noise = back === 0 ? 1 : 1 + (r() - 0.5) * 0.06;
    const k = trend * noise;
    const at = new Date(today);
    at.setDate(at.getDate() - back);
    return {
      at: at.toISOString(),
      min: r2(current.min * k * (back === 0 ? 1 : 1 + (r() - 0.5) * 0.04)),
      median: r2(current.median * k),
      mean: r2(current.mean * k),
      max: r2(current.max * k * (back === 0 ? 1 : 1 + (r() - 0.5) * 0.04)),
      offers: back === 0 ? current.count : Math.max(1, Math.round(current.count * (0.85 + r() * 0.3))),
    };
  });
}
