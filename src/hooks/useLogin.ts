"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, forgotPassword } from "@/lib/api";
import type { LoginResponse } from "@/models/User";

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const data: LoginResponse = await loginUser(email, password);
      localStorage.setItem("token", data.token.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          fullName: data.fullName,
          email: data.email,
        })
      );
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Usuário ou senha incorretos");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    setError(null);
    setLoading(true);
    try {
      await forgotPassword(email);
      return "E‑mail de recuperação enviado com sucesso!";
    } catch (err: any) {
      return err.message || "Erro ao solicitar recuperação de senha";
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, handleForgotPassword, error, loading };
};
