"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  useRef,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchProducts } from "@/services/productService";
import type { Product } from "@/models/Product";
import MiniCalculator from "@/components/MiniCalculator";
import LegendTooltip from "./LegendTooltip";

type FilterOption = (typeof FILTER_OPTIONS)[number]["value"];

const FILTER_OPTIONS = [
  { value: "price", label: "Preço (menor → maior)" },
  { value: "shipping", label: "Tipo de Frete" },
  { value: "productCode", label: "Código EAN" },
] as const;

const SHIP_OPTIONS = ["Prime", "Normal", "Flex", "Full", "Express"];

export default function Dashboard() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<FilterOption>("price");
  const [dataFilter, setDataFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sellPrice, setSellPrice] = useState<number | null>(null);
  const [calcResult, setCalcResult] = useState<number | null>(null);

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const loadProducts = useCallback(
    async (filterArg?: FilterOption, dataFilterArg?: string) => {
      setLoading(true);
      setError(null);
      try {
        const list = await fetchProducts(
          filterArg || undefined,
          dataFilterArg?.trim() || undefined
        );
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

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onClose = () => setSelectedProduct(null);

    if (selectedProduct) {
      if (!dialog.open) dialog.showModal();
      setTimeout(() => closeButtonRef.current?.focus(), 0);
      dialog.addEventListener("close", onClose);

      return () => dialog.removeEventListener("close", onClose);
    } else if (dialog.open) {
      dialog.close();
    }
  }, [selectedProduct]);

  useEffect(() => {
    const dialog = dialogRef.current;

    return () => {
      document.body.style.overflow = "";
      if (dialog?.open) {
        dialog.close();
      }
    };
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value as FilterOption);
    setDataFilter("");
  };

  const handleEANChange = (e: ChangeEvent<HTMLInputElement>) =>
    setDataFilter(e.target.value);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  let productsToDisplay = [...products];

  const term = dataFilter.trim().toLowerCase();
  if (filter === "productCode" && term) {
    productsToDisplay = productsToDisplay.filter((p) =>
      p.productCode.toLowerCase().includes(term)
    );
  }

  if (filter === "shipping" && term) {
    productsToDisplay = productsToDisplay.filter((p) =>
      p.shipping.toLowerCase().includes(term)
    );
  }

  if (searchTerm.trim()) {
    const search = searchTerm.trim().toLowerCase();
    productsToDisplay = productsToDisplay.filter((p) =>
      p.name.toLowerCase().includes(search)
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

  const renderTable = (title: string, items: Product[]) => {
    if (items.length === 0) return null;
    return (
      <div key={title} className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-max w-full table-auto">
              <thead className="bg-[var(--secondary-to-third)]">
                <tr>
                  {[
                    "Produtos",
                    "Nome",
                    "Preço R$",
                    "Frete",
                    "Disponível",
                    "Vendidos",
                    "Vendedor",
                    "Código EAN",
                    "Visitas no Mês",
                    "Visualizações",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-2 text-sm font-medium text-white text-center"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {items.map((p) => {
                  let colorClass = "";

                  const adPrice =
                    typeof p.price === "string" ? parseFloat(p.price) : p.price;
                  if (
                    sellPrice !== null &&
                    calcResult !== null &&
                    !Number.isNaN(calcResult)
                  ) {
                    if (sellPrice < adPrice && calcResult > 0) {
                      colorClass = "bg-green-500";
                    } else if (sellPrice === adPrice && calcResult > 0) {
                      colorClass = "bg-yellow-500";
                    } else {
                      colorClass = "bg-red-500";
                    }
                  }
                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedProduct(p)}
                      className="hover:bg-gray-100 cursor-pointer"
                    >
                      <td className="px-4 py-2 relative">
                        {calcResult !== null && !Number.isNaN(calcResult) && (
                          <div
                            className={`absolute inset-y-0 left-0 w-3 rounded-r ${colorClass}`}
                          />
                        )}
                        <div className="flex justify-center items-center ml-2">
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
                        {Number(p.price).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
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
                      <td className="px-4 py-2 text-center">
                        {p.amountReviews}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  function renderContent() {
    if (loading) {
      return <p className="text-white">Carregando…</p>;
    }

    if (error) {
      return <p className="text-red-500 mb-4">❌ {error}</p>;
    }

    if (productsToDisplay.length === 0) {
      return <p className="text-white mb-4">Nenhum produto encontrado.</p>;
    }

    return (
      <>
        {renderTable("Mercado Livre", mercadoLivre)}
        {renderTable("Amazon", amazon)}
        {renderTable("Shopee", shopee)}
      </>
    );
  }

  const closeModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  return (
    <div className="bg-[var(--black-to-primary)] min-h-screen flex flex-col">
      <main className="p-8 flex-grow">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">
            Dashboard de Produtos
          </h1>
          <button onClick={handleLogout} className="relative group">
            <Image
              src="/logout.png"
              className="h-13 w-13"
              alt="Logout"
              width={50}
              height={50}
            />
            <span className="absolute top-full left-1/2 font-medium -translate-x-1/2 mt-1 px-2 py-1 bg-white text-red-600 text-sm rounded opacity-0 group-hover:opacity-100">
              Sair
            </span>
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar produto por nome..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full max-w-md p-2 rounded bg-white"
          />
        </div>

        <div className="flex flex-wrap gap-4 mb-6 items-end">
          <div className="flex flex-col">
            <label htmlFor="filterBy" className="block text-sm text-white mb-1">
              Filtrar por:
            </label>
            <div className="flex items-center gap-2">
              <select
                id="filterBy"
                value={filter}
                onChange={handleFilterChange}
                className="rounded p-2 bg-white"
              >
                {FILTER_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <div className={filter === "price" ? "" : "hidden"}>
                <LegendTooltip drop={false} />
              </div>
            </div>
          </div>

          {filter === "shipping" && (
            <div className="flex items-end gap-2">
              <div>
                <label
                  htmlFor="filterShipping"
                  className="block mb-1 text-sm text-white"
                >
                  Frete:
                </label>
                <select
                  id="filterShipping"
                  value={dataFilter}
                  onChange={(e) => setDataFilter(e.target.value)}
                  className="rounded p-2 bg-white"
                >
                  <option value="">Todos</option>
                  {SHIP_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <LegendTooltip drop={true} />
            </div>
          )}

          {filter === "productCode" && (
            <div className="flex items-end gap-2">
              <div>
                <label
                  htmlFor="productCodeInput"
                  className="block mb-1 text-sm text-white"
                >
                  EAN:
                </label>
                <input
                  id="productCodeInput"
                  type="text"
                  placeholder="Digite EAN..."
                  value={dataFilter}
                  onChange={handleEANChange}
                  className="
    border rounded p-2 bg-white
    w-full sm:w-auto
    max-w-xs sm:max-w-none
  "
                />
              </div>
              <LegendTooltip drop={true} />
            </div>
          )}
        </div>

        <div>{renderContent()}</div>

        <MiniCalculator
          onCalc={(sp, cr) => {
            setSellPrice(sp);
            setCalcResult(cr);
          }}
        />
      </main>

      {selectedProduct && (
        <dialog
          ref={dialogRef}
          aria-labelledby="productModalTitle"
          className="
    sp-modal
    fixed top-1/2 left-1/2
    -translate-x-1/2 -translate-y-1/2
    m-0 p-0
    rounded-2xl w-[350px] max-w-md border-0
  "
        >
          <div className="relative bg-white rounded-2xl p-6">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeModal}
              aria-label="Fechar"
              className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 text-2xl leading-none focus:outline-none"
            >
              ✕
            </button>

            <div className="flex flex-col items-center gap-4">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                width={120}
                height={120}
                className="rounded"
              />
              <h3
                id="productModalTitle"
                className="text-2xl text-center font-semibold"
              >
                {selectedProduct.name}
              </h3>

              <p>
                <span className="font-semibold">Preço:</span>{" "}
                {Number(selectedProduct.price).toLocaleString("pt-BR", {
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
                <span className="font-semibold">Visitas:</span>{" "}
                {selectedProduct.amountVisitsLastMonth}
              </p>
              <p>
                <span className="font-semibold">Avaliações:</span>{" "}
                {selectedProduct.amountReviews}
              </p>
            </div>
          </div>
        </dialog>
      )}

      <footer className="bg-[var(--dark-black-to-secondary)] text-white text-center p-8">
        © 2023-2025 Search Price Soluções Tecnológicas LTDA. Todos os direitos
        reservados.
      </footer>
    </div>
  );
}
