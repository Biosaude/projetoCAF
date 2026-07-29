export const ROLE_KEYS = ["ADMIN", "MANAGER", "ANALYST", "VIEWER"] as const;
export type RoleKey = (typeof ROLE_KEYS)[number];

export const USER_STATUSES = [
  "ACTIVE",
  "INACTIVE",
  "BLOCKED",
  "PENDING",
] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export interface AuthenticatedUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  status: UserStatus;
  roles: RoleKey[];
}
