import type { PrismaClient } from "@prisma/client";
import type { AuditEntry, AuditRepository } from "./audit.repository";

export class PrismaAuditRepository implements AuditRepository {
  constructor(private readonly client: PrismaClient) {}

  async create(entry: AuditEntry) {
    await this.client.auditLog.create({ data: entry });
  }

  list(userId?: string) {
    return this.client.auditLog.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        action: true,
        entity: true,
        ipAddress: true,
        createdAt: true,
        user: { select: { name: true, email: true } },
      },
    });
  }
}
