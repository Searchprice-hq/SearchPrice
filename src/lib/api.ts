import type { User, LoginResponse } from "@/models/User";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

function getDefaultHeaders() {
  return {
    "Content-Type": "application/json",
    "x-api-key": API_KEY || "",
  };
}

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/user/login`, {
    method: "POST",
    headers: getDefaultHeaders(),
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Erro ao efetuar login");
  }

  return res.json();
}

export async function registerUser(
  fullName: string,
  email: string,
  password: string,
  document: string
): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/user/register`, {
    method: "POST",
    headers: getDefaultHeaders(),
    body: JSON.stringify({ fullName, email, password, document }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Erro ao registrar usuário");
  }

  return res.json();
}

export async function forgotPassword(email: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/email/forgot-password`, {
    method: "POST",
    headers: getDefaultHeaders(),
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Erro ao solicitar recuperação de senha");
  }
}
