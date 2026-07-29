import { ResourcePage } from "@/components/shared/resource-page";
export const metadata = { title: "Solicitações" };
export default function Page() {
  return (
    <ResourcePage
      title="Solicitações"
      description="Gerencie e acompanhe as solicitações de cotação cadastradas."
      singular="solicitação"
    />
  );
}
