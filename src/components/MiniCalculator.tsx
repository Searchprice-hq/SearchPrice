"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { Calculator, X } from "lucide-react";
import MoneyInput from "@/components/ui/MoneyInput";
import { inputClass } from "@/components/ui/Field";
import { formatBRL } from "@/helpers/currency";

const logisticsCosts: Record<string, number> = {
  prime: 7,
  normal: 5,
  flex: 3,
  full: 10,
  express: 8,
};

const adCosts: Record<string, number> = {
  classic: 7,
  premium: 15,
  free: 0,
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const parsePct = (v: string) => (parseFloat(v.replace(",", ".")) || 0) / 100;

function Row({
  label,
  hint,
  action,
  children,
}: Readonly<{
  label: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-fg">{label}</span>
        {action}
      </div>
      {children}
      {hint && <p className="text-xs text-subtle">{hint}</p>}
    </div>
  );
}

function ToggleLink({
  custom,
  onClick,
}: Readonly<{ custom: boolean; onClick: () => void }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs font-medium text-brand hover:underline"
    >
      {custom ? "Usar lista" : "Inserir valor"}
    </button>
  );
}

/** Painel lateral que calcula lucro e margem de uma venda. */
export default function MiniCalculator() {
  const [open, setOpen] = useState(false);
  const [sellPrice, setSellPrice] = useState<number | null>(null);
  const [buyPrice, setBuyPrice] = useState<number | null>(null);
  const [additionalCost, setAdditionalCost] = useState<number | null>(null);
  const [aliquot, setAliquot] = useState("");
  const [logistics, setLogistics] = useState("");
  const [customLogistics, setCustomLogistics] = useState(false);
  const [customLogisticsValue, setCustomLogisticsValue] = useState<number | null>(null);
  const [adType, setAdType] = useState("");
  const [customAd, setCustomAd] = useState(false);
  const [customAdValue, setCustomAdValue] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const sp = sellPrice ?? 0;
  const logCost = customLogistics
    ? customLogisticsValue ?? 0
    : logisticsCosts[logistics] ?? 0;
  const adPct = customAd ? parsePct(customAdValue) : (adCosts[adType] ?? 0) / 100;
  const alPct = parsePct(aliquot);

  const ready = sellPrice !== null && buyPrice !== null;
  const result = ready
    ? sp - logCost - sp * adPct - (buyPrice ?? 0) - sp * alPct - (additionalCost ?? 0)
    : null;
  const margin = result !== null && sp > 0 ? result / sp : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={clsx(
          "fixed bottom-5 right-5 z-30 inline-flex h-12 items-center gap-2 rounded-full bg-brand px-5 font-semibold text-brand-contrast shadow-card transition-transform hover:scale-[1.03]",
          open && "hidden"
        )}
      >
        <Calculator className="size-5" />
        Calculadora de margem
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Fechar calculadora"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="calc-title"
            className="relative flex h-full w-full max-w-sm flex-col border-l border-border bg-surface shadow-card"
          >
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 id="calc-title" className="flex items-center gap-2 font-semibold text-fg">
                <Calculator className="size-5 text-brand" />
                Calculadora de margem
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="grid size-8 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-fg"
              >
                <X className="size-4" />
              </button>
            </header>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
              <Row label="Preço de venda" hint="Valor pelo qual você quer vender.">
                <MoneyInput value={sellPrice} onChange={setSellPrice} autoFocus />
              </Row>
              <Row label="Custo de compra" hint="Quanto você paga pelo produto.">
                <MoneyInput value={buyPrice} onChange={setBuyPrice} />
              </Row>

              <Row
                label="Logística"
                action={
                  <ToggleLink
                    custom={customLogistics}
                    onClick={() => setCustomLogistics((v) => !v)}
                  />
                }
              >
                {customLogistics ? (
                  <MoneyInput
                    value={customLogisticsValue}
                    onChange={setCustomLogisticsValue}
                  />
                ) : (
                  <select
                    value={logistics}
                    onChange={(e) => setLogistics(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Selecione</option>
                    {Object.entries(logisticsCosts).map(([k, v]) => (
                      <option key={k} value={k}>
                        {capitalize(k)} — {formatBRL(v)}
                      </option>
                    ))}
                  </select>
                )}
              </Row>

              <Row
                label="Taxa do anúncio (%)"
                action={
                  <ToggleLink custom={customAd} onClick={() => setCustomAd((v) => !v)} />
                }
              >
                {customAd ? (
                  <input
                    inputMode="decimal"
                    placeholder="0,00"
                    value={customAdValue}
                    onChange={(e) => setCustomAdValue(e.target.value.replace(/[^\d.,]/g, ""))}
                    className={inputClass}
                  />
                ) : (
                  <select
                    value={adType}
                    onChange={(e) => setAdType(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Selecione</option>
                    {Object.entries(adCosts).map(([k, v]) => (
                      <option key={k} value={k}>
                        {capitalize(k)} — {v}%
                      </option>
                    ))}
                  </select>
                )}
              </Row>

              <Row label="Alíquota de imposto (%)" hint="ICMS ou Simples sobre a venda.">
                <input
                  inputMode="decimal"
                  placeholder="0,00"
                  value={aliquot}
                  onChange={(e) => setAliquot(e.target.value.replace(/[^\d.,]/g, ""))}
                  className={inputClass}
                />
              </Row>
              <Row label="Custos adicionais" hint="Embalagem, etiqueta, outros.">
                <MoneyInput value={additionalCost} onChange={setAdditionalCost} />
              </Row>
            </div>

            <footer className="border-t border-border bg-surface-2 px-5 py-4">
              {result === null ? (
                <p className="text-sm text-muted">
                  Preencha preço de venda e custo de compra.
                </p>
              ) : (
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs text-muted">
                      {result >= 0 ? "Lucro por venda" : "Prejuízo por venda"}
                    </p>
                    <p
                      className={clsx(
                        "text-2xl font-bold tabular",
                        result >= 0 ? "text-success" : "text-danger"
                      )}
                    >
                      {formatBRL(result)}
                    </p>
                  </div>
                  {margin !== null && (
                    <div className="text-right">
                      <p className="text-xs text-muted">Margem</p>
                      <p className="text-lg font-semibold text-fg tabular">
                        {(margin * 100).toLocaleString("pt-BR", {
                          maximumFractionDigits: 1,
                        })}
                        %
                      </p>
                    </div>
                  )}
                </div>
              )}
            </footer>
          </aside>
        </div>
      )}
    </>
  );
}
