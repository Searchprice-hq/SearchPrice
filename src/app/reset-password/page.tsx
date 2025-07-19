import ResetPasswordForm from "./ResetPasswordForm";

type SearchParamsType = {
  email?: string | string[];
  token?: string | string[];
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsType>;
}) {
  const { email, token } = await searchParams;
  const initialEmail = Array.isArray(email) ? email[0] : email ?? "";
  const initialToken = Array.isArray(token) ? token[0] : token ?? "";

  return (
    <ResetPasswordForm
      initialEmail={initialEmail}
      initialToken={initialToken}
    />
  );
}
