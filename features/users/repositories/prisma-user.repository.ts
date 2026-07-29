import type { Prisma, PrismaClient, RoleKey, UserStatus } from "@prisma/client";
import type { UserRepository, UserSummary } from "./user.repository";

const userSelection = {
  id: true,
  name: true,
  email: true,
  image: true,
  status: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
  roles: { select: { role: { select: { key: true } } } },
} as const;

type SelectedUser = Prisma.UserGetPayload<{ select: typeof userSelection }>;

function toSummary(user: SelectedUser): UserSummary {
  return { ...user, roles: user.roles.map(({ role }) => role.key) };
}

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly client: PrismaClient) {}

  async findById(id: string) {
    const user = await this.client.user.findUnique({
      where: { id },
      select: userSelection,
    });
    return user ? toSummary(user) : null;
  }

  async list() {
    const users = await this.client.user.findMany({
      orderBy: { createdAt: "desc" },
      select: userSelection,
    });
    return users.map(toSummary);
  }

  async updateStatusWithAudit(id: string, status: UserStatus, actorId: string) {
    await this.client.$transaction([
      this.client.user.update({ where: { id }, data: { status } }),
      this.client.auditLog.create({
        data: {
          action: "STATUS_CHANGED",
          entity: "User",
          entityId: id,
          userId: actorId,
          metadata: { status },
        },
      }),
    ]);
  }

  async replaceRoleWithAudit(id: string, role: RoleKey, actorId: string) {
    await this.client.$transaction(async (transaction) => {
      const persistedRole = await transaction.role.findUniqueOrThrow({
        where: { key: role },
      });
      await transaction.userRole.deleteMany({ where: { userId: id } });
      await transaction.userRole.create({
        data: { userId: id, roleId: persistedRole.id, assignedBy: actorId },
      });
      await transaction.auditLog.create({
        data: {
          action: "ROLE_CHANGED",
          entity: "User",
          entityId: id,
          userId: actorId,
          metadata: { role },
        },
      });
    });
  }
}
