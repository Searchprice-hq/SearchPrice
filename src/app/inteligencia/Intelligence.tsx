"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import {
  ArrowLeft,
  BarChart3,
  Calculator,
  Filter,
  Layers,
  LoaderCircle,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  TriangleAlert,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { buttonClass } from "@/components/ui/button";
import { inputClass } from "@/components/ui/Field";
import { MARKETPLACES, MarketplaceDot, type MarketplaceKey } from "@/components/ui/MarketplaceBadge";
import KpiCards from "@/components/intelligence/KpiCards";
import OffersTable from "@/components/intelligence/OffersTable";
import OfferFormDialog from "@/components/intelligence/OfferFormDialog";
import MarketOverview from "@/components/intelligence/MarketOverview";
import ProfitSimulator from "@/components/intelligence/ProfitSimulator";
import { fetchProducts } from "@/services/productService";
import {
  analyzeProduct,
  deleteManualOffer,
  splitQuery,
  type Analysis,
  type PricingOffer,
} from "@/services/pricingService";

type Tab = "market" | "offers" | "simulator";
const MP_KEYS = Object.keys(MARKETPLACES) as MarketplaceKey[];

export default function Intelligence() {
  const router = useRouter();
  const params = useSearchParams();
  const ean = params.get("ean");
  const q = params.get("q");
  const hasQuery = !!(ean || q);

  const [tab, setTab] = useState<Tab>((params.get("tab") as Tab) || "offers");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [withoutOutliers, setWithoutOutliers] = useState(true);
  const [marketplace, setMarketplace] = useState<MarketplaceKey | "all">("all");
  const [filter, setFilter] = useState("");
  const [productInput, setProductInput] = useState(ean ?? q ?? "");
  const [myPrice, setMyPrice] = useState<number | null>(null);
  const [formOffer, setFormOffer] = useState<PricingOffer | "new" | null>(null);
  const [suggestions, setSuggestions] = useState<{ ean: string; name: string }[]>([]);

  useEffect(() => {
    if (!localStorage.getItem("token")) router.replace("/login");
  }, [router]);

  // preço do vendedor salvo por produto
  const priceKey = `sp:myPrice:${ean ?? `q:${q}`}`;
  useEffect(() => {
    if (!hasQuery) return;
    const saved = Number(localStorage.getItem(priceKey));
    setMyPrice(saved > 0 ? saved : null);
  }, [priceKey, hasQuery]);

  const handleMyPrice = (v: number | null) => {
    setMyPrice(v);
    if (v) localStorage.setItem(priceKey, String(v));
    else localStorage.removeItem(priceKey);
  };

  const load = useCallback(
    async (refresh = false) => {
      if (!hasQuery) return;
      setLoading(true);
      setError(null);
      try {
        const data = await analyzeProduct({ ean, q, includeOutliers: !withoutOutliers, refresh });
        setAnalysis(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    },
    [ean, q, withoutOutliers, hasQuery]
  );

  useEffect(() => {
    load();
  }, [load]);

  // sugestões para o estado vazio (produtos do catálogo atual)
  useEffect(() => {
    if (hasQuery) return;
    fetchProducts()
      .then((list) => {
        const seen = new Map<string, string>();
        for (const p of list) {
          const code = String(p.productCode).replace(/^0+/, "");
          if (!seen.has(code)) seen.set(code, p.name);
        }
        setSuggestions([...seen.entries()].slice(0, 8).map(([e, name]) => ({ ean: e, name })));
      })
      .catch(() => setSuggestions([]));
  }, [hasQuery]);

  const goTo = (value: string) => {
    const { ean: e, q: term } = splitQuery(value);
    if (!e && !term) return;
    const next = new URLSearchParams();
    if (e) next.set("ean", e);
    if (term) next.set("q", term);
    next.set("tab", tab);
    router.push(`/inteligencia?${next}`);
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    const next = new URLSearchParams(params.toString());
    next.set("tab", t);
    router.replace(`/inteligencia?${next}`, { scroll: false });
  };

  const visibleOffers = useMemo(() => {
    if (!analysis) return [];
    const term = filter.trim().toLowerCase();
    return analysis.offers.filter((o) => {
      if (marketplace !== "all" && o.marketplace !== marketplace) return false;
      // ofertas manuais continuam visíveis (marcadas como Outlier) para o usuário não "perder" o que cadastrou
      if (withoutOutliers && o.isOutlier && o.source !== "manual") return false;
      if (!term) return true;
      return (
        o.externalId.toLowerCase().includes(term) ||
        o.seller.name.toLowerCase().includes(term) ||
        (o.seller.id ?? "").toLowerCase().includes(term) ||
        (o.logistics ?? "").toLowerCase().includes(term)
      );
    });
  }, [analysis, filter, marketplace, withoutOutliers]);

  const demoSources = analysis?.sources.filter((s) => s.mode !== "live") ?? [];

  const handleDelete = async (offer: PricingOffer) => {
    if (!offer.manualId) return;
    if (!window.confirm(`Remover a oferta de "${offer.seller.name}"?`)) return;
    try {
      await deleteManualOffer(offer.manualId);
      load();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : String(err));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const TABS: { key: Tab; label: string; Icon: typeof BarChart3; badge?: number }[] = [
    { key: "market", label: "Visão de Mercado", Icon: BarChart3 },
    { key: "offers", label: "Análise de Ofertas", Icon: Layers, badge: analysis?.summary.totalOffers },
    { key: "simulator", label: "Simulador de Rentabilidade", Icon: Calculator },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-surface-2/60">
      {/* ------------------------------------------------------------ header */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Logo href="/dashboard" />
              <span className="hidden rounded-full border border-brand/30 bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-brand-strong sm:inline">
                Inteligência Competitiva
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Link href="/dashboard" className={buttonClass("ghost", "sm")}>
                <ArrowLeft className="size-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <ThemeToggle />
              <button type="button" onClick={handleLogout} className={buttonClass("ghost", "sm")}>
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 pb-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="min-w-0 truncate text-sm text-muted">
              Produto analisado:{" "}
              <span className="font-semibold text-fg">
                {analysis?.product.title ?? (hasQuery ? "…" : "nenhum")}
              </span>
              {analysis?.product.ean && (
                <span className="ml-2 text-xs text-subtle tabular">EAN {analysis.product.ean}</span>
              )}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  goTo(productInput);
                }}
                className="flex gap-2"
              >
                <input
                  value={productInput}
                  onChange={(e) => setProductInput(e.target.value)}
                  placeholder="EAN ou nome do produto"
                  aria-label="EAN ou nome do produto para analisar"
                  className={clsx(inputClass, "h-10 w-56 sm:w-72")}
                />
                <button type="submit" className={buttonClass("secondary", "sm", "h-10")}>
                  <Search className="size-4" /> Analisar
                </button>
              </form>
              <button
                type="button"
                disabled={!hasQuery}
                onClick={() => setFormOffer("new")}
                className={buttonClass("primary", "sm", "h-10")}
              >
                <Plus className="size-4" /> Nova Oferta
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------- tabs + filtros */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 xl:flex-row xl:items-center">
          <nav
            role="tablist"
            aria-label="Seções da análise"
            className="grid grid-cols-3 gap-1 rounded-xl bg-surface-2 p-1 xl:w-[560px] xl:shrink-0"
          >
            {TABS.map(({ key, label, Icon, badge }) => (
              <button
                key={key}
                role="tab"
                type="button"
                aria-selected={tab === key}
                onClick={() => switchTab(key)}
                className={clsx(
                  "flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-xs font-medium transition-colors sm:text-sm",
                  tab === key ? "bg-surface text-brand-strong shadow-sm" : "text-muted hover:text-fg"
                )}
              >
                <Icon className="hidden size-4 shrink-0 sm:block" aria-hidden />
                <span className="text-center leading-tight">
                  {label}
                  {badge !== undefined && <span className="tabular"> ({badge})</span>}
                </span>
              </button>
            ))}
          </nav>

          <div className="flex flex-1 flex-wrap items-center gap-2">
            <div className="relative min-w-52 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
              <input
                type="search"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filtrar por ID, loja ou logística…"
                aria-label="Filtrar ofertas"
                className={clsx(inputClass, "h-9 rounded-full pl-9 text-sm")}
              />
            </div>
            <div role="group" aria-label="Marketplace" className="flex flex-wrap gap-1.5">
              {(["all", ...MP_KEYS] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={marketplace === k}
                  onClick={() => setMarketplace(k)}
                  className={clsx(
                    "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors",
                    marketplace === k
                      ? "border-fg bg-fg text-bg"
                      : "border-border bg-surface text-muted hover:border-border-strong hover:text-fg"
                  )}
                >
                  {k !== "all" && <MarketplaceDot marketplace={k} className="size-2" />}
                  {k === "all" ? "Todos" : MARKETPLACES[k].label}
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-pressed={withoutOutliers}
              onClick={() => setWithoutOutliers((v) => !v)}
              className={clsx(
                "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-colors",
                withoutOutliers
                  ? "border-brand/40 bg-brand-soft text-brand-strong"
                  : "border-border bg-surface text-muted hover:text-fg"
              )}
            >
              <Filter className="size-3.5" aria-hidden />
              {withoutOutliers ? "Sem Outliers" : "Com Outliers"}
            </button>
            <button
              type="button"
              onClick={() => load(true)}
              disabled={!hasQuery || loading}
              aria-label="Atualizar coleta"
              title="Atualizar coleta (ignora o cache)"
              className={buttonClass("ghost", "sm", "h-8 px-2")}
            >
              <RefreshCw className={clsx("size-4", loading && "animate-spin")} />
            </button>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------- body */}
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-5 px-4 py-6 sm:px-6">
        {!hasQuery ? (
          <EmptyState suggestions={suggestions} onPick={goTo} />
        ) : error ? (
          <div className="rounded-2xl border border-danger/30 bg-danger-soft p-6 text-danger">
            <p className="font-semibold">Não foi possível analisar o produto.</p>
            <p className="mt-1 text-sm">{error}</p>
            <button type="button" onClick={() => load()} className={buttonClass("secondary", "sm", "mt-4")}>
              Tentar novamente
            </button>
          </div>
        ) : !analysis ? (
          <div className="flex items-center justify-center gap-2 py-24 text-muted">
            <LoaderCircle className="size-5 animate-spin" /> Consultando marketplaces…
          </div>
        ) : (
          <>
            {demoSources.length > 0 && (
              <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning-soft px-4 py-3 text-sm text-warning">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                <p>
                  <strong>Dados de demonstração</strong> em{" "}
                  {demoSources.map((s) => MARKETPLACES[s.marketplace].label).join(", ")}: as APIs oficiais
                  desses canais ainda não estão configuradas no backend. Os números ilustram a análise,
                  mas não são preços reais.
                </p>
              </div>
            )}

            <KpiCards analysis={analysis} />

            {tab === "offers" && (
              <OffersTable
                offers={visibleOffers}
                loading={loading}
                onEdit={(o) => setFormOffer(o)}
                onDelete={handleDelete}
              />
            )}
            {tab === "market" && (
              <MarketOverview
                analysis={analysis}
                offers={visibleOffers}
                myPrice={myPrice}
                onMyPriceChange={handleMyPrice}
              />
            )}
            {tab === "simulator" && <ProfitSimulator analysis={analysis} myPrice={myPrice} />}
          </>
        )}
      </main>

      <OfferFormDialog
        offer={formOffer}
        query={{ ean, q }}
        onClose={() => setFormOffer(null)}
        onSaved={() => {
          setFormOffer(null);
          load();
        }}
      />
    </div>
  );
}

function EmptyState({
  suggestions,
  onPick,
}: Readonly<{ suggestions: { ean: string; name: string }[]; onPick: (v: string) => void }>) {
  return (
    <div className="rounded-2xl border border-dashed border-border-strong bg-surface px-6 py-16 text-center">
      <BarChart3 className="mx-auto mb-3 size-8 text-brand" aria-hidden />
      <h1 className="text-lg font-semibold text-fg">Analise um produto</h1>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted">
        Digite um EAN ou o nome do produto acima. A Search Price consulta Mercado Livre, Amazon, Shopee e
        Magalu em paralelo e consolida preços, tarifas e rentabilidade.
      </p>
      {suggestions.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {suggestions.map((s) => (
            <button
              key={s.ean}
              type="button"
              onClick={() => onPick(s.ean)}
              className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-brand/40 hover:text-fg"
            >
              {s.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
