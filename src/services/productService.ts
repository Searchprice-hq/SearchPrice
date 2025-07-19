import type { Product } from "@/models/Product";

function getHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    "x-api-key": "m7fLLNkHUuKrUaKkYbJcTi8o154u81ze",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

/**
 * Busca produtos. Se não passar `filter`, retorna todos.
 * Já desembrulha eventuais wrappers { status, data }.
 */
export async function fetchProducts(
  filter?: "price" | "marketplace" | "shipping" | "productCode",
  dataFilter?: string
): Promise<Product[]> {
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
  // Se já for array, retorna direto
  if (Array.isArray(payload)) return payload;
  // Se vir embrulhado em { data: [...] }
  if (payload.data && Array.isArray(payload.data)) return payload.data;
  // Senão
  throw new Error("Formato de resposta inesperado");
}
