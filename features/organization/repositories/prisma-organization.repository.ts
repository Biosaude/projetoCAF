import type { PrismaClient } from "@prisma/client";
import { PrismaRepository } from "@/repositories/structural.repository";
import type { OrganizationInput } from "../validators/organization.validator";
import type { OrganizationRepository } from "./organization.repository";
export class PrismaOrganizationRepository
  extends PrismaRepository
  implements OrganizationRepository
{
  constructor(db: PrismaClient) {
    super(db);
  }
  findById(id: string) {
    return this.db.organization.findUnique({ where: { id } });
  }
  findMany() {
    return this.db.organization.findMany({ orderBy: { legalName: "asc" } });
  }
  findByDocument(document: string) {
    return this.db.organization.findUnique({ where: { document } });
  }
  create(input: OrganizationInput) {
    return this.db.organization.create({ data: input });
  }
  update(id: string, input: Partial<OrganizationInput>) {
    return this.db.organization.update({ where: { id }, data: input });
  }
  deactivate(id: string) {
    return this.db.organization.update({
      where: { id },
      data: { active: false },
    });
  }
}
