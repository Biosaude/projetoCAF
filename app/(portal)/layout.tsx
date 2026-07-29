import { AppShell } from "@/components/layout/app-shell";
import { UserMenu } from "@/features/authentication/components/user-menu";
import { getAuthenticatedUser } from "@/features/authentication/services/session.service";
import type { ReactNode } from "react";
export default async function PortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getAuthenticatedUser();
  return <AppShell userMenu={<UserMenu user={user} />}>{children}</AppShell>;
}
