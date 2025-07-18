"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useResetPassword } from "@/hooks/useResetPassword";

interface Props {
  initialEmail: string;
  initialToken: string;
}

export default function ResetPasswordForm({
  initialEmail,
  initialToken,
}: Props) {
  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { handleReset, error, loading } = useResetPassword();

  useEffect(() => {
    setEmail(initialEmail);
    setToken(initialToken);
  }, [initialEmail, initialToken]);

  const isFormValid =
    email.trim() !== "" &&
    token.trim() !== "" &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "";

  const onSubmit = async (e: FormEvent) => {
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
            onChange={(e) => setConfirmPassword(e.target.value)}
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
                ? "bg-[var(--primary-color)] hover:bg-[var(--secondary-color)]"
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
