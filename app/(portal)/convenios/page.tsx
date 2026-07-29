import { ResourcePage } from "@/components/shared/resource-page";
export const metadata = { title: "Convênios" };
export default function Page() {
  return (
    <ResourcePage
      title="Convênios"
      description="Administre as operadoras e os convênios relacionados às solicitações."
      singular="convênio"
    />
  );
}
