import { z } from "zod";
import {
  confidenceSchema,
  cuidSchema,
  nonNegativeDecimalSchema,
  percentageSchema,
} from "@/lib/validation/domain-primitives";
const unit = z.enum([
  "UNIT",
  "PAIR",
  "KIT",
  "BOX",
  "PACKAGE",
  "CENTIMETER",
  "METER",
]);
export const quotationItemSchema = z.object({
  materialId: cuidSchema.optional(),
  requestedDescription: z.string().trim().min(2).max(2000),
  requestedQuantity: z.coerce.number().int().positive(),
  unitOfMeasure: unit,
  supplierId: cuidSchema.optional(),
  supplierMaterialId: cuidSchema.optional(),
  extractionConfidence: confidenceSchema.optional(),
  matchingConfidence: confidenceSchema.optional(),
  status: z
    .enum([
      "PENDING_IDENTIFICATION",
      "IDENTIFIED",
      "NEEDS_REVIEW",
      "UNAVAILABLE",
      "PRICED",
      "APPROVED",
      "REJECTED",
    ])
    .default("PENDING_IDENTIFICATION"),
  notes: z.string().max(2000).optional(),
});
const quotationRequestBaseSchema = z.object({
  organizationId: cuidSchema,
  requestNumber: z.string().trim().min(1).max(80),
  externalReference: z.string().trim().max(120).optional(),
  hospitalId: cuidSchema.optional(),
  insuranceId: cuidSchema.optional(),
  requestingDoctor: z.string().trim().max(160).optional(),
  patientReference: z.string().trim().max(120).optional(),
  surgeryDate: z.coerce.date().optional(),
  urgency: z.enum(["ROUTINE", "URGENT", "EMERGENCY"]),
  receivedAt: z.coerce.date(),
  dueAt: z.coerce.date().optional(),
  assignedToUserId: cuidSchema.optional(),
  sourceEmailId: cuidSchema.optional(),
  notes: z.string().max(5000).optional(),
  items: z.array(quotationItemSchema).default([]),
});
export const quotationRequestSchema = quotationRequestBaseSchema.refine(
  (v) => !v.dueAt || v.dueAt >= v.receivedAt,
  { message: "dueAt não pode preceder receivedAt", path: ["dueAt"] },
);
export const updateQuotationRequestSchema = quotationRequestBaseSchema
  .omit({ organizationId: true, items: true })
  .partial();
const money = nonNegativeDecimalSchema;
export const quotationProposalItemSchema = z.object({
  quotationItemId: cuidSchema,
  materialId: cuidSchema,
  supplierId: cuidSchema.optional(),
  quantity: z.coerce.number().positive(),
  unitCost: money,
  logisticsCost: money,
  taxCost: money,
  additionalCost: money,
  minimumUnitPrice: money,
  proposedUnitPrice: money,
  totalCost: money,
  totalPrice: money,
  marginPercent: percentageSchema,
});
export const quotationProposalSchema = z.object({
  organizationId: cuidSchema,
  quotationRequestId: cuidSchema,
  proposalNumber: z.string().trim().min(1).max(80),
  version: z.coerce.number().int().positive(),
  status: z
    .enum([
      "DRAFT",
      "UNDER_REVIEW",
      "APPROVED",
      "REJECTED",
      "SENT",
      "EXPIRED",
      "CANCELLED",
    ])
    .default("DRAFT"),
  subtotal: money,
  taxes: money,
  logisticsCost: money,
  additionalCost: money,
  discount: money,
  total: money,
  minimumMarginPercent: percentageSchema,
  actualMarginPercent: percentageSchema,
  validUntil: z.coerce.date(),
  approvedByUserId: cuidSchema.optional(),
  approvedAt: z.coerce.date().optional(),
  sentAt: z.coerce.date().optional(),
  createdByUserId: cuidSchema,
  items: z.array(quotationProposalItemSchema).min(1),
});
export type QuotationRequestInput = z.infer<typeof quotationRequestSchema>;
export type QuotationProposalInput = z.infer<typeof quotationProposalSchema>;
