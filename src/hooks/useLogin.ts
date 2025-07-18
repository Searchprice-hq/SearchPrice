// src/hooks/useLogin.ts
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, forgotPassword } from "@/lib/api";
import type { LoginResponse } from "@/models/User";

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const data: LoginResponse = await loginUser(email, password);
      localStorage.setItem("token", data.token.token);
      console.log(data.token.token); // Log do token para depuração
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.id,
          fullName: data.fullName,
          email: data.email,
        })
      );
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err) || "Usuário ou senha incorretos");
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

  return { handleLogin, handleForgotPassword, error, loading };
};
