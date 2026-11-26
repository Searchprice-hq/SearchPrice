import type { MarketplaceKey, OfferDTO, ProviderResult, Restricted, SearchQuery } from './types'

/**
 * Provider de demonstração.
 *
 * Gera ofertas DETERMINÍSTICAS a partir do EAN/termo (mesma busca → mesmo
 * resultado), com vendedores, logísticas e IDs no formato de cada canal.
 * É usado quando a API oficial do canal não está configurada, para que a
 * interface e a planilha funcionem ponta a ponta. Toda oferta sai marcada
 * com source = "demo" e a UI avisa o usuário.
 */

function rng(seed: string) {
  // FNV-1a 32 bits (roda no navegador, sem node:crypto)
  let h = 0x811c9dc5
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  h = h >>> 0 || 1
  return () => {
    // xorshift32
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    return ((h >>> 0) % 1_000_000) / 1_000_000
  }
}

const pick = <T>(r: () => number, list: T[]): T => list[Math.floor(r() * list.length)]

const RESTRICTED: Record<MarketplaceKey, Restricted> = {
  mercadolivre: { restricted: true, reason: 'Restrito ao vendedor (OAuth2)' },
  amazon: { restricted: true, reason: 'Restrito à loja própria (SP-API)' },
  shopee: { restricted: true, reason: 'Restrito ao vendedor (Open Platform)' },
  magalu: { restricted: true, reason: 'Restrito ao seller (Open API)' },
}

const SELLERS: Record<MarketplaceKey, { name: string; tier: string }[]> = {
  mercadolivre: [
    { name: 'Droga Raia Oficial', tier: 'Loja Oficial · Platinum' },
    { name: 'Megastore BR', tier: 'MercadoLíder Gold' },
    { name: 'Casa & Cia Distribuidora', tier: 'MercadoLíder Platinum' },
    { name: 'Atacadão Online', tier: 'MercadoLíder' },
    { name: 'Loja do Zé', tier: 'Reputação verde' },
    { name: 'Distribuidora Sul', tier: 'MercadoLíder Gold' },
    { name: 'Empório Digital', tier: 'Reputação verde' },
    { name: 'Ofertas Express', tier: 'Reputação amarela' },
  ],
  amazon: [
    { name: 'Amazon.com.br', tier: 'Vendido e entregue pela Amazon' },
    { name: 'Drogaria São Paulo Oficial', tier: 'Vendedor Parceiro Prime' },
    { name: 'Comercial Paulista', tier: 'Vendedor Parceiro' },
    { name: 'Beleza Store', tier: 'Vendedor Parceiro Prime' },
    { name: 'TopShop Brasil', tier: 'Vendedor Parceiro' },
  ],
  shopee: [
    { name: 'Loja Oficial Shopee Mall', tier: 'Shopee Mall' },
    { name: 'Drogaria Pacheco Oficial', tier: 'Vendedor Indicado' },
    { name: 'Achadinhos da Bia', tier: 'Vendedor Indicado' },
    { name: 'Importados SP', tier: 'Vendedor' },
    { name: 'Mundo Barato', tier: 'Vendedor' },
    { name: 'Bazar Center', tier: 'Vendedor Indicado' },
  ],
  magalu: [
    { name: 'Magazine Luiza', tier: 'Vendido pelo Magalu' },
    { name: 'Época Cosméticos', tier: 'Parceiro Magalu' },
    { name: 'Netshoes', tier: 'Parceiro Magalu' },
    { name: 'Center Ofertas', tier: 'Parceiro' },
  ],
}

const LOGISTICS: Record<MarketplaceKey, string[]> = {
  mercadolivre: ['Full (Fulfillment ML)', 'Flex', 'Coletas', 'Places', 'Full (Fulfillment ML)'],
  amazon: ['FBA (Fulfillment by Amazon)', 'DBA (Delivery by Amazon)', 'Envio pelo vendedor'],
  shopee: ['Shopee Xpress (SPX)', 'Entrega padrão', 'Shopee Xpress (SPX)'],
  magalu: ['Magalu Entregas', 'Envio pelo parceiro'],
}

