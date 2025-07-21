import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nossos diferenciais",
  description: "Os principais benefícios da Search Price",
};

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
    <div className="bg-[var(--background-container)] rounded-lg shadow-md p-6 flex flex-col items-center text-center transform transition-transform hover:scale-105">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-[var(--white-to-primary)]">{children}</p>
    </div>
  );
}

function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-lg p-6 text-center transform transition-transform hover:scale-105">
      <p className="text-3xl font-bold">{value}</p>
      <p className="uppercase mt-1 text-sm">{label}</p>
    </div>
  );
}

export default function OurAdvantagesPage() {
  return (
    <main className="bg-[var(--black-to-light-blue)] text-[var(--white-to-primary)] min-h-screen">
      {/* Hero: botões fixos nos cantos */}
      <section className="relative bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white">
        {/* Botão Home no canto superior esquerdo */}
        <Link
          href="/"
          className="absolute top-4 left-4 flex-shrink-0 hover:opacity-90 transition-opacity transition-transform hover:scale-110"
        >
          <Image src="/left-pointer.png" alt="Home" width={40} height={40} />
        </Link>

        {/* Botão Login no canto superior direito */}
        <Link
          href="/login"
          className="absolute top-4 right-4 flex-shrink-0 hover:opacity-90 transition-opacity transition-transform hover:scale-110"
        >
          <Image src="/profile.png" alt="Login" width={40} height={40} />
        </Link>

        {/* Conteúdo do Hero centralizado com padding top reduzido e largura maior */}
        <div className="container mx-auto px-6 flex items-center justify-center pt-12 pb-14">
          <div className="text-center max-w-6xl mx-auto">
            <h1 className="mt-4 sm:mt-4 md:mt-0 text-4xl md:text-5xl font-bold mb-4">
              Estratégia de preços com inteligência de mercado
            </h1>
            <p className="max-w-2xl mx-auto text-lg leading-relaxed">
              Na Search Price, oferecemos uma plataforma completa que agrega e
              analisa dados de múltiplos marketplaces em um só lugar, permitindo
              que você acompanhe tendências, ajuste ofertas e maximize sua
              lucratividade de forma simples e rápida.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Cinco grandes pilares */}
      <section className="py-16">
        <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <InfoCard icon="🔍" title="Busca Unificada">
            Compare preços de Amazon, Shopee e Mercado Livre sem sair de uma
            tela.
          </InfoCard>
          <InfoCard icon="⚙️" title="Precificação Inteligente">
            Ajuste automaticamente suas ofertas com base na concorrência e na
            demanda.
          </InfoCard>
          <InfoCard icon="📊" title="Insights em Tempo Real">
            Dashboards e relatórios que mostram tendências e oportunidades de
            lucro.
          </InfoCard>
          <InfoCard icon="🔒" title="Segurança de Dados">
            Seus dados são criptografados e armazenados em servidores confiáveis
            para sua total tranquilidade.
          </InfoCard>
          <InfoCard icon="💬" title="Suporte Dedicado">
            Equipe especializada disponível 24/7 para ajudar você a extrair o
            máximo da plataforma.
          </InfoCard>
        </div>
      </section>

      {/* 3. Estatísticas rápidas */}
      <section className="py-16 bg-[var(--background-primary)] text-white">
        <div className="container mx-auto px-6 grid gap-6 md:grid-cols-3">
          <StatCard value="10K+" label="Consultas realizadas" />
          <StatCard value="3" label="Marketplaces suportados" />
          <StatCard value="24/7" label="Suporte contínuo" />
        </div>
      </section>

      {/* 4. Como Funciona em Card */}
      <section className="py-16">
        <div className="container mx-auto px-6 flex justify-center">
          <div className="bg-[var(--background-container)] rounded-lg shadow-lg p-8 max-w-3xl w-full transform transition-transform hover:scale-105">
            <h2 className="text-3xl font-bold text-[var(--secondary)] text-center mb-4">
              Como Funciona
            </h2>
            <p className="text-[var(--white-to-primary)] text-justify leading-relaxed mb-4">
              Basta inserir o código do produto ou pesquisar por categoria, e a
              Search Price retorna uma análise completa de preços, estoque,
              vendas e avaliações, tudo em segundos. Com filtros avançados, você
              refina os resultados e exporta relatórios detalhados para tomar
              decisões embasadas.
            </p>
            <p className="text-[var(--white-to-primary)] text-justify leading-relaxed">
              Nossa infraestrutura em nuvem garante alta performance e
              escalabilidade, enquanto nosso motor de filtragem avançada lhe
              proporciona a visão mais precisa do mercado.
            </p>
          </div>
        </div>
      </section>

      {/* 5. FAQ resumido */}
      <section className="py-16 bg-[var(--background-primary)] text-[var(--third)]">
        <div className="container mx-auto px-6 max-w-2xl">
          <h2 className="text-3xl font-bold text-center mb-6">
            Perguntas Frequentes
          </h2>
          <ul className="space-y-4">
            <li>
              <strong>Como faço uma busca?</strong>
              <p className="text-white">
                Basta digitar o EAN ou nome do produto e clicar em Buscar.
              </p>
            </li>
            <li>
              <strong>Preciso de cadastro?</strong>
              <p className="text-white">
                Sim, um cadastro rápido para proteger seu histórico e
                personalizar alertas.
              </p>
            </li>
            <li>
              <strong>Quais marketplaces são suportados?</strong>
              <p className="text-white">
                Atualmente Amazon, Shopee e Mercado Livre, com novos sendo
                adicionados em breve.
              </p>
            </li>
            <li>
              <strong>Posso exportar relatórios?</strong>
              <p className="text-white">
                Sim, exporte em CSV ou Excel para integrar com suas ferramentas
                de BI.
              </p>
            </li>
          </ul>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-[var(--black-to-light-blue)] text-white px-8 py-8 mt-auto text-center">
        <p className="text-base text-[var(--white-to-primary)]">
          © 2023-2025 Search Price Soluções Tecnológicas LTDA. Todos os direitos
          reservados.
        </p>
      </footer>
    </main>
  );
}
