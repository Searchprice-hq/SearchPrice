"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/hooks/useTheme";
import { Grid } from "@/components/Grid";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const { toggleTheme } = useTheme();

  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER */}
      <header className="relative bg-[var(--background-primary)] px-4 sm:px-6 lg:px-8 py-4">
        {/* Linha principal: logo à esquerda e botões à direita */}
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center gap-2">
            <Image
              src="/searchpriceLogo.png"
              alt="logo"
              width={50}
              height={50}
            />
            <h2 className="text-white font-semibold text-xl">Search Price</h2>
          </div>

          {/* BOTÕES */}
          <div className="flex items-center gap-6">
            <button
              onClick={toggleTheme}
              className="focus:outline-none transition-transform duration-200 hover:scale-110"
            >
              <Image
                src="/halfMoonWhite.png"
                alt="Alterar tema"
                width={36}
                height={36}
              />
            </button>
            <button
              onClick={() => router.push("/login")}
              className="focus:outline-none transition-transform duration-200 hover:scale-110"
            >
              <Image src="/profile.png" alt="Perfil" width={40} height={40} />
            </button>
          </div>
        </div>

        {/* MENU DESKTOP/ TABLET — absolutizado e centralizado */}
        <nav className="hidden sm:block absolute inset-x-0 top-1/2 transform -translate-y-1/2">
          <ul className="flex justify-center gap-20">
            {[
              { label: "Sobre", href: "/about" },
              { label: "Depoimentos", href: "/testimonials" },
              { label: "Nossos diferenciais", href: "/our-advantages" },
            ].map((item) => (
              <li
                key={item.href}
                className="text-white text-lg cursor-pointer hover:scale-110 transition"
                onClick={() => router.push(item.href)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </nav>

        {/* MENU MOBILE — empilha logo+botões acima e esse nav abaixo */}
        <nav className="sm:hidden mt-4">
          <ul className="flex flex-col text-left">
            {[
              { label: "• Nossos diferenciais", href: "/our-advantages" },
              { label: "• Depoimentos", href: "/testimonials" },
              { label: "• Sobre", href: "/about" },
            ].map((item) => (
              <li
                key={item.href}
                className="text-white text-lg cursor-pointer hover:scale-110 transition py-1"
                onClick={() => router.push(item.href)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Main Content*/}
      <main className="flex-1">
        {/* WhatsApp Button */}
        <button
          className="
    fixed bottom-6 right-6 z-50
    flex items-center justify-center
    bg-[var(--green-100)]
    sm:w-14 sm:h-14
    rounded-full
    p-3
    md:w-58 md:h-16 lg:w-58 lg:h-16 sm:px-4 sm:py-4
    transition-transform duration-200 hover:scale-105
    [-webkit-tap-highlight-color:transparent]
  "
        >
          <Image src="/whatsapp.png" alt="WhatsApp" width={30} height={30} />
          <span className="hidden sm:inline ml-2 text-[var(--white)] font-bold">
            Conversar com os fundadores
          </span>
        </button>

        {/* Section 1: Vídeo + CTA */}
        <section className="bg-[var(--background-secondary)] py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <video
              src="/video.mp4"
              className="w-full max-w-4xl sm:h-70 md:h-auto mx-auto rounded-md mb-8"
              controls
              loop
            />
            <h1 className="text-[var(--white-to-primary)] font-semibold text-2xl sm:text-2xl lg:text-4xl mt-4 mb-10">
              Transforme horas de pesquisa por produtos em minutos
            </h1>
            <button
              onClick={() => router.push("/register")}
              className="bg-[var(--primary)] text-white px-6 py-3 rounded-md font-semibold text-base sm:text-lg transition-transform duration-200 hover:scale-105 hover:bg-[var(--secondary)]"
            >
              Quero economizar meu tempo
            </button>
          </div>
        </section>

        {/* Section 2: Tabela de Marketplaces */}
        <section className="bg-[var(--background-primary)] py-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Image
              src="/marketplacesTable.png"
              alt="Comparativo Marketplaces"
              width={800}
              height={600}
              className="block mx-auto rounded-md shadow-lg mb-6"
            />
            <div className="flex justify-center mt-8">
              <div className="flex justify-between items-center w-[20rem] sm:w-[27rem]">
                <Image
                  src="/magnifyingGlass.png"
                  alt="Lupa"
                  width={56}
                  height={56}
                  className="w-8 h-8 sm:w-14 sm:h-14"
                />
                <Image
                  src="/pointer.png"
                  alt="Pointer"
                  width={56}
                  height={56}
                  className="w-8 h-8 sm:w-14 sm:h-14"
                />
                <Image
                  src="/star.png"
                  alt="Estrela"
                  width={56}
                  height={56}
                  className="w-8 h-8 sm:w-14 sm:h-14"
                />
              </div>
            </div>

            <div className="flex justify-center mt-2">
              <div className="flex justify-between w-[22rem] sm:w-[31rem] text-center">
                <p className="w-[6rem] sm:w-[8rem] text-[var(--third-to-fourth)] text-base sm:text-xl">
                  Busque por produtos
                </p>
                <p className="w-[8rem] sm:w-[10rem] text-[var(--third-to-fourth)] text-base sm:text-xl">
                  Escolha as melhores oportunidades
                </p>
                <p className="w-[6rem] sm:w-[8rem] text-[var(--third-to-fourth)] text-base sm:text-xl">
                  Busque por um produto
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Artigos */}
        <section className="py-8 bg-[var(--background-secondary)]">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 space-y-6 max-w-3xl">
            {[1, 2, 3].map((i) => {
              const isEven = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`
            flex flex-col md:flex-row items-center gap-6
            ${isEven ? "md:flex-row-reverse" : ""}
          `}
                >
                  {/* Imagem */}
                  <div className="w-full flex justify-center sm:w-1/2 md:w-2/5 mx-auto">
                    <Image
                      src={`/article${i}.png`}
                      alt={`Artigo ${i}`}
                      width={300}
                      height={200}
                      className="sm:w-1/2 md:w-3/4 lg:w-full h-auto rounded-xl"
                    />
                  </div>

                  {/* Texto */}
                  <div className="w-full sm:w-1/2 md:w-3/5 space-y-4 text-justify">
                    <h4 className="text-[var(--third)] font-medium text-base sm:text-lg">
                      {i === 1
                        ? "ENCONTRE OS MELHORES PREÇOS RÁPIDO!"
                        : i === 2
                        ? "FIQUE SEMPRE UM PASSO À FRENTE!"
                        : "TOME DECISÕES BASEADAS EM DADOS!"}
                    </h4>
                    <h2 className="text-[var(--white-to-primary)] font-semibold text-lg sm:text-xl">
                      {i === 1 &&
                        "Compare a lucratividade de vários produtos em vários marketplaces com um clique"}
                      {i === 2 &&
                        "Precificação inteligente para dominar o mercado"}
                      {i === 3 && "Dados precisos para impulsionar seu negócio"}
                    </h2>
                    <p className="text-[var(--third-to-primary)] text-base sm:text-base">
                      {i === 1 &&
                        "A Search Price permite que você encontre os preços mais competitivos em diversos marketplaces com apenas alguns cliques. Chega de perder horas navegando em diferentes sites - agora você pode obter as informações que precisa instantaneamente, economizando um tempo valioso que pode ser dedicado a fazer crescer seu negócio."}
                      {i === 2 &&
                        "Em um cenário altamente competitivo, ter os melhores preços é essencial para se destacar. Com nossa plataforma, você acompanha em tempo real os valores praticados pelos concorrentes e ajusta suas ofertas estrategicamente. Garante mais visibilidade, mais vendas e torna sua loja a opção mais atraente para os clientes!"}
                      {i === 3 &&
                        "Tome decisões de precificação embasadas em dados concretos e não em suposições. Nosso software fornece relatórios detalhados e insights valiosos sobre as tendências de preços no mercado. Com essas informações estratégicas, você poderá identificar oportunidades, antecipar mudanças e adaptar-se rapidamente para maximizar seus lucros."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 4: Chamada Cinza */}
        <section className="bg-[var(--black-to-gray)] py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h3 className="text-[var(--white-to-primary)] text-xl sm:text-2xl">
              Comece a economizar tempo hoje
            </h3>
            <div className="flex justify-center gap-4">
              <button
                className="w-40 sm:w-auto px-8 py-3 bg-[var(--primary)] text-white rounded-md font-semibold transition-transform duration-200 hover:scale-105 hover:bg-[var(--secondary)]"
                onClick={() => router.push("/register")}
              >
                Iniciar teste grátis
              </button>
              <button
                className="w-40 sm:w-auto px-4 py-3 bg-[var(--primary)] text-white rounded-md font-semibold transition-transform duration-200 hover:scale-105 hover:bg-[var(--secondary)]"
                onClick={() => router.push("/register")}
              >
                Conversar com os fundadores
              </button>
            </div>
          </div>
        </section>

        {/* Section 5: Grid de Recursos e Comparativo */}
        <section className="py-8 bg-[var(--background-secondary)]">
          <div className="container flex justify-center mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6">
            <p className="w-13/14 text-2xl mt-2 sm:text-3xl lg:text-4xl font-medium text-[var(--white-to-primary)]">
              Somos a{" "}
              <span className="text-[var(--third)] font-bold">
                sua melhor alternativa
              </span>{" "}
              de economizar seu tempo com busca de produtos que faturam
            </p>
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-6 flex flex-col lg:flex-row justify-center items-start">
            {/* Tópicos */}
            <div className="grid grid-rows-5 gap-2 lg:mt-18 w-full lg:w-1/4">
              {[
                "Análise de mercado em tempo real",
                "Calculadora de lucro integrada",
                "Baixo custo",
                "Busca assertiva",
                "Fornecedores na plataforma",
              ].map((txt) => (
                <div
                  key={txt}
                  className="flex items-center bg-[var(--background-secondary)] p-2 rounded-lg"
                >
                  <Image
                    src="/dollarBill.png"
                    alt="Ícone"
                    width={40}
                    height={40}
                    className="bg-[var(--dollar-bill-container)] rounded-full p-2 "
                  />
                  <p className="ml-3 text-[var(--white-to-primary)] font-medium">
                    {txt}
                  </p>
                </div>
              ))}
            </div>
            {/* Comparativo */}
            <div className="w-full lg:w-2/5 sm:mt-0 lg:-mt-7">
              <Grid />
            </div>
          </div>
        </section>

        {/* Section 6: Convite Membro */}
        <section className="bg-[var(--background-primary)] flex flex-col items-center text-center py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
              Seja um membro fundador da Search Price
            </h2>
            <p className="text-[var(--third-to-white)] text-base sm:text-lg mb-6">
              Teste a Search Price gratuitamente por 7 dias e receba benefícios
              exclusivos a membros fundadores
            </p>
            <button
              onClick={() => router.push("/register")}
              className="px-6 py-3 bg-[var(--primary-to-white)] text-[var(--white-to-primary)] rounded-md font-semibold transition-transform duration-200 hover:scale-105 hover:bg-[var(--secondary-to-white)]"
            >
              Quero ser um membro fundador
            </button>
          </div>
        </section>

        {/* Section 7: FAQs */}
        <section className="bg-[var(--background-secondary)] py-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-[var(--white-to-primary)] mb-6">
              Perguntas frequentes:
            </h2>
            <div className="space-y-2">
              {[
                {
                  q: "O que é a Search Price?",
                  a: "É uma plataforma de comparação massiva e centralizada para os principais marketplaces, permitindo acesso a dados como preços, visitas e vendas. Nela também o usuário encontrará fornecedores e ofertas para os produtos pesquisados.",
                },
                {
                  q: "Como a Search Price ajuda os vendedores?",
                  a: "A plataforma economiza tempo ao centralizar a busca por preços competitivos, permitindo que os vendedores foquem em estratégias para crescer seus negócios.",
                },
                {
                  q: "Quais são os benefícios de usar a Search Price?",
                  a: "Centralização das informações, economia de tempo, maior assertividade nas decisões de compra e venda, e uma visão ampla do mercado.",
                },
                {
                  q: "Como a Search Price pode me ajudar a definir preços competitivos?",
                  a: "A plataforma fornece dados em tempo real sobre os preços praticados pelos concorrentes, permitindo ajustes estratégicos nas suas ofertas.",
                },
                {
                  q: "O que diferencia a Search Price de outras ferramentas no mercado?",
                  a: "A Search Price combina comparação massiva de preços e compra centralizada, oferecendo uma solução integrada que outras ferramentas não possuem.",
                },
                {
                  q: "Posso utilizar a Search Price em diferentes marketplaces?",
                  a: "Sim, a Search Price permite comparar preços em múltiplos marketplaces de forma simultânea.",
                },
              ].map(({ q, a }) => (
                <Accordion
                  key={q}
                  sx={{
                    backgroundColor: "var(--black-to-light-blue)",
                    borderRadius: "0.5rem",
                    borderWidth: "1.5px",
                    color: "var(--white-to-primary)",
                  }}
                  className="w-full rounded-2xl dark:border-[var(--secondary)]"
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon className="text-[var(--white-to-primary)]" />
                    }
                    className="font-bold text-[var(--white-to-primary)]"
                  >
                    {q}
                  </AccordionSummary>
                  <AccordionDetails className="rounded-xl bg-[var(--black-to-light-blue)] text-[var(--white-to-primary)]">
                    {a}
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          </div>
        </section>

        {/* Section 8: Contato */}
        <section className="bg-[var(--background-secondary)] flex flex-col items-center justify-center py-8 pb-14">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--white-to-primary)] mb-4">
              Ainda restam dúvidas?
            </h2>
            <button
              className="px-8 py-3 bg-[var(--primary)] text-white rounded-md font-semibold transition-transform duration-200 hover:scale-105 hover:bg-[var(--secondary)]"
              onClick={() => router.push("/register")}
            >
              Entre em contato com os fundadores
            </button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[var(--background-primary)] text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-center gap-4 text-center">
          <p className="text-base">
            © 2024-2025 Search Price Soluções Tecnológicas LTDA. Todos os
            direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
