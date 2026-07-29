import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/ui/badge";
import type { AuditRecord } from "../repositories/audit.repository";

const actionLabels = {
  LOGIN: "Login",
  LOGOUT: "Logout",
  FIRST_ACCESS: "Primeiro acesso",
  ROLE_CHANGED: "Perfil alterado",
  STATUS_CHANGED: "Status alterado",
  ACCESS_DENIED: "Acesso negado",
  ENTITY_CREATED: "Entidade criada",
  ENTITY_UPDATED: "Entidade alterada",
  ENTITY_DEACTIVATED: "Entidade desativada",
} as const;

export function AuditView({ records }: { records: AuditRecord[] }) {
  return (
    <div className="space-y-7">
      <PageHeader
        title="Auditoria"
        description="Consulte os eventos de autenticação, acesso e administração de usuários."
        showActions={false}
      />
      <div className="overflow-hidden rounded-xl border bg-white shadow-panel">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="h-12 px-5">Evento</th>
                <th className="px-5">Usuário</th>
                <th className="px-5">Entidade</th>
                <th className="px-5">IP</th>
                <th className="px-5">Data e hora</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b last:border-0">
                  <td className="px-5 py-4">
                    <StatusBadge
                      status={
                        record.action === "ACCESS_DENIED" ? "error" : "info"
                      }
                    >
                      {actionLabels[record.action]}
                    </StatusBadge>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium">
                      {record.user?.name ?? "Sistema"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {record.user?.email}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{record.entity}</td>
                  <td className="px-5 py-4 font-mono text-xs text-slate-500">
                    {record.ipAddress ?? "Não disponível"}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {new Intl.DateTimeFormat("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "medium",
                    }).format(record.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {records.length === 0 ? (
          <EmptyState
            title="Nenhum evento de auditoria"
            description="Os eventos de autenticação e administração aparecerão aqui."
            compact
          />
        ) : null}
      </div>
    </div>
  );
}
