"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useRegister } from "@/hooks/useRegister";
import Image from "next/image";

interface PasswordRequirement {
  regex: RegExp;
  text: string;
}

interface UseRegisterReturn {
  handleRegister: (
    fullName: string,
    cpfCnpj: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  error: string | null;
  loading: boolean;
  passwordRequirements: PasswordRequirement[];
  validatePassword: (password: string) => boolean;
  checkPasswordsMatch: (password: string, confirmPassword: string) => boolean;
  validateDocument: (value: string) => boolean;
}

export default function Register() {
  const router = useRouter();

  const [fullName, setFullName] = useState<string>("");
  const [document, setDocument] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPasswordRules, setShowPasswordRules] = useState<boolean>(false);
  const [showConfirmError, setShowConfirmError] = useState<boolean>(false);

  const {
    handleRegister,
    error,
    loading,
    passwordRequirements,
    validatePassword,
    checkPasswordsMatch,
    validateDocument,
  } = useRegister() as UseRegisterReturn;

  const isValidPassword = validatePassword(password);
  const passwordsMatch = checkPasswordsMatch(password, confirmPassword);
  const docValid = validateDocument(document);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleRegister(fullName, document, email, password, confirmPassword);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-[var(--black-to-primary)]">
      <div className="bg-[var(--background-container)] w-full max-w-md p-8 flex flex-col items-center rounded-xl border-2 border-[var(--primary)]">
        <Image
          src="/searchprice-logo.png"
          alt="logo"
          className="w-auto h-auto mb-8"
          width={80}
          height={80}
          priority
        />
        <form onSubmit={onSubmit} className="w-full flex flex-col items-center">
          <div className="w-full max-w-sm flex flex-col gap-6">
            <input
              type="text"
              placeholder="Nome completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border border-[var(--border)] rounded-xl bg-[var(--background-input)] outline-none h-14 px-4 text-[var(--white-to-primary)] w-full focus:border-[var(--white-to-primary)]"
              disabled={loading}
            />

            <input
              type="text"
              placeholder="CPF ou CNPJ"
              value={document}
              onChange={(e) => setDocument(e.target.value.replace(/\D/g, ""))}
              className="border border-[var(--border)] rounded-xl bg-[var(--background-input)] outline-none h-14 px-4 text-[var(--white-to-primary)] w-full focus:border-[var(--white-to-primary)]"
              disabled={loading}
            />
            {!docValid && document.length > 0 && (
              <p className="text-[var(--danger)] text-xs ml-1">
                Digite um CPF ou CNPJ válido
              </p>
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-[var(--border)] rounded-xl bg-[var(--background-input)] outline-none h-14 px-4 text-[var(--white-to-primary)] w-full focus:border-[var(--white-to-primary)]"
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
                className="border border-[var(--border)] rounded-xl bg-[var(--background-input)] outline-none h-14 px-4 text-[var(--white-to-primary)] w-full focus:border-[var(--white-to-primary)]"
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
                onFocus={() => setShowConfirmError(true)}
                onBlur={() => {
                  if (passwordsMatch || !confirmPassword)
                    setShowConfirmError(false);
                }}
                className="border border-[var(--border)] rounded-xl bg-[var(--background-input)] outline-none h-14 px-4 text-[var(--white-to-primary)] w-full focus:border-[var(--white-to-primary)]"
                disabled={loading}
              />
              {showConfirmError && !passwordsMatch && (
                <p className="absolute text-[var(--danger)] text-sm mt-1">
                  As senhas não coincidem!
                </p>
              )}
            </div>
          </div>

          {error && (
            <p className="text-[var(--danger)] text-sm mt-4">{error}</p>
          )}

          <div className="w-full max-w-sm border-t border-[var(--border)] mt-8" />

          <button
            type="submit"
            className={`mt-8 h-14 w-full max-w-xs rounded-xl flex items-center justify-center text-white transition-all duration-200
              ${
                !isValidPassword || !passwordsMatch || !docValid || loading
                  ? "bg-[var(--primary)] hover:bg-[var(--secondary)] opacity-50 cursor-not-allowed"
                  : "bg-[var(--primary)] hover:bg-[var(--secondary)] hover:scale-105"
              }
            `}
            disabled={
              !isValidPassword || !passwordsMatch || !docValid || loading
            }
          >
            {loading ? "Registrando..." : "Registrar-se agora"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleBack}
          disabled={loading}
          className="mt-6 h-14 w-full max-w-xs rounded-xl  bg-[var(--danger)] hover:bg-[var(--danger-hover)] hover:scale-105 transition-all duration-200 text-white"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
