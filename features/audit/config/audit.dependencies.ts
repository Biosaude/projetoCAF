import { prisma } from "@/lib/db/prisma";
import { PrismaAuditRepository } from "../repositories/prisma-audit.repository";
import { AuditService } from "../services/audit.service";

/** Composition root for server-side audit infrastructure. */
export const auditService = new AuditService(
  new PrismaAuditRepository(prisma),
);
