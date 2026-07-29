import { ResourcePage } from "@/components/shared/resource-page";
export const metadata = { title: "Usuários" };
export default function Page() {
  return (
    <ResourcePage
      title="Usuários"
      description="Administre acessos, funções e permissões dos usuários da plataforma."
      singular="usuário"
    />
  );
}
