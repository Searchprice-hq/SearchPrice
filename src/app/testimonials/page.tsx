import React from "react";
import Image from "next/image";
import Link from "next/link";
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
    role: "Especialista em E‑commerce",
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

function TestimonialCard({ avatar, name, role, quote }: Testimonial) {
  return (
    <div className="bg-[var(--background-container-color)] p-6 rounded-lg shadow-lg flex flex-col transform transition-transform hover:scale-105">
      <div className="flex items-center mb-4">
        <Image
          src={avatar}
          alt={name}
          width={56}
          height={56}
          className="rounded-full object-cover"
        />
        <div className="ml-4">
          <h3 className="font-semibold text-lg text-[var(--third-to-primary)]">
            {name}
          </h3>
          <p className="text-sm text-[var(--white-to-primary)]">{role}</p>
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
      <p className="text-[var(--white-to-primary)] flex-1">“{quote}”</p>
    </div>
  );
}

export default function TestimonialsPage() {
  return (
    <main className="bg-[var(--black-to-light-blue)] min-h-screen">
      {/* Hero */}
      <header className="bg-[var(--background-primary-color)] text-white">
        <div className="container mx-auto px-6 flex items-center justify-between py-8">
          {/* Home no extremo esquerdo */}
          <Link
            href="/"
            className="hover:opacity-90 transition-opacity transform transition-transform hover:scale-110"
          >
            <Image src="/leftPointer.png" alt="Home" height={42} width={42} />
          </Link>

          {/* Título centralizado */}
          <div className="text-center flex-1 mx-6">
            <h1 className="text-4xl font-bold mb-2 text-[var(--third-to-white)]">
              Depoimentos
            </h1>
            <p className="max-w-md mx-auto">
              Veja como a Search Price tem ajudado vendedores e empreendedores a
              otimizarem suas vendas e lucros.
            </p>
          </div>

          {/* Login no extremo direito */}
          <Link
            href="/login"
            className="hover:opacity-90 transition-opacity transform transition-transform hover:scale-110"
          >
            <Image src="/profile.png" alt="Login" height={42} width={42} />
          </Link>
        </div>
      </header>

      {/* Grid de depoimentos */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--background-primary-color)] ] text-white py-12">
        <div className="container mx-auto px-6 text-center space-y-4">
          <h2 className="text-2xl font-semibold text-[var(--third-to-white)]">
            Quer ser nosso próximo caso de sucesso?
          </h2>
          <p>
            Experimente a Search Price grátis por 14 dias e veja a diferença!
          </p>
          <Link
            href="/signup"
            className="mt-4 inline-block px-6 py-3 bg-white text-[var(--primary-color)] font-semibold rounded-lg hover:scale-105 transition-transform"
          >
            Começar Agora
          </Link>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-[var(--background-secondary-color)] text-white px-8 py-6 mt-auto text-center">
        <p className="text-base">
          © 2023-2025 Search Price Soluções Tecnológicas LTDA. Todos os direitos
          reservados.
        </p>
      </footer>
    </main>
  );
}
