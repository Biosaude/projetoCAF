import { Prisma, type PrismaClient } from "@prisma/client";
import { PrismaRepository } from "@/repositories/structural.repository";
import type { MaterialInput } from "../validators";
import type {
  MaterialRepository,
  SupplierMaterialInput,
} from "./material.repository";
export class PrismaMaterialRepository
  extends PrismaRepository
  implements MaterialRepository
{
  constructor(db: PrismaClient) {
    super(db);
  }
  findById(id: string) {
    return this.db.material.findUnique({ where: { id } });
  }
  findMany(organizationId: string) {
    return this.db.material.findMany({
      where: { organizationId },
      orderBy: { name: "asc" },
    });
  }
  findDuplicate(organizationId: string, internalCode: string) {
    return this.db.material.findFirst({
      where: { organizationId, internalCode },
    });
  }
  create(input: MaterialInput) {
    return this.db.material.create({ data: input });
  }
  update(id: string, input: Partial<MaterialInput>) {
    return this.db.material.update({ where: { id }, data: input });
  }
  deactivate(id: string) {
    return this.db.material.update({ where: { id }, data: { active: false } });
  }
  findSupplierPriceDuplicate(i: SupplierMaterialInput) {
    return this.db.supplierMaterial.findUnique({
      where: {
        supplierId_materialId_supplierCode_validFrom: {
          supplierId: i.supplierId,
          materialId: i.materialId,
          supplierCode: i.supplierCode,
          validFrom: i.validFrom,
        },
      },
    });
  }
  createSupplierPrice(i: SupplierMaterialInput) {
    return this.db.supplierMaterial.create({
      data: { ...i, purchasePrice: new Prisma.Decimal(i.purchasePrice) },
    });
  }
}
