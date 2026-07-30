import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { authenticationRepository } from "../config/auth.dependencies";
import type { AuthenticatedUser } from "../types/auth.types";

export async function getAuthenticatedUser(): Promise<AuthenticatedUser> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await authenticationRepository.findAuthenticatedUser(
    session.user.id,
  );

  if (!user || user.status !== "ACTIVE") {
    await signOut({ redirectTo: "/login" });
    redirect("/login");
  }

  return user;
}
