"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/hooks/useTheme";
import { Footer } from "@/components/Footer";
import { ComparisonGrid } from "@/components/ComparisonGrid";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Home() {
  const router = useRouter();
  const { toggleTheme } = useTheme();

  return (
    <div className="w-full flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between bg-[var(--background-primary-color)] px-3 py-3">
        <div className="flex items-center gap-2">
          <img
            src="/searchpriceLogo.png"
            alt="logo"
            className="h-14 w-auto ml-6"
          />
          <h2 className="text-white font-semibold">Search Price</h2>
        </div>
        <nav className="p-4">
          <ul className="flex gap-[9rem] list-none m-0 p-0">
            <li
              className="text-[var(--white)] cursor-pointer transition-transform duration-200 hover:scale-110 hover:rounded-md"
              onClick={() => router.push("/about")}
            >
              Sobre
            </li>
            <li className="text-[var(--white)] cursor-pointer transition-transform duration-200 hover:scale-110 hover:rounded-md">
              Depoimentos
            </li>
            <li className="text-[var(--white)] cursor-pointer transition-transform duration-200 hover:scale-110 hover:rounded-md">
              Redes Sociais
            </li>
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="bg-transparent border-none cursor-pointer transition-transform duration-200 hover:scale-110"
          >
            <img src="/halfMoonWhite.png" alt="Tema" className="w-8" />
          </button>
          <button
            onClick={() => router.push("/login")}
            className="bg-transparent border-none cursor-pointer transition-transform duration-200 hover:scale-110"
          >
            <img src="/profile.png" alt="Perfil" className="w-9 mr-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="bg-[var(--background-secundary-color)] flex flex-col items-center w-full flex-1">
        {/* WhatsApp Button */}
        <button className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[var(--green-100)] text-[var(--white)] font-bold rounded-full w-56 px-4 py-2 transition-transform duration-200 hover:scale-105">
          <img src="/whatsapp.png" alt="WhatsApp" className="w-12" />
          Conversar com os fundadores
        </button>

        {/* Section 1: Vídeo + CTA */}
        <section className="w-full pb-8">
          <div className="flex justify-center">
            <video
              src="/video.mp4"
              className="mt-10 w-[90%] max-w-[50rem] rounded-md"
              controls
              loop
            />
          </div>
          <div className="mt-4 flex flex-col items-center text-center px-4">
            <h1 className="mt-4 mb-8 font-semibold text-[2.3rem] text-[var(--white-to-primary)]">
              Transforme horas de pesquisa por produtos em minutos
            </h1>
            <button
              onClick={() => router.push("/register")}
              className="bg-[var(--primary-color)] text-[var(--white)] px-8 py-4 rounded-md font-semibold text-base transition-transform duration-200 hover:scale-105 hover:bg-[var(--secundary-color)]"
            >
              Quero economizar meu tempo
            </button>
          </div>
        </section>

        {/* Section 2: Tabela de Marketplaces */}
        <section className="w-full pb-8 bg-[var(--background-primary-color)]">
          <div className="flex justify-center">
            <img
              src="/marketplacesTable.png"
              alt="Comparativo Marketplaces"
              className="mt-12 w-[55rem] rounded-md shadow-[0_0_0.6rem_var(--white)]"
            />
          </div>
          <div className="flex justify-center mt-8">
            <div className="flex justify-between items-center w-[27rem]">
              <img
                src="/magnifyingGlass.png"
                alt="Lupa"
                className="w-[3.5rem]"
              />
              <img src="/pointer.png" alt="Pointer" className="w-[3.5rem]" />
              <img src="/star.png" alt="Estrela" className="w-[3.5rem]" />
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <div className="flex justify-between w-[31rem] text-center">
              <p className="w-[8rem] text-[var(--third-to-fourth)] text-[1.25rem]">
                Busque por produtos
              </p>
              <p className="w-[10rem] text-[var(--third-to-fourth)] text-[1.25rem]">
                Escolha as melhores oportunidades
              </p>
              <p className="w-[8rem] text-[var(--third-to-fourth)] text-[1.25rem]">
                Busque por um produto
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Artigos */}
        <section className="w-full pb-8">
          {[1, 2, 3].map((i) => (
            <article
              key={i}
              className={`flex items-center justify-center ${
                isEven ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <img
                src={`/article${i}.png`}
                alt={`Artigo ${i}`}
                className="mt-6 w-[18rem] mr-8 rounded-xl"
              />
              <div className="mt-5 flex flex-col w-[24rem]">
                <h4 className="text-[var(--third-color)] text-base font-medium">
                  {i === 1
                    ? "ENCONTRE OS MELHORES PREÇOS RÁPIDO!"
                    : i === 2
                    ? "FIQUE SEMPRE UM PASSO À FRENTE!"
                    : "TOME DECISÕES BASEADAS EM DADOS!"}
                </h4>
                <h2 className="text-[var(--white-to-primary)] text-xl font-medium mt-2">
                  {i === 1 &&
                    "Compare a lucratividade de vários produtos em vários marketplaces com um clique"}
                  {i === 2 && "Precificação inteligente para dominar o mercado"}
                  {i === 3 && "Dados precisos para impulsionar seu negócio"}
                </h2>
                <p className="text-[var(--third-to-primary)] text-[0.95rem] font-medium text-justify mt-2 w-[22rem]">
                  {i === 1 &&
                    "A Search Price permite que você encontre os preços mais competitivos em diversos marketplaces com apenas alguns cliques. Chega de perder horas navegando em diferentes sites - agora você pode obter as informações que precisa instantaneamente, economizando um tempo valioso que pode ser dedicado a fazer crescer seu negócio."}
                  {i === 2 &&
                    "Em um cenário altamente competitivo, ter os melhores preços é essencial para se destacar. Com nossa plataforma, você acompanha em tempo real os valores praticados pelos concorrentes e ajusta suas ofertas estrategicamente. Garante mais visibilidade, mais vendas e torna sua loja a opção mais atraente para os clientes!"}
                  {i === 3 &&
                    "Tome decisões de precificação embasadas em dados concretos e não em suposições. Nosso software fornece relatórios detalhados e insights valiosos sobre as tendências de preços no mercado. Com essas informações estratégicas, você poderá identificar oportunidades, antecipar mudanças e adaptar-se rapidamente para maximizar seus lucros."}
                </p>
              </div>
            </article>
          ))}
        </section>

        {/* Section 4: Chamada Cinza */}
        <section className="w-full flex justify-center items-center py-8">
          <div className="w-[98%] h-40 bg-[var(--black-to-gray)] rounded-xl flex flex-col items-center pt-6">
            <h3 className="mb-2 text-center text-[1.2rem] text-[var(--white-to-primary)]">
              Comece a economizar tempo hoje
            </h3>
            <div className="flex justify-between gap-4 w-[32rem]">
              <button className="px-8 py-3 bg-[var(--primary-color)] text-white rounded-md font-semibold transition-transform duration-200 hover:scale-105 hover:bg-[var(--secundary-color)]">
                Iniciar teste grátis
              </button>
              <button className="px-4 py-3 bg-[var(--primary-color)] text-white rounded-md font-semibold transition-transform duration-200 hover:scale-105 hover:bg-[var(--secundary-color)]">
                Conversar com os fundadores
              </button>
            </div>
          </div>
        </section>

        {/* Section 5: Grid de Recursos e Comparativo */}
        <section className="w-full pb-8">
          <div className="mx-auto text-center w-[49rem] my-10 -mb-6">
            <p className="text-[2rem] font-medium text-[var(--white-to-primary)]">
              Somos a{" "}
              <span className="text-[var(--third-color)] font-bold">
                sua melhor alternativa
              </span>{" "}
              de economizar seu tempo com busca de produtos que faturam
            </p>
          </div>

          <div className="flex justify-center items-start gap-6">
            {/* Tópicos */}
            <div className="grid grid-rows-5 grid-cols-1 w-[16rem] mt-28 h-[19rem]">
              {[
                "Análise de mercado em tempo real",
                "Calculadora de lucro integrada",
                "Baixo custo",
                "Busca assertiva",
                "Fornecedores na plataforma",
              ].map((txt) => (
                <div
                  key={txt}
                  className="flex items-center bg-[var(--background-secundary-color)]"
                >
                  <img
                    src="/dollarBill.png"
                    alt="Ícone"
                    className="w-[2.5rem] p-1 bg-[var(--dollar-bill-container)] rounded"
                  />
                  <p className="ml-2 text-[var(--white-to-primary)] font-medium">
                    {txt}
                  </p>
                </div>
              ))}
            </div>

            {/* Comparativo */}
            <div className="grid grid-rows-6 grid-cols-4 gap-4 mt-12 h-[22rem]">
              {/* Cabeçalho */}
              <div className="flex items-center justify-center p-2 bg-[var(--background-secundary-color)] text-white rounded-md shadow">
                Search Price
              </div>
              {["Google", "Chat GPT", "Avantpro"].map((t) => (
                <div
                  key={t}
                  className="flex items-center justify-center bg-[var(--black-to-light-blue)] text-[var(--white-to-primary)] rounded-md shadow"
                >
                  {t}
                </div>
              ))}
              {/* Linhas de checks/cross */}
              <ComparisonGrid />
            </div>
          </div>
        </section>

        {/* Section 6: Convite Membro */}
        <section className="w-full bg-[var(--background-primary-color)] flex flex-col items-center text-center py-12 mb-10">
          <h1 className="text-2xl text-white">
            Seja um membro fundador da Search Price
          </h1>
          <p className="mt-2 text-[var(--third-to-white)]">
            Teste a Search Price gratuitamente por 7 dias e receba benefícios
            exclusivos a membros fundadores
          </p>
          <button
            onClick={() => router.push("/register")}
            className="mt-8 px-6 py-4 bg-[var(--primary-to-white)] text-[var(--white-to-primary)] rounded-md font-semibold transition-transform duration-200 hover:scale-105 hover:bg-[var(--secundary-color)]"
          >
            Quero ser um membro fundador
          </button>
        </section>

        {/* Section 7: FAQs */}
        <section className="w-full py-8 bg-[var(--background-secundary-color)]">
          <h1 className="ml-12 mb-4 text-[1.5rem] text-[var(--white-to-primary)]">
            Perguntas frequentes:
          </h1>
          <div className="flex flex-col items-center space-y-2">
            {[
              {
                q: "O que é a Search Price?",
                a: "É uma plataforma de comparação massiva e centralizada...",
              },
              /* ... demais perguntas ... */
            ].map(({ q, a }) => (
              <Accordion
                key={q}
                className="w-[95%] rounded-xl border border-[var(--secundary-color)] bg-[var(--black-to-light-blue)]"
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
        </section>

        {/* Section 8: Contato */}
        <section className="w-full flex flex-col items-center justify-center h-64 pb-4 bg-[var(--background-secundary-color)]">
          <h1 className="mb-4 text-[1.75rem] text-[var(--white-to-primary)]">
            Ainda restam dúvidas?
          </h1>
          <button className="px-8 py-4 bg-[var(--primary-color)] text-white rounded-md font-semibold transition-transform duration-200 hover:scale-105 hover:bg-[var(--secundary-color)]">
            Entre em contato com os fundadores
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
