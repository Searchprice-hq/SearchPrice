import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Calculator,
  Check,
  ChevronDown,
  Headset,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Truck,
  X,
  Zap,
} from "lucide-react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter, { SOCIALS } from "@/components/site/SiteFooter";
import HeroPreview from "@/components/site/HeroPreview";
import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";
import { buttonClass } from "@/components/ui/button";
import PressFeature from "@/components/site/PressFeature";
import MarketplaceBadge, {
  MARKETPLACES,
  type MarketplaceKey,
} from "@/components/ui/MarketplaceBadge";

const STEPS = [
  {
    Icon: Search,
    title: "Informe seu produto",
    text: "Busque pelo EAN ou nome e diga por quanto você vende hoje.",
  },
  {
    Icon: BarChart3,
    title: "Comparamos os canais",
    text: "Reunimos as ofertas do Mercado Livre, Amazon e Shopee e calculamos mínimo, mediana e máximo.",
  },
  {
    Icon: Target,
    title: "Veja sua posição",
    text: "Saiba na hora se você está acima, alinhado ou abaixo do mercado — e quanto de margem sobra.",
  },
];

const CHANNELS: { key: MarketplaceKey; points: string[] }[] = [
  {
    key: "mercadolivre",
    points: [
      "Preço por anúncio e por catálogo",
      "Tipo de frete: Full, Flex, Coletas",
      "Vendidos, visitas e reputação do vendedor",
    ],
  },
  {
    key: "amazon",
    points: [
      "Ofertas por ASIN/EAN",
      "Buy Box e vendedores concorrentes",
      "Prime e prazo de entrega",
    ],
  },
  {
    key: "shopee",
    points: [
      "Preço por variação",
      "Vendidos e avaliação da loja",
      "Descontos e cupons ativos",
    ],
  },
];

const ADVANTAGES = [
  {
    Icon: Target,
    title: "Posição de preço",
    text: "Régua mín–mediana–máx com o seu preço marcado, por produto.",
  },
  {
    Icon: Calculator,
    title: "Calculadora de margem",
    text: "Comissão, frete, imposto e custos extras na mesma conta.",
  },
  {
    Icon: Truck,
    title: "Frete na comparação",
    text: "Filtre por Full, Flex, Prime e compare só o que concorre com você.",
  },
  {
    Icon: Zap,
    title: "Busca por EAN",
    text: "Encontre o mesmo produto nos três canais sem depender do título.",
  },
  {
    Icon: Sparkles,
    title: "Precificação inteligente",
    text: "Ajuste suas ofertas com base na concorrência e na sua margem.",
  },
  {
    Icon: ShieldCheck,
    title: "Seus dados protegidos",
    text: "Seu preço e seus custos ficam só na sua conta.",
  },
];

const COMPARISON = {
  columns: ["Search Price", "Google", "ChatGPT", "Avantpro"],
  rows: [
    "Análise de mercado em tempo real",
    "Calculadora de lucro integrada",
    "Baixo custo",
    "Busca assertiva por EAN",
    "Fornecedores na plataforma",
  ],
};

const TESTIMONIALS = [
  {
    avatar: "/woman1.png",
    name: "Ana Silva",
    role: "Vendedora no Mercado Livre",
    quote:
      "Reduzi em 30% o tempo gasto pesquisando preços e ainda aumentei minha margem de lucro em 15%.",
  },
  {
    avatar: "/man3.png",
    name: "Bruno Costa",
    role: "Empreendedor Amazon",
    quote:
      "A comparação me ajuda a ajustar meus valores na hora. Recomendo para qualquer seller sério.",
  },
  {
    avatar: "/man2.png",
    name: "Pedro Lima",
    role: "Varejista online",
    quote:
      "Antes gastava horas comparando preços. Com a Search Price, faço isso em segundos.",
  },
];

const TEAM = [
  { name: "Gerson Boing Carvalho", role: "CEO & Cofundador", avatar: "/gerson-boing.jpeg" },
  { name: "Priscilla Barbosa Moni", role: "CTO & Cofundadora", avatar: "/priscilla-barbosa.png" },
  { name: "Rogerio Rodrigues da Silva", role: "Cloud System Administrator", avatar: "/rogerio-silva.png" },
  { name: "Patrick Meirelles", role: "Backend Developer", avatar: "/patrick-meirelles.png" },
  { name: "Victor Augusto Barbosa Moni", role: "Frontend Developer", avatar: "/victor-moni.png" },
];

