import Image from "next/image";
import { Eye, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/ui/badge";
import type { RoleKey } from "@/features/authentication/types/auth.types";
import type { UserSummary } from "../repositories/user.repository";
import { updateUserRole, updateUserStatus } from "../services/user.actions";

const roleLabels: Record<RoleKey, string> = {
  ADMIN: "Administrador",
  MANAGER: "Gestor",
  ANALYST: "Analista",
  VIEWER: "Visualizador",
};
const statusLabels = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  BLOCKED: "Bloqueado",
  PENDING: "Pendente",
} as const;
const formatDate = (date: Date | null) =>
  date
    ? new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(date)
    : "Nunca";

export function UsersAdminView({ users }: { users: UserSummary[] }) {
  return (
    <div className="space-y-7">
      <PageHeader
        title="Usuários"
        description="Administre acessos, perfis e status dos usuários autenticados pelo Google."
        showActions={false}
      />
      <div className="overflow-hidden rounded-xl border bg-white shadow-panel">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                {[
                  "Usuário",
                  "Perfil",
                  "Status",
                  "Último acesso",
                  "Criado em",
                  "Atualizado em",
                  "Ações",
                ].map((heading) => (
                  <th key={heading} className="h-12 px-4 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b last:border-0 hover:bg-slate-50/60"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt=""
                          width={36}
                          height={36}
                          className="size-9 rounded-full"
                        />
                      ) : (
                        <span className="grid size-9 place-items-center rounded-full bg-slate-100 font-semibold">
                          {user.name?.[0] ?? "U"}
                        </span>
                      )}
                      <div>
                        <p className="font-medium text-slate-900">
                          {user.name ?? "Sem nome"}
                        </p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <form action={updateUserRole} className="flex gap-2">
                      <input type="hidden" name="userId" value={user.id} />
                      <select
                        name="role"
                        defaultValue={user.roles[0] ?? "VIEWER"}
                        aria-label={`Perfil de ${user.name ?? user.email}`}
                        className="h-9 rounded-md border bg-white px-2 text-xs"
                      >
                        {Object.entries(roleLabels).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                      <button
                        className="rounded-md border px-2 text-slate-600 hover:bg-slate-100"
                        title="Salvar perfil"
                      >
                        <ShieldCheck className="size-4" />
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge
                      status={
                        user.status === "ACTIVE"
                          ? "success"
                          : user.status === "BLOCKED"
                            ? "error"
                            : "neutral"
                      }
                    >
                      {statusLabels[user.status]}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {formatDate(user.lastLoginAt)}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {formatDate(user.updatedAt)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <form action={updateUserStatus}>
                        <input type="hidden" name="userId" value={user.id} />
                        <input
                          type="hidden"
                          name="status"
                          value={
                            user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
                          }
                        />
                        <button className="rounded-md border px-3 py-2 text-xs font-semibold hover:bg-slate-50">
                          {user.status === "ACTIVE" ? "Inativar" : "Ativar"}
                        </button>
                      </form>
                      <a
                        href={`/auditoria?userId=${user.id}`}
                        className="grid size-9 place-items-center rounded-md border text-slate-600 hover:bg-slate-50"
                        title="Visualizar auditoria"
                      >
                        <Eye className="size-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 ? (
          <p className="p-12 text-center text-sm text-slate-500">
            Nenhum usuário cadastrado.
          </p>
        ) : null}
      </div>
    </div>
  );
}
