"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import MarketplaceBadge from "@/components/ui/MarketplaceBadge";
import { formatBRL } from "@/helpers/currency";
import type { Offer } from "@/helpers/products";

const capitalize = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;

export default function OfferDialog({
  offer,
  onClose,
}: Readonly<{ offer: Offer | null; onClose: () => void }>) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (offer && !dialog.open) dialog.showModal();
    if (!offer && dialog.open) dialog.close();
  }, [offer]);

  const rows: [string, React.ReactNode][] = offer
    ? [
        ["Preço", <strong key="p">{formatBRL(offer.priceValue)}</strong>],
        ["Frete", capitalize(String(offer.shipping))],
        ["Vendedor", offer.sellerName],
        ["Disponível", Number(offer.amountAvailable).toLocaleString("pt-BR")],
        ["Vendidos", Number(offer.amountSold).toLocaleString("pt-BR")],
        ["Visitas no mês", Number(offer.amountVisitsLastMonth).toLocaleString("pt-BR")],
        ["Avaliações", Number(offer.amountReviews).toLocaleString("pt-BR")],
        ["EAN", offer.productCode],
      ]
    : [];

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="offer-title"
      className="sp-modal m-auto w-[min(420px,calc(100vw-2rem))] rounded-2xl border border-border bg-surface p-0 text-fg shadow-card"
    >
      {offer && (
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            {offer.marketplaceKey ? (
              <MarketplaceBadge marketplace={offer.marketplaceKey} />
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              autoFocus
              className="-m-1 grid size-8 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-fg"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src={offer.image}
              alt=""
              width={72}
              height={72}
              className="size-18 rounded-xl border border-border object-cover"
            />
            <h2 id="offer-title" className="text-lg font-semibold text-balance">
              {offer.name}
            </h2>
          </div>
          <dl className="mt-6 divide-y divide-border rounded-xl border border-border">
            {rows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right tabular">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </dialog>
  );
}
