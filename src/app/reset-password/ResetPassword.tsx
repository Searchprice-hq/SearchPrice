"use client";

import React, { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useResetPassword } from "@/hooks/useResetPassword";
import { useRegister } from "@/hooks/useRegister";
import AuthShell from "@/components/site/AuthShell";
import {
  Field,
  FormError,
  PasswordField,
  PasswordRules,
} from "@/components/ui/Field";
import { buttonClass } from "@/components/ui/button";

type Props = { initialEmail: string; initialToken: string };

export default function ResetPassword({
  initialEmail,
  initialToken,
}: Readonly<Props>) {
  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { handleReset, error, loading } = useResetPassword();
  const { passwordRequirements, validatePassword, checkPasswordsMatch } =
    useRegister();

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
    <AuthShell
      title="Redefinir senha"
      subtitle="Informe o código que enviamos para o seu e-mail e escolha uma nova senha."
      footer={
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Voltar para o login
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <Field
          label="E-mail"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <Field
          label="Código de verificação"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="000000"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          disabled={loading}
          className="tracking-[0.3em]"
        />
        <PasswordField
          label="Nova senha"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          hint={
            password.length > 0 && !isValidPassword ? (
              <PasswordRules rules={passwordRequirements} password={password} />
            ) : null
          }
        />
        <PasswordField
          label="Confirme a nova senha"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
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
          disabled={!isFormValid || loading}
          className={buttonClass("primary", "md", "w-full")}
        >
          {loading ? "Redefinindo…" : "Redefinir senha"}
        </button>
      </form>
    </AuthShell>
  );
}
