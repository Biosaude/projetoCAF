import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getRequestContext } from "./request-context.service";
import { getAuthenticatedUser } from "./session.service";
import { isAdministrator } from "./rbac.service";

export async function requireAdministrator() {
  const user = await getAuthenticatedUser();
  if (isAdministrator(user.roles)) return user;

  const context = await getRequestContext();
  await prisma.auditLog.create({
    data: {
      action: "ACCESS_DENIED",
      entity: "Route",
      entityId: "/usuarios",
      userId: user.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      metadata: { requiredRole: "ADMIN" },
    },
  });
  redirect("/dashboard");
}
