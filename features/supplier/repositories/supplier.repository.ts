import type { Supplier } from "@prisma/client";
import type { SupplierInput } from "../validators";
export interface SupplierRepository {
  findById(id: string): Promise<Supplier | null>;
  findMany(org: string): Promise<Supplier[]>;
  findDuplicate(
    org: string,
    document: string | undefined,
    code: string,
  ): Promise<Supplier | null>;
  create(input: SupplierInput): Promise<Supplier>;
  update(id: string, input: Partial<SupplierInput>): Promise<Supplier>;
  deactivate(id: string): Promise<Supplier>;
}
