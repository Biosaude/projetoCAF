"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";
import { PageHeader } from "@/components/shared/page-header";
type EmptyRow = { name: string; status: string; updatedAt: string };
const columns: ColumnDef<EmptyRow>[] = [
  { accessorKey: "name", header: "Nome" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "updatedAt", header: "Atualizado em" },
];
export function ResourcePage({
  title,
  description,
  singular,
}: {
  title: string;
  description: string;
  singular: string;
}) {
  return (
    <div className="space-y-7">
      <PageHeader title={title} description={description} />
      <DataTable
        columns={columns}
        data={[]}
        emptyTitle={`Nenhum ${singular} encontrado`}
        emptyDescription={`Ainda não há registros nesta área. Use o botão “Novo” para cadastrar o primeiro ${singular}.`}
      />
    </div>
  );
}
