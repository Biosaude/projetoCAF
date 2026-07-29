import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import type { AuthenticatedUser, RoleKey } from "../types/auth.types";

export async function getAuthenticatedUser(): Promise<AuthenticatedUser> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      status: true,
      roles: { select: { role: { select: { key: true } } } },
    },
  });

  if (!user || user.status !== "ACTIVE") {
    await signOut({ redirectTo: "/login" });
    redirect("/login");
  }

  return {
    ...user,
    roles: user.roles.map(({ role }) => role.key as RoleKey),
  };
}
