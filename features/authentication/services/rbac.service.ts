import type { RoleKey, UserStatus } from "../types/auth.types";

const roleWeight: Record<RoleKey, number> = {
  ADMIN: 4,
  MANAGER: 3,
  ANALYST: 2,
  VIEWER: 1,
};

export function hasRole(roles: readonly RoleKey[], requiredRole: RoleKey) {
  return roles.some((role) => roleWeight[role] >= roleWeight[requiredRole]);
}

export function isAdministrator(roles: readonly RoleKey[]) {
  return roles.includes("ADMIN");
}

export function canUserSignIn(status?: UserStatus) {
  return status === undefined || status === "ACTIVE";
}
