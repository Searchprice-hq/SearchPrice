// src/app/about/page.tsx
import React from "react";
import Image from "next/image";

export const metadata = {
  title: "Sobre",
  description: "Conheça a missão, visão e time da Search Price",
};

// Componente para os cards de info
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

// Componente para estatísticas
function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white rounded-lg p-6 text-center">
      <p className="text-3xl font-bold">{value}</p>
      <p className="uppercase mt-1 text-sm">{label}</p>
    </div>
  );
}

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

export default function AboutPage() {
  return (
    <main className="bg-[var(--black-to-gray-50)] text-gray-800">
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

      {/* 2. Três grandes pilares */}
      <section className="py-16">
        <div className="container mx-auto px-6 grid gap-8 md:grid-cols-3">
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
        </div>
      </section>

      {/* 3. Estatísticas rápidas */}
      <section className="py-16 bg-[var(--background-primary-color)] text-white">
        <div className="container mx-auto px-6 grid gap-6 md:grid-cols-3">
          <StatCard value="10K+" label="Consultas realizadas" />
          <StatCard value="3" label="Marketplaces suportados" />
          <StatCard value="24/7" label="Dados em tempo real" />
        </div>
      </section>

      {/* 4. Time de fundadores */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center mb-8">
          <h2 className="text-3xl text-[var(--secondary-color)] font-bold">
            Nosso Time
          </h2>
          <p className="text-white max-w-xl mx-auto">
            Um time apaixonado por dados, tecnologia e negócios — sempre
            buscando entregar valor aos nossos usuários.
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
            role=""
            avatar="/PatrickMeirelles.jpg"
          />
          <TeamMember
            name="Victor Augusto Barbosa Moni"
            role="Lead de Dados"
            avatar="/victorMoni.jpg"
          />
        </div>
      </section>

      {/* 5. FAQ resumido */}
      <section className="py-16 bg-[var(--background-primary-color)] text-[var(--secondary-color)]">
        <div className="container mx-auto px-6 max-w-2xl">
          <h2 className="text-3xl font-bold text-center mb-6">
            Perguntas Frequentes
          </h2>
          <ul className="space-y-4">
            <li>
              <strong>Como faço uma busca?</strong>
              <p className="text-white">
                Basta digitar o EAN ou escolher um marketplace e clicar em
                Buscar.
              </p>
            </li>
            <li>
              <strong>Preciso de cadastro?</strong>
              <p className="text-white">
                Sim, um cadastro rápido para protegermos suas pesquisas e
                personalizar relatórios.
              </p>
            </li>
            <li>
              <strong>Posso exportar os dados?</strong>
              <p className="text-white">
                Em breve teremos exportação em CSV e integração via API externa.
              </p>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
