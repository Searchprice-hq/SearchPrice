"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "sp:my-prices";

/**
 * Preço de venda do próprio usuário por EAN.
 * Guardado no navegador até o backend expor `/my-products` (ver docs/SPEC.md da API).
 */
export function useMyPrices() {
  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPrices(JSON.parse(raw));
    } catch {
      // storage indisponível: segue só em memória
    }
  }, []);

  const setPrice = useCallback((key: string, value: number | null) => {
    setPrices((prev) => {
      const next = { ...prev };
      if (value && value > 0) next[key] = value;
      else delete next[key];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignora
      }
      return next;
    });
  }, []);

  return { prices, setPrice };
}
