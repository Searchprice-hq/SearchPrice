"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { Bell, RefreshCw } from "lucide-react";
import {
  MARKETPLACES,
  MarketplaceDot,
  type MarketplaceKey,
} from "@/components/ui/MarketplaceBadge";
import PricePositionBar, {
  PositionChip,
} from "@/components/dashboard/PricePositionBar";
import { formatBRL } from "@/helpers/currency";
import { marketStats } from "@/helpers/market";

type DemoOffer = { marketplace: MarketplaceKey; price: number; seller: string };

const DEMOS: {
  name: string;
  ean: string;
  myPrice: number;
  offers: DemoOffer[];
}[] = [
  {
    name: "Fone Bluetooth XYZ",
    ean: "7898378709273",
    myPrice: 134.9,
    offers: [
      { marketplace: "shopee", price: 109.0, seller: "BrasilFones" },
      { marketplace: "mercadolivre", price: 119.9, seller: "SoundTech" },
      { marketplace: "amazon", price: 124.5, seller: "AudioShop" },
      { marketplace: "shopee", price: 127.9, seller: "TechStore" },
      { marketplace: "mercadolivre", price: 132.0, seller: "FoneMania" },
    ],
  },
  {
    name: "Cafeteira Philco PH30",
    ean: "7891356059049",
    myPrice: 359.9,
    offers: [
      { marketplace: "amazon", price: 369.9, seller: "PhilcoOfficial" },
      { marketplace: "mercadolivre", price: 379.0, seller: "CasaShop" },
      { marketplace: "shopee", price: 389.9, seller: "LarDoce" },
      { marketplace: "mercadolivre", price: 399.9, seller: "Eletrolar" },
      { marketplace: "amazon", price: 412.0, seller: "MegaStore" },
    ],
  },
  {
    name: "Impressora HP DeskJet 2776",
    ean: "8887939221311",
    myPrice: 449.9,
    offers: [
      { marketplace: "mercadolivre", price: 429.9, seller: "HPStore" },
      { marketplace: "amazon", price: 439.0, seller: "InfoShop" },
      { marketplace: "shopee", price: 449.0, seller: "PrintMais" },
      { marketplace: "mercadolivre", price: 455.9, seller: "TechCenter" },
      { marketplace: "shopee", price: 469.9, seller: "OfficeBR" },
    ],
  },
];

const INTERVAL = 4500;

export default function HeroPreview() {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % DEMOS.length),
      INTERVAL,
    );
    return () => clearInterval(id);
  }, []);

  const demo = DEMOS[index];
  const stats = marketStats(demo.offers.map((o) => o.price))!;

  return (
    <div className="relative lg:animate-float">
      <div className="rounded-3xl border border-border bg-surface p-5 shadow-lift sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div key={demo.ean} className="animate-[fade-in_0.4s_ease-out]">
            <p className="text-xs font-medium text-subtle tabular">
              EAN {demo.ean}
            </p>
            <p className="font-semibold text-fg">{demo.name}</p>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-end justify-between gap-3 rounded-2xl bg-surface-2 p-4">
          <div>
            <p className="text-xs text-muted">Seu preço</p>
            <p className="text-2xl font-bold text-fg tabular transition-all">
              {formatBRL(demo.myPrice)}
            </p>
          </div>
          <PositionChip myPrice={demo.myPrice} stats={stats} />
        </div>

        <PricePositionBar
          stats={stats}
          myPrice={mounted ? demo.myPrice : stats.min}
        />

        <ul className="mt-5 divide-y divide-border border-t border-border">
          {demo.offers.slice(0, 4).map((o, i) => (
            <li
              key={`${demo.ean}-${o.seller}`}
              className="flex items-center justify-between py-2.5 text-sm opacity-0 animate-[fade-in_0.5s_ease-out_forwards]"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="flex items-center gap-2.5">
                <MarketplaceDot marketplace={o.marketplace} />
                <span className="text-fg">{o.seller}</span>
                <span className="text-subtle">
                  {MARKETPLACES[o.marketplace].label}
                </span>
              </span>
              <span className="font-semibold text-fg tabular">
                {formatBRL(o.price)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center gap-3">
          <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-subtle">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-brand" />
            </span>
            dados de demonstração
          </span>
          <div className="flex flex-1 gap-1.5" aria-hidden>
            {DEMOS.map((d, i) => (
              <span
                key={d.ean}
                className={clsx(
                  "h-1 flex-1 overflow-hidden rounded-full bg-surface-2",
                )}
              >
                <span
                  key={i === index ? `active-${index}` : d.ean}
                  className={clsx(
                    "block h-full rounded-full bg-brand",
                    i < index && "w-full",
                    i > index && "w-0",
                    i === index &&
                      "w-0 animate-[progress_4.5s_linear_forwards]",
                  )}
                />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Cartões flutuantes (fora da área de conteúdo do card) */}
      <div className="absolute -right-6 -top-7 hidden animate-[float_6s_ease-in-out_infinite] items-center gap-2.5 rounded-2xl border border-border bg-surface px-3.5 py-2.5 shadow-lift sm:flex">
        <span className="grid size-8 place-items-center rounded-xl bg-brand-soft text-brand">
          <Bell className="size-4" />
        </span>
        <div className="text-xs">
          <p className="font-semibold text-fg">Concorrente baixou o preço</p>
          <p className="text-muted">Shopee · −4,2%</p>
        </div>
      </div>
      <div className="absolute -bottom-9 -left-6 hidden animate-[float_8s_ease-in-out_infinite_1s] items-center gap-2 rounded-2xl border border-border bg-surface px-3.5 py-2.5 text-xs shadow-lift sm:flex">
        <RefreshCw className="size-3.5 text-brand" />
        <span className="text-muted">
          <span className="font-semibold text-fg">3 canais</span> comparados
        </span>
      </div>
    </div>
  );
}
