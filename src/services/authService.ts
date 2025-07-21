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
    throw new Error(body.message || "Erro ao efetuar login");
  }
  return body.data as LoginResponse;
}

export async function registerUser(
  fullName: string,
  email: string,
  password: string,
  document: string
): Promise<User> {
  const res = await fetch("/api/user/register", {
    method: "POST",
    headers: getDefaultHeaders(),
    body: JSON.stringify({
      fullName,
      email: email.trim(),
      password,
      document: document.trim(),
    }),
  });

  if (!res.ok) {
    const errBody: any = await res.json().catch(() => ({}));

    if (Array.isArray(errBody.errors)) {
      const uniqueErrors = errBody.errors.filter(
        (e: any) => e.rule === "database.unique"
      );
      const fields = uniqueErrors.map((e: any) => e.field);

      const hasEmail = fields.includes("email");
      const hasDoc = fields.includes("document");

      if (hasEmail && hasDoc) {
        throw new Error("E-mail e documento já cadastrados");
      }
      if (hasEmail) {
        throw new Error("E-mail já cadastrado");
      }
      if (hasDoc) {
        throw new Error("Documento já cadastrado");
      }

      if (errBody.errors.length > 0) {
        throw new Error(errBody.errors[0].message);
      }
    }

    throw new Error(errBody.message || "Erro ao registrar usuário");
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
