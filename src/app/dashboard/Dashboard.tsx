"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
  BarChart3,
  LoaderCircle,
  LogOut,
  Package,
  RefreshCw,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { fetchProducts } from "@/services/productService";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import MiniCalculator from "@/components/MiniCalculator";
import ProductCard from "@/components/dashboard/ProductCard";
import OfferDialog from "@/components/dashboard/OfferDialog";
import { inputClass } from "@/components/ui/Field";
import { buttonClass } from "@/components/ui/button";
import {
  MARKETPLACES,
  MarketplaceDot,
  type MarketplaceKey,
} from "@/components/ui/MarketplaceBadge";
import { groupByProduct, normalizeEan, toOffer, type Offer } from "@/helpers/products";
import { pricePosition } from "@/helpers/market";
import { useMyPrices } from "@/hooks/useMyPrices";

const SHIP_OPTIONS = ["prime", "normal", "flex", "full", "express"];

type SortKey = "name" | "offers" | "position";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "position", label: "Posição (mais caro)" },
  { value: "offers", label: "Mais ofertas" },
  { value: "name", label: "Nome (A–Z)" },
];

function Kpi({
  label,
  value,
  Icon,
  tone = "default",
}: Readonly<{
  label: string;
  value: number;
  Icon: typeof Package;
  tone?: "default" | "danger" | "success";
}>) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-3 sm:p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs text-muted sm:text-sm">{label}</p>
        <Icon
          className={clsx(
            "hidden size-4 shrink-0 sm:block",
            tone === "danger" && "text-danger",
            tone === "success" && "text-success",
            tone === "default" && "text-subtle"
          )}
        />
      </div>
      <p className="mt-1 text-2xl font-bold tracking-tight text-fg tabular sm:mt-2 sm:text-3xl">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();

  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [marketplace, setMarketplace] = useState<MarketplaceKey | "all">("all");
  const [shipping, setShipping] = useState("");
  const [sort, setSort] = useState<SortKey>("position");
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const { prices: myPrices, setPrice: setMyPrice } = useMyPrices();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchProducts();
      setOffers(list.map(toOffer));
    } catch (err: unknown) {
      setOffers([]);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.replace("/login");
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem("user") ?? "null");
      setUserName(user?.fullName ?? user?.email ?? null);
    } catch {
      setUserName(null);
    }
    load();
  }, [load, router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const groups = useMemo(() => {
    const term = search.trim().toLowerCase();
    const eanTerm = normalizeEan(term);

    const filtered = offers.filter((o) => {
      if (marketplace !== "all" && o.marketplaceKey !== marketplace) return false;
      if (shipping && String(o.shipping).toLowerCase() !== shipping) return false;
      if (!term) return true;
      if (/^\d+$/.test(term)) return normalizeEan(o.productCode).startsWith(eanTerm);
      return o.name.toLowerCase().includes(term);
    });

    const list = groupByProduct(filtered);
    const deltaOf = (key: string, stats: (typeof list)[number]["stats"]) =>
      myPrices[key] && stats ? pricePosition(myPrices[key], stats).deltaPct : -Infinity;

    return list.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name, "pt-BR");
      if (sort === "offers") return b.offers.length - a.offers.length;
      return deltaOf(b.key, b.stats) - deltaOf(a.key, a.stats);
    });
  }, [offers, search, marketplace, shipping, sort, myPrices]);

  const kpis = useMemo(() => {
    let above = 0;
    let below = 0;
    for (const g of groups) {
      const mine = myPrices[g.key];
      if (!mine || !g.stats) continue;
      const { level } = pricePosition(mine, g.stats);
      if (level === "above") above++;
      if (level === "below") below++;
    }
    return { products: groups.length, above, below };
  }, [groups, myPrices]);

  const firstName = userName?.split(" ")[0];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo href="/dashboard" />
          <div className="flex items-center gap-1.5">
            {firstName && (
              <span className="mr-2 hidden text-sm text-muted sm:inline">
                Olá, <span className="font-medium text-fg">{firstName}</span>
              </span>
            )}
            <Link href="/inteligencia" className={buttonClass("secondary", "sm")}>
              <BarChart3 className="size-4" />
              <span className="hidden sm:inline">Inteligência de preços</span>
            </Link>
            <ThemeToggle />
            <button
              type="button"
              onClick={handleLogout}
              className={buttonClass("ghost", "sm")}
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">
              Comparar preços
            </h1>
            <p className="mt-1 text-muted">
              Informe seu preço em cada produto e veja onde você está em relação ao mercado.
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className={buttonClass("secondary", "sm", "self-start sm:self-auto")}
          >
            <RefreshCw className={clsx("size-4", loading && "animate-spin")} />
            Atualizar
          </button>
        </div>

        <section className="mb-6 grid grid-cols-3 gap-3">
          <Kpi label="Produtos" value={kpis.products} Icon={Package} />
          <Kpi label="Acima do mercado" value={kpis.above} Icon={TrendingUp} tone="danger" />
          <Kpi label="Abaixo do mercado" value={kpis.below} Icon={TrendingDown} tone="success" />
        </section>

        <section className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-surface p-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou EAN…"
              aria-label="Buscar por nome ou EAN"
              className={clsx(inputClass, "pl-10")}
            />
          </div>

          <div
            role="group"
            aria-label="Filtrar por marketplace"
            className="flex flex-wrap gap-1 rounded-xl bg-surface-2 p-1"
          >
            {(["all", ...Object.keys(MARKETPLACES)] as (MarketplaceKey | "all")[]).map(
              (k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setMarketplace(k)}
                  aria-pressed={marketplace === k}
                  className={clsx(
                    "inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors",
                    marketplace === k
                      ? "bg-surface text-fg shadow-sm"
                      : "text-muted hover:text-fg"
                  )}
                >
                  {k !== "all" && <MarketplaceDot marketplace={k} />}
                  {k === "all" ? "Todos" : MARKETPLACES[k].label}
                </button>
              )
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 lg:flex">
            <select
              value={shipping}
              onChange={(e) => setShipping(e.target.value)}
              aria-label="Tipo de frete"
              className={clsx(inputClass, "lg:w-40")}
            >
              <option value="">Todo frete</option>
              {SHIP_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Ordenar"
              className={clsx(inputClass, "lg:w-56")}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-24 text-muted">
            <LoaderCircle className="size-5 animate-spin" /> Carregando ofertas…
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-danger/30 bg-danger-soft p-6 text-danger">
            <p className="font-semibold">Não foi possível carregar os produtos.</p>
            <p className="mt-1 text-sm">{error}</p>
            <button type="button" onClick={load} className={buttonClass("secondary", "sm", "mt-4")}>
              Tentar novamente
            </button>
          </div>
        ) : groups.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-strong py-20 text-center">
            <Package className="mx-auto mb-3 size-8 text-subtle" />
            <p className="font-semibold text-fg">Nenhum produto encontrado</p>
            <p className="mt-1 text-sm text-muted">Ajuste a busca ou os filtros.</p>
          </div>
        ) : (
          <div className="space-y-4 pb-20">
            {groups.map((g) => (
              <ProductCard
                key={g.key}
                group={g}
                myPrice={myPrices[g.key] ?? null}
                onMyPriceChange={(v) => setMyPrice(g.key, v)}
                onSelectOffer={setSelectedOffer}
              />
            ))}
          </div>
        )}
      </main>

      <OfferDialog offer={selectedOffer} onClose={() => setSelectedOffer(null)} />
      <MiniCalculator />
    </div>
  );
}
