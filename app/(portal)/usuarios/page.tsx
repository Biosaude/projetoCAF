import { requireAdministrator } from "@/features/authentication/services/authorization.service";
import { UsersAdminView } from "@/features/users/components/users-admin-view";
import { userAdminService } from "@/features/users/config/user.dependencies";

export const metadata = { title: "Usuários" };
export default async function UsersPage() {
  await requireAdministrator();
  return <UsersAdminView users={await userAdminService.listUsers()} />;
}
