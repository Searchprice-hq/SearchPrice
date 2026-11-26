"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { History, Radio, Target } from "lucide-react";
import MoneyInput from "@/components/ui/MoneyInput";
import MarketplaceBadge, { MARKETPLACES, type MarketplaceKey } from "@/components/ui/MarketplaceBadge";
import PricePositionBar, { PositionChip } from "@/components/dashboard/PricePositionBar";
import { formatBRL } from "@/helpers/currency";
import type { MarketStats } from "@/helpers/market";
import {
  fetchHistory,
  type Analysis,
  type HistoryPoint,
  type PriceStats,
  type PricingOffer,
} from "@/services/pricingService";

const toMarket = (s: PriceStats): MarketStats => ({ min: s.min, median: s.median, max: s.max, count: s.count });

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, width };
}

function niceTicks(min: number, max: number, count = 5): number[] {
  const span = max - min || 1;
  const step0 = span / count;
  const mag = 10 ** Math.floor(Math.log10(step0));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= step0) ?? step0;
  const out: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max + 1e-9; v += step) out.push(Math.round(v * 100) / 100);
  return out;
}

const shortBRL = (n: number) =>
  n >= 1000 ? `R$ ${(n / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil` : `R$ ${Math.round(n)}`;

/* ------------------------------------------------------------------ dot plot */

