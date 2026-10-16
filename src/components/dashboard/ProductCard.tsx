"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import MoneyInput from "@/components/ui/MoneyInput";
import MarketplaceBadge, {
  MARKETPLACES,
  MarketplaceDot,
  type MarketplaceKey,
} from "@/components/ui/MarketplaceBadge";
import PricePositionBar, { PositionChip } from "./PricePositionBar";
import { formatBRL } from "@/helpers/currency";
import type { Offer, ProductGroup } from "@/helpers/products";

const capitalize = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;

const fmtInt = (n: number | null | undefined) =>
  Number(n ?? 0).toLocaleString("pt-BR");

export default function ProductCard({
  group,
  myPrice,
  onMyPriceChange,
  onSelectOffer,
}: Readonly<{
  group: ProductGroup;
  myPrice: number | null;
  onMyPriceChange: (value: number | null) => void;
  onSelectOffer: (offer: Offer) => void;
}>) {
  const [open, setOpen] = useState(false);
  const { stats } = group;

  return (
    <article className="rounded-2xl border border-border bg-surface shadow-card">
      <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center">
        {/* Produto */}
        <div className="flex min-w-0 items-center gap-4">
          <Image
            src={group.image}
            alt=""
            width={56}
            height={56}
            className="size-14 shrink-0 rounded-xl border border-border bg-surface-2 object-cover"
          />
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-fg" title={group.name}>
              {group.name}
            </h3>
            <p className="text-xs text-subtle tabular">EAN {group.ean}</p>
            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
              {(Object.keys(MARKETPLACES) as MarketplaceKey[]).map((k) =>
                group.bestByMarketplace[k] !== undefined ? (
                  <span key={k} className="flex items-center gap-1.5 text-xs text-muted tabular">
                    <MarketplaceDot marketplace={k} />
                    {formatBRL(group.bestByMarketplace[k]!)}
                  </span>
                ) : null
              )}
            </div>
          </div>
        </div>

        {/* Meu preço */}
        <div className="space-y-2">
          <label
            htmlFor={`my-price-${group.key}`}
            className="block text-xs font-medium text-muted"
          >
            Meu preço de venda
          </label>
          <MoneyInput
            id={`my-price-${group.key}`}
            value={myPrice}
            onChange={onMyPriceChange}
          />
          <div className="min-h-6">
            {myPrice && stats ? (
              <PositionChip myPrice={myPrice} stats={stats} />
            ) : (
              <p className="text-xs text-subtle">
                Informe seu preço para ver sua posição.
              </p>
            )}
          </div>
        </div>

        {/* Mercado */}
        <div>
          {stats ? (
            <PricePositionBar stats={stats} myPrice={myPrice} />
          ) : (
            <p className="text-sm text-muted">Sem preços para comparar.</p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between border-t border-border px-5 py-3 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-fg"
      >
        {group.offers.length}{" "}
        {group.offers.length === 1 ? "oferta encontrada" : "ofertas encontradas"}
        <ChevronDown className={clsx("size-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="overflow-x-auto border-t border-border">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-surface-2 text-left text-xs uppercase tracking-wide text-subtle">
              <tr>
                <th className="px-5 py-2.5 font-medium">Canal</th>
                <th className="px-3 py-2.5 font-medium">Vendedor</th>
                <th className="px-3 py-2.5 text-right font-medium">Preço</th>
                <th className="px-3 py-2.5 text-right font-medium">vs. meu</th>
                <th className="px-3 py-2.5 font-medium">Frete</th>
                <th className="px-3 py-2.5 text-right font-medium">Vendidos</th>
                <th className="px-3 py-2.5 text-right font-medium">Disponível</th>
                <th className="px-5 py-2.5 text-right font-medium">Visitas/mês</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {group.offers.map((o) => {
                const diff = myPrice ? o.priceValue - myPrice : null;
                return (
                  <tr
                    key={o.id}
                    onClick={() => onSelectOffer(o)}
                    className="cursor-pointer text-fg transition-colors hover:bg-surface-2"
                  >
                    <td className="px-5 py-3">
                      {o.marketplaceKey ? (
                        <MarketplaceBadge marketplace={o.marketplaceKey} size="sm" />
                      ) : (
                        o.marketplace
                      )}
                    </td>
                    <td className="px-3 py-3">{o.sellerName}</td>
                    <td className="px-3 py-3 text-right font-semibold tabular">
                      {formatBRL(o.priceValue)}
                    </td>
                    <td
                      className={clsx(
                        "px-3 py-3 text-right tabular",
                        diff === null && "text-subtle",
                        diff !== null && diff < 0 && "text-danger",
                        diff !== null && diff > 0 && "text-success",
                        diff === 0 && "text-muted"
                      )}
                    >
                      {diff === null
                        ? "—"
                        : `${diff > 0 ? "+" : diff < 0 ? "−" : ""}${formatBRL(Math.abs(diff))}`}
                    </td>
                    <td className="px-3 py-3">{capitalize(String(o.shipping))}</td>
                    <td className="px-3 py-3 text-right tabular">{fmtInt(o.amountSold)}</td>
                    <td className="px-3 py-3 text-right tabular">{fmtInt(o.amountAvailable)}</td>
                    <td className="px-5 py-3 text-right tabular">
                      {fmtInt(o.amountVisitsLastMonth)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
}
