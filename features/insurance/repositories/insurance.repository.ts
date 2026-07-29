import type { Insurance } from "@prisma/client";
import type { InsuranceInput } from "../validators";
export interface InsuranceRepository {
  findById(id: string): Promise<Insurance | null>;
  findMany(organizationId: string): Promise<Insurance[]>;
  findDuplicate(
    organizationId: string,
    code: string,
    document?: string,
  ): Promise<Insurance | null>;
  create(input: InsuranceInput): Promise<Insurance>;
  update(id: string, input: Partial<InsuranceInput>): Promise<Insurance>;
  deactivate(id: string): Promise<Insurance>;
}
