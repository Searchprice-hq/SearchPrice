// src/app/dashboard/page.tsx
"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  FormEvent,
  ChangeEvent,
} from "react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(
    async (filterArg?: FilterOption, dataFilterArg?: string) => {
      setLoading(true);
      setError(null);
      try {
        // convert "" → undefined so it matches the fetchProducts signature
        const filterParam = filterArg === "" ? undefined : filterArg;
        const dataFilterParam =
          dataFilterArg === "" ? undefined : dataFilterArg;

        const list = await fetchProducts(filterParam, dataFilterParam);
        setProducts(Array.isArray(list) ? list : []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadProducts(filter, dataFilter);
  }, [loadProducts, filter, dataFilter]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    loadProducts(filter, dataFilter);
  }

  async function resetFilters() {
    setFilter("");
    setDataFilter("");
    await loadProducts("", "");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/");
  }

  const mercadoLivre = products.filter((p) =>
    p.marketplace.toLowerCase().includes("mercado")
  );
  const amazon = products.filter((p) =>
    p.marketplace.toLowerCase().includes("amazon")
  );
  const shopee = products.filter((p) =>
    p.marketplace.toLowerCase().includes("shopee")
  );

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
    <div className="bg-[var(--black-to-primary)] min-h-screen">
      <div className="p-8">
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
              <Image src="/profile.png" alt="Logout" width={40} height={40} />
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
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setFilter(e.target.value as FilterOption);
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
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 bg-[var(--primary-to-secondary)] text-white rounded hover:bg-[var(--secondary-to-third)] transition-transform duration-200 hover:scale-105"
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

        {/* Três tabelas por marketplace */}
        {!loading && !error && (
          <>
            {renderTable("Mercado Livre", mercadoLivre)}
            {renderTable("Amazon", amazon)}
            {renderTable("Shopee", shopee)}
          </>
        )}
      </div>

      <footer className="bg-[var(--background-primary-color)] text-white w-full mt-auto px-8 py-8 flex flex-col md:flex-row items-center justify-center gap-4 text-center">
        <p className="text-base">
          © 2024-2025 Search Price Soluções Tecnológicas LTDA. Todos os direitos
          reservados.
        </p>
      </footer>
    </div>
  );
}
