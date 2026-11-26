"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import {
  ArrowUpDown,
  CircleAlert,
  CircleCheck,
  ExternalLink,
  Lock,
  Package,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";
import MarketplaceBadge from "@/components/ui/MarketplaceBadge";
import { inputClass } from "@/components/ui/Field";
import { formatBRL } from "@/helpers/currency";
import { isRestricted, type PricingOffer } from "@/services/pricingService";

type Sort = "price_asc" | "price_desc" | "seller" | "marketplace";

const SORTS: { value: Sort; label: string }[] = [
  { value: "price_asc", label: "Menor Preço" },
  { value: "price_desc", label: "Maior Preço" },
  { value: "seller", label: "Loja (A–Z)" },
  { value: "marketplace", label: "Marketplace" },
];

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function RestrictedValue({ label, value }: Readonly<{ label: string; value: PricingOffer["visits"] }>) {
  if (!isRestricted(value)) {
    return (
      <p>
        <span className="text-muted">{label}:</span>{" "}
        <span className="font-medium text-fg tabular">{value.toLocaleString("pt-BR")}</span>
      </p>
    );
  }
  return (
    <p className="flex min-w-0 items-center gap-1" title={value.reason}>
      <span className="text-muted">{label}:</span>
      <Lock className="size-3 shrink-0 text-warning" aria-hidden />
      <span className="truncate text-muted">{value.reason}</span>
    </p>
  );
}

