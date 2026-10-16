import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter, { SOCIALS } from "@/components/site/SiteFooter";
import PageHero from "@/components/site/PageHero";
import { buttonClass } from "@/components/ui/button";

const PILLARS = [
  {
    title: "Missão",
    text: "Democratizar o acesso a dados de mercado, permitindo que qualquer lojista ou empreendedor tome decisões estratégicas baseadas em informações reais e atualizadas.",
  },
  {
    title: "Visão",
    text: "Ser referência na América Latina em inteligência de preços, oferecendo uma plataforma confiável e inovadora para o comércio eletrônico.",
  },
  {
    title: "Valores",
    text: "Transparência, inovação contínua e foco no sucesso dos nossos clientes são os pilares que guiam cada nova funcionalidade da Search Price.",
  },
];

const TEAM = [
  { name: "Gerson Boing Carvalho", role: "CEO & Cofundador", avatar: "/gerson-boing.png" },
  { name: "Priscilla Barbosa Moni", role: "CTO & Cofundadora", avatar: "/priscilla-barbosa.png" },
  { name: "Rogerio Rodrigues da Silva", role: "Cloud System Administrator", avatar: "/rogerio-silva.png" },
  { name: "Patrick Meirelles", role: "Backend Developer", avatar: "/patrick-meirelles.png" },
  { name: "Victor Augusto Barbosa Moni", role: "Frontend Developer", avatar: "/victor-moni.png" },
];

export default function About() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="Sobre nós"
          title="Bem-vindo à Search Price"
          description="Nossa missão é simplificar a busca e a análise de preços em múltiplos marketplaces, entregando dados precisos para decisões melhores."
        />

        <section className="py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-fg">
                Nossa história
              </h2>
              <p className="mt-4 text-lg text-muted text-pretty">
                Fundada em 2023 por um grupo de empreendedores apaixonados por
                e-commerce, a Search Price surgiu para resolver a coleta manual
                de preços em diversos marketplaces. Desde então, evoluímos a
                plataforma para reunir preços, visitas e vendas em um só lugar e
                ajudar lojistas a otimizar suas estratégias.
              </p>
            </div>
            <div className="grid gap-4">
              {PILLARS.map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl border border-border bg-surface p-6"
                >
                  <h3 className="mb-2 font-semibold text-brand">{p.title}</h3>
                  <p className="text-muted">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-surface py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-fg">
                Nosso time
              </h2>
              <p className="mt-3 text-muted">
                Desenvolvedores, analistas e estrategistas dedicados a
                transformar dados em resultados reais.
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
              {TEAM.map((m) => (
                <li key={m.name} className="flex flex-col items-center text-center">
                  <Image
                    src={m.avatar}
                    alt={m.name}
                    width={96}
                    height={96}
                    className="mb-3 size-24 rounded-full object-cover ring-4 ring-brand-soft"
                  />
                  <p className="font-semibold text-fg">{m.name}</p>
                  <p className="text-sm text-muted">{m.role}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-bold text-fg">Conecte-se conosco</h2>
            <div className="mt-6 flex justify-center gap-3">
              {SOCIALS.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass("secondary", "md")}
                >
                  <Icon className="size-4" />
                  {name}
                </a>
              ))}
            </div>
            <Link href="/register" className={buttonClass("primary", "lg", "mt-10")}>
              Começar teste grátis <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
