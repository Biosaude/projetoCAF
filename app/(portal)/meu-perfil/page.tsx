import { notFound } from "next/navigation";
import { getAuthenticatedUser } from "@/features/authentication/services/session.service";
import { ProfileView } from "@/features/users/components/profile-view";
import { PrismaUserRepository } from "@/features/users/repositories/prisma-user.repository";
import { prisma } from "@/lib/db/prisma";

export const metadata = { title: "Meu Perfil" };
export default async function ProfilePage() {
  const authenticatedUser = await getAuthenticatedUser();
  const user = await new PrismaUserRepository(prisma).findById(
    authenticatedUser.id,
  );
  if (!user) notFound();
  return <ProfileView user={user} />;
}
