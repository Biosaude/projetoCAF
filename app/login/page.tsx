import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginCard } from "@/features/authentication/components/login-card";

export const metadata = { title: "Entrar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await auth()) redirect("/dashboard");
  const { error } = await searchParams;
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-950 p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,.12),transparent_30%)]" />
      <div className="relative z-10 flex w-full justify-center">
        <LoginCard error={error} />
      </div>
    </main>
  );
}
