import type { PrismaClient } from "@prisma/client";
import { PrismaRepository } from "@/repositories/structural.repository";
import type { SupplierInput } from "../validators";
import type { SupplierRepository } from "./supplier.repository";
export class PrismaSupplierRepository
  extends PrismaRepository
  implements SupplierRepository
{
  constructor(db: PrismaClient) {
    super(db);
  }
  findById(id: string) {
    return this.db.supplier.findUnique({ where: { id } });
  }
  findMany(organizationId: string) {
    return this.db.supplier.findMany({
      where: { organizationId },
      orderBy: { legalName: "asc" },
    });
  }
  findDuplicate(
    organizationId: string,
    document: string | undefined,
    internalCode: string,
  ) {
    return this.db.supplier.findFirst({
      where: {
        organizationId,
        OR: [{ internalCode }, ...(document ? [{ document }] : [])],
      },
    });
  }
  create(input: SupplierInput) {
    return this.db.supplier.create({ data: input });
  }
  update(id: string, input: Partial<SupplierInput>) {
    return this.db.supplier.update({ where: { id }, data: input });
  }
  deactivate(id: string) {
    return this.db.supplier.update({ where: { id }, data: { active: false } });
  }
}
