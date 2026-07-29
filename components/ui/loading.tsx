import { LoaderCircle } from "lucide-react";
export function Loading({ label = "Carregando" }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex items-center gap-2 text-sm text-slate-500"
    >
      <LoaderCircle className="size-4 animate-spin" />
      {label}
      <span className="sr-only">...</span>
    </div>
  );
}
