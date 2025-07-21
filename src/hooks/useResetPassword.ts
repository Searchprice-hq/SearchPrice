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
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 8) {
      setError("A senha deve ter ao menos 8 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email, token, password);
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err) || "Erro ao redefinir senha");
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleReset, error, loading };
}
