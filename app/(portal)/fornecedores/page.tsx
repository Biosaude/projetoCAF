import { ResourcePage } from "@/components/shared/resource-page";
export const metadata = { title: "Fornecedores" };
export default function Page() {
  return (
    <ResourcePage
      title="Fornecedores"
      description="Mantenha uma visão centralizada da rede de fornecedores homologados."
      singular="fornecedor"
    />
  );
}
