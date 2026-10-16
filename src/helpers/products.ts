import type { Product } from "@/models/Product";
import { marketStats, type MarketStats } from "@/helpers/market";
import {
  toMarketplaceKey,
  type MarketplaceKey,
} from "@/components/ui/MarketplaceBadge";

export interface Offer extends Product {
  priceValue: number;
  marketplaceKey: MarketplaceKey | null;
}

export interface ProductGroup {
  /** EAN normalizado (sem zeros à esquerda), usado como chave. */
  key: string;
  ean: string;
  name: string;
  image: string;
  offers: Offer[];
  stats: MarketStats | null;
  /** Menor preço encontrado em cada marketplace. */
  bestByMarketplace: Partial<Record<MarketplaceKey, number>>;
}

/** GTIN-14 com zero à esquerda e EAN-13 representam o mesmo produto. */
export function normalizeEan(code: string | null | undefined): string {
  return String(code ?? "").replace(/\D/g, "").replace(/^0+/, "");
}

export function toOffer(p: Product): Offer {
  return {
    ...p,
    priceValue: Number(p.price),
    marketplaceKey: toMarketplaceKey(String(p.marketplace ?? "")),
  };
}

export function groupByProduct(offers: Offer[]): ProductGroup[] {
  const groups = new Map<string, Offer[]>();
  for (const o of offers) {
    const key = normalizeEan(o.productCode) || `id-${o.id}`;
    const list = groups.get(key);
    if (list) list.push(o);
    else groups.set(key, [o]);
  }

  return [...groups.entries()].map(([key, list]) => {
    const sorted = [...list].sort((a, b) => a.priceValue - b.priceValue);
    const bestByMarketplace: ProductGroup["bestByMarketplace"] = {};
    for (const o of sorted) {
      if (o.marketplaceKey && bestByMarketplace[o.marketplaceKey] === undefined) {
        bestByMarketplace[o.marketplaceKey] = o.priceValue;
      }
    }
    return {
      key,
      ean: sorted[0].productCode,
      name: sorted[0].name,
      image: sorted[0].image,
      offers: sorted,
      stats: marketStats(sorted.map((o) => o.priceValue)),
      bestByMarketplace,
    };
  });
}
