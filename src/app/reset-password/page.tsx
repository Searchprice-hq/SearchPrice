"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useResetPassword } from "@/hooks/useResetPassword";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";
  const initialToken = searchParams.get("token") ?? "";

  const [email, setEmail] = useState<string>(initialEmail);
  const [token, setToken] = useState<string>(initialToken);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirm] = useState<string>("");

  const { handleReset, error, loading } = useResetPassword();

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
    if (initialToken) setToken(initialToken);
  }, [initialEmail, initialToken]);

  const isFormValid =
    email.trim() !== "" &&
    token.trim() !== "" &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "";

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleReset(email, token, password, confirmPassword);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[var(--black-to-primary)] p-4">
      <div className="bg-[var(--background-container-color)] p-8 w-full max-w-md rounded-xl border-2 border-[var(--primary-color)]">
        <h1 className="text-2xl font-semibold text-center mb-4 text-[var(--white-to-primary)]">
          Redefinir Senha
        </h1>
        <p className="text-center text-sm mb-6 text-[var(--white-to-primary)]">
          Informe seu e‑mail, o código recebido por e‑mail e a nova senha.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full h-12 px-4 rounded-xl bg-[var(--background-input-color)] border border-[var(--border-color)] text-[var(--white-to-primary)] outline-none"
          />
          <input
            type="text"
            placeholder="Código de redefinição"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            disabled={loading}
            className="w-full h-12 px-4 rounded-xl bg-[var(--background-input-color)] border border-[var(--border-color)] text-[var(--white-to-primary)] outline-none"
          />
          <input
            type="password"
            placeholder="Nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full h-12 px-4 rounded-xl bg-[var(--background-input-color)] border border-[var(--border-color)] text-[var(--white-to-primary)] outline-none"
          />
          <input
            type="password"
            placeholder="Confirme a nova senha"
            value={confirmPassword}
            onChange={(e) => setConfirm(e.target.value)}
            required
            disabled={loading}
            className="w-full h-12 px-4 rounded-xl bg-[var(--background-input-color)] border border-[var(--border-color)] text-[var(--white-to-primary)] outline-none"
          />

          {error && <p className="text-[var(--danger)] text-sm">{error}</p>}

          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full h-12 mt-2 text-white rounded-xl transition ${
              isFormValid && !loading
                ? "bg-[var(--primary-color)] hover:bg-[var(--secundary-color)]"
                : "bg-[var(--primary-color)] opacity-50 cursor-not-allowed"
            }`}
          >
            {loading ? "Redefinindo..." : "Redefinir Senha"}
          </button>
        </form>
      </div>
    </div>
  );
}
