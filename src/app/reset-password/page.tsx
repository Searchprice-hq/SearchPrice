import ResetPassword from "./ResetPassword";

export const metadata = {
  title: "Recuperar Senha",
  description: "Recupere sua senha.",
};

type SearchParamsType = {
  email?: string | string[];
  token?: string | string[];
};

export default async function ResetPasswordPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<SearchParamsType>;
}>) {
  const sp = await searchParams;

  const email = Array.isArray(sp.email) ? sp.email[0] : sp.email ?? "";
  const token = Array.isArray(sp.token) ? sp.token[0] : sp.token ?? "";

  return <ResetPassword initialEmail={email} initialToken={token} />;
}
