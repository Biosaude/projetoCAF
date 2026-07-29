import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { authConfig } from "@/features/authentication/config/auth.config";
import { getRequestContext } from "@/features/authentication/services/request-context.service";
import type {
  RoleKey,
  UserStatus,
} from "@/features/authentication/types/auth.types";
import { PrismaProvisioningRepository } from "@/features/authentication/repositories/prisma-provisioning.repository";
import { UserProvisioningService } from "@/features/authentication/services/user-provisioning.service";
import { prisma } from "@/lib/db/prisma";
import { logger } from "@/services";
import { canUserSignIn } from "@/features/authentication/services/rbac.service";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user }) {
      const allowed = canUserSignIn(user.status);
      if (!allowed && user.id) {
        const context = await getRequestContext();
        await prisma.auditLog.create({
          data: {
            action: "ACCESS_DENIED",
            entity: "User",
            entityId: user.id,
            userId: user.id,
            ipAddress: context.ipAddress,
            userAgent: context.userAgent,
            metadata: { reason: `USER_${user.status}` },
          },
        });
      }
      return allowed;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        const persistedUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            status: true,
            roles: { select: { role: { select: { key: true } } } },
          },
        });
        token.status = persistedUser?.status as UserStatus | undefined;
        token.roles =
          persistedUser?.roles.map(({ role }) => role.key as RoleKey) ?? [];
      }
      return token;
    },
    session: authConfig.callbacks.session,
  },
  events: {
    async createUser({ user }) {
      if (!user.id) return;
      await new UserProvisioningService(
        new PrismaProvisioningRepository(prisma),
      ).provisionFirstAccess(user.id);
    },
    async signIn({ user, account }) {
      if (!user.id) return;
      const context = await getRequestContext();
      await prisma.$transaction([
        prisma.user.update({
          where: { id: user.id },
          data: {
            lastLoginAt: new Date(),
            lastLoginIp: context.ipAddress,
            lastLoginUserAgent: context.userAgent,
            lastLoginBrowser: context.browser,
            lastLoginOs: context.os,
            lastLoginProvider: account?.provider,
          },
        }),
        prisma.auditLog.create({
          data: {
            action: "LOGIN",
            entity: "User",
            entityId: user.id,
            userId: user.id,
            ipAddress: context.ipAddress,
            userAgent: context.userAgent,
            metadata: { provider: account?.provider ?? "unknown" },
          },
        }),
      ]);
    },
    async signOut(message) {
      const userId =
        "token" in message ? message.token?.sub : message.session?.userId;
      if (!userId) return;
      const context = await getRequestContext();
      await prisma.auditLog.create({
        data: {
          action: "LOGOUT",
          entity: "User",
          entityId: userId,
          userId,
          ipAddress: context.ipAddress,
          userAgent: context.userAgent,
        },
      });
    },
  },
  logger: {
    error(error) {
      logger.error("Erro do Auth.js", error);
    },
    warn(code) {
      logger.warn("Alerta do Auth.js", { code });
    },
    debug(code, metadata) {
      logger.debug("Diagnóstico do Auth.js", { code, metadata });
    },
  },
});
