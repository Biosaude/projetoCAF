import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
export function EmptyState({
  title = "Nenhum registro encontrado",
  description = "Os registros criados aparecerão aqui.",
  compact = false,
}: {
  title?: string;
  description?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 text-center",
        compact ? "min-h-72 py-12" : "min-h-96 py-16",
      )}
    >
      <div className="mb-4 grid size-14 place-items-center rounded-2xl border border-blue-100 bg-blue-50 text-primary">
        <Inbox className="size-6" />
      </div>
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}
