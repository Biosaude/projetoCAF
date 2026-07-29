import type { Organization } from "@prisma/client";
import type { OrganizationInput } from "../validators/organization.validator";
export interface OrganizationRepository {
  findById(id: string): Promise<Organization | null>;
  findMany(): Promise<Organization[]>;
  findByDocument(document: string): Promise<Organization | null>;
  create(input: OrganizationInput): Promise<Organization>;
  update(id: string, input: Partial<OrganizationInput>): Promise<Organization>;
  deactivate(id: string): Promise<Organization>;
}
