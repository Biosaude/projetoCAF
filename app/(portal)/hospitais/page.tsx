import { ResourcePage } from "@/components/shared/resource-page";
export const metadata = { title: "Hospitais" };
export default function Page() {
  return (
    <ResourcePage
      title="Hospitais"
      description="Centralize o cadastro das instituições hospitalares atendidas."
      singular="hospital"
    />
  );
}
