import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const requiredTables = [
  "Organization",
  "HospitalAddress",
  "HospitalInsurance",
  "SupplierAddress",
  "Manufacturer",
  "Brand",
  "MaterialCategory",
  "SupplierMaterial",
  "EmailAttachment",
  "QuotationProposal",
  "QuotationProposalItem",
  "QuotationStatusHistory",
  "ProposalStatusHistory",
];
const requiredConstraints = [
  "SupplierMaterial_validity_check",
  "SupplierMaterial_price_check",
  "QuotationItem_quantity_check",
  "QuotationItem_extraction_confidence_check",
  "QuotationItem_matching_confidence_check",
  "QuotationProposal_financials_check",
  "QuotationProposalItem_financials_check",
];

try {
  const [{ tables, constraints }] = await prisma.$queryRaw`
    SELECT
      ARRAY(SELECT tablename FROM pg_tables WHERE schemaname = current_schema() AND tablename = ANY(${requiredTables})) AS tables,
      ARRAY(SELECT conname FROM pg_constraint WHERE conname = ANY(${requiredConstraints})) AS constraints
  `;
  const missingTables = requiredTables.filter((name) => !tables.includes(name));
  const missingConstraints = requiredConstraints.filter(
    (name) => !constraints.includes(name),
  );
  if (missingTables.length || missingConstraints.length) {
    throw new Error(
      `Fundação incompleta. Tabelas: ${missingTables.join(", ") || "ok"}; constraints: ${missingConstraints.join(", ") || "ok"}`,
    );
  }
  const roles = await prisma.role.groupBy({
    by: ["key"],
    _count: { key: true },
    where: { key: { in: ["ADMIN", "MANAGER", "ANALYST", "VIEWER"] } },
  });
  if (roles.length !== 4 || roles.some((role) => role._count.key !== 1)) {
    throw new Error("Os quatro perfis técnicos devem existir sem duplicidade.");
  }
} finally {
  await prisma.$disconnect();
}
