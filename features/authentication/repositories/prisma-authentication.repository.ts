import type { PrismaClient } from "@prisma/client";
import type { RoleKey, UserStatus } from "../types/auth.types";
import type {
  AccessDeniedAuditInput,
  AuthenticationRepository,
  LoginAuditInput,
} from "./authentication.repository";

const roleSelection = {
  roles: { select: { role: { select: { key: true } } } },
} as const;

export class PrismaAuthenticationRepository
  implements AuthenticationRepository
{
  constructor(private readonly client: PrismaClient) {}

  async findAuthenticatedUser(userId: string) {
    const user = await this.client.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        status: true,
        ...roleSelection,
      },
    });

    if (!user) return null;
    return {
      ...user,
      status: user.status as UserStatus,
      roles: user.roles.map(({ role }) => role.key as RoleKey),
    };
  }

  async findAccessProfile(userId: string) {
    const user = await this.client.user.findUnique({
      where: { id: userId },
      select: { status: true, ...roleSelection },
    });
    if (!user) return null;
    return {
      status: user.status as UserStatus,
      roles: user.roles.map(({ role }) => role.key as RoleKey),
    };
  }

  async recordLogin(input: LoginAuditInput) {
    await this.client.$transaction([
      this.client.user.update({
        where: { id: input.userId },
        data: {
          lastLoginAt: new Date(),
          lastLoginIp: input.ipAddress,
          lastLoginUserAgent: input.userAgent,
          lastLoginBrowser: input.browser,
          lastLoginOs: input.operatingSystem,
          lastLoginProvider: input.provider,
        },
      }),
      this.client.auditLog.create({
        data: {
          action: "LOGIN",
          entity: "User",
          entityId: input.userId,
          userId: input.userId,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
          metadata: { provider: input.provider ?? "unknown" },
        },
      }),
    ]);
  }

  async recordLogout(
    userId: string,
    context: Pick<LoginAuditInput, "ipAddress" | "userAgent">,
  ) {
    await this.client.auditLog.create({
      data: {
        action: "LOGOUT",
        entity: "User",
        entityId: userId,
        userId,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
      },
    });
  }

  async recordAccessDenied(input: AccessDeniedAuditInput) {
    await this.client.auditLog.create({
      data: {
        action: "ACCESS_DENIED",
        entity: input.entity,
        entityId: input.entityId,
        userId: input.userId,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        metadata: { reason: input.reason, ...input.metadata },
      },
    });
  }
}
