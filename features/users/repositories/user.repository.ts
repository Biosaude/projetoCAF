import type {
  RoleKey,
  UserStatus,
} from "@/features/authentication/types/auth.types";

export interface UserSummary {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  status: UserStatus;
  roles: RoleKey[];
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRepository {
  findById(id: string): Promise<UserSummary | null>;
  list(): Promise<UserSummary[]>;
  updateStatusWithAudit(
    id: string,
    status: UserStatus,
    actorId: string,
  ): Promise<void>;
  replaceRoleWithAudit(
    id: string,
    role: RoleKey,
    actorId: string,
  ): Promise<void>;
}
