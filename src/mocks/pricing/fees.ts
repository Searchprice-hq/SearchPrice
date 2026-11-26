import type { MarketplaceKey } from './types'

/**
 * Tabelas de tarifas de REFERÊNCIA por marketplace.
 *
 * Comissões variam por categoria e mudam com frequência. Estes valores são
 * o ponto de partida do simulador; quando a API oficial está configurada o
 * gateway pode substituí-los (ML: /sites/MLB/listing_prices, Amazon:
 * getMyFeesEstimateForASIN). Revise em `FEE_TABLE_VERSION` ao atualizar.
 */
export const FEE_TABLE_VERSION = '2026-11'

export interface FixedFeeTier {
  /** Aplica-se quando preço < upTo (null = sem limite). */
  upTo: number | null
  fee: number
}

export interface ListingType {
  id: string
  label: string
  commissionPct: number
  /** Teto da comissão por item (Shopee), em R$. */
  commissionCap?: number
  fixedFees: FixedFeeTier[]
}

export interface MarketplaceFees {
  marketplace: MarketplaceKey
  listingTypes: ListingType[]
  notes: string
  officialEndpoint: string
}

export const FEE_TABLES: Record<MarketplaceKey, MarketplaceFees> = {
  mercadolivre: {
    marketplace: 'mercadolivre',
    listingTypes: [
      {
        id: 'gold_special',
        label: 'Clássico',
        commissionPct: 12,
        fixedFees: [
          { upTo: 29, fee: 6.25 },
          { upTo: 50, fee: 6.5 },
          { upTo: 79, fee: 6.75 },
          { upTo: null, fee: 0 },
        ],
      },
      {
        id: 'gold_pro',
        label: 'Premium',
        commissionPct: 17,
        fixedFees: [
          { upTo: 29, fee: 6.25 },
          { upTo: 50, fee: 6.5 },
          { upTo: 79, fee: 6.75 },
          { upTo: null, fee: 0 },
        ],
      },
    ],
    notes: 'Comissão varia de ~10% a 19% conforme a categoria. Custo fixo para itens abaixo de R$ 79.',
    officialEndpoint: 'GET /sites/MLB/listing_prices?price={preco}&listing_type_id={tipo}&category_id={id}',
  },
  amazon: {
    marketplace: 'amazon',
    listingTypes: [
      {
        id: 'dba',
        label: 'DBA / Envio próprio',
        commissionPct: 13,
        fixedFees: [
          { upTo: 30, fee: 4.5 },
          { upTo: 79, fee: 6.5 },
          { upTo: null, fee: 0 },
        ],
      },
      {
        id: 'fba',
        label: 'FBA',
        commissionPct: 13,
        fixedFees: [
          { upTo: 30, fee: 9.5 },
          { upTo: 79, fee: 12.5 },
          { upTo: null, fee: 15.5 },
        ],
      },
    ],
    notes: 'Taxa de indicação de 8% a 15% por categoria. FBA inclui tarifa logística estimada.',
    officialEndpoint: 'getMyFeesEstimateForASIN (Product Fees API v0)',
  },
  shopee: {
    marketplace: 'shopee',
    listingTypes: [
      {
        id: 'padrao',
        label: 'Padrão (CNPJ)',
        commissionPct: 20,
        commissionCap: 100,
        fixedFees: [{ upTo: null, fee: 4 }],
      },
    ],
    notes: '14% de comissão + 6% do programa de frete grátis, teto de R$ 100 por item, mais R$ 4 por item vendido.',
    officialEndpoint: 'Open Platform V2 — get_order_detail / get_escrow_detail (valores realizados)',
  },
  magalu: {
    marketplace: 'magalu',
    listingTypes: [
      {
        id: 'padrao',
        label: 'Padrão',
        commissionPct: 16,
        fixedFees: [
          { upTo: 10, fee: 0 },
          { upTo: null, fee: 5 },
        ],
      },
    ],
    notes: 'Comissão de 10% a 20% conforme a categoria, mais tarifa fixa por item.',
    officialEndpoint: 'Magalu Open API — comissão financeira por pedido',
  },
}

