import { z } from "zod";
import {
  cuidSchema,
  nonNegativeDecimalSchema,
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
export const materialSchema = z.object({
  organizationId: cuidSchema,
  internalCode: z.string().trim().min(1).max(50),
  manufacturerCode: z.string().trim().max(80).optional(),
  name: z.string().trim().min(2).max(200),
  description: z.string().max(2000).optional(),
  technicalDescription: z.string().max(5000).optional(),
  categoryId: cuidSchema,
  brandId: cuidSchema.optional(),
  unitOfMeasure: unit,
  anvisaRegistration: z.string().trim().max(80).optional(),
  anvisaExpirationDate: z.coerce.date().optional(),
  active: z.boolean().default(true),
});
export const updateMaterialSchema = materialSchema
  .partial()
  .omit({ organizationId: true });
export const supplierMaterialSchema = z
  .object({
    supplierId: cuidSchema,
    materialId: cuidSchema,
    supplierCode: z.string().trim().min(1).max(80),
    purchasePrice: nonNegativeDecimalSchema,
    currency: z.enum(["BRL", "USD", "EUR"]),
    minimumQuantity: z.coerce.number().int().positive(),
    leadTimeDays: z.coerce.number().int().nonnegative().optional(),
    validFrom: z.coerce.date(),
    validUntil: z.coerce.date(),
    active: z.boolean().default(true),
  })
  .refine((v) => v.validUntil > v.validFrom, {
    message: "validUntil deve ser posterior a validFrom",
    path: ["validUntil"],
  });
export type MaterialInput = z.infer<typeof materialSchema>;
