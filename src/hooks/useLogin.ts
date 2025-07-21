"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/authService";
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
        setError(String(err) || "Erro ao efetuar login");
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, error, loading };
};