export function fixedFeeFor(price: number, tiers: FixedFeeTier[]): number {
  for (const t of tiers) {
    if (t.upTo === null || price < t.upTo) return t.fee
  }
  return 0
}

export function listingType(marketplace: MarketplaceKey, id?: string | null): ListingType {
  const types = FEE_TABLES[marketplace].listingTypes
  return types.find((t) => t.id === id) ?? types[0]
}

export interface ProfitInput {
  price: number
  cost: number
  /** Alíquota de imposto sobre a venda, em % (ex.: 6 para Simples Nacional). */
  taxPct: number
  /** Margem líquida alvo sobre o preço, em %. */
  targetMarginPct: number
  /** Custos extras por unidade (embalagem, frete pago pelo vendedor). */
  extraCost?: number
}

export interface ProfitResult {
  marketplace: MarketplaceKey
  listingType: { id: string; label: string }
  price: number
  commissionPct: number
  commission: number
  fixedFee: number
  tax: number
  cost: number
  extraCost: number
  netRevenue: number
  profit: number
  marginPct: number
  /** Preço mínimo para lucro zero. */
  breakEvenPrice: number | null
  /** Preço que atinge a margem alvo. */
  targetPrice: number | null
  verdict: 'profit' | 'loss' | 'below_target'
}

const r2 = (n: number) => Math.round(n * 100) / 100

function commissionFor(price: number, lt: ListingType): number {
  const raw = (price * lt.commissionPct) / 100
  return lt.commissionCap ? Math.min(raw, lt.commissionCap) : raw
}

/**
 * Resolve P em  P - P*c - F(P) - P*t - custo = P*m  (m = margem alvo).
 * A tarifa fixa depende da faixa de preço, então testa cada faixa e
 * aceita a primeira solução que cai dentro dela. Para o teto de comissão
 * (Shopee) faz uma segunda passada com comissão fixa.
 */
function solvePrice(lt: ListingType, cost: number, taxPct: number, marginPct: number): number | null {
  const c = lt.commissionPct / 100
  const t = taxPct / 100
  const m = marginPct / 100
  let lower = 0
  for (const tier of lt.fixedFees) {
    const upper = tier.upTo ?? Number.POSITIVE_INFINITY
    const denom = 1 - c - t - m
    if (denom > 0) {
      let p = (cost + tier.fee) / denom
      if (lt.commissionCap && p * c > lt.commissionCap) {
        const d2 = 1 - t - m
        p = d2 > 0 ? (cost + tier.fee + lt.commissionCap) / d2 : Number.NaN
      }
      if (Number.isFinite(p) && p >= lower && p < upper) return r2(p)
    }
    lower = upper
  }
  return null
}

export function simulate(
  marketplace: MarketplaceKey,
  input: ProfitInput,
  listingTypeId?: string | null
): ProfitResult {
  const lt = listingType(marketplace, listingTypeId)
  const extraCost = input.extraCost ?? 0
  const commission = commissionFor(input.price, lt)
  const fixedFee = fixedFeeFor(input.price, lt.fixedFees)
  const tax = (input.price * input.taxPct) / 100
  const netRevenue = input.price - commission - fixedFee - tax
  const profit = netRevenue - input.cost - extraCost
  const marginPct = input.price > 0 ? (profit / input.price) * 100 : 0
  const totalCost = input.cost + extraCost

  let verdict: ProfitResult['verdict'] = 'profit'
  if (profit < 0) verdict = 'loss'
  else if (marginPct < input.targetMarginPct) verdict = 'below_target'

  return {
    marketplace,
    listingType: { id: lt.id, label: lt.label },
    price: r2(input.price),
    commissionPct: lt.commissionPct,
    commission: r2(commission),
    fixedFee: r2(fixedFee),
    tax: r2(tax),
    cost: r2(input.cost),
    extraCost: r2(extraCost),
    netRevenue: r2(netRevenue),
    profit: r2(profit),
    marginPct: r2(marginPct),
    breakEvenPrice: solvePrice(lt, totalCost, input.taxPct, 0),
    targetPrice: solvePrice(lt, totalCost, input.taxPct, input.targetMarginPct),
    verdict,
  }
}