/** Multiplicador de preço típico por canal (Shopee mais barato, Magalu mais caro…). */
const BIAS: Record<MarketplaceKey, number> = {
  mercadolivre: 1.0,
  amazon: 1.04,
  shopee: 0.9,
  magalu: 1.08,
}

const COUNT: Record<MarketplaceKey, [number, number]> = {
  mercadolivre: [14, 22],
  amazon: [8, 14],
  shopee: [12, 20],
  magalu: [5, 10],
}

function externalId(mp: MarketplaceKey, r: () => number): string {
  const digits = (n: number) =>
    Array.from({ length: n }, () => Math.floor(r() * 10)).join('')
  switch (mp) {
    case 'mercadolivre':
      return `MLB${digits(10)}`
    case 'amazon': {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'
      return `B0${Array.from({ length: 8 }, () => pick(r, chars.split(''))).join('')}`
    }
    case 'shopee':
      return digits(11)
    case 'magalu':
      return `${pick(r, ['ab', 'ce', 'hj', 'gf'])}${digits(7)}`
  }
}

/**
 * Demo não tem anúncio real: aponta para a BUSCA do produto no canal,
 * que é um link válido (a UI rotula como "Buscar", não "Anúncio").
 */
function searchUrlFor(mp: MarketplaceKey, query: SearchQuery, title: string): string {
  const term = query.ean ?? title
  const enc = encodeURIComponent(term)
  switch (mp) {
    case 'mercadolivre':
      return `https://lista.mercadolivre.com.br/${encodeURIComponent(term.replace(/\s+/g, '-'))}`
    case 'amazon':
      return `https://www.amazon.com.br/s?k=${enc}`
    case 'shopee':
      return `https://shopee.com.br/search?keyword=${enc}`
    case 'magalu':
      return `https://www.magazineluiza.com.br/busca/${enc}/`
  }
}

export interface DemoContext {
  /** Preço de referência (ex.: seed `products`), se conhecido. */
  basePrice?: number | null
  title?: string | null
}

export function demoSearch(
  mp: MarketplaceKey,
  query: SearchQuery,
  ctx: DemoContext = {}
): ProviderResult {
  const key = query.ean ?? (query.term ?? '').toLowerCase().trim()
  const r = rng(`${mp}:${key}`)
  const rBase = rng(`base:${key}`)

  const title = ctx.title ?? (query.term ? query.term : `Produto EAN ${query.ean}`)
  const base = ctx.basePrice ?? Math.round((15 + rBase() * 285) * 100) / 100
  const [lo, hi] = COUNT[mp]
  const n = lo + Math.floor(r() * (hi - lo + 1))
  const now = new Date()
  now.setSeconds(0, 0)

  const offers: OfferDTO[] = []
  for (let i = 0; i < n; i++) {
    const seller = pick(r, SELLERS[mp])
    const id = externalId(mp, r)
    // distribuição em torno do preço base, com cauda e alguns outliers (kits/erros)
    let factor = BIAS[mp] * (0.78 + r() * 0.5)
    const roll = r()
    if (roll > 0.95) factor *= 2.1 + r() // kit / anúncio errado
    else if (roll < 0.03) factor *= 0.45 // preço quebrado
    const price = Math.max(1, Math.round(base * factor * 100) / 100)

    offers.push({
      id: `${mp}:${id}`,
      marketplace: mp,
      externalId: id,
      title,
      url: searchUrlFor(mp, query, title),
      image: null,
      price,
      shippingPrice: r() > 0.6 ? 0 : Math.round(r() * 2500) / 100,
      logistics: pick(r, LOGISTICS[mp]),
      seller: {
        id: mp === 'amazon' ? `A${Math.floor(r() * 1e12).toString(36).toUpperCase()}` : String(Math.floor(r() * 1e9)),
        name: seller.name,
        tier: seller.tier,
        rating: Math.round((4 + r()) * 10) / 10,
      },
      condition: 'new',
      visits: RESTRICTED[mp],
      stock: RESTRICTED[mp],
      status: 'active',
      source: 'demo',
      collectedAt: now.toISOString(),
    })
  }

  return { offers, productTitle: ctx.title ?? null }
}

export const RESTRICTED_FIELDS = RESTRICTED
