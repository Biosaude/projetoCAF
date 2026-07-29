import { requireAdministrator } from "@/features/authentication/services/authorization.service";
import { AuditView } from "@/features/audit/components/audit-view";
import { PrismaAuditRepository } from "@/features/audit/repositories/prisma-audit.repository";
import { AuditService } from "@/features/audit/services/audit.service";
import { prisma } from "@/lib/db/prisma";

export const metadata = { title: "Auditoria" };
export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string }>;
}) {
  await requireAdministrator();
  const { userId } = await searchParams;
  const records = await new AuditService(
    new PrismaAuditRepository(prisma),
  ).list(userId);
  return <AuditView records={records} />;
}
