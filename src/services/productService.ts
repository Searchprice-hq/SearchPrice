import type { Product } from "@/models/Product";
import { USE_MOCKS, mockProducts } from "@/mocks";

function getHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function fetchProducts(
  filter?: "price" | "marketplace" | "shipping" | "productCode",
  dataFilter?: string
): Promise<Product[]> {
  if (USE_MOCKS) return mockProducts(filter, dataFilter);
  const params = new URLSearchParams();
  if (filter) {
    params.append("filter", filter);
    if (dataFilter) params.append("dataFilter", dataFilter);
  }

  const url =
    params.toString().length > 0 ? `/api/products?${params}` : `/api/products`;

  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Erro ao buscar produtos");
  }

  const payload = await res.json();
  if (Array.isArray(payload)) return payload;
  if (payload.data && Array.isArray(payload.data)) return payload.data;
  throw new Error("Formato de resposta inesperado");
}
