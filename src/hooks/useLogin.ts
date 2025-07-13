"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";

type LoginResponse = {
  token: {
    token: string;
  };
  id: number;
  fullName: string;
  email: string;
};

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
          id: String(data.id),
          fullName: data.fullName,
          email: data.email,
        })
      );

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setError("Usuário ou senha incorretos");
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, error, loading };
};