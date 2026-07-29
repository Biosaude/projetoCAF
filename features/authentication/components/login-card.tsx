import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { loginWithGoogle } from "../services/auth.actions";

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M21.6 12.2c0-.7-.1-1.5-.2-2.2H12v4.3h5.4a4.6 4.6 0 0 1-2 3v2.8h3.5c2-1.9 3.2-4.6 3.2-7.9Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.9 0 5.3-1 7-2.6l-3.5-2.8c-1 .7-2.1 1-3.5 1a6.1 6.1 0 0 1-5.8-4.2H2.6v2.9A10.6 10.6 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.2 13.4a6.4 6.4 0 0 1 0-4V6.5H2.6a10.1 10.1 0 0 0 0 9.8l3.6-2.9Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.1c1.6 0 3 .6 4.1 1.6l3.1-3A10.4 10.4 0 0 0 2.6 6.4l3.6 2.9A6.1 6.1 0 0 1 12 5.1Z"
      />
    </svg>
  );
}

export function LoginCard({ error }: { error?: string }) {
  return (
    <Card className="w-full max-w-md border-slate-200/80 shadow-xl shadow-slate-900/10">
      <CardContent className="p-8 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="grid size-14 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <Building2 className="size-7" />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-blue-600">
            CAF Gestão
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
            Bem-vindo
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Acesse a Central Administrativa com sua conta corporativa Google.
          </p>
        </div>
        {error ? (
          <p
            role="alert"
            className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-700"
          >
            Não foi possível autenticar. Tente novamente.
          </p>
        ) : null}
        <form action={loginWithGoogle}>
          <Button
            type="submit"
            variant="outline"
            className="mt-8 h-12 w-full border-slate-300 bg-white text-slate-800 shadow-sm hover:bg-slate-50"
          >
            <GoogleIcon /> Entrar com Google
          </Button>
        </form>
        <p className="mt-6 text-center text-xs leading-5 text-slate-400">
          Ao continuar, você será redirecionado com segurança para o Google.
        </p>
      </CardContent>
    </Card>
  );
}
