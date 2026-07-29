import { Download, Filter, Plus } from "lucide-react";
import { Breadcrumbs } from "./breadcrumbs";
import { Button } from "@/components/ui/button";
export function PageHeader({
  title,
  description,
  showActions = true,
}: {
  title: string;
  description: string;
  showActions?: boolean;
}) {
  return (
    <div className="space-y-5">
      <Breadcrumbs current={title} />
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {title}
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>
        {showActions ? (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              <Filter className="size-4" />
              Filtrar
            </Button>
            <Button variant="outline">
              <Download className="size-4" />
              Exportar
            </Button>
            <Button>
              <Plus className="size-4" />
              Novo
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
