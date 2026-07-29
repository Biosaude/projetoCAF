import {
  Activity,
  Building2,
  ClipboardCheck,
  PackageCheck,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
const metrics = [
  {
    label: "Solicitações abertas",
    value: "0",
    helper: "Nenhuma solicitação pendente",
    icon: ClipboardCheck,
  },
  {
    label: "Materiais cadastrados",
    value: "0",
    helper: "Catálogo pronto para iniciar",
    icon: PackageCheck,
  },
  {
    label: "Hospitais ativos",
    value: "0",
    helper: "Nenhuma instituição ativa",
    icon: Building2,
  },
  {
    label: "Taxa de conclusão",
    value: "0%",
    helper: "Sem dados no período",
    icon: TrendingUp,
  },
];
export function DashboardView() {
  return (
    <div className="space-y-7">
      <PageHeader
        title="Dashboard"
        description="Acompanhe os principais indicadores e a atividade operacional em um único lugar."
        showActions={false}
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, helper, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                    {value}
                  </p>
                </div>
                <div className="grid size-10 place-items-center rounded-lg bg-blue-50 text-primary">
                  <Icon className="size-5" />
                </div>
              </div>
              <p className="mt-4 border-t pt-3 text-xs text-slate-400">
                {helper}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
      <section className="grid gap-4 xl:grid-cols-[1.65fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Visão operacional</CardTitle>
            <p className="text-sm text-slate-500">
              Evolução das solicitações nos últimos 30 dias
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed bg-slate-50/50">
              <Activity className="mb-3 size-8 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">
                Aguardando dados operacionais
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Os indicadores serão exibidos quando houver movimentações.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Atividade recente</CardTitle>
            <p className="text-sm text-slate-500">
              Últimas movimentações registradas
            </p>
          </CardHeader>
          <CardContent>
            <div className="min-h-72">
              <div className="flex h-52 flex-col items-center justify-center text-center">
                <div className="mb-3 size-2 rounded-full bg-slate-200" />
                <p className="text-sm font-medium text-slate-600">
                  Nenhuma atividade
                </p>
                <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
                  Eventos importantes e alterações recentes aparecerão nesta
                  área.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
