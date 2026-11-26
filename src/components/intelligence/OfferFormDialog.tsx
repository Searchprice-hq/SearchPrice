"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle, X } from "lucide-react";
import { Field, FormError, inputClass } from "@/components/ui/Field";
import MoneyInput from "@/components/ui/MoneyInput";
import { buttonClass } from "@/components/ui/button";
import { MARKETPLACES, type MarketplaceKey } from "@/components/ui/MarketplaceBadge";
import {
  createManualOffer,
  updateManualOffer,
  type ManualOfferInput,
  type PricingOffer,
} from "@/services/pricingService";

const LOGISTICS: Record<MarketplaceKey, string[]> = {
  mercadolivre: ["Full (Fulfillment ML)", "Flex", "Coletas", "Places", "Logística própria"],
  amazon: ["FBA (Fulfillment by Amazon)", "DBA (Delivery by Amazon)", "Envio pelo vendedor"],
  shopee: ["Shopee Xpress (SPX)", "Entrega padrão"],
  magalu: ["Magalu Entregas", "Envio pelo parceiro"],
};

const empty = (): ManualOfferInput => ({ marketplace: "mercadolivre", sellerName: "", price: 0 });

export default function OfferFormDialog({
  offer,
  query,
  onClose,
  onSaved,
}: Readonly<{
  offer: PricingOffer | "new" | null;
  query: { ean: string | null; q: string | null };
  onClose: () => void;
  onSaved: () => void;
}>) {
  const ref = useRef<HTMLDialogElement>(null);
  const [form, setForm] = useState<ManualOfferInput>(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editing = offer && offer !== "new" ? offer : null;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (offer && !dialog.open) {
      setError(null);
      setForm(
        editing
          ? {
              marketplace: editing.marketplace,
              sellerName: editing.seller.name,
              sellerTier: editing.seller.tier === "Cadastro manual" ? "" : (editing.seller.tier ?? ""),
              price: editing.price,
              shippingPrice: editing.shippingPrice ?? undefined,
              logistics: editing.logistics ?? "",
              externalId: editing.externalId.startsWith("MANUAL-") ? "" : editing.externalId,
              url: editing.url ?? "",
            }
          : empty()
      );
      dialog.showModal();
    }
    if (!offer && dialog.open) dialog.close();
  }, [offer, editing]);

  const set = <K extends keyof ManualOfferInput>(k: K, v: ManualOfferInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.sellerName.trim()) return setError("Informe a loja ou vendedor.");
    if (!form.price || form.price <= 0) return setError("Informe o preço da oferta.");
    const clean: ManualOfferInput = {
      marketplace: form.marketplace,
      sellerName: form.sellerName.trim(),
      price: form.price,
      ...(form.sellerTier?.trim() && { sellerTier: form.sellerTier.trim() }),
      ...(form.logistics?.trim() && { logistics: form.logistics.trim() }),
      ...(form.externalId?.trim() && { externalId: form.externalId.trim() }),
      ...(form.url?.trim() && { url: form.url.trim() }),
      ...(form.shippingPrice !== undefined && { shippingPrice: form.shippingPrice }),
    };
    setSaving(true);
    setError(null);
    try {
      if (editing?.manualId) await updateManualOffer(editing.manualId, clean);
      else await createManualOffer(query, clean);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="offer-form-title"
      className="sp-modal m-auto w-[min(520px,calc(100vw-2rem))] rounded-2xl border border-border bg-surface p-0 text-fg shadow-card"
    >
      <form onSubmit={submit} className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="offer-form-title" className="text-lg font-semibold">
              {editing ? "Editar oferta" : "Nova oferta"}
            </h2>
            <p className="text-sm text-muted">
              Ofertas manuais entram nas estatísticas e na detecção de outliers.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="-m-1 grid size-8 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-fg"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="of-mp" className="block text-sm font-medium">
              Marketplace
            </label>
            <select
              id="of-mp"
              value={form.marketplace}
              onChange={(e) => set("marketplace", e.target.value as MarketplaceKey)}
              className={inputClass}
            >
              {(Object.keys(MARKETPLACES) as MarketplaceKey[]).map((k) => (
                <option key={k} value={k}>
                  {MARKETPLACES[k].label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="of-price" className="block text-sm font-medium">
              Preço
            </label>
            <MoneyInput id="of-price" value={form.price || null} onChange={(v) => set("price", v ?? 0)} />
          </div>
          <Field
            label="Loja / vendedor"
            value={form.sellerName}
            onChange={(e) => set("sellerName", e.target.value)}
            placeholder="Ex.: Droga Raia Oficial"
            required
          />
          <Field
            label="Reputação / tipo (opcional)"
            value={form.sellerTier ?? ""}
            onChange={(e) => set("sellerTier", e.target.value)}
            placeholder="Ex.: Loja Oficial · Platinum"
          />
          <div className="space-y-1.5">
            <label htmlFor="of-log" className="block text-sm font-medium">
              Logística
            </label>
            <input
              id="of-log"
              list="of-log-options"
              value={form.logistics ?? ""}
              onChange={(e) => set("logistics", e.target.value)}
              className={inputClass}
              placeholder="Selecione ou digite"
            />
            <datalist id="of-log-options">
              {LOGISTICS[form.marketplace].map((l) => (
                <option key={l} value={l} />
              ))}
            </datalist>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="of-ship" className="block text-sm font-medium">
              Frete (opcional)
            </label>
            <MoneyInput
              id="of-ship"
              value={form.shippingPrice ?? null}
              onChange={(v) => set("shippingPrice", v ?? undefined)}
            />
          </div>
          <Field
            label="ID do anúncio (opcional)"
            value={form.externalId ?? ""}
            onChange={(e) => set("externalId", e.target.value)}
            placeholder="MLB…, ASIN…"
          />
          <Field
            label="Link (opcional)"
            type="url"
            value={form.url ?? ""}
            onChange={(e) => set("url", e.target.value)}
            placeholder="https://"
          />
        </div>

        {error && <FormError>{error}</FormError>}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className={buttonClass("ghost", "md")}>
            Cancelar
          </button>
          <button type="submit" disabled={saving} className={buttonClass("primary", "md")}>
            {saving && <LoaderCircle className="size-4 animate-spin" />}
            {editing ? "Salvar alterações" : "Adicionar oferta"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
