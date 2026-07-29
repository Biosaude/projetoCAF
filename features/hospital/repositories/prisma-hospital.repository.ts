import type { PrismaClient } from "@prisma/client";
import { PrismaRepository } from "@/repositories/structural.repository";
import type { HospitalInput } from "../validators";
import type { HospitalRepository } from "./hospital.repository";
export class PrismaHospitalRepository
  extends PrismaRepository
  implements HospitalRepository
{
  constructor(db: PrismaClient) {
    super(db);
  }
  findById(id: string) {
    return this.db.hospital.findUnique({ where: { id } });
  }
  findMany(organizationId: string) {
    return this.db.hospital.findMany({
      where: { organizationId },
      orderBy: { legalName: "asc" },
    });
  }
  findDuplicate(
    organizationId: string,
    document: string | undefined,
    internalCode: string,
  ) {
    return this.db.hospital.findFirst({
      where: {
        organizationId,
        OR: [{ internalCode }, ...(document ? [{ document }] : [])],
      },
    });
  }
  create(input: HospitalInput) {
    return this.db.hospital.create({ data: input });
  }
  update(id: string, input: Partial<HospitalInput>) {
    return this.db.hospital.update({ where: { id }, data: input });
  }
  deactivate(id: string) {
    return this.db.hospital.update({ where: { id }, data: { active: false } });
  }
}
