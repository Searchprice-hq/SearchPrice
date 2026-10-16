import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import PageHero from "@/components/site/PageHero";

interface Testimonial {
  avatar: string;
  name: string;
  role: string;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    avatar: "/woman1.png",
    name: "Ana Silva",
    role: "Vendedora no Mercado Livre",
    quote:
      "Com a Search Price eu reduzi em 30% o tempo gasto pesquisando preços e ainda aumentei minha margem de lucro em 15%! É incrível.",
  },
  {
    avatar: "/man3.png",
    name: "Bruno Costa",
    role: "Empreendedor Amazon",
    quote:
      "A ferramenta de comparação em tempo real me ajuda a ajustar meus valores instantaneamente. Recomendo para qualquer seller sério!",
  },
  {
    avatar: "/woman2.png",
    name: "Carla Souza",
    role: "Especialista em E-commerce",
    quote:
      "Os relatórios de tendência de preços são precisos e fáceis de usar. Uma virada de jogo para o meu negócio.",
  },
  {
    avatar: "/man1.png",
    name: "Lucas Santos",
    role: "Desenvolvedor de Plugins",
    quote:
      "Como desenvolvedor, uso a Search Price para monitorar APIs de marketplaces. A integração é super prática e me permite criar soluções rápidas.",
  },
  {
    avatar: "/woman3.png",
    name: "Mariana Oliveira",
    role: "Analista de Mercado",
    quote:
      "A Search Price tornou meu trabalho muito mais eficiente: agora concentro todas as análises em um só lugar e entrego relatórios em minutos.",
  },
  {
    avatar: "/man2.png",
    name: "Pedro Lima",
    role: "Varejista Online",
    quote:
      "Antes gastava horas na web comparando preços. Com a Search Price, faço isso em segundos e ainda recebo alertas de quedas de preço!",
  },
];

export default function Testimonials() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <PageHero
          eyebrow="Depoimentos"
          title="O que nossos usuários dizem"
          description="Vendedores de Mercado Livre, Amazon e Shopee que trocaram a pesquisa manual pela Search Price."
        />

        <section className="py-20">
          <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col rounded-2xl border border-border bg-surface p-6"
              >
                <div className="mb-4 flex gap-0.5" aria-label="5 de 5 estrelas">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="flex-1 text-fg text-pretty">“{t.quote}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                  <Image
                    src={t.avatar}
                    alt=""
                    width={44}
                    height={44}
                    className="size-11 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-fg">{t.name}</p>
                    <p className="text-sm text-muted">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6">
          <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-brand-strong via-brand to-accent px-6 py-12 text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Faça parte dessa história
            </h2>
            <p className="mt-3 text-white/85">
              Teste por 7 dias e veja onde seus preços estão em relação ao mercado.
            </p>
            <Link href="/register" className="mt-8 inline-flex h-13 items-center gap-2 rounded-xl bg-white px-6 font-semibold text-brand-strong shadow-lift transition-all duration-200 hover:-translate-y-0.5">
              Começar teste grátis <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
