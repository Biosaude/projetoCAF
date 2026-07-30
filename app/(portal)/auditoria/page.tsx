import { requireAdministrator } from "@/features/authentication/services/authorization.service";
import { AuditView } from "@/features/audit/components/audit-view";
import { auditService } from "@/features/audit/config/audit.dependencies";

export const metadata = { title: "Auditoria" };
export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string }>;
}) {
  await requireAdministrator();
  const { userId } = await searchParams;
  const records = await auditService.list(userId);
  return <AuditView records={records} />;
}
