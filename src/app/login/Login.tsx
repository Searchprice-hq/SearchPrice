"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/useLogin";
import AuthShell from "@/components/site/AuthShell";
import { Field, FormError, PasswordField } from "@/components/ui/Field";
import { buttonClass } from "@/components/ui/button";

// Usuário fixo da API (searchprice-master-api/app/utils/test_users.ts)
const TEST_USER = { email: "user-test@searchprice.com", password: "UserTest@123" };

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotStatus, setForgotStatus] = useState<string | null>(null);

  const { handleLogin, handleForgotPassword, error, loading } = useLogin();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleLogin(email, password);
  };

  const onTestLogin = async () => {
    setEmail(TEST_USER.email);
    setPassword(TEST_USER.password);
    await handleLogin(TEST_USER.email, TEST_USER.password);
  };

  const onForgotPassword = async () => {
    if (!email) {
      setForgotStatus("Informe seu e-mail primeiro.");
      return;
    }

    const msg = await handleForgotPassword(email);
    setForgotStatus(msg);
    router.push(`/reset-password?email=${encodeURIComponent(email)}`);
  };

  return (
    <AuthShell
      title="Entrar na sua conta"
      subtitle="Bem-vindo de volta. Veja como seus preços estão hoje."
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link href="/register" className="font-semibold text-brand hover:underline">
            Cadastre-se grátis
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <Field
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="voce@empresa.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <div className="space-y-2">
          <PasswordField
            label="Senha"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onForgotPassword}
              disabled={loading}
              className="text-sm font-medium text-brand hover:underline"
            >
              Esqueceu sua senha?
            </button>
          </div>
          {forgotStatus && <p className="text-sm text-muted">{forgotStatus}</p>}
        </div>

        {error && <FormError>{error}</FormError>}

        <button
          type="submit"
          disabled={loading}
          className={buttonClass("primary", "md", "w-full")}
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>

        <button
          type="button"
          onClick={onTestLogin}
          disabled={loading}
          className={buttonClass("secondary", "md", "w-full")}
        >
          Entrar com usuário de teste
        </button>
      </form>
    </AuthShell>
  );
}
