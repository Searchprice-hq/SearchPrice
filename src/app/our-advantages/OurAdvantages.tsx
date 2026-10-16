import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  Headset,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import PageHero from "@/components/site/PageHero";
import { buttonClass } from "@/components/ui/button";

const ADVANTAGES = [
  {
    Icon: Search,
    title: "Busca unificada",
    text: "Compare preços de Amazon, Shopee e Mercado Livre sem sair de uma tela.",
  },
  {
    Icon: Sparkles,
    title: "Precificação inteligente",
    text: "Ajuste suas ofertas com base na concorrência e na sua margem.",
  },
  {
    Icon: BarChart3,
    title: "Insights de mercado",
    text: "Mínimo, mediana e máximo por produto mostram onde está a oportunidade.",
  },
  {
    Icon: ShieldCheck,
    title: "Segurança de dados",
    text: "Seus custos e preços são criptografados e ficam só na sua conta.",
  },
  {
    Icon: Headset,
    title: "Suporte dedicado",
    text: "Fale direto com o time que constrói a plataforma.",
  },
];

const STATS = [
  { value: "10 mil+", label: "Consultas realizadas" },
  { value: "3", label: "Marketplaces suportados" },
  { value: "7 dias", label: "De teste grátis" },
];

const FAQ = [
  { q: "Como faço uma busca?", a: "Digite o EAN ou o nome do produto no painel e informe o seu preço de venda." },
  { q: "Preciso de cadastro?", a: "Sim, um cadastro rápido para proteger seu histórico e personalizar a análise." },
  { q: "Quais marketplaces são suportados?", a: "Mercado Livre, Amazon e Shopee, com novos canais sendo adicionados em breve." },
];

export default function OurAdvantages() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="Diferenciais"
          title="Estratégia de preços com inteligência de mercado"
          description="Uma plataforma que reúne e analisa dados de vários marketplaces em um só lugar, para você ajustar ofertas e proteger sua margem."
        />

        <section className="py-20">
          <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
            {ADVANTAGES.map(({ Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-brand/50"
              >
                <span className="mb-4 grid size-11 place-items-center rounded-xl bg-brand-soft text-brand">
                  <Icon className="size-5" />
                </span>
                <h3 className="mb-1.5 text-lg font-semibold text-fg">{title}</h3>
                <p className="text-muted">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-surface py-16">
          <dl className="mx-auto grid max-w-4xl gap-8 px-4 text-center sm:grid-cols-3 sm:px-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="text-sm text-muted">{s.label}</dt>
                <dd className="mt-1 text-4xl font-extrabold tracking-tight text-brand tabular">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-3xl font-bold tracking-tight text-fg">Como funciona</h2>
            <p className="mt-4 text-lg text-muted text-pretty">
              Basta inserir o código do produto ou pesquisar pelo nome, e a
              Search Price retorna as ofertas de cada canal com preço, frete,
              estoque e vendas. Com filtros por marketplace e tipo de frete, você
              compara só o que concorre de verdade com o seu anúncio.
            </p>

            <h2 className="mt-16 text-2xl font-bold text-fg">Perguntas frequentes</h2>
            <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-surface">
              {FAQ.map(({ q, a }) => (
                <details key={q} className="group px-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-semibold text-fg [&::-webkit-details-marker]:hidden">
                    {q}
                    <ChevronDown className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="-mt-1 pb-5 text-muted">{a}</p>
                </details>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/register" className={buttonClass("primary", "lg")}>
                Começar teste grátis <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
