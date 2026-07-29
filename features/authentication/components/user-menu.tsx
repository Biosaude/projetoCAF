import Image from "next/image";
import Link from "next/link";
import { LogOut, Settings, UserRound } from "lucide-react";
import type { AuthenticatedUser } from "../types/auth.types";
import { logout } from "../services/auth.actions";

export function UserMenu({ user }: { user: AuthenticatedUser }) {
  const initials = (user.name ?? user.email)
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-3 rounded-lg p-1.5 hover:bg-slate-50">
        {user.image ? (
          <Image
            src={user.image}
            alt=""
            width={36}
            height={36}
            className="size-9 rounded-full object-cover"
          />
        ) : (
          <span className="grid size-9 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white">
            {initials}
          </span>
        )}
        <span className="hidden text-left sm:block">
          <span className="block max-w-40 truncate text-xs font-semibold text-slate-900">
            {user.name ?? "Usuário"}
          </span>
          <span className="block max-w-40 truncate text-[11px] text-slate-500">
            {user.email}
          </span>
        </span>
      </summary>
      <div className="absolute right-0 top-12 z-50 w-60 rounded-xl border bg-white p-2 shadow-xl">
        <div className="border-b px-3 py-2 sm:hidden">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="truncate text-xs text-slate-500">{user.email}</p>
        </div>
        <Link
          href="/meu-perfil"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          <UserRound className="size-4" />
          Meu Perfil
        </Link>
        <Link
          href="/configuracoes"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          <Settings className="size-4" />
          Configurações
        </Link>
        <form action={logout} className="mt-1 border-t pt-1">
          <button
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            type="submit"
          >
            <LogOut className="size-4" />
            Sair
          </button>
        </form>
      </div>
    </details>
  );
}
