import { ResourcePage } from "@/components/shared/resource-page";
export const metadata = { title: "Materiais" };
export default function Page() {
  return (
    <ResourcePage
      title="Materiais"
      description="Organize o catálogo corporativo de materiais e suas informações essenciais."
      singular="material"
    />
  );
}
