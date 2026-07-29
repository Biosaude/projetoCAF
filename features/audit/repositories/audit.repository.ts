import type { AuditAction, Prisma } from "@prisma/client";

export interface AuditEntry {
  action: AuditAction;
  entity: string;
  entityId?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Prisma.InputJsonValue;
}

export interface AuditRepository {
  create(entry: AuditEntry): Promise<void>;
  list(userId?: string): Promise<AuditRecord[]>;
}

export interface AuditRecord {
  id: string;
  action: AuditAction;
  entity: string;
  ipAddress: string | null;
  createdAt: Date;
  user: { name: string | null; email: string } | null;
}
