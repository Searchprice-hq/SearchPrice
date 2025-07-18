// src/app/dashboard/page.tsx
"use client";

import React, { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchProducts } from "@/services/productService";
import type { Product } from "@/models/Product";

const FILTER_OPTIONS = [
  { value: "", label: "— Todos —" },
  { value: "price", label: "Preço (menor → maior)" },
  { value: "shipping", label: "Tipo de Frete" },
  { value: "productCode", label: "Código EAN" },
];

const SHIP_OPTIONS = ["Prime", "Normal", "Flex", "Full", "Express"];

export default function DashboardPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<
    "price" | "shipping" | "productCode" | ""
  >("");
  const [dataFilter, setDataFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // busca produtos com filtro, se houver
  async function loadProducts() {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchProducts(
        filter || undefined,
        dataFilter || undefined
      );
      setProducts(Array.isArray(list) ? list : []);
    } catch (err: any) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
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
    await loadProducts();
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/");
  }

  // separa por marketplace
  const mercadoLivre = products.filter((p) =>
    p.marketplace.toLowerCase().includes("mercado")
  );
  const amazon = products.filter((p) =>
    p.marketplace.toLowerCase().includes("amazon")
  );
  const shopee = products.filter((p) =>
    p.marketplace.toLowerCase().includes("shopee")
  );

  // renderiza cada tabela
  function renderTable(title: string, items: Product[]) {
    return (
      <div key={title} className="mb-8">
        <h2 className="text-xl font-semibold text-[var(--white)] mb-2">
          {title}
        </h2>
        <div className="bg-[var(--white)] shadow rounded-lg overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-[var(--secondary-to-third)]">
              <tr>
                {[
                  "Imagem",
                  "Nome",
                  "Preço",
                  "Frete",
                  "Disponível",
                  "Vendidos",
                  "Vendedor",
                  "Código EAN",
                  "Visitas no Último Mês",
                  "Visualizações",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-2 text-sm font-medium text-[var(--white)] whitespace-nowrap text-center"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {items.map((p) => (
                <tr key={p.id} className="hover:bg-[var(--secondary-to-third)]">
                  <td className="px-4 py-2 whitespace-nowrap text-center">
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={48}
                      height={48}
                      className="object-cover rounded inline-block"
                    />
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    {p.name}
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    {p.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className="px-4 py-2 text-center capitalize whitespace-nowrap">
                    {p.shipping}
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    {p.amountAvailable}
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    {p.amountSold}
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    {p.sellerName}
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    {p.productCode}
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    {p.amountVisitsLastMonth}
                  </td>
                  <td className="px-4 py-2 text-center whitespace-nowrap">
                    {p.amountReviews}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[var(--black-to-primary)] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[var(--white)]">
          Dashboard de Produtos
        </h1>
        <div className="relative inline-block group">
          <button
            onClick={handleLogout}
            className="bg-transparent border-none cursor-pointer transition-transform duration-200 hover:scale-110"
            aria-label="Logout"
          >
            <img src="/profile.png" alt="Logout" className="w-8 h-8" />
          </button>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-white text-red-600 font-bold text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
            Logout?
          </div>
        </div>
      </div>

      {/* Formulário de filtro */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-4 mb-6 items-end"
      >
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
            className="px-4 py-2 bg-[var(--primary-to-secondary)] text-white rounded hover:bg-[var(--secondary-to-third)] transition-transform duration-200 hover:scale-105"
          >
            Aplicar
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 bg-[var(--yellow-200)] text-white rounded hover:bg-[var(--yellow-100)] transition-transform duration-200 hover:scale-105"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Feedback */}
      {loading && <p className="text-[var(--white)]">Carregando…</p>}
      {error && <p className="text-red-500 mb-4">❌ {error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-[var(--white)]">Nenhum produto encontrado.</p>
      )}

      {/* Tabelas por marketplace */}
      {!loading && !error && (
        <>
          {renderTable("Mercado Livre", mercadoLivre)}
          {renderTable("Amazon", amazon)}
          {renderTable("Shopee", shopee)}
        </>
      )}
    </div>
  );
}
