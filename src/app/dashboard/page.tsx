"use client";

import React, { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { fetchProducts } from "@/services/productService";
import type { Product } from "@/models/Product";
import { useRouter } from "next/navigation";

const FILTER_OPTIONS = [
  { value: "", label: "— Todos —" },
  { value: "price", label: "Preço (menor → maior)" },
  { value: "marketplace", label: "Marketplace" },
  { value: "shipping", label: "Tipo de Frete" },
  { value: "productCode", label: "Código EAN" },
];

const MARKETPLACES = ["Amazon", "Shopee", "Mercado livre"];
const SHIP_OPTIONS = ["Prime", "Normal", "Flex", "Full", "Express"];

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<
    "" | "price" | "marketplace" | "shipping" | "productCode"
  >("");
  const [dataFilter, setDataFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // paginação simples
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const paginated = products.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  // carrega tudo ou aplica filtro
  async function loadProducts() {
    setLoading(true);
    setError(null);
    try {
      const lista = await fetchProducts(
        filter || undefined,
        dataFilter || undefined
      );
      // garante que products seja sempre array
      setProducts(Array.isArray(lista) ? lista : []);
      setPageIndex(0);
    } catch (err: any) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    // remove o token (ou qualquer outro cleanup)
    localStorage.removeItem("token");
    // redireciona para a home
    router.push("/");
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    loadProducts();
  }

  async function resetFilters() {
    setFilter("");
    setDataFilter("");
    setPageIndex(0);
    setLoading(true);
    setError(null);

    try {
      const lista = await fetchProducts();
      setProducts(Array.isArray(lista) ? lista : []);
    } catch (err: any) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 bg-[var(--black-to-primary)] min-h-screen">
      <div className="flex items-center justify-between ">
        <h1 className="text-3xl font-bold mb-6 text-[var(--white)]">
          Dashboard de Produtos
        </h1>
        <div className="relative inline-block group">
          <button
            onClick={handleLogout}
            className="bg-transparent border-none cursor-pointer transition-transform duration-200 hover:scale-110"
            aria-label="Logout"
          >
            <img src="/profile.png" alt="Logout" />
          </button>

          {/* balão abaixo da imagem */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-white text-red-600 font-bold text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
            Logout?
          </div>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-4 mb-6 items-end"
      >
        {/* Select de filtro */}
        <div>
          <label className="block mb-1 text-sm text-[var(--white)]">
            Filtrar por:
          </label>
          <select
            className="rounded p-2 bg-[var(--white)]"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as any);
              setDataFilter("");
            }}
          >
            {FILTER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Campo dinâmico */}
        {filter === "marketplace" && (
          <div>
            <label className="block mb-1 text-sm text-[var(--white)]">
              Marketplace:
            </label>
            <select
              className="rounded p-2 bg-[var(--white)]"
              value={dataFilter}
              onChange={(e) => setDataFilter(e.target.value)}
            >
              <option value="">— Todos —</option>
              {MARKETPLACES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        )}
        {filter === "shipping" && (
          <div>
            <label className="block mb-1 text-sm text-[var(--white)]">
              Frete:
            </label>
            <select
              className="rounded p-2 bg-[var(--white)]"
              value={dataFilter}
              onChange={(e) => setDataFilter(e.target.value)}
            >
              <option value="">— Todos —</option>
              {SHIP_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}
        {filter === "productCode" && (
          <div>
            <label className="block mb-1 text-sm text-[var(--white)]">
              EAN:
            </label>
            <input
              type="text"
              className="border rounded p-2 bg-[var(--white)]"
              placeholder="7891356059049"
              value={dataFilter}
              onChange={(e) => setDataFilter(e.target.value)}
            />
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--primary-to-secondary)] transition-transform duration-200 hover:scale-105 text-white rounded hover:bg-[var(--secondary-to-third)]"
          >
            Aplicar
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 text-white bg-[var(--yellow-200)] transition-transform duration-200 hover:scale-105 hover:bg-[var(--yellow-100)] rounded"
          >
            Reset
          </button>
        </div>
      </form>

      {/* feedback ao usuário */}
      {loading && <p className="text-[var(--white)]">Carregando…</p>}
      {error && <p className="text-red-500 mb-4">❌ {error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-[var(--white)]">Nenhum produto encontrado.</p>
      )}
      {!loading && !error && products.length > 0 && (
        <p className="text-sm text-[var(--white)]">
          {products.length} produto(s) encontrado(s).
        </p>
      )}

      {/* tabela */}
      {!loading && !error && products.length > 0 && (
        <div className="overflow-x-auto bg-[var(--white)] shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-[var(--secondary-to-third)]">
              <tr>
                <th className="px-4 py-2 text-center text-[var(--white)] text-sm font-medium">
                  Imagem
                </th>
                <th className="px-4 py-2 text-center text-[var(--white)] text-sm font-medium">
                  Nome
                </th>
                <th className="px-4 py-2 text-center text-[var(--white)] text-sm font-medium">
                  Preço
                </th>
                <th className="px-4 py-2 text-center text-[var(--white)] text-sm font-medium">
                  Marketplace
                </th>
                <th className="px-4 py-2 text-center text-[var(--white)] text-sm font-medium">
                  Frete
                </th>
                <th className="px-4 py-2 text-center text-[var(--white)] text-sm font-medium">
                  Disponível
                </th>
                <th className="px-4 py-2 text-center text-[var(--white)] text-sm font-medium">
                  Vendidos
                </th>
                <th className="px-4 py-2 text-center text-[var(--white)] text-sm font-medium">
                  Vendedor
                </th>
                <th className="px-4 py-2 text-center text-[var(--white)] text-sm font-medium">
                  Código EAN
                </th>
                <th className="px-4 py-2 text-center text-[var(--white)] text-sm font-medium">
                  Visitas no Último Mês
                </th>
                <th className="px-4 py-2 text-center text-[var(--white)] text-sm font-medium">
                  Visualizações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {paginated.map((p) => (
                <tr key={p.id} className="hover:bg-[var(--secondary-to-third)]">
                  <td className="px-4 py-2 text-center">
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={48}
                      height={48}
                      className="object-cover rounded justify-center mx-auto"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">{p.name}</td>
                  <td className="px-4 py-2 text-center">
                    {p.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className="px-4 py-2 text-center capitalize">
                    {p.marketplace}
                  </td>
                  <td className="px-4 py-2 text-center capitalize">
                    {p.shipping}
                  </td>
                  <td className="px-4 py-2 text-center">{p.amountAvailable}</td>
                  <td className="px-4 py-2 text-center">{p.amountSold}</td>
                  <td className="px-4 py-2 text-center">{p.sellerName}</td>
                  <td className="px-4 py-2 text-center">{p.productCode}</td>
                  <td className="px-4 py-2 text-center">
                    {p.amountVisitsLastMonth}
                  </td>
                  <td className="px-4 py-2 text-center">{p.amountReviews}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* paginação */}
      {!loading && !error && products.length > pageSize && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setPageIndex((i) => Math.max(i - 1, 0))}
            disabled={pageIndex === 0}
            className="px-3 py-1 bg-[var(--white)] rounded disabled:opacity-50"
          >
            ← Anterior
          </button>
          <span className="text-sm text-[var(--white)]">
            Página {pageIndex + 1} de {Math.ceil(products.length / pageSize)}
          </span>
          <button
            onClick={() =>
              setPageIndex((i) =>
                i + 1 < Math.ceil(products.length / pageSize) ? i + 1 : i
              )
            }
            disabled={(pageIndex + 1) * pageSize >= products.length}
            className="px-3 py-1 bg-[var(--white)] rounded disabled:opacity-50"
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  );
}
