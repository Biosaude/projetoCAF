import Image from "next/image";
import {
  CalendarDays,
  Clock,
  Mail,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import type { UserSummary } from "../repositories/user.repository";

const roleNames: Record<string, string> = {
  ADMIN: "Administrador",
  MANAGER: "Gestor",
  ANALYST: "Analista",
  VIEWER: "Visualizador",
};
const statusNames = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  BLOCKED: "Bloqueado",
  PENDING: "Pendente",
} as const;
const date = (value: Date | null) =>
  value
    ? new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "long",
        timeStyle: "short",
      }).format(value)
    : "Nunca";

export function ProfileView({ user }: { user: UserSummary }) {
  const details = [
    { icon: Mail, label: "Email", value: user.email },
    {
      icon: ShieldCheck,
      label: "Perfil",
      value:
        user.roles.map((role) => roleNames[role]).join(", ") || "Sem perfil",
    },
    { icon: Clock, label: "Último acesso", value: date(user.lastLoginAt) },
    {
      icon: CalendarDays,
      label: "Conta criada em",
      value: date(user.createdAt),
    },
  ];
  return (
    <div className="space-y-7">
      <PageHeader
        title="Meu Perfil"
        description="Consulte seus dados de identificação e acesso ao sistema."
        showActions={false}
      />
      <Card className="overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-slate-950 to-blue-900" />
        <CardContent className="px-6 pb-8 sm:px-10">
          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end">
            {user.image ? (
              <Image
                src={user.image}
                alt=""
                width={96}
                height={96}
                className="size-24 rounded-2xl border-4 border-white object-cover shadow-md"
              />
            ) : (
              <span className="grid size-24 place-items-center rounded-2xl border-4 border-white bg-slate-100 shadow-md">
                <UserRoundCheck className="size-9 text-slate-500" />
              </span>
            )}
            <div className="pb-1">
              <h2 className="text-xl font-bold text-slate-950">
                {user.name ?? "Usuário"}
              </h2>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
            <StatusBadge
              className="sm:mb-2 sm:ml-auto"
              status={user.status === "ACTIVE" ? "success" : "neutral"}
            >
              {statusNames[user.status]}
            </StatusBadge>
          </div>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-lg border bg-slate-50/60 p-4">
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <Icon className="size-4 text-blue-600" />
                  {label}
                </dt>
                <dd className="mt-2 text-sm font-medium text-slate-900">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
