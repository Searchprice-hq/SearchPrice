"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/useLogin";
import Image from "next/image";

interface UseLoginReturn {
  handleLogin: (email: string, password: string) => Promise<void>;
  handleForgotPassword: (email: string) => Promise<string>;
  error: string | null;
  loading: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [forgotStatus, setForgotStatus] = useState<string | null>(null);

  const { handleLogin, handleForgotPassword, error, loading } =
    useLogin() as UseLoginReturn;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleLogin(email, password);
  };

  const onForgotPassword = async () => {
    if (!email) {
      setForgotStatus("Informe seu e‑mail primeiro.");
      return;
    }

    const msg = await handleForgotPassword(email);
    setForgotStatus(msg);
    router.push(`/reset-password?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-[var(--black-to-primary)]">
      <div className="bg-[var(--background-container)] w-full max-w-md p-8 flex flex-col items-center rounded-xl border-2 border-[var(--primary)]">
        <Image
          src="/searchprice-logo.png"
          alt="SearchPrice Logo"
          width={90}
          height={90}
          className="mb-8 w-auto h-auto"
        />

        <form
          onSubmit={onSubmit}
          className="w-full flex flex-col items-center space-y-4"
        >
          <div className="w-full max-w-sm flex flex-col gap-6">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="border border-[var(--border)] rounded-xl bg-[var(--background-input)] h-14 px-4 text-[var(--white-to-primary)] w-full outline-none focus:border-[var(--white-to-primary)]"
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="border border-[var(--border)] rounded-xl bg-[var(--background-input)] h-14 px-4 text-[var(--white-to-primary)] w-full outline-none focus:border-[var(--white-to-primary)]"
            />
          </div>

          {error && (
            <p className="self-start text-[var(--danger)] text-sm ml-1">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={onForgotPassword}
            disabled={loading}
            className="self-end text-xs text-[var(--secondary-to-primary)] hover:text-[var(--third)]"
          >
            Esqueceu sua senha?
          </button>
          {forgotStatus && (
            <p className="mt-1 text-xs text-[var(--white-to-primary)]">
              {forgotStatus}
            </p>
          )}

          <div className="w-full max-w-sm flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-[var(--fifth)] hover:bg-[var(--secondary)] hover:scale-105 transition-transform duration-200 text-white h-14 px-6 rounded-xl disabled:opacity-50"
            >
              Entrar
            </button>
          </div>
        </form>

        <div className="w-full max-w-sm border-t border-[var(--border)] mt-8" />

        <div className="w-full max-w-sm flex flex-col items-center gap-4 mt-8">
          <button
            type="button"
            onClick={() => router.push("/register")}
            disabled={loading}
            className="w-full bg-[var(--primary)] hover:bg-[var(--secondary)] hover:scale-105 transition-all duration-200 text-white h-14 rounded-xl disabled:opacity-50"
          >
            Cadastre-se agora
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            disabled={loading}
            className="w-full bg-[var(--danger)] hover:bg-[var(--danger-hover)] hover:scale-105 transition-all duration-200 text-white h-14 rounded-xl  disabled:opacity-50"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
