import type { PrismaClient } from "@prisma/client";
import type {
  ProvisioningRepository,
  SYSTEM_ROLES,
} from "../services/user-provisioning.service";

export class PrismaProvisioningRepository implements ProvisioningRepository {
  constructor(private readonly client: PrismaClient) {}

  async provision(userId: string, roles: typeof SYSTEM_ROLES) {
    await this.client.$transaction(async (transaction) => {
      for (const role of roles) {
        await transaction.role.upsert({
          where: { key: role.key },
          update: { name: role.name, description: role.description },
          create: role,
        });
      }
      const viewerRole = await transaction.role.findUniqueOrThrow({
        where: { key: "VIEWER" },
      });
      await transaction.user.update({
        where: { id: userId },
        data: { status: "ACTIVE" },
      });
      await transaction.userRole.create({
        data: { userId, roleId: viewerRole.id },
      });
      await transaction.auditLog.create({
        data: {
          action: "FIRST_ACCESS",
          entity: "User",
          entityId: userId,
          userId,
        },
      });
    });
  }
}
