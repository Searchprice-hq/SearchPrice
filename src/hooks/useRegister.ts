"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api";

export const useRegister = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const passwordRequirements = [
    { text: "Pelo menos 8 caracteres", regex: /.{8,}/ },
    { text: "Uma letra maiúscula", regex: /[A-Z]/ },
    { text: "Uma letra minúscula", regex: /[a-z]/ },
    { text: "Um número", regex: /[0-9]/ },
    { text: "Um caractere especial (!@#$%^&*)", regex: /[!@#$%^&*]/ },
  ];

  const validatePassword = (password: string) =>
    passwordRequirements.every((req) => req.regex.test(password));

  const checkPasswordsMatch = (password: string, confirmPassword: string) =>
    password === confirmPassword && confirmPassword.length > 0;

  const handleRegister = async (
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    setError(null);

    if (!checkPasswordsMatch(password, confirmPassword)) {
      setError("As senhas não coincidem!");
      return;
    }

    if (!validatePassword(password)) {
      setError("A senha não atende todos os requisitos.");
      return;
    }

    setLoading(true);
    try {
      await registerUser(fullName, email, password);
      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro desconhecido ao registrar.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    handleRegister,
    error,
    loading,
    passwordRequirements,
    validatePassword,
    checkPasswordsMatch,
  };
};