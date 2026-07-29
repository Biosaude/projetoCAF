import { describe, expect, it, vi } from "vitest";
import { HospitalService } from "@/features/hospital/services";
import { MaterialService } from "@/features/material/services";
const id = "clh1234560000abcdefghijk";
describe("structural domain services", () => {
  it("prevents duplicate hospitals inside one organization", async () => {
    const repository = {
      findById: vi.fn(),
      findMany: vi.fn(),
      findDuplicate: vi.fn().mockResolvedValue({ id }),
      create: vi.fn(),
      update: vi.fn(),
      deactivate: vi.fn(),
    };
    await expect(
      new HospitalService(repository as never).create({
        organizationId: id,
        legalName: "Hospital Teste",
        internalCode: "H1",
      }),
    ).rejects.toMatchObject({ code: "HOSPITAL_DUPLICATE" });
    expect(repository.create).not.toHaveBeenCalled();
  });
  it("implements logical deletion instead of physical deletion", async () => {
    const repository = {
      findById: vi.fn().mockResolvedValue({ id }),
      findMany: vi.fn(),
      findDuplicate: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      deactivate: vi.fn().mockResolvedValue({ id, active: false }),
    };
    await new HospitalService(repository as never).deactivate(id);
    expect(repository.deactivate).toHaveBeenCalledWith(id);
  });
  it("does not overwrite an existing supplier price period", async () => {
    const repository = {
      findById: vi.fn(),
      findMany: vi.fn(),
      findDuplicate: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      deactivate: vi.fn(),
      findSupplierPriceDuplicate: vi.fn().mockResolvedValue({ id }),
      createSupplierPrice: vi.fn(),
    };
    await expect(
      new MaterialService(repository as never).addSupplierPrice({
        supplierId: id,
        materialId: id,
        supplierCode: "SUP-1",
        purchasePrice: "12.30",
        currency: "BRL",
        minimumQuantity: 1,
        validFrom: "2026-01-01",
        validUntil: "2026-12-31",
      }),
    ).rejects.toMatchObject({ code: "SUPPLIER_PRICE_DUPLICATE" });
    expect(repository.createSupplierPrice).not.toHaveBeenCalled();
  });
});
