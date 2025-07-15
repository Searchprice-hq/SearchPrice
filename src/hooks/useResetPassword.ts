// src/hooks/useResetPassword.ts
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/lib/api";

export function useResetPassword() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
      router.push("/login"); // volta à tela de login
    } catch (err: any) {
      setError(err.message || "Erro ao redefinir senha");
    } finally {
      setLoading(false);
    }
  };

  return { handleReset, error, loading };
}
