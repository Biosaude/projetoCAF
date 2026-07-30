import type {
  AuthenticatedUser,
  RoleKey,
  UserStatus,
} from "../types/auth.types";

export interface AccessProfile {
  status: UserStatus;
  roles: RoleKey[];
}

export interface LoginAuditInput {
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  browser?: string;
  operatingSystem?: string;
  provider?: string;
}

export interface AccessDeniedAuditInput {
  userId: string;
  entity: string;
  entityId?: string;
  reason: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, string>;
}

export interface AuthenticationRepository {
  findAuthenticatedUser(userId: string): Promise<AuthenticatedUser | null>;
  findAccessProfile(userId: string): Promise<AccessProfile | null>;
  recordLogin(input: LoginAuditInput): Promise<void>;
  recordLogout(
    userId: string,
    context: Pick<LoginAuditInput, "ipAddress" | "userAgent">,
  ): Promise<void>;
  recordAccessDenied(input: AccessDeniedAuditInput): Promise<void>;
}
