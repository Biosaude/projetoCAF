import { describe, expect, it, vi } from "vitest";
import { PrismaMaterialRepository } from "@/features/material/repositories";
import { PrismaQuotationProposalRepository } from "@/features/quotation/repositories";
const id = "clh1234560000abcdefghijk";
describe("Prisma domain mappings", () => {
  it("maps purchase price to Prisma Decimal", async () => {
    const create = vi.fn().mockImplementation(({ data }) => data);
    const db = { supplierMaterial: { create }, material: {} };
    const repository = new PrismaMaterialRepository(db as never);
    const result = await repository.createSupplierPrice({
      supplierId: id,
      materialId: id,
      supplierCode: "S1",
      purchasePrice: "123.4567",
      currency: "BRL",
      minimumQuantity: 1,
      validFrom: new Date("2026-01-01"),
      validUntil: new Date("2026-12-31"),
      active: true,
    });
    expect(result.purchasePrice.toString()).toBe("123.4567");
  });
  it("persists proposal values as Decimal without financial calculations", async () => {
    const create = vi.fn().mockImplementation(({ data }) => data);
    const repository = new PrismaQuotationProposalRepository({
      quotationProposal: { create },
    } as never);
    const result = await repository.create({
      organizationId: id,
      quotationRequestId: id,
      proposalNumber: "P1",
      version: 1,
      status: "DRAFT",
      subtotal: "10",
      taxes: "0",
      logisticsCost: "0",
      additionalCost: "0",
      discount: "0",
      total: "10",
      minimumMarginPercent: 0,
      actualMarginPercent: 0,
      validUntil: new Date("2027-01-01"),
      createdByUserId: id,
      items: [
        {
          quotationItemId: id,
          materialId: id,
          quantity: 1,
          unitCost: "10",
          logisticsCost: "0",
          taxCost: "0",
          additionalCost: "0",
          minimumUnitPrice: "10",
          proposedUnitPrice: "10",
          totalCost: "10",
          totalPrice: "10",
          marginPercent: 0,
        },
      ],
    });
    expect(result.total.toString()).toBe("10");
    expect(create).toHaveBeenCalledOnce();
  });
});
