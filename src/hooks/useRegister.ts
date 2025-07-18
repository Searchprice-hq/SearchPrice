// src/hooks/useRegister.ts
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api";
import type { User } from "@/models/User";

interface PasswordRequirement {
  regex: RegExp;
  text: string;
}

export const useRegister = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const passwordRequirements: PasswordRequirement[] = [
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

  const validateDocument = (value: string) => {
    // apenas números, length 11 (CPF) ou 14 (CNPJ)
    return /^(\d{11}|\d{14})$/.test(value);
  };

  const handleRegister = async (
    fullName: string,
    document: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    setError(null);

    if (!validateDocument(document)) {
      setError("CPF ou CNPJ inválido");
      return;
    }

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
      const newUser: User = await registerUser(
        fullName,
        email,
        password,
        document
      );
      console.log("Usuário criado:", newUser);
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err) || "Erro ao registrar usuário");
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
    validateDocument,
  };
};
