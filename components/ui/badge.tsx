import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Status = "neutral" | "success" | "error" | "info";
export function StatusBadge({
  status = "neutral",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { status?: Status }) {
  const styles = {
    neutral: "bg-slate-100 text-slate-700",
    success: "bg-emerald-50 text-emerald-700",
    error: "bg-red-50 text-red-700",
    info: "bg-blue-50 text-blue-700",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        styles[status],
        className,
      )}
      {...props}
    />
  );
}