const FAQ = [
  {
    q: "O que é a Search Price?",
    a: "Uma plataforma que compara o preço do seu produto com as ofertas do Mercado Livre, Amazon e Shopee e mostra se você está acima ou abaixo do mercado.",
  },
  {
    q: "Como a Search Price me ajuda a definir preços?",
    a: "Você vê o mínimo, a mediana e o máximo praticados pelos concorrentes e, com a calculadora de margem, testa um novo preço antes de publicar.",
  },
  {
    q: "Preciso conectar minha conta dos marketplaces?",
    a: "Não para começar: a busca funciona por EAN ou nome. Conectar suas contas permite trazer seus anúncios e preços automaticamente.",
  },
  {
    q: "Quais marketplaces são suportados?",
    a: "Mercado Livre, Amazon e Shopee. Novos canais serão adicionados em breve.",
  },
  {
    q: "Posso testar antes de assinar?",
    a: "Sim. São 7 dias grátis, com benefícios exclusivos para membros fundadores.",
  },
];

const MARQUEE = [
  "Mercado Livre",
  "Preço mínimo",
  "Amazon",
  "Mediana do mercado",
  "Shopee",
  "Busca por EAN",
  "Full · Flex · Prime",
  "Margem real",
];

const WHATSAPP_HREF = SOCIALS.find((s) => s.name === "WhatsApp")!.href;

function SectionHeading({
  eyebrow,
  title,
  text,
}: Readonly<{ eyebrow: string; title: string; text?: string }>) {
  return (
    <Reveal className="mx-auto mb-14 max-w-2xl text-center">
      <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-bold tracking-tight text-fg text-balance sm:text-4xl">
        {title}
      </h2>
      {text && <p className="mt-4 text-lg text-muted text-pretty">{text}</p>}
    </Reveal>
  );
}

