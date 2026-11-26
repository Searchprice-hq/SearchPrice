"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { CircleAlert, CircleCheck, CircleX, Info, LoaderCircle } from "lucide-react";
import MoneyInput from "@/components/ui/MoneyInput";
import { inputClass } from "@/components/ui/Field";
import MarketplaceBadge from "@/components/ui/MarketplaceBadge";
import { formatBRL } from "@/helpers/currency";
import {
  simulateProfit,
  type Analysis,
  type ProfitResult,
  type SimulateParams,
} from "@/services/pricingService";

interface SimState {
  cost: number | null;
  tax: string;
  margin: string;
  extraCost: number | null;
  price: number | null;
  mlListingType: "gold_special" | "gold_pro";
  amazonListingType: "dba" | "fba";
}

const STORAGE = "sp:simulator";
const pct = (n: number) => `${n.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
const num = (s: string) => {
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

const VERDICT = {
  profit: { label: "Atinge a meta", cls: "bg-success-soft text-success", Icon: CircleCheck },
  below_target: { label: "Abaixo da meta", cls: "bg-warning-soft text-warning", Icon: CircleAlert },
  loss: { label: "Prejuízo", cls: "bg-danger-soft text-danger", Icon: CircleX },
} as const;

function PercentInput({
  id,
  label,
  value,
  onChange,
  hint,
}: Readonly<{ id: string; label: string; value: string; onChange: (v: string) => void; hint?: string }>) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-medium text-muted">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.,-]/g, ""))}
          className={clsx(inputClass, "pr-9 tabular")}
        />
        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-subtle">%</span>
      </div>
      {hint && <p className="text-[11px] text-subtle">{hint}</p>}
    </div>
  );
}

export default function ProfitSimulator({
  analysis,
  myPrice,
}: Readonly<{ analysis: Analysis; myPrice: number | null }>) {
  const median = analysis.summary.stats?.median ?? null;
  const [state, setState] = useState<SimState>({
    cost: null,
    tax: "6",
    margin: "15",
    extraCost: null,
    price: myPrice ?? median,
    mlListingType: "gold_special",
    amazonListingType: "dba",
  });
  const [results, setResults] = useState<ProfitResult[] | null>(null);
  const [version, setVersion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // restaura custo/imposto/margem salvos por produto
  const key = `${STORAGE}:${analysis.query.key}`;
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) ?? "null");
      if (saved) setState((s) => ({ ...s, ...saved, price: saved.price ?? myPrice ?? median }));
    } catch {
      /* ignora */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = (patch: Partial<SimState>) =>
    setState((s) => {
      const next = { ...s, ...patch };
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });

  useEffect(() => {
    if (!state.price || state.cost === null) {
      setResults(null);
      return;
    }
    const params: SimulateParams = {
      price: state.price,
      cost: state.cost,
      tax: num(state.tax),
      margin: num(state.margin),
      extraCost: state.extraCost ?? 0,
      mlListingType: state.mlListingType,
      amazonListingType: state.amazonListingType,
    };
    const t = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await simulateProfit(params);
        setResults(data.results);
        setVersion(data.feeTableVersion);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [state]);

  const channelMedian = (mp: string) => analysis.byMarketplace.find((m) => m.marketplace === mp)?.stats?.median ?? null;

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
      <section className="space-y-4 rounded-2xl border border-border bg-surface p-5 shadow-card">
        <div>
          <h2 className="font-semibold text-fg">Parâmetros</h2>
          <p className="text-sm text-muted">Os mesmos campos da planilha: custo, imposto e margem alvo.</p>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="sim-cost" className="block text-xs font-medium text-muted">
            Custo de aquisição (unidade)
          </label>
          <MoneyInput id="sim-cost" value={state.cost} onChange={(v) => update({ cost: v ?? null })} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="sim-extra" className="block text-xs font-medium text-muted">
            Custos extras (embalagem, frete pago)
          </label>
          <MoneyInput id="sim-extra" value={state.extraCost} onChange={(v) => update({ extraCost: v })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <PercentInput
            id="sim-tax"
            label="Imposto sobre venda"
            value={state.tax}
            onChange={(v) => update({ tax: v })}
            hint="Ex.: Simples 4–6%"
          />
          <PercentInput id="sim-margin" label="Margem alvo" value={state.margin} onChange={(v) => update({ margin: v })} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="sim-price" className="block text-xs font-medium text-muted">
            Preço de venda simulado
          </label>
          <MoneyInput id="sim-price" value={state.price} onChange={(v) => update({ price: v })} />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {median && (
              <button
                type="button"
                onClick={() => update({ price: median })}
                className="rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted hover:border-brand/40 hover:text-fg"
              >
                Mediana {formatBRL(median)}
              </button>
            )}
            {analysis.summary.stats && (
              <button
                type="button"
                onClick={() => update({ price: analysis.summary.stats!.min })}
                className="rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted hover:border-brand/40 hover:text-fg"
              >
                Menor {formatBRL(analysis.summary.stats.min)}
              </button>
            )}
            {myPrice && (
              <button
                type="button"
                onClick={() => update({ price: myPrice })}
                className="rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted hover:border-brand/40 hover:text-fg"
              >
                Meu preço {formatBRL(myPrice)}
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="sim-ml" className="block text-xs font-medium text-muted">
              Anúncio ML
            </label>
            <select
              id="sim-ml"
              value={state.mlListingType}
              onChange={(e) => update({ mlListingType: e.target.value as SimState["mlListingType"] })}
              className={inputClass}
            >
              <option value="gold_special">Clássico</option>
              <option value="gold_pro">Premium</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="sim-amz" className="block text-xs font-medium text-muted">
              Envio Amazon
            </label>
            <select
              id="sim-amz"
              value={state.amazonListingType}
              onChange={(e) => update({ amazonListingType: e.target.value as SimState["amazonListingType"] })}
              className={inputClass}
            >
              <option value="dba">DBA / próprio</option>
              <option value="fba">FBA</option>
            </select>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-4">
          <div>
            <h2 className="font-semibold text-fg">Rentabilidade por marketplace</h2>
            <p className="text-sm text-muted">
              Comissão, tarifa fixa e imposto descontados do preço simulado.
            </p>
          </div>
          {loading && <LoaderCircle className="size-4 animate-spin text-muted" aria-label="Calculando" />}
        </div>

        {error && <p className="m-5 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">{error}</p>}

        {!results ? (
          <p className="px-5 py-16 text-center text-sm text-muted">
            Informe o <strong className="text-fg">custo de aquisição</strong> e o preço de venda para calcular lucro,
            margem e ponto de equilíbrio em cada canal.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-sm">
                <thead className="bg-surface-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-5 py-2.5">Canal</th>
                    <th className="px-3 py-2.5 text-right">Comissão</th>
                    <th className="px-3 py-2.5 text-right">Tarifa fixa</th>
                    <th className="px-3 py-2.5 text-right">Imposto</th>
                    <th className="px-3 py-2.5 text-right">Recebe líquido</th>
                    <th className="px-3 py-2.5 text-right">Lucro</th>
                    <th className="px-3 py-2.5 text-right">Margem</th>
                    <th className="px-3 py-2.5 text-right">Equilíbrio</th>
                    <th className="px-5 py-2.5 text-right">Preço p/ meta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border tabular">
                  {results.map((r) => {
                    const v = VERDICT[r.verdict];
                    const med = channelMedian(r.marketplace);
                    const competitive = r.targetPrice !== null && med !== null ? r.targetPrice <= med : null;
                    return (
                      <tr key={r.marketplace} className="text-fg">
                        <td className="px-5 py-3">
                          <MarketplaceBadge marketplace={r.marketplace} size="sm" />
                          <p className="mt-1 text-[11px] text-subtle">{r.listingType.label}</p>
                        </td>
                        <td className="px-3 py-3 text-right">
                          {formatBRL(r.commission)}
                          <p className="text-[11px] text-subtle">{pct(r.commissionPct)}</p>
                        </td>
                        <td className="px-3 py-3 text-right">{formatBRL(r.fixedFee)}</td>
                        <td className="px-3 py-3 text-right">{formatBRL(r.tax)}</td>
                        <td className="px-3 py-3 text-right">{formatBRL(r.netRevenue)}</td>
                        <td
                          className={clsx(
                            "px-3 py-3 text-right font-bold",
                            r.profit < 0 ? "text-danger" : "text-fg"
                          )}
                        >
                          {formatBRL(r.profit)}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <span
                            className={clsx(
                              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                              v.cls
                            )}
                            title={v.label}
                          >
                            <v.Icon className="size-3.5" aria-hidden />
                            {pct(r.marginPct)}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right">{r.breakEvenPrice ? formatBRL(r.breakEvenPrice) : "—"}</td>
                        <td className="px-5 py-3 text-right">
                          <span className="font-semibold">{r.targetPrice ? formatBRL(r.targetPrice) : "Inviável"}</span>
                          {competitive !== null && (
                            <p className={clsx("text-[11px]", competitive ? "text-success" : "text-warning")}>
                              {competitive ? "≤ mediana do canal" : `acima da mediana (${formatBRL(med!)})`}
                            </p>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="flex items-start gap-2 border-t border-border px-5 py-3 text-xs text-muted">
              <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              Tarifas de referência (tabela {version}). A comissão real varia por categoria; com as APIs oficiais
              conectadas, o backend usa os valores do canal (ML listing_prices, Amazon getMyFeesEstimateForASIN).
            </p>
          </>
        )}
      </section>
    </div>
  );
}
