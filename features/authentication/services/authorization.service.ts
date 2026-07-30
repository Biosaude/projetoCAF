import { redirect } from "next/navigation";
import { authenticationRepository } from "../config/auth.dependencies";
import { getRequestContext } from "./request-context.service";
import { getAuthenticatedUser } from "./session.service";
import { isAdministrator } from "./rbac.service";

export async function requireAdministrator() {
  const user = await getAuthenticatedUser();
  if (isAdministrator(user.roles)) return user;

  const context = await getRequestContext();
  await authenticationRepository.recordAccessDenied({
    userId: user.id,
    entity: "Route",
    entityId: "/usuarios",
    reason: "ROLE_REQUIRED",
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
    metadata: { requiredRole: "ADMIN" },
  });
  redirect("/dashboard");
}
