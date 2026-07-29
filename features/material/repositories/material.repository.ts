import type { Material, SupplierMaterial } from "@prisma/client";
import type { MaterialInput } from "../validators";
import type { z } from "zod";
import type { supplierMaterialSchema } from "../validators";
export type SupplierMaterialInput = z.infer<typeof supplierMaterialSchema>;
export interface MaterialRepository {
  findById(id: string): Promise<Material | null>;
  findMany(org: string): Promise<Material[]>;
  findDuplicate(org: string, code: string): Promise<Material | null>;
  create(input: MaterialInput): Promise<Material>;
  update(id: string, input: Partial<MaterialInput>): Promise<Material>;
  deactivate(id: string): Promise<Material>;
  findSupplierPriceDuplicate(
    input: SupplierMaterialInput,
  ): Promise<SupplierMaterial | null>;
  createSupplierPrice(input: SupplierMaterialInput): Promise<SupplierMaterial>;
}
