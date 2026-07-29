import { describe, expect, it } from "vitest";
import { hospitalSchema } from "@/features/hospital/validators";
import { supplierMaterialSchema } from "@/features/material/validators";
import {
  quotationItemSchema,
  quotationRequestSchema,
  quotationProposalSchema,
} from "@/features/quotation/validators";
const id = "clh1234560000abcdefghijk";
describe("database domain validators", () => {
  it("normalizes organization documents", () => {
    expect(
      hospitalSchema.parse({
        organizationId: id,
        legalName: "Hospital Teste",
        document: "12.345/0001-ab",
        internalCode: "H-1",
      }).document,
    ).toBe("123450001AB");
  });
  it("requires a positive price validity interval", () => {
    expect(() =>
      supplierMaterialSchema.parse({
        supplierId: id,
        materialId: id,
        supplierCode: "X",
        purchasePrice: "10.2500",
        currency: "BRL",
        minimumQuantity: 1,
        validFrom: "2026-08-02",
        validUntil: "2026-08-01",
      }),
    ).toThrow();
  });
  it("keeps confidence in the documented zero-to-one range", () => {
    expect(() =>
      quotationItemSchema.parse({
        requestedDescription: "Implante",
        requestedQuantity: 1,
        unitOfMeasure: "UNIT",
        extractionConfidence: 1.01,
      }),
    ).toThrow();
  });
  it("rejects direct patient clinical data by stripping unknown fields", () => {
    const result = quotationRequestSchema.parse({
      organizationId: id,
      requestNumber: "REQ-1",
      urgency: "ROUTINE",
      receivedAt: new Date(),
      items: [],
      patientName: "Dado proibido",
      diagnosis: "Dado proibido",
    });
    expect(result).not.toHaveProperty("patientName");
    expect(result).not.toHaveProperty("diagnosis");
  });
  it("accepts structural Decimal values without calculating them", () => {
    const result = quotationProposalSchema.parse({
      organizationId: id,
      quotationRequestId: id,
      proposalNumber: "P-1",
      version: 1,
      subtotal: "0",
      taxes: "0",
      logisticsCost: "0",
      additionalCost: "0",
      discount: "0",
      total: "0",
      minimumMarginPercent: 0,
      actualMarginPercent: 0,
      validUntil: new Date("2027-01-01"),
      createdByUserId: id,
      items: [
        {
          quotationItemId: id,
          materialId: id,
          quantity: 1,
          unitCost: "0",
          logisticsCost: "0",
          taxCost: "0",
          additionalCost: "0",
          minimumUnitPrice: "0",
          proposedUnitPrice: "0",
          totalCost: "0",
          totalPrice: "0",
          marginPercent: 0,
        },
      ],
    });
    expect(result.total).toBe("0");
  });
});
