import { ResourcePage } from "@/components/shared/resource-page";
export const metadata = { title: "Configurações" };
export default function Page() {
  return (
    <ResourcePage
      title="Configurações"
      description="Gerencie as preferências gerais e os parâmetros da plataforma."
      singular="parâmetro"
    />
  );
}
