export function formatBRL(n: number): string {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function parseToNumberFromMaskedBRL(str: string): number {
  const digits = str.replace(/\D/g, "");
  return Number(digits) / 100;
}
