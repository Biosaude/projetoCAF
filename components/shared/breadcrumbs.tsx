import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
export function Breadcrumbs({ current }: { current: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-xs font-medium text-slate-500"
    >
      <Link href="/dashboard" className="hover:text-primary">
        <Home className="size-3.5" />
        <span className="sr-only">Início</span>
      </Link>
      <ChevronRight className="size-3.5 text-slate-300" />
      <span className="text-slate-700">{current}</span>
    </nav>
  );
}
