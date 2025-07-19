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
    icon: "/facebook.png",
    color: "text-blue-600",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/searchprice",
    icon: "/instagram.png",
    color: "text-pink-500",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/searchprice",
    icon: "/linkedin.png",
    color: "text-blue-700",
  },
  {
    name: "X (Twitter)",
    href: "https://x.com/searchprice",
    icon: "/x.png",
    color: "text-blue-400",
  },
  {
    name: "YouTube",
    href: "https://youtube.com/searchprice",
    icon: "/youtube.png",
    color: "text-red-600",
  },
];

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
        className="rounded-full mb-3 object-cover transition-transform hover:scale-110"
      />
      <h4 className="font-medium text-white">{name}</h4>
      <p className="text-sm text-white">{role}</p>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="bg-[var(--black-to-gray-50)] flex flex-col min-h-screen">
      {/* Hero / Apresentação */}
      <section className="relative bg-[var(--background-primary)] text-white py-16">
        <Link
          href="/"
          className="absolute top-4 left-4 hover:opacity-90 transition-opacity transition-transform hover:scale-110"
        >
          <Image src="/leftPointer.png" alt="Home" width={40} height={40} />
        </Link>
        <Link
          href="/login"
          className="absolute top-4 right-4 hover:opacity-90 transition-opacity transition-transform hover:scale-110"
        >
          <Image src="/profile.png" alt="Login" width={40} height={40} />
        </Link>

        <div className="container mx-auto px-6 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl text-[var(--third-to-white)] font-bold">
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
      <section className="py-16 bg-[var(--background-secondary)]">
        <div className="container mx-auto px-6 grid gap-12 md:grid-cols-2">
          {/* Coluna 1: Sobre */}
          <div>
            <h1 className="text-4xl font-bold text-[var(--third-to-primary)] mb-4">
              Sobre a Search Price
            </h1>
            <p className="text-[var(--white-to-primary)] leading-relaxed">
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
              <h2 className="text-2xl font-semibold text-[var(--third-to-primary)] mb-2">
                Missão
              </h2>
              <p className="text-[var(--white-to-primary)] leading-relaxed">
                Democratizar o acesso a dados de mercado, permitindo que
                qualquer lojista ou empreendedor tome decisões estratégicas
                baseadas em informações reais e atualizadas.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-[var(--third-to-primary)] mb-2">
                Visão
              </h2>
              <p className="text-[var(--white-to-primary)] leading-relaxed">
                Ser referência na América Latina em inteligência de preços,
                oferecendo uma plataforma confiável e inovadora para comércio
                eletrônico.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-[var(--third-to-primary)] mb-2">
                Valores
              </h2>
              <p className="text-[var(--white-to-primary)] leading-relaxed">
                Transparência, inovação contínua e foco no sucesso dos nossos
                clientes são os pilares que guiam cada nova funcionalidade da
                Search Price.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Time de Fundadores */}
      <section className="py-16 bg-[var(--background-primary)]">
        <div className="container mx-auto px-6  text-center mb-8">
          <h2 className="text-3xl text-[var(--third-to-white)] font-bold">
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
            avatar="/man4.png"
          />
          <TeamMember
            name="Priscilla Barbosa Moni"
            role="CTO & Cofundadora"
            avatar="/woman1.png"
          />
          <TeamMember
            name="Rogerio Rodrigues da Silva"
            role="Cloud System Administrator"
            avatar="/man1.png"
          />
          <TeamMember
            name="Patrick Meirelles"
            role="Backend Developer"
            avatar="/man3.png"
          />
          <TeamMember
            name="Victor Augusto Barbosa Moni"
            role="Frontend Developer"
            avatar="/man2.png"
          />
        </div>
      </section>

      {/* Redes Sociais */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold text-[var(--third-to-primary)] text-center mb-8">
          Conecte-se Conosco
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 ">
          {SOCIALS.map(({ name, href, icon, color }) => (
            <Link
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-6 bg-[var(--white)] rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 transition-transform hover:scale-110"
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
              <span className="font-medium text-[var(--primary)]">{name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--background-primary)] text-white px-8 py-8 mt-auto text-center">
        <p className="text-base">
          © 2023-2025 Search Price Soluções Tecnológicas LTDA. Todos os direitos
          reservados.
        </p>
      </footer>
    </main>
  );
}
