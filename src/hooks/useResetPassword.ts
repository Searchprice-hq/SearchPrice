"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword, forgotPassword } from "@/services/authService";

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

  const handleForgotPassword = async (email: string): Promise<string> => {
    setError(null);
    setLoading(true);
    try {
      await forgotPassword(email);
      return "E‑mail de recuperação enviado com sucesso!";
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        return err.message;
      } else {
        return String(err) || "Erro ao solicitar recuperação de senha";
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleReset, handleForgotPassword, error, loading };
}
