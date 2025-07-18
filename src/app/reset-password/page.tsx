import ResetPasswordForm from "./ResetPasswordForm";

type SearchParamsType = {
  email?: string | string[];
  token?: string | string[];
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  // aqui declaramos explicitamente como Promise<…>
  searchParams: Promise<SearchParamsType>;
}) {
  // aguardamos a resolução da Promise
  const { email, token } = await searchParams;

  // garantimos que tenhamos strings simples
  const initialEmail = Array.isArray(email) ? email[0] : email ?? "";
  const initialToken = Array.isArray(token) ? token[0] : token ?? "";

  return (
    <ResetPasswordForm
      initialEmail={initialEmail}
      initialToken={initialToken}
    />
  );
}
