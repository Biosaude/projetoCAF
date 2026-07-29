import { requireAdministrator } from "@/features/authentication/services/authorization.service";
import { UsersAdminView } from "@/features/users/components/users-admin-view";
import { PrismaUserRepository } from "@/features/users/repositories/prisma-user.repository";
import { UserAdminService } from "@/features/users/services/user-admin.service";
import { prisma } from "@/lib/db/prisma";

export const metadata = { title: "Usuários" };
export default async function UsersPage() {
  await requireAdministrator();
  const service = new UserAdminService(new PrismaUserRepository(prisma));
  return <UsersAdminView users={await service.listUsers()} />;
}
