/**
 * Modo mock: o front roda sozinho, sem a searchprice-master-api.
 *
 * Ligado por padrão. Para voltar a usar a API, defina no .env.local:
 *   NEXT_PUBLIC_USE_MOCKS=false
 */
import type { LoginResponse, User } from "@/models/User";
import type { Product } from "@/models/Product";
import products from "./products.json";

export const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";

/** Mesmo usuário fixo da API (app/utils/test_users.ts). */
export const TEST_USER = {
  fullName: "User Test",
  email: "user-test@searchprice.com",
  password: "UserTest@123",
  document: "00000000000",
};

const FIXED_USERS = [
  TEST_USER,
  { fullName: "Demo SearchPrice", email: "demo@searchprice.local", password: "Demo@12345", document: "00000000001" },
];

const USERS_KEY = "sp:mock:users";

/** Pequena latência para os estados de carregamento aparecerem. */
export const delay = (ms = 350) => new Promise<void>((r) => setTimeout(r, ms));

type StoredUser = typeof TEST_USER;

function readUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function toUser(u: StoredUser, id: number): User {
  const now = new Date().toISOString();
  return {
    id,
    fullName: u.fullName,
    email: u.email,
    document: u.document,
    phone: "",
    groupId: 1,
    role: "seller",
    createdAt: now,
    updatedAt: now,
  };
}

export async function mockLogin(email: string, password: string): Promise<LoginResponse> {
  await delay();
  const all = [...FIXED_USERS, ...readUsers()];
  const idx = all.findIndex((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (idx === -1) throw new Error("E‑mail não cadastrado");
  if (all[idx].password !== password) throw new Error("Senha incorreta");
  const expires = new Date(Date.now() + 30 * 86400_000).toISOString();
  return {
    ...toUser(all[idx], idx + 1),
    token: { token: `mock_${btoa(all[idx].email)}`, name: all[idx].email, type: "bearer", expiresAt: expires },
  };
}

export async function mockRegister(fullName: string, email: string, password: string, document: string): Promise<User> {
  await delay();
  const users = readUsers();
  const all = [...FIXED_USERS, ...users];
  const hasEmail = all.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  const hasDoc = all.some((u) => u.document === document.trim());
  if (hasEmail && hasDoc) throw new Error("E-mail e documento já cadastrados");
  if (hasEmail) throw new Error("E-mail já cadastrado");
  if (hasDoc) throw new Error("Documento já cadastrado");
  const record = { fullName, email: email.trim(), password, document: document.trim() };
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, record]));
  return toUser(record, all.length + 1);
}

export async function mockProducts(
  filter?: "price" | "marketplace" | "shipping" | "productCode",
  dataFilter?: string
): Promise<Product[]> {
  await delay();
  let list = [...(products as unknown as Product[])];
  const eq = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();
  if (dataFilter) {
    if (filter === "marketplace") list = list.filter((p) => eq(p.marketplace, dataFilter));
    if (filter === "shipping") list = list.filter((p) => eq(p.shipping, dataFilter));
    if (filter === "productCode") list = list.filter((p) => p.productCode === dataFilter);
  }
  return list.sort((a, b) => a.price - b.price);
}
