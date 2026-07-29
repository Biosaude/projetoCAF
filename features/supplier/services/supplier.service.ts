import { AppError, NotFoundError } from "@/lib/errors";
import type { SupplierRepository } from "../repositories/supplier.repository";
import { supplierSchema, updateSupplierSchema } from "../validators";
export class SupplierService {
  constructor(private readonly repository: SupplierRepository) {}
  async create(input: unknown) {
    const data = supplierSchema.parse(input);
    if (
      await this.repository.findDuplicate(
        data.organizationId,
        data.document,
        data.internalCode,
      )
    )
      throw new AppError(
        "Fornecedor já cadastrado.",
        "SUPPLIER_DUPLICATE",
        409,
      );
    return this.repository.create(data);
  }
  async update(id: string, input: unknown) {
    if (!(await this.repository.findById(id)))
      throw new NotFoundError("Fornecedor");
    return this.repository.update(id, updateSupplierSchema.parse(input));
  }
  async deactivate(id: string) {
    if (!(await this.repository.findById(id)))
      throw new NotFoundError("Fornecedor");
    return this.repository.deactivate(id);
  }
  findById(id: string) {
    return this.repository.findById(id);
  }
  findMany(org: string) {
    return this.repository.findMany(org);
  }
}
