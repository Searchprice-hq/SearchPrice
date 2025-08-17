import type { User, LoginResponse } from "@/models/User";

function getDefaultHeaders() {
  return {
    "Content-Type": "application/json",
    "x-api-key": process.env.API_KEY!,
  };
}

interface ErrorDetail {
  message: string;
  rule: string;
  field: string;
}
interface ErrorResponse {
  errors?: ErrorDetail[];
  message?: string;
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

  const raw = (await res.json().catch(() => ({}))) as
    | { data: LoginResponse }
    | ErrorResponse;

  if (!res.ok) {
    const errBody = raw as ErrorResponse;
    const firstError = errBody.errors?.[0];

    if (res.status === 400) {
      throw new Error("Senha incorreta");
    }

    if (res.status === 422 && firstError) {
      if (firstError.field === "password" && firstError.rule === "minLength") {
        throw new Error("A senha deve ter no mínimo 8 caracteres");
      }
      if (firstError.field === "email") {
        throw new Error("E‑mail não cadastrado");
      }
      throw new Error(firstError.message);
    }

    throw new Error(
      errBody.message || firstError?.message || "Erro ao efetuar login"
    );
  }

  return (raw as { data: LoginResponse }).data;
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
    body: JSON.stringify({
      fullName,
      email: email.trim(),
      password,
      document: document.trim(),
    }),
  });

  if (!res.ok) {
    const errBody = (await res.json().catch(() => ({}))) as ErrorResponse;

    if (errBody.errors && Array.isArray(errBody.errors)) {
      const uniqueErrors = errBody.errors.filter(
        (e) => e.rule === "database.unique"
      );

      const fields = uniqueErrors.map((e) => e.field);
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

      throw new Error(errBody.errors[0].message);
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
    const errBody = (await res.json().catch(() => ({}))) as ErrorResponse;
    throw new Error(
      errBody.message || "Erro ao solicitar recuperação de senha"
    );
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
    const errBody = (await res.json().catch(() => ({}))) as ErrorResponse;
    throw new Error(errBody.message || "Erro ao redefinir senha");
  }
}