export default function OffersTable({
  offers,
  loading,
  onEdit,
  onDelete,
}: Readonly<{
  offers: PricingOffer[];
  loading: boolean;
  onEdit: (o: PricingOffer) => void;
  onDelete: (o: PricingOffer) => void;
}>) {
  const [sort, setSort] = useState<Sort>("price_asc");

  const sorted = useMemo(() => {
    const list = [...offers];
    switch (sort) {
      case "price_desc":
        return list.sort((a, b) => b.price - a.price);
      case "seller":
        return list.sort((a, b) => a.seller.name.localeCompare(b.seller.name, "pt-BR"));
      case "marketplace":
        return list.sort((a, b) => a.marketplace.localeCompare(b.marketplace) || a.price - b.price);
      default:
        return list.sort((a, b) => a.price - b.price);
    }
  }, [offers, sort]);

  return (
    <section
      aria-label="Ofertas encontradas"
      className={clsx(
        "overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-opacity",
        loading && "opacity-60"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
        <p className="inline-flex items-center gap-2 rounded-lg border border-warning/30 bg-warning-soft px-3 py-1.5 text-xs text-warning">
          <Lock className="size-3.5" aria-hidden />
          Visitas e estoque de terceiros são restritos pelas APIs oficiais (OAuth2).
        </p>
        <label className="flex items-center gap-2 text-sm text-muted">
          <ArrowUpDown className="size-4" aria-hidden />
          <span className="sr-only">Ordenar por</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className={clsx(inputClass, "h-9 w-44 text-sm")}
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {sorted.length === 0 ? (
        <div className="py-16 text-center">
          <Package className="mx-auto mb-3 size-7 text-subtle" aria-hidden />
          <p className="font-semibold text-fg">Nenhuma oferta com esses filtros</p>
          <p className="mt-1 text-sm text-muted">Troque o marketplace, limpe a busca ou inclua os outliers.</p>
        </div>
      ) : (
        <div className="max-h-[640px] overflow-auto">
          <table className="w-full min-w-[1040px] text-sm">
            <thead className="sticky top-0 z-10 bg-surface-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-3">Marketplace</th>
                <th className="px-3 py-3">Loja / Vendedor</th>
                <th className="px-3 py-3 text-right">Preço</th>
                <th className="px-3 py-3">Logística</th>
                <th className="px-3 py-3">Visitas / Estoque (API)</th>
                <th className="px-3 py-3">Amostra & Status</th>
                <th className="px-3 py-3">Coleta</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sorted.map((o) => (
                <tr key={o.id} className="align-middle text-fg transition-colors hover:bg-surface-2/60">
                  <td className="px-5 py-4">
                    <MarketplaceBadge marketplace={o.marketplace} size="sm" />
                    <p className="mt-1 font-mono text-[11px] text-subtle">{o.externalId}</p>
                  </td>
                  <td className="max-w-[220px] px-3 py-4">
                    <p className="font-semibold leading-snug">{o.seller.name}</p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-muted">
                      {o.seller.tier}
                      {o.seller.rating !== null && (
                        <span className="inline-flex items-center gap-0.5 tabular">
                          <Star className="size-3 fill-warning text-warning" aria-hidden />
                          {o.seller.rating.toLocaleString("pt-BR")}
                        </span>
                      )}
                    </p>
                    {o.seller.id && (
                      <p className="mt-0.5 truncate font-mono text-[11px] text-subtle">ID Vendedor: {o.seller.id}</p>
                    )}
                  </td>
                  <td className="px-3 py-4 text-right">
                    <p className="font-bold tabular">{formatBRL(o.price)}</p>
                    {o.shippingPrice !== null && (
                      <p className="text-[11px] text-subtle tabular">
                        {o.shippingPrice === 0 ? "Frete grátis" : `+ ${formatBRL(o.shippingPrice)} frete`}
                      </p>
                    )}
                  </td>
                  <td className="max-w-[170px] px-3 py-4 text-xs text-muted">
                    <span className="flex items-start gap-1.5">
                      <Package className="mt-0.5 size-3.5 shrink-0 text-subtle" aria-hidden />
                      {o.logistics ?? "Não informado"}
                    </span>
                  </td>
                  <td className="max-w-[230px] space-y-0.5 px-3 py-4 text-xs">
                    <RestrictedValue label="Visitas" value={o.visits} />
                    <RestrictedValue label="Estoque" value={o.stock} />
                  </td>
                  <td className="px-3 py-4">
                    {o.isOutlier ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-danger/30 bg-danger-soft px-2 py-0.5 text-xs font-semibold text-danger">
                        <CircleAlert className="size-3.5" aria-hidden /> Outlier
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success-soft px-2 py-0.5 text-xs font-semibold text-success">
                        <CircleCheck className="size-3.5" aria-hidden /> Válida
                      </span>
                    )}
                    <p className="mt-1 text-[11px] text-muted">
                      {o.status === "active" ? "Ativo / Disponível" : "Status desconhecido"}
                      {o.source === "manual" && " · Manual"}
                      {o.source === "demo" && " · Demo"}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-xs text-muted tabular">{fmtDate(o.collectedAt)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {o.url ? (
                        <a
                          href={o.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-7 items-center gap-1 rounded-md border border-brand/30 bg-brand-soft px-2 text-xs font-semibold text-brand-strong hover:border-brand"
                        >
                          <ExternalLink className="size-3.5" aria-hidden />{" "}
                          {o.source === "demo" ? "Buscar" : "Anúncio"}
                        </a>
                      ) : (
                        <span className="inline-flex h-7 items-center rounded-md bg-surface-2 px-2 text-xs text-subtle">
                          Sem link
                        </span>
                      )}
                      {o.manualId ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onEdit(o)}
                            aria-label={`Editar oferta de ${o.seller.name}`}
                            className="grid size-7 place-items-center rounded-md text-muted hover:bg-surface-2 hover:text-fg"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(o)}
                            aria-label={`Remover oferta de ${o.seller.name}`}
                            className="grid size-7 place-items-center rounded-md text-danger hover:bg-danger-soft"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </>
                      ) : (
                        <span
                          className="grid size-7 place-items-center text-subtle"
                          title="Ofertas coletadas dos marketplaces não podem ser editadas"
                        >
                          <Lock className="size-3.5" aria-hidden />
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
