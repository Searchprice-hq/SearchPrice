"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useResetPassword } from "@/hooks/useResetPassword";
import { useRegister } from "@/hooks/useRegister";
import type {
  PasswordRequirement,
  UseRegisterReturn,
} from "@/hooks/useRegister";
import Image from "next/image";
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
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [showConfirmError, setShowConfirmError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { handleReset, error, loading } = useResetPassword();
  const { passwordRequirements, validatePassword, checkPasswordsMatch } =
    useRegister() as UseRegisterReturn;

  const isValidPassword = validatePassword(password);
  const passwordsMatch = checkPasswordsMatch(password, confirmPassword);

  useEffect(() => {
    setEmail(initialEmail);
    setToken(initialToken);
  }, [initialEmail, initialToken]);

  const isFormValid =
    email.trim() !== "" &&
    token.trim() !== "" &&
    isValidPassword &&
    passwordsMatch;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await handleReset(email, token, password, confirmPassword);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[var(--black-to-primary)] p-4">
      <div className="bg-[var(--background-container)] p-8 w-full max-w-md rounded-xl border-2 border-[var(--primary)]">
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
            className="w-full h-12 px-4 rounded-xl bg-[var(--background-input)] border border-[var(--border)] text-[var(--white-to-primary)] outline-none"
          />
          <input
            type="text"
            placeholder="Código de redefinição"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            disabled={loading}
            className="w-full h-12 px-4 rounded-xl bg-[var(--background-input)] border border-[var(--border)] text-[var(--white-to-primary)] outline-none"
          />
          <div className="space-y-1">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setShowPasswordRules(true)}
                onBlur={() => {
                  if (!password || isValidPassword) setShowPasswordRules(false);
                }}
                required
                disabled={loading}
                className="w-full h-12 px-4 pr-12 rounded-xl bg-[var(--background-input)] border border-[var(--border)] text-[var(--white-to-primary)] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Image
                  src={showPassword ? "/eye-opened.png" : "/eye-closed.png"}
                  alt={showPassword ? "Esconder senha" : "Mostrar senha"}
                  width={20}
                  height={20}
                  className="opacity-80 hover:opacity-100 transition"
                />
              </button>
            </div>

            {/* Agora abaixo do input */}
            {showPasswordRules && !isValidPassword && (
              <ul className="pl-4 text-sm text-[var(--danger)] space-y-1">
                {passwordRequirements.map(
                  (req: PasswordRequirement, idx: number) => {
                    const ok = req.regex.test(password);
                    return (
                      <li
                        key={idx}
                        className={
                          ok ? "text-[var(--green-400)] line-through" : ""
                        }
                      >
                        {req.text}
                      </li>
                    );
                  }
                )}
              </ul>
            )}
          </div>
          <div className="space-y-1">
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirme a nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setShowConfirmError(true)}
                onBlur={() => {
                  if (passwordsMatch || !confirmPassword)
                    setShowConfirmError(false);
                }}
                required
                disabled={loading}
                className="w-full h-12 px-4 pr-12 rounded-xl bg-[var(--background-input)] border border-[var(--border)] text-[var(--white-to-primary)] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Image
                  src={
                    showConfirmPassword ? "/eye-opened.png" : "/eye-closed.png"
                  }
                  alt={showConfirmPassword ? "Esconder senha" : "Mostrar senha"}
                  width={20}
                  height={20}
                  className="opacity-80 hover:opacity-100 transition"
                />
              </button>
            </div>

            {showConfirmError && !passwordsMatch && (
              <p className="text-[var(--danger)] text-sm mt-1">
                As senhas não coincidem!
              </p>
            )}
          </div>
          {error && <p className="text-[var(--danger)] text-sm">{error}</p>}

          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full h-12 mt-2 text-white rounded-xl transition ${
              isFormValid && !loading
                ? "bg-[var(--primary)] hover:bg-[var(--secondary)]"
                : "bg-[var(--primary)] opacity-50 cursor-not-allowed"
            }`}
          >
            {loading ? "Redefinindo..." : "Redefinir Senha"}
          </button>
        </form>
      </div>
    </div>
  );
}
