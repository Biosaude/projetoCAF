import type { PrismaClient } from "@prisma/client";
import { PrismaRepository } from "@/repositories/structural.repository";
import type { InsuranceInput } from "../validators";
import type { InsuranceRepository } from "./insurance.repository";
export class PrismaInsuranceRepository
  extends PrismaRepository
  implements InsuranceRepository
{
  constructor(db: PrismaClient) {
    super(db);
  }
  findById(id: string) {
    return this.db.insurance.findUnique({ where: { id } });
  }
  findMany(organizationId: string) {
    return this.db.insurance.findMany({
      where: { organizationId },
      orderBy: { name: "asc" },
    });
  }
  findDuplicate(organizationId: string, code: string, document?: string) {
    return this.db.insurance.findFirst({
      where: {
        organizationId,
        OR: [{ code }, ...(document ? [{ document }] : [])],
      },
    });
  }
  create(input: InsuranceInput) {
    return this.db.insurance.create({ data: input });
  }
  update(id: string, input: Partial<InsuranceInput>) {
    return this.db.insurance.update({ where: { id }, data: input });
  }
  deactivate(id: string) {
    return this.db.insurance.update({ where: { id }, data: { active: false } });
  }
}
