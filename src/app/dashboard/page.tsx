// src/app/dashboard/page.tsx
"use client";

import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchProducts } from "@/services/productService";
import type { Product } from "@/models/Product";

type FilterOption = "" | "price" | "shipping" | "productCode";

const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: "", label: "— Todos —" },
  { value: "price", label: "Preço (menor → maior)" },
  { value: "shipping", label: "Tipo de Frete" },
  { value: "productCode", label: "Código EAN" },
];

const SHIP_OPTIONS = ["Prime", "Normal", "Flex", "Full", "Express"];

export default function DashboardPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<FilterOption>("");
  const [dataFilter, setDataFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Trava scroll do body quando modal aberto
  useEffect(() => {
    document.body.style.overflow = selectedProduct ? "hidden" : "";
  }, [selectedProduct]);

  // Carrega produtos via service
  const loadProducts = useCallback(
    async (filterArg?: FilterOption, dataFilterArg?: string) => {
      setLoading(true);
      setError(null);
      try {
        // se vier "" ou undefined, passa undefined; senão, passa o filtro
        const filterQuery = filterArg || undefined;
        const codeQuery = dataFilterArg?.trim() || undefined;

        const list = await fetchProducts(filterQuery, codeQuery);
        setProducts(Array.isArray(list) ? list : []);
      } catch (err: unknown) {
        setProducts([]);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Sempre que filter/dataFilter mudam, recarrega
  useEffect(() => {
    if (filter && filter !== "productCode") {
      loadProducts(filter, dataFilter);
    } else {
      loadProducts();
    }
  }, [filter, dataFilter, loadProducts]);

  // Handlers de UI
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);
  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value as FilterOption);
    setDataFilter("");
  };
  const handleEANChange = (e: ChangeEvent<HTMLInputElement>) =>
    setDataFilter(e.target.value);
  const resetFilters = () => {
    setFilter("");
    setDataFilter("");
    setSearchTerm("");
    loadProducts();
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  // Aplica busca por nome e filtro local
  let productsToDisplay = products;
  if (filter === "productCode" && dataFilter.trim() !== "") {
    const term = dataFilter.trim().toLowerCase();
    productsToDisplay = productsToDisplay.filter((p) =>
      p.productCode.toLowerCase().includes(term)
    );
  }
  if (searchTerm.trim() !== "") {
    const term = searchTerm.trim().toLowerCase();
    productsToDisplay = productsToDisplay.filter((p) =>
      p.name.toLowerCase().includes(term)
    );
  }

  const mercadoLivre = productsToDisplay.filter((p) =>
    p.marketplace.toLowerCase().includes("mercado")
  );
  const amazon = productsToDisplay.filter((p) =>
    p.marketplace.toLowerCase().includes("amazon")
  );
  const shopee = productsToDisplay.filter((p) =>
    p.marketplace.toLowerCase().includes("shopee")
  );

  // Função de renderização da tabela
  const renderTable = (title: string, items: Product[]) => {
    if (items.length === 0) return null;
    return (
      <div key={title} className="mb-8">
        <h2 className="text-xl font-semibold text-[var(--white)] mb-2">
          {title}
        </h2>
        <div className="bg-[var(--white)] shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-max w-full table-auto">
              <thead className="bg-[var(--secondary-to-third)]">
                <tr className="border-b border-gray-700">
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
              <tbody className="divide-y divide-gray-700">
                {items.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className="hover:bg-[var(--secondary-to-third)] cursor-pointer"
                  >
                    <td className="px-4 py-2">
                      <div className="flex justify-center items-center">
                        <Image
                          src={p.image}
                          alt={p.name}
                          width={48}
                          height={48}
                          className="object-cover rounded"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center">{p.name}</td>
                    <td className="px-4 py-2 text-center">
                      {p.price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td className="px-4 py-2 text-center capitalize">
                      {p.shipping}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {p.amountAvailable}
                    </td>
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
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[var(--black-to-primary)] min-h-screen flex flex-col">
      {/* Conteúdo principal */}
      <main className="p-8 flex-grow">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[var(--white)]">
            Dashboard de Produtos
          </h1>
          <button onClick={handleLogout} className="relative group">
            <Image src="/profile.png" alt="Logout" width={40} height={40} />
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-white text-red-600 text-sm rounded opacity-0 group-hover:opacity-100">
              Logout?
            </span>
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar produto por nome..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full max-w-md p-2 rounded bg-[var(--white)]"
          />
        </div>

        <div className="flex flex-wrap gap-4 mb-6 items-end">
          <div>
            <label className="block mb-1 text-sm text-[var(--white)]">
              Filtrar por:
            </label>
            <select
              value={filter}
              onChange={handleFilterChange}
              className="rounded p-2 bg-[var(--white)]"
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
                value={dataFilter}
                onChange={(e) => setDataFilter(e.target.value)}
                className="rounded p-2 bg-[var(--white)]"
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
                placeholder="Digite EAN..."
                value={dataFilter}
                onChange={handleEANChange}
                className="border rounded p-2 bg-[var(--white)]"
              />
            </div>
          )}

          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 bg-[var(--primary-to-secondary)] text-white rounded hover:bg-[var(--secondary-to-third)] transition"
          >
            Reset
          </button>
        </div>

        {loading ? (
          <p className="text-[var(--white)]">Carregando…</p>
        ) : error ? (
          <p className="text-red-500 mb-4">❌ {error}</p>
        ) : productsToDisplay.length === 0 ? (
          <p className="text-[var(--white)] mb-4">Nenhum produto encontrado.</p>
        ) : (
          <>
            {renderTable("Mercado Livre", mercadoLivre)}
            {renderTable("Amazon", amazon)}
            {renderTable("Shopee", shopee)}
          </>
        )}
      </main>

      {/* Modal de detalhes */}
      {selectedProduct && (
        <div
          onClick={() => setSelectedProduct(null)}
          className="fixed inset-0 w-full h-screen bg-gray-800/50 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-lg w-full relative"
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>
            <div className="flex flex-col items-center gap-4">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                width={120}
                height={120}
                className="rounded"
              />
              <h3 className="text-2xl text-center font-semibold">
                {selectedProduct.name}
              </h3>
              <p>
                <span className="font-semibold">Preço:</span>{" "}
                {selectedProduct.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
              <p>
                <span className="font-semibold">Frete:</span>{" "}
                {selectedProduct.shipping}
              </p>
              <p>
                <span className="font-semibold">Disponível:</span>{" "}
                {selectedProduct.amountAvailable}
              </p>
              <p>
                <span className="font-semibold">Vendidos:</span>{" "}
                {selectedProduct.amountSold}
              </p>
              <p>
                <span className="font-semibold">Vendedor:</span>{" "}
                {selectedProduct.sellerName}
              </p>
              <p>
                <span className="font-semibold">EAN:</span>{" "}
                {selectedProduct.productCode}
              </p>
              <p>
                <span className="font-semibold">Visitas no mês:</span>{" "}
                {selectedProduct.amountVisitsLastMonth}
              </p>
              <p>
                <span className="font-semibold">Avaliações:</span>{" "}
                {selectedProduct.amountReviews}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer sempre no final */}
      <footer className="bg-[var(--dark-black-to-secondary)] text-white w-full px-8 py-8 text-center">
        © 2024-2025 Search Price Soluções Tecnológicas LTDA. Todos os direitos
        reservados.
      </footer>
    </div>
  );
}
