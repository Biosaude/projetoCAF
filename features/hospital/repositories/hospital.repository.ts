import type { Hospital } from "@prisma/client";
import type { HospitalInput } from "../validators";
export interface HospitalRepository {
  findById(id: string): Promise<Hospital | null>;
  findMany(organizationId: string): Promise<Hospital[]>;
  findDuplicate(
    organizationId: string,
    document: string | undefined,
    internalCode: string,
  ): Promise<Hospital | null>;
  create(input: HospitalInput): Promise<Hospital>;
  update(id: string, input: Partial<HospitalInput>): Promise<Hospital>;
  deactivate(id: string): Promise<Hospital>;
}
