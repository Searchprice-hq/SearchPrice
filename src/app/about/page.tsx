// src/app/about/page.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre • Search Price",
  description: "Conheça a história, missão e time da Search Price",
};

const SOCIALS = [
  {
    name: "Facebook",
    href: "https://facebook.com/searchprice",
    icon: "/icons/facebook.svg",
    color: "text-blue-600",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/searchprice",
    icon: "/icons/instagram.svg",
    color: "text-pink-500",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/searchprice",
    icon: "/icons/linkedin.svg",
    color: "text-blue-700",
  },
  {
    name: "Twitter",
    href: "https://twitter.com/searchprice",
    icon: "/icons/twitter.svg",
    color: "text-blue-400",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/searchprice",
    icon: "/icons/youtube.svg",
    color: "text-red-600",
  },
];

// Componente para membros do time
function TeamMember({
  name,
  role,
  avatar,
}: {
  name: string;
  role: string;
  avatar: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <Image
        src={avatar}
        alt={name}
        width={96}
        height={96}
        className="rounded-full mb-3 object-cover"
      />
      <h4 className="font-medium text-white">{name}</h4>
      <p className="text-sm text-white">{role}</p>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{children}</p>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="bg-[var(--black-to-gray-50)] flex flex-col min-h-screen">
      {/* 1. Hero / Apresentação */}
      <section className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white py-20">
        <div className="container mx-auto px-6 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Bem-vindo à Search Price
          </h1>
          <p className="max-w-2xl mx-auto text-lg">
            Nossa missão é simplificar a busca e análise de preços em múltiplos
            marketplaces, entregando dados precisos e insights valiosos em tempo
            real.
          </p>
        </div>
      </section>

      {/* História, Missão, Visão e Valores em duas colunas */}
      <section className="py-16 bg-[var(--background-secondary-color)]">
        <div className="container mx-auto px-6 grid gap-12 md:grid-cols-2">
          {/* Coluna 1: Sobre */}
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Sobre a Search Price
            </h1>
            <p className="text-[var(--white)] leading-relaxed">
              Fundada em 2023 por um grupo de empreendedores apaixonados por
              e‑commerce, a Search Price surgiu para resolver o problema de
              coleta manual de dados de preços em diversos marketplaces. Desde
              então, evoluímos nossa plataforma para oferecer informações
              atualizadas sobre preços, visitas e vendas em um só lugar,
              ajudando milhares de lojistas a otimizar suas estratégias.
            </p>
          </div>
          {/* Coluna 2: Missão, Visão e Valores */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-[var(--secondary-color)] mb-2">
                Missão
              </h2>
              <p className="text-[var(--white)] leading-relaxed">
                Democratizar o acesso a dados de mercado, permitindo que
                qualquer lojista ou empreendedor tome decisões estratégicas
                baseadas em informações reais e atualizadas.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-[var(--secondary-color)] mb-2">
                Visão
              </h2>
              <p className="text-[var(--white)] leading-relaxed">
                Ser referência na América Latina em inteligência de preços,
                oferecendo uma plataforma confiável e inovadora para comércio
                eletrônico.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-[var(--secondary-color)] mb-2">
                Valores
              </h2>
              <p className="text-[var(--white)] leading-relaxed">
                Transparência, inovação contínua e foco no sucesso dos nossos
                clientes são os pilares que guiam cada nova funcionalidade da
                Search Price.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Time de Fundadores */}
      <section className="py-16 bg-[var(--background-primary-color)]">
        <div className="container mx-auto px-6  text-center mb-8">
          <h2 className="text-3xl text-[var(--secondary-color)] font-bold">
            Nosso Time
          </h2>
          <p className="text-white max-w-xl mx-auto">
            Um grupo diverso de desenvolvedores, analistas e estrategistas
            dedicados a transformar dados em resultados reais para nossos
            clientes.
          </p>
        </div>
        <div className="container mx-auto px-6 grid gap-12 sm:grid-cols-2 md:grid-cols-5">
          <TeamMember
            name="Gerson Boing Carvalho"
            role="CEO & Cofundador"
            avatar="/gersonBoing.jpg"
          />
          <TeamMember
            name="Priscilla Barbosa Moni"
            role="CTO & Cofundadora"
            avatar="/priscillaMoni.jpg"
          />
          <TeamMember
            name="Rogerio Rodrigues"
            role="Head de Produto"
            avatar="/RogerRodrigues.jpg"
          />
          <TeamMember
            name="Patrick Meirelles"
            role="COO"
            avatar="/PatrickMeirelles.jpg"
          />
          <TeamMember
            name="Victor Augusto Barbosa Moni"
            role="Lead de Dados"
            avatar="/victorMoni.jpg"
          />
        </div>
      </section>

      {/* Redes Sociais */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold text-center mb-8">
          Conecte-se Conosco
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {SOCIALS.map(({ name, href, icon, color }) => (
            <Link
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-6 bg-[var(--white)] rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <div className={`w-12 h-12 mb-4 ${color}`}>
                <Image
                  src={icon}
                  alt={name}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <span className="font-medium text-[var(--primary-color)]">
                {name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--background-primary-color)] text-white px-8 py-6 mt-auto text-center">
        <p className="text-base">
          © 2023-2025 Search Price Soluções Tecnológicas LTDA. Todos os direitos
          reservados.
        </p>
      </footer>
    </main>
  );
}
