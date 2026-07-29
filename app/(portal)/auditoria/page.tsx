import { ResourcePage } from "@/components/shared/resource-page";
export const metadata = { title: "Auditoria" };
export default function Page() {
  return (
    <ResourcePage
      title="Auditoria"
      description="Consulte o histórico de eventos e alterações realizadas na plataforma."
      singular="evento de auditoria"
    />
  );
}