const cardHover =
  "transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lift";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative -mt-16 overflow-hidden pt-16">
          <div className="bg-grid absolute inset-0" aria-hidden />
          <div
            className="absolute -left-40 -top-20 size-[32rem] animate-blob rounded-full bg-accent/25 blur-3xl"
            aria-hidden
          />
          <div
            className="absolute -right-32 top-40 size-[28rem] animate-blob rounded-full bg-brand/15 blur-3xl [animation-delay:-6s]"
            aria-hidden
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-4 pb-24 pt-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-24">
            <div>
              <Reveal>
                <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                  <span className="size-1.5 animate-pulse-ring rounded-full bg-brand" />
                  Inteligência de preços para marketplaces
                </p>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="text-4xl font-extrabold tracking-tight text-fg text-balance sm:text-5xl lg:text-6xl">
                  Seu preço está <span className="text-shine">acima ou abaixo</span>{" "}
                  do mercado?
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-6 max-w-xl text-lg text-muted text-pretty">
                  Compare seu produto com as ofertas do Mercado Livre, Amazon e
                  Shopee em um só painel e ajuste o preço sem perder margem.
                </p>
              </Reveal>
              <Reveal delay={240} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/register" className={buttonClass("primary", "lg", "group")}>
                  Começar teste grátis
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass("secondary", "lg")}
                >
                  Conversar com os fundadores
                </a>
              </Reveal>
              <Reveal delay={320}>
                <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
                  {["7 dias grátis", "Sem fidelidade", "Benefícios de fundador"].map((t) => (
                    <li key={t} className="flex items-center gap-1.5">
                      <Check className="size-4 text-brand" /> {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
            <Reveal delay={200}>
              <HeroPreview />
            </Reveal>
          </div>
        </section>

        {/* Faixa animada */}
        <section className="border-y border-border bg-surface-2 py-4" aria-label="Destaques">
          <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex shrink-0 animate-marquee gap-10 pr-10 hover:[animation-play-state:paused]">
              {[...MARQUEE, ...MARQUEE].map((item, i) => (
                <span
                  key={`${item}-${i}`}
                  className="flex items-center gap-10 whitespace-nowrap text-sm font-semibold text-muted"
                  aria-hidden={i >= MARQUEE.length}
                >
                  {item}
                  <span className="size-1.5 rounded-full bg-brand/50" />
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section id="como-funciona" className="py-24 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Como funciona"
              title="Da busca à decisão de preço em minutos"
              text="Sem abrir três abas, sem planilha. Você informa o produto, a Search Price faz o resto."
            />
            <ol className="relative grid gap-5 md:grid-cols-3">
              <div
                className="absolute left-[16%] right-[16%] top-11 hidden h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent md:block"
                aria-hidden
              />
              {STEPS.map(({ Icon, title, text }, i) => (
                <Reveal
                  as="li"
                  key={title}
                  delay={i * 120}
                  className={`group relative rounded-3xl border border-border bg-surface p-7 ${cardHover}`}
                >
                  <div className="mb-6 flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-2xl bg-brand text-brand-contrast shadow-lift transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                      <Icon className="size-5" />
                    </span>
                    <span className="text-5xl font-extrabold text-brand/10 tabular">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-fg">{title}</h3>
                  <p className="text-muted">{text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* Canais */}
        <section id="canais" className="bg-surface-2 py-24 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Canais"
              title="Os três maiores marketplaces do Brasil, lado a lado"
              text="Cada canal tem suas regras de frete, comissão e catálogo. A comparação respeita isso."
            />
            <div className="grid gap-5 md:grid-cols-3">
              {CHANNELS.map(({ key, points }, i) => (
                <Reveal
                  as="article"
                  key={key}
                  delay={i * 120}
                  className={`flex flex-col rounded-3xl border border-border bg-surface p-7 ${cardHover}`}
                >
                  <div className="mb-6 flex items-center justify-between">
                    <MarketplaceBadge marketplace={key} />
                    <span className="text-xs font-medium text-subtle">
                      {MARKETPLACES[key].short}
                    </span>
                  </div>
                  <ul className="space-y-3.5">
                    {points.map((p) => (
                      <li key={p} className="flex gap-3 text-fg">
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                          <Check className="size-3" />
                        </span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Diferenciais */}
        <section id="diferenciais" className="py-24 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Diferenciais"
              title="Tudo o que você precisa para precificar com dados"
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ADVANTAGES.map(({ Icon, title, text }, i) => (
                <Reveal
                  key={title}
                  delay={(i % 3) * 100}
                  className={`group rounded-3xl border border-border bg-surface p-7 ${cardHover}`}
                >
                  <span className="mb-5 grid size-11 place-items-center rounded-2xl bg-brand-soft text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-brand-contrast">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mb-1.5 font-semibold text-fg">{title}</h3>
                  <p className="text-sm text-muted">{text}</p>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-3">
              {[
                { node: <CountUp to={10000} suffix="+" />, label: "Consultas realizadas" },
                { node: <CountUp to={3} />, label: "Marketplaces comparados" },
                { node: <CountUp to={7} suffix=" dias" />, label: "De teste grátis" },
              ].map((s) => (
                <div key={s.label} className="bg-surface p-8 text-center">
                  <p className="text-4xl font-extrabold tracking-tight text-brand">{s.node}</p>
                  <p className="mt-1 text-sm text-muted">{s.label}</p>
                </div>
              ))}
            </Reveal>

            <Reveal className="mx-auto mt-16 max-w-4xl">
              <h3 className="mb-6 text-center text-xl font-semibold text-fg">
                Somos a sua melhor alternativa
              </h3>
              <div className="overflow-x-auto rounded-3xl border border-border bg-surface">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr>
                      <th className="px-5 py-4 text-left font-medium text-muted">Recurso</th>
                      {COMPARISON.columns.map((c, i) => (
                        <th
                          key={c}
                          className={
                            i === 0
                              ? "bg-brand px-4 py-4 font-semibold text-brand-contrast"
                              : "px-4 py-4 font-medium text-muted"
                          }
                        >
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {COMPARISON.rows.map((row) => (
                      <tr key={row} className="transition-colors hover:bg-surface-2">
                        <td className="px-5 py-3.5 text-fg">{row}</td>
                        {COMPARISON.columns.map((c, i) => (
                          <td key={c} className={i === 0 ? "bg-brand-soft px-4 py-3.5" : "px-4 py-3.5"}>
                            {i === 0 ? (
                              <Check className="mx-auto size-5 text-brand" aria-label="Sim" />
                            ) : (
                              <X className="mx-auto size-4 text-subtle" aria-label="Não" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Depoimentos */}
        <section id="depoimentos" className="bg-surface-2 py-24 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading eyebrow="Depoimentos" title="Quem usa, recomenda" />
            <div className="grid gap-5 md:grid-cols-3">
              {TESTIMONIALS.map((t, i) => (
                <Reveal
                  as="figure"
                  key={t.name}
                  delay={i * 120}
                  className={`flex flex-col rounded-3xl border border-border bg-surface p-7 ${cardHover}`}
                >
                  <div className="mb-4 flex gap-0.5" aria-label="5 de 5 estrelas">
                    {Array.from({ length: 5 }, (_, s) => (
                      <Star key={s} className="size-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <blockquote className="flex-1 text-fg text-pretty">“{t.quote}”</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                    <Image
                      src={t.avatar}
                      alt=""
                      width={44}
                      height={44}
                      className="size-11 rounded-full object-cover ring-2 ring-brand-soft"
                    />
                    <div>
                      <p className="font-semibold text-fg">{t.name}</p>
                      <p className="text-sm text-muted">{t.role}</p>
                    </div>
                  </figcaption>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-10 text-center">
              <Link
                href="/testimonials"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand"
              >
                Ver todos os depoimentos
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* Sobre */}
        <section id="sobre" className="py-24 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <Reveal>
                <p className="mb-4 inline-flex rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand">
                  Sobre nós
                </p>
                <h2 className="text-3xl font-bold tracking-tight text-fg text-balance sm:text-4xl">
                  Feita por quem vende em marketplace
                </h2>
                <p className="mt-5 text-lg text-muted text-pretty">
                  Fundada em 2023 por empreendedores apaixonados por e-commerce,
                  a Search Price nasceu para acabar com a coleta manual de preços
                  em vários marketplaces. Nossa missão é democratizar o acesso a
                  dados de mercado para que qualquer lojista decida com
                  informação real.
                </p>
                <Link
                  href="/about"
                  className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand"
                >
                  Conheça nossa história
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Reveal>
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {TEAM.map((m, i) => (
                  <Reveal
                    as="li"
                    key={m.name}
                    delay={i * 80}
                    className={`flex flex-col items-center rounded-3xl border border-border bg-surface p-5 text-center ${cardHover}`}
                  >
                    <Image
                      src={m.avatar}
                      alt={m.name}
                      width={72}
                      height={72}
                      className="mb-3 size-18 rounded-full object-cover object-top ring-4 ring-brand-soft"
                    />
                    <p className="text-sm font-semibold leading-tight text-fg">{m.name}</p>
                    <p className="mt-1 text-xs text-muted">{m.role}</p>
                  </Reveal>
                ))}
                <Reveal
                  as="li"
                  delay={TEAM.length * 80}
                  className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-brand/40 bg-brand-soft p-5 text-center"
                >
                  <Headset className="mb-2 size-6 text-brand" />
                  <p className="text-sm font-semibold text-brand">Fale com a gente</p>
                  <a
                    href={WHATSAPP_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-xs text-muted underline-offset-2 hover:underline"
                  >
                    WhatsApp
                  </a>
                </Reveal>
              </ul>
            </div>
            <Reveal className="mt-12">
              <PressFeature />
            </Reveal>
          </div>
        </section>

        {/* Membro fundador */}
        <section className="px-4 sm:px-6">
          <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-strong via-brand to-accent px-6 py-16 text-center sm:px-12">
            <div className="bg-grid absolute inset-0 opacity-20" aria-hidden />
            <div
              className="absolute -right-24 -top-24 size-80 animate-blob rounded-full bg-white/20 blur-3xl"
              aria-hidden
            />
            <div className="relative">
              <h2 className="text-3xl font-bold tracking-tight text-white text-balance sm:text-4xl">
                Seja um membro fundador da Search Price
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
                Teste gratuitamente por 7 dias e receba benefícios exclusivos de
                membro fundador.
              </p>
              <Link
                href="/register"
                className="group mt-8 inline-flex h-13 items-center gap-2 rounded-xl bg-white px-6 font-semibold text-brand-strong shadow-lift transition-all duration-200 hover:-translate-y-0.5"
              >
                Quero ser membro fundador
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-24 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <SectionHeading eyebrow="FAQ" title="Perguntas frequentes" />
            <Reveal className="space-y-3">
              {FAQ.map(({ q, a }) => (
                <details
                  key={q}
                  className="group rounded-2xl border border-border bg-surface px-5 transition-colors open:border-brand/40 open:bg-brand-soft/40"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-semibold text-fg [&::-webkit-details-marker]:hidden">
                    {q}
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface-2 text-muted transition-all duration-300 group-open:rotate-180 group-open:bg-brand group-open:text-brand-contrast">
                      <ChevronDown className="size-4" />
                    </span>
                  </summary>
                  <p className="-mt-1 pb-5 text-muted">{a}</p>
                </details>
              ))}
            </Reveal>
            <Reveal className="mt-10 flex flex-col items-center gap-3 text-center">
              <p className="text-muted">Ainda restam dúvidas?</p>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass("secondary", "md")}
              >
                Falar com os fundadores
              </a>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
