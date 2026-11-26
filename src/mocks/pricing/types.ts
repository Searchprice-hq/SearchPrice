/**
 * Tipos do gateway de inteligência de preços.
 *
 * O gateway é stateless: recebe { ean | termo, custo, imposto, margem },
 * consulta os marketplaces em paralelo, aplica cache e devolve um JSON
 * consolidado. Nada de lotes brutos persistidos — só o que o cliente
 * (Web App ou Google Sheets) precisa para renderizar.
 */

export const MARKETPLACE_KEYS = ['mercadolivre', 'amazon', 'shopee', 'magalu'] as const
export type MarketplaceKey = (typeof MARKETPLACE_KEYS)[number]

export const MARKETPLACE_LABELS: Record<MarketplaceKey, string> = {
  mercadolivre: 'Mercado Livre',
  amazon: 'Amazon',
  shopee: 'Shopee',
  magalu: 'Magalu',
}

/** "live" = API oficial; "demo" = dados simulados determinísticos; "manual" = cadastrada pelo usuário. */
export type OfferSource = 'live' | 'demo' | 'manual'

/** Campo que a API oficial não expõe para anúncios de terceiros. */
export type Restricted = { restricted: true; reason: string }
export type MaybeRestricted<T> = T | Restricted

export interface OfferDTO {
  /** Identificador estável dentro da resposta (marketplace:externalId). */
  id: string
  marketplace: MarketplaceKey
  /** MLB…, ASIN, itemId Shopee, SKU Magalu. */
  externalId: string
  title: string
  url: string | null
  image: string | null
  price: number
  shippingPrice: number | null
  /** Texto de logística normalizado (Full, FBA, Shopee Xpress…). */
  logistics: string | null
  seller: {
    id: string | null
    name: string
    /** Tipo/reputação textual (Loja Oficial · Platinum, Vendedor Parceiro…). */
    tier: string | null
    rating: number | null
  }
  condition: 'new' | 'used' | null
  visits: MaybeRestricted<number>
  stock: MaybeRestricted<number>
  status: 'active' | 'paused' | 'unknown'
  source: OfferSource
  collectedAt: string
  /** Preenchido pelo gateway após a análise estatística. */
  isOutlier?: boolean
  /** Só em ofertas manuais. */
  manualId?: number
}

export interface SearchQuery {
  /** EAN/GTIN normalizado (sem zeros à esquerda). */
  ean: string | null
  /** Termo livre de busca. */
  term: string | null
  /** Título conhecido do produto (seed/catálogo) — usado por canais sem busca por EAN (Shopee). */
  titleHint?: string | null
}

export interface ProviderResult {
  offers: OfferDTO[]
  /** Título do produto quando o canal o resolve (catálogo). */
  productTitle?: string | null
}

export interface MarketplaceProvider {
  key: MarketplaceKey
  /** Há credenciais para chamar a API oficial? */
  isConfigured(): boolean
  search(query: SearchQuery): Promise<ProviderResult>
}

export interface SourceStatus {
  marketplace: MarketplaceKey
  mode: 'live' | 'demo' | 'error' | 'disabled'
  cached: boolean
  latencyMs: number
  offers: number
  message: string | null
}

export interface PriceStats {
  count: number
  min: number
  max: number
  mean: number
  median: number
  stdDev: number
  /** (max - min) / min — mesma métrica de "dispersão" da planilha. */
  dispersionPct: number
  q1: number
  q3: number
}
