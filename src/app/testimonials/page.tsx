import React from "react";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Depoimentos",
  description: "O que nossos usuários dizem sobre a Search Price",
};

interface Testimonial {
  avatar: string;
  name: string;
  role: string;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    avatar: "/team/ana.jpg",
    name: "Ana Silva",
    role: "Vendedora no Mercado Livre",
    quote:
      "Com a Search Price eu reduzi em 30% o tempo gasto pesquisando preços e ainda aumentei minha margem de lucro em 15%! É incrível.",
  },
  {
    avatar: "/team/bruno.jpg",
    name: "Bruno Costa",
    role: "Empreendedor Amazon",
    quote:
      "A ferramenta de comparação em tempo real me ajuda a ajustar meus valores instantaneamente. Recomendo para qualquer seller sério!",
  },
  {
    avatar: "/team/carla.jpg",
    name: "Carla Souza",
    role: "Especialista em E‑commerce",
    quote:
      "Os relatórios de tendência de preços são precisos e fáceis de usar. Uma virada de jogo para o meu negócio.",
  },
  // Novos depoimentos:
  {
    avatar: "/team/lucas.jpg",
    name: "Lucas Santos",
    role: "Desenvolvedor de Plugins",
    quote:
      "Como desenvolvedor, uso a Search Price para monitorar APIs de marketplaces. A integração é super prática e me permite criar soluções rápidas.",
  },
  {
    avatar: "/team/mariana.jpg",
    name: "Mariana Oliveira",
    role: "Analista de Mercado",
    quote:
      "A Search Price tornou meu trabalho muito mais eficiente: agora concentro todas as análises em um só lugar e entrego relatórios em minutos.",
  },
  {
    avatar: "/team/pedro.jpg",
    name: "Pedro Lima",
    role: "Varejista Online",
    quote:
      "Antes gastava horas na web comparando preços. Com a Search Price, faço isso em segundos e ainda recebo alertas de quedas de preço!",
  },
];

function TestimonialCard({ avatar, name, role, quote }: Testimonial) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
      <div className="flex items-center mb-4">
        <Image
          src={avatar}
          alt={name}
          width={56}
          height={56}
          className="rounded-full object-cover"
        />
        <div className="ml-4">
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-gray-500">{role}</p>
          {/* cinco estrelas em unicode */}
          <div className="flex items-center mt-1 space-x-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-sm">
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-700 flex-1">“{quote}”</p>
    </div>
  );
}

export default function TestimonialsPage() {
  return (
    <main className="bg-gray-50 text-gray-800 min-h-screen">
      {/* Hero */}
      <section className="bg-[var(--secondary-color)] text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-2">Depoimentos</h1>
          <p className="max-w-2xl mx-auto">
            Veja como a Search Price tem ajudado vendedores e empreendedores a
            otimizarem suas vendas e lucros.
          </p>
        </div>
      </section>

      {/* Grid de depoimentos */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--primary-color)] text-white py-12">
        <div className="container mx-auto px-6 text-center space-y-4">
          <h2 className="text-2xl font-semibold">
            Quer ser nosso próximo caso de sucesso?
          </h2>
          <p>
            Experimente a Search Price grátis por 14 dias e veja a diferença!
          </p>
          <button className="mt-4 px-6 py-3 bg-white text-[var(--primary-color)] font-semibold rounded-lg hover:scale-105 transition-transform">
            Começar Agora
          </button>
        </div>
      </section>
    </main>
  );
}