function PriceDotPlot({
  analysis,
  offers,
  myPrice,
}: Readonly<{ analysis: Analysis; offers: PricingOffer[]; myPrice: number | null }>) {
  const { ref, width } = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<{ o: PricingOffer; x: number; y: number } | null>(null);

  const rows = analysis.byMarketplace.filter((m) => offers.some((o) => o.marketplace === m.marketplace));
  const prices = offers.map((o) => o.price).concat(myPrice ? [myPrice] : []);
  const lo = prices.length ? Math.min(...prices) : 0;
  const hi = prices.length ? Math.max(...prices) : 1;
  const pad = (hi - lo) * 0.05 || 1;
  const x0 = Math.max(0, lo - pad);
  const x1 = hi + pad;

  const left = 112;
  const right = 20;
  const rowH = 44;
  const top = 12;
  const plotW = Math.max(100, width - left - right);
  const height = top + rows.length * rowH + 30;
  const sx = (v: number) => left + ((v - x0) / (x1 - x0)) * plotW;
  const ticks = niceTicks(x0, x1, width < 500 ? 3 : 6);

  // jitter vertical determinístico para separar pontos próximos
  const jitter = (id: string) => {
    let h = 0;
    for (const c of id) h = (h * 31 + c.charCodeAt(0)) | 0;
    return ((Math.abs(h) % 100) / 100 - 0.5) * 18;
  };

  return (
    <div ref={ref} className="relative w-full">
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label="Distribuição de preços por marketplace">
          {/* grade */}
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={sx(t)}
                x2={sx(t)}
                y1={top}
                y2={height - 26}
                stroke="var(--border)"
                strokeDasharray="2 4"
              />
              <text x={sx(t)} y={height - 8} textAnchor="middle" fontSize={11} fill="var(--text-subtle)">
                {shortBRL(t)}
              </text>
            </g>
          ))}

          {rows.map((m, i) => {
            const cy = top + i * rowH + rowH / 2;
            const list = offers.filter((o) => o.marketplace === m.marketplace);
            return (
              <g key={m.marketplace}>
                <text x={0} y={cy + 4} fontSize={12} fontWeight={600} fill="var(--text)">
                  {MARKETPLACES[m.marketplace].label}
                </text>
                <line x1={left} x2={left + plotW} y1={cy} y2={cy} stroke="var(--border)" />
                {m.stats && (
                  <>
                    <line
                      x1={sx(m.stats.q1)}
                      x2={sx(m.stats.q3)}
                      y1={cy}
                      y2={cy}
                      stroke="var(--brand)"
                      strokeOpacity={0.25}
                      strokeWidth={14}
                      strokeLinecap="round"
                    />
                    <line
                      x1={sx(m.stats.median)}
                      x2={sx(m.stats.median)}
                      y1={cy - 13}
                      y2={cy + 13}
                      stroke="var(--text)"
                      strokeWidth={2}
                      strokeLinecap="round"
                    >
                      <title>Mediana {formatBRL(m.stats.median)}</title>
                    </line>
                  </>
                )}
                {list.map((o) => {
                  const cx = sx(o.price);
                  const y = cy + jitter(o.id);
                  return (
                    <g
                      key={o.id}
                      onMouseEnter={() => setHover({ o, x: cx, y })}
                      onMouseLeave={() => setHover((h) => (h?.o.id === o.id ? null : h))}
                    >
                      <circle cx={cx} cy={y} r={9} fill="transparent" />
                      <circle
                        cx={cx}
                        cy={y}
                        r={hover?.o.id === o.id ? 6 : 4.5}
                        fill={o.isOutlier ? "var(--surface)" : "var(--brand)"}
                        stroke={o.isOutlier ? "var(--danger)" : "var(--surface)"}
                        strokeWidth={o.isOutlier ? 1.75 : 2}
                      />
                    </g>
                  );
                })}
              </g>
            );
          })}

          {myPrice && (
            <g>
              <line
                x1={sx(myPrice)}
                x2={sx(myPrice)}
                y1={top - 4}
                y2={height - 26}
                stroke="var(--brand-strong)"
                strokeWidth={2}
                strokeDasharray="5 4"
              />
              <rect
                x={Math.min(sx(myPrice) + 4, width - 92)}
                y={top - 6}
                width={86}
                height={18}
                rx={5}
                fill="var(--brand-strong)"
              />
              <text
                x={Math.min(sx(myPrice) + 4, width - 92) + 43}
                y={top + 7}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                fill="var(--surface)"
              >
                Meu preço
              </text>
            </g>
          )}
        </svg>
      )}

      {hover && (
        <div
          role="tooltip"
          className={clsx(
            "pointer-events-none absolute z-20 w-56 -translate-x-1/2 rounded-xl border border-border bg-surface p-3 text-xs shadow-lift",
            hover.y > 110 && "-translate-y-full"
          )}
          style={{
            left: Math.min(Math.max(hover.x, 112), width - 112),
            top: hover.y > 110 ? hover.y - 12 : hover.y + 14,
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <MarketplaceBadge marketplace={hover.o.marketplace} size="sm" />
            <span className="text-sm font-bold text-fg tabular">{formatBRL(hover.o.price)}</span>
          </div>
          <p className="mt-2 font-semibold text-fg">{hover.o.seller.name}</p>
          <p className="text-muted">{hover.o.logistics ?? "Logística não informada"}</p>
          {hover.o.isOutlier && <p className="mt-1 font-semibold text-danger">Outlier (fora do IQR)</p>}
          {myPrice && (
            <p className="mt-1 text-muted tabular">
              vs. meu preço: {hover.o.price >= myPrice ? "+" : "−"}
              {formatBRL(Math.abs(hover.o.price - myPrice))}
            </p>
          )}
        </div>
      )}

      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-brand" /> Oferta válida
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full border-[1.75px] border-danger bg-surface" /> Outlier
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-5 rounded-full bg-brand/25" /> Faixa central (Q1–Q3)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-0.5 rounded bg-fg" /> Mediana
        </span>
        {myPrice && (
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-0 border-l-2 border-dashed border-brand-strong" /> Meu preço
          </span>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- history */

function HistoryChart({ points }: Readonly<{ points: HistoryPoint[] }>) {
  const { ref, width } = useWidth<HTMLDivElement>();
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const h = 180;
  const pad = { l: 64, r: 16, t: 12, b: 28 };
  const lo = Math.min(...points.map((p) => p.min));
  const hi = Math.max(...points.map((p) => p.max));
  const sx = (i: number) => pad.l + (i / Math.max(1, points.length - 1)) * (width - pad.l - pad.r);
  const sy = (v: number) => pad.t + (1 - (v - lo) / (hi - lo || 1)) * (h - pad.t - pad.b);
  const ticks = niceTicks(lo, hi, 4);
  const band =
    points.map((p, i) => `${i ? "L" : "M"}${sx(i)},${sy(p.max)}`).join(" ") +
    " " +
    [...points]
      .reverse()
      .map((p, j) => `L${sx(points.length - 1 - j)},${sy(p.min)}`)
      .join(" ") +
    " Z";
  const line = points.map((p, i) => `${i ? "L" : "M"}${sx(i)},${sy(p.median)}`).join(" ");
  const hp = hoverIdx !== null ? points[hoverIdx] : null;

  return (
    <div ref={ref} className="relative">
      {width > 0 && (
        <svg
          width={width}
          height={h}
          role="img"
          aria-label="Histórico da mediana de preços"
          onMouseMove={(e) => {
            const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
            const idx = Math.round(((x - pad.l) / (width - pad.l - pad.r)) * (points.length - 1));
            setHoverIdx(Math.min(points.length - 1, Math.max(0, idx)));
          }}
          onMouseLeave={() => setHoverIdx(null)}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.l} x2={width - pad.r} y1={sy(t)} y2={sy(t)} stroke="var(--border)" />
              <text x={pad.l - 8} y={sy(t) + 4} textAnchor="end" fontSize={11} fill="var(--text-subtle)">
                {shortBRL(t)}
              </text>
            </g>
          ))}
          <path d={band} fill="var(--brand)" fillOpacity={0.12} />
          <path d={line} fill="none" stroke="var(--brand)" strokeWidth={2} strokeLinejoin="round" />
          {hp && hoverIdx !== null && (
            <>
              <line x1={sx(hoverIdx)} x2={sx(hoverIdx)} y1={pad.t} y2={h - pad.b} stroke="var(--border-strong)" />
              <circle cx={sx(hoverIdx)} cy={sy(hp.median)} r={4.5} fill="var(--brand)" stroke="var(--surface)" strokeWidth={2} />
            </>
          )}
          <text x={pad.l} y={h - 8} fontSize={11} fill="var(--text-subtle)">
            {new Date(points[0].at).toLocaleDateString("pt-BR")}
          </text>
          <text x={width - pad.r} y={h - 8} textAnchor="end" fontSize={11} fill="var(--text-subtle)">
            {new Date(points[points.length - 1].at).toLocaleDateString("pt-BR")}
          </text>
        </svg>
      )}
      {hp && hoverIdx !== null && (
        <div
          className="pointer-events-none absolute top-0 z-10 rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-lift"
          style={{ left: Math.min(sx(hoverIdx) + 10, width - 170) }}
        >
          <p className="font-semibold text-fg">{new Date(hp.at).toLocaleString("pt-BR")}</p>
          <p className="text-muted tabular">Mediana: <span className="text-fg">{formatBRL(hp.median)}</span></p>
          <p className="text-muted tabular">
            Faixa: {formatBRL(hp.min)} – {formatBRL(hp.max)}
          </p>
          <p className="text-muted tabular">{hp.offers} ofertas</p>
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------------------------- main */

export default function MarketOverview({
  analysis,
  offers,
  myPrice,
  onMyPriceChange,
}: Readonly<{
  analysis: Analysis;
  offers: PricingOffer[];
  myPrice: number | null;
  onMyPriceChange: (v: number | null) => void;
}>) {
  const [history, setHistory] = useState<HistoryPoint[] | null>(null);
  const { ean, term } = analysis.query;

  useEffect(() => {
    fetchHistory({ ean, q: term })
      .then(setHistory)
      .catch(() => setHistory([]));
  }, [ean, term, analysis.generatedAt]);

  const overall = analysis.summary.stats;
  const sourceOf = useMemo(
    () => Object.fromEntries(analysis.sources.map((s) => [s.marketplace, s])) as Record<MarketplaceKey, Analysis["sources"][number]>,
    [analysis.sources]
  );

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="rounded-2xl border border-border bg-surface p-5 shadow-card">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold text-fg">Distribuição de preços por canal</h2>
            <p className="text-sm text-muted">
              Cada ponto é um anúncio. Passe o mouse para ver loja e logística.
              {analysis.outlierBounds &&
                ` Outliers: fora de ${formatBRL(analysis.outlierBounds.low)} – ${formatBRL(analysis.outlierBounds.high)} (${analysis.outlierBounds.method}).`}
            </p>
          </div>
        </div>
        {offers.length > 0 ? (
          <PriceDotPlot analysis={analysis} offers={offers} myPrice={myPrice} />
        ) : (
          <p className="py-10 text-center text-sm text-muted">Nenhuma oferta com os filtros atuais.</p>
        )}
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-surface p-5 shadow-card">
        <div className="flex items-center gap-2">
          <Target className="size-4 text-brand" aria-hidden />
          <h2 className="font-semibold text-fg">Minha posição</h2>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="mo-my-price" className="block text-xs font-medium text-muted">
            Meu preço de venda
          </label>
          <MoneyInput id="mo-my-price" value={myPrice} onChange={onMyPriceChange} />
        </div>
        {overall ? (
          <>
            <div className="min-h-7">
              {myPrice ? (
                <PositionChip myPrice={myPrice} stats={toMarket(overall)} />
              ) : (
                <p className="text-xs text-subtle">Informe seu preço para ver a posição no mercado.</p>
              )}
            </div>
            <PricePositionBar stats={toMarket(overall)} myPrice={myPrice} />
          </>
        ) : (
          <p className="text-sm text-muted">Sem preços para comparar.</p>
        )}
        {myPrice && (
          <ul className="space-y-2 border-t border-border pt-4">
            {analysis.byMarketplace.map((m) =>
              m.stats ? (
                <li key={m.marketplace} className="flex items-center justify-between gap-2">
                  <MarketplaceBadge marketplace={m.marketplace} size="sm" />
                  <PositionChip myPrice={myPrice} stats={toMarket(m.stats)} />
                </li>
              ) : null
            )}
          </ul>
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card lg:col-span-2">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold text-fg">Resumo por marketplace</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-surface-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-2.5">Canal</th>
                <th className="px-3 py-2.5 text-right">Ofertas</th>
                <th className="px-3 py-2.5 text-right">Mínimo</th>
                <th className="px-3 py-2.5 text-right">Mediana</th>
                <th className="px-3 py-2.5 text-right">Média</th>
                <th className="px-3 py-2.5 text-right">Máximo</th>
                <th className="px-3 py-2.5 text-right">Desvio</th>
                <th className="px-5 py-2.5">Fonte</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border tabular">
              {analysis.byMarketplace.map((m) => {
                const src = sourceOf[m.marketplace];
                return (
                  <tr key={m.marketplace} className="text-fg">
                    <td className="px-5 py-3">
                      <MarketplaceBadge marketplace={m.marketplace} size="sm" />
                    </td>
                    <td className="px-3 py-3 text-right">{m.stats?.count ?? 0}</td>
                    <td className="px-3 py-3 text-right">{m.stats ? formatBRL(m.stats.min) : "—"}</td>
                    <td className="px-3 py-3 text-right font-semibold">{m.stats ? formatBRL(m.stats.median) : "—"}</td>
                    <td className="px-3 py-3 text-right">{m.stats ? formatBRL(m.stats.mean) : "—"}</td>
                    <td className="px-3 py-3 text-right">{m.stats ? formatBRL(m.stats.max) : "—"}</td>
                    <td className="px-3 py-3 text-right text-muted">{m.stats ? formatBRL(m.stats.stdDev) : "—"}</td>
                    <td className="px-5 py-3">
                      {src && (
                        <span
                          title={src.message ?? undefined}
                          className={clsx(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                            src.mode === "live" && "bg-success-soft text-success",
                            src.mode === "demo" && "bg-warning-soft text-warning",
                            src.mode === "error" && "bg-danger-soft text-danger"
                          )}
                        >
                          <Radio className="size-3" aria-hidden />
                          {src.mode === "live" ? "API oficial" : src.mode === "demo" ? "Demonstração" : "Erro"}
                          {src.cached && <span className="font-normal opacity-80">· cache</span>}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-card lg:col-span-2">
        <div className="mb-3 flex items-center gap-2">
          <History className="size-4 text-brand" aria-hidden />
          <h2 className="font-semibold text-fg">Histórico da mediana</h2>
          <span className="text-xs text-muted">(faixa sombreada = mínimo a máximo)</span>
        </div>
        {history === null ? (
          <p className="text-sm text-muted">Carregando…</p>
        ) : history.length < 2 ? (
          <p className="text-sm text-muted">
            O histórico começa a se formar a partir da segunda coleta. A Search Price guarda um resumo agregado
            por produto a cada hora, sem armazenar os anúncios brutos.
          </p>
        ) : (
          <HistoryChart points={history} />
        )}
      </section>
    </div>
  );
}
