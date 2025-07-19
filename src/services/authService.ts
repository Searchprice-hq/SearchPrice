import type { User, LoginResponse } from "@/models/User";

function getDefaultHeaders() {
  return {
    "Content-Type": "application/json",
    "x-api-key": "m7fLLNkHUuKrUaKkYbJcTi8o154u81ze",
  };
}

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`/api/user/login`, {
    method: "POST",
    headers: getDefaultHeaders(),
    body: JSON.stringify({ email, password }),
  });

  const body = await res.json();
  if (!res.ok) {
    // body pode ter message ou errors
    throw new Error(body.message || "Erro ao efetuar login");
  }

  // descompacta o data do helper
  return body.data as LoginResponse;
}

export async function registerUser(
  fullName: string,
  email: string,
  password: string,
  document: string
): Promise<User> {
  const res = await fetch(`/api/user/register`, {
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
  const res = await fetch(`/api/email/forgot-password`, {
    method: "POST",
    headers: getDefaultHeaders(),
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Erro ao solicitar recuperação de senha");
  }
}

export async function resetPassword(
  email: string,
  token: string,
  password: string
): Promise<void> {
  const res = await fetch(`/api/email/reset-password`, {
    method: "POST",
    headers: getDefaultHeaders(),
    body: JSON.stringify({ email, token, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || "Erro ao redefinir senha");
  }
}
