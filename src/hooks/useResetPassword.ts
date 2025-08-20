"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/services/authService";

export function useResetPassword() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleReset = async (
    email: string,
    token: string,
    password: string,
    confirmPassword: string
  ) => {
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }
    if (password.length < 8) {
      setError("A senha deve ter ao menos 8 caracteres");
      return;
    }

    function hasMessage(e: unknown): e is { message: string } {
      return (
        typeof e === "object" &&
        e !== null &&
        "message" in e &&
        typeof (e as { message?: unknown }).message === "string"
      );
    }

    setLoading(true);
    try {
      await resetPassword(email, token, password);
      router.push("/login");
    } catch (err: unknown) {
      let msg = "";

      if (err instanceof Error) {
        msg = err.message;
      } else if (typeof err === "string") {
        msg = err;
      } else if (hasMessage(err)) {
        msg = err.message;
      }

      if (/invalid code/i.test(msg)) {
        setError("Código inválido");
      } else {
        setError(msg || "Erro ao redefinir senha");
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleReset, error, loading };
}
