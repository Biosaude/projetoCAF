import { AppError, NotFoundError } from "@/lib/errors";
import type { MaterialRepository } from "../repositories/material.repository";
import {
  materialSchema,
  supplierMaterialSchema,
  updateMaterialSchema,
} from "../validators";
export class MaterialService {
  constructor(private readonly repository: MaterialRepository) {}
  async create(input: unknown) {
    const data = materialSchema.parse(input);
    if (
      await this.repository.findDuplicate(
        data.organizationId,
        data.internalCode,
      )
    )
      throw new AppError("Material já cadastrado.", "MATERIAL_DUPLICATE", 409);
    return this.repository.create(data);
  }
  async update(id: string, input: unknown) {
    if (!(await this.repository.findById(id)))
      throw new NotFoundError("Material");
    return this.repository.update(id, updateMaterialSchema.parse(input));
  }
  async deactivate(id: string) {
    if (!(await this.repository.findById(id)))
      throw new NotFoundError("Material");
    return this.repository.deactivate(id);
  }
  async addSupplierPrice(input: unknown) {
    const data = supplierMaterialSchema.parse(input);
    if (await this.repository.findSupplierPriceDuplicate(data))
      throw new AppError(
        "Preço vigente já cadastrado.",
        "SUPPLIER_PRICE_DUPLICATE",
        409,
      );
    return this.repository.createSupplierPrice(data);
  }
  findById(id: string) {
    return this.repository.findById(id);
  }
  findMany(org: string) {
    return this.repository.findMany(org);
  }
}
