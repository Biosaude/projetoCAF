import { notFound } from "next/navigation";
import { getAuthenticatedUser } from "@/features/authentication/services/session.service";
import { ProfileView } from "@/features/users/components/profile-view";
import { userRepository } from "@/features/users/config/user.dependencies";

export const metadata = { title: "Meu Perfil" };
export default async function ProfilePage() {
  const authenticatedUser = await getAuthenticatedUser();
  const user = await userRepository.findById(authenticatedUser.id);
  if (!user) notFound();
  return <ProfileView user={user} />;
}
