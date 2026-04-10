import { LoginForm } from "./LoginForm";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const fromRaw = searchParams.from;
  const from = typeof fromRaw === "string" ? fromRaw : "/admin";
  return <LoginForm redirectTo={from.startsWith("/admin") ? from : "/admin"} />;
}
