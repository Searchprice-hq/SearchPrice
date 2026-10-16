"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import { useRegister } from "@/hooks/useRegister";
import AuthShell from "@/components/site/AuthShell";
import {
  Field,
  FormError,
  PasswordField,
  PasswordRules,
} from "@/components/ui/Field";
import { buttonClass } from "@/components/ui/button";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [document, setDocument] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    handleRegister,
    error,
    loading,
    passwordRequirements,
    validatePassword,
    checkPasswordsMatch,
    validateDocument,
  } = useRegister();

  const fullNamePatternValid = /^[\p{L} ]{1,60}$/u.test(fullName);
  const fullNameLengthValid = fullName.trim().length >= 10;
  const fullNameValid = fullNamePatternValid && fullNameLengthValid;

  const isValidPassword = validatePassword(password);
  const passwordsMatch = checkPasswordsMatch(password, confirmPassword);
  const docValid = validateDocument(document);
  const emailValid = /^\S+@\S+\.\S+$/.test(email);

  const canSubmit =
    fullNameValid && emailValid && docValid && isValidPassword && passwordsMatch;

  let fullNameError: string | null = null;
  if (fullName.length > 0 && !fullNameLengthValid)
    fullNameError = "O nome deve ter no mínimo 10 caracteres.";
  else if (fullName.length > 0 && !fullNamePatternValid)
    fullNameError = "Informe um nome válido.";

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    await handleRegister(fullName, document, email, password, confirmPassword);
  };

  return (
    <AuthShell
      title="Crie sua conta"
      subtitle="7 dias grátis para comparar seus preços com o mercado."
      footer={
        <>
          Já tem conta?{" "}
          <Link href="/login" className="font-semibold text-brand hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <Field
          label="Nome completo"
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          maxLength={60}
          disabled={loading}
          error={fullNameError}
        />
        <Field
          label="CPF ou CNPJ"
          inputMode="numeric"
          value={document}
          onChange={(e) => setDocument(e.target.value.replace(/\D/g, ""))}
          disabled={loading}
          error={
            !docValid && document.length > 0 ? "Digite um CPF ou CNPJ válido." : null
          }
        />
        <Field
          label="E-mail"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          error={!emailValid && email.length > 0 ? "Insira um e-mail válido." : null}
        />
        <PasswordField
          label="Senha"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          hint={
            password.length > 0 && !isValidPassword ? (
              <PasswordRules rules={passwordRequirements} password={password} />
            ) : null
          }
        />
        <PasswordField
          label="Confirme a senha"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
          error={
            confirmPassword.length > 0 && !passwordsMatch
              ? "As senhas não coincidem."
              : null
          }
        />

        {error && <FormError>{error}</FormError>}

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className={buttonClass("primary", "md", "w-full")}
        >
          {loading ? "Criando conta…" : "Criar conta grátis"}
        </button>
      </form>
    </AuthShell>
  );
}
