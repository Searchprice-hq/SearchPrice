import { ArrowUpRight, Newspaper, Quote } from "lucide-react";
import clsx from "clsx";

export const PRESS = {
  outlet: "Associação Nacional dos Inventores",
  outletShort: "ANI · inventores.com.br",
  title: "Conheça a Search Price: a ferramenta de análise para vendedores de marketplaces",
  date: "16 de setembro de 2024",
  quote:
    "Utiliza um software inovador que promete economia de tempo ao transformar horas de busca em poucos minutos.",
  href: "https://inventores.com.br/conheca-a-search-price-a-ferramenta-que-ira-revolucionar-suas-compras-em-marketplaces/",
};

/** Destaque da matéria publicada sobre a Search Price. */
export default function PressFeature({ className }: Readonly<{ className?: string }>) {
  return (
    <a
      href={PRESS.href}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        "group relative block overflow-hidden rounded-3xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lift sm:p-8",
        className
      )}
    >
      <div
        className="absolute -right-16 -top-16 size-56 rounded-full bg-brand-soft blur-2xl transition-transform duration-500 group-hover:scale-125"
        aria-hidden
      />
      <div className="relative grid gap-6 md:grid-cols-[auto_1fr] md:items-center md:gap-8">
        <div className="flex items-center gap-3 md:flex-col md:items-start">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand text-brand-contrast shadow-sm">
            <Newspaper className="size-6" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand">
              Na mídia
            </p>
            <p className="text-sm font-medium text-fg">{PRESS.outletShort}</p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold tracking-tight text-fg text-balance sm:text-2xl">
            {PRESS.title}
          </h3>
          <blockquote className="mt-4 flex gap-3 text-muted">
            <Quote className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
            <p className="text-pretty italic">{PRESS.quote}</p>
          </blockquote>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-subtle">
              {PRESS.outlet} · {PRESS.date}
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
              Ler matéria completa
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
