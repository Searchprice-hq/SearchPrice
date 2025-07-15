"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useRegister } from "@/hooks/useRegister";

interface PasswordRequirement {
  regex: RegExp;
  text: string;
}

interface UseRegisterReturn {
  handleRegister: (
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  error: string | null;
  loading: boolean;
  passwordRequirements: PasswordRequirement[];
  validatePassword: (password: string) => boolean;
  checkPasswordsMatch: (password: string, confirmPassword: string) => boolean;
}

export default function Register() {
  const router = useRouter();

  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPasswordRules, setShowPasswordRules] = useState<boolean>(false);
  const [showConfirmPasswordError, setShowConfirmPasswordError] =
    useState<boolean>(false);

  const {
    handleRegister,
    error,
    loading,
    passwordRequirements,
    validatePassword,
    checkPasswordsMatch,
  } = useRegister() as UseRegisterReturn;

  const isValidPassword = validatePassword(password);
  const passwordsMatch = checkPasswordsMatch(password, confirmPassword);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleRegister(fullName, email, password, confirmPassword);
    // se quiser navegar após cadastro, descomente abaixo:
    // router.push('/login')
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-[var(--black-to-primary)]">
      <div className="bg-[var(--background-container-color)] w-full max-w-md p-8 flex flex-col items-center rounded-xl border-2 border-[var(--primary-color)]">
        <img
          src="/searchpriceLogo.png"
          alt="logo"
          className="mb-8 w-1/5 max-w-xs h-auto"
        />
        <form onSubmit={onSubmit} className="w-full flex flex-col items-center">
          <div className="w-full max-w-sm flex flex-col gap-6">
            <input
              type="text"
              placeholder="Nome completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border border-[var(--border-color)] rounded-xl bg-[var(--background-input-color)] outline-none h-14 px-4 text-[var(--white-to-primary)] w-full focus:border-[var(--white-to-primary)]"
              disabled={loading}
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-[var(--border-color)] rounded-xl bg-[var(--background-input-color)] outline-none h-14 px-4 text-[var(--white-to-primary)] w-full focus:border-[var(--white-to-primary)]"
              disabled={loading}
            />

            <div className="relative">
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setShowPasswordRules(true)}
                onBlur={() => {
                  if (!password || isValidPassword) setShowPasswordRules(false);
                }}
                className="border border-[var(--border-color)] rounded-xl bg-[var(--background-input-color)] outline-none h-14 px-4 text-[var(--white-to-primary)] w-full focus:border-[var(--white-to-primary)]"
                disabled={loading}
              />
              {showPasswordRules && !isValidPassword && (
                <ul className="mt-2 pl-4 text-sm text-[var(--danger)] space-y-1">
                  {passwordRequirements.map((req, idx) => {
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
                  })}
                </ul>
              )}
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setShowConfirmPasswordError(true)}
                onBlur={() => {
                  if (passwordsMatch || !confirmPassword)
                    setShowConfirmPasswordError(false);
                }}
                className="border border-[var(--border-color)] rounded-xl bg-[var(--background-input-color)] outline-none h-14 px-4 text-[var(--white-to-primary)] w-full focus:border-[var(--white-to-primary)]"
                disabled={loading}
              />
              {showConfirmPasswordError && !passwordsMatch && (
                <p className="absolute text-[var(--danger)] text-sm mt-1">
                  As senhas não coincidem!
                </p>
              )}
            </div>
          </div>

          {error && (
            <p className="text-[var(--danger)] text-sm mt-4">{error}</p>
          )}

          <div className="w-full max-w-sm border-t border-[var(--border-color)] mt-8" />

          <button
            type="submit"
            className={`
              mt-8 h-14 w-full max-w-xs rounded-xl border 
              ${
                !isValidPassword || !passwordsMatch || loading
                  ? "bg-[var(--green-300)] border-[var(--green-400)] opacity-50 cursor-not-allowed"
                  : "bg-[var(--green-400)] border-[var(--green-400)] hover:bg-[var(--green-200)] hover:scale-105"
              }
              text-white transition-all duration-200
            `}
            disabled={!isValidPassword || !passwordsMatch || loading}
          >
            {loading ? "Registrando..." : "Registrar-se agora"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => router.push("/login")}
          disabled={loading}
          className="mt-6 h-14 w-full max-w-xs rounded-xl border bg-[var(--danger)] hover:bg-[var(--danger-hover)] hover:scale-105 transition-all duration-200 text-white"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
