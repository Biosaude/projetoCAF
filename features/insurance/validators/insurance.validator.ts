import { z } from "zod";
import {
  cuidSchema,
  normalizedDocumentSchema,
  optionalEmailSchema,
} from "@/lib/validation/domain-primitives";
export const insuranceSchema = z.object({
  organizationId: cuidSchema,
  name: z.string().trim().min(2).max(160),
  code: z.string().trim().min(1).max(50),
  document: normalizedDocumentSchema.optional(),
  email: optionalEmailSchema,
  phone: z.string().trim().max(30).optional(),
  active: z.boolean().default(true),
});
export const updateInsuranceSchema = insuranceSchema
  .partial()
  .omit({ organizationId: true });
export type InsuranceInput = z.infer<typeof insuranceSchema>;
