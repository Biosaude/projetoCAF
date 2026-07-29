"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { logger } from "@/services";
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Erro não tratado na interface", error, {
      digest: error.digest,
    });
  }, [error]);
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
      <div className="max-w-md rounded-xl border bg-white p-8 text-center shadow-panel">
        <p className="text-xs font-bold uppercase tracking-widest text-red-600">
          Falha inesperada
        </p>
        <h1 className="mt-3 text-xl font-semibold">
          Não foi possível concluir esta ação
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          A ocorrência foi registrada. Tente novamente ou contate o suporte se o
          problema persistir.
        </p>
        <Button className="mt-6" onClick={reset}>
          Tentar novamente
        </Button>
      </div>
    </main>
  );
}
