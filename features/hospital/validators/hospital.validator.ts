import { z } from "zod";
import {
  cuidSchema,
  normalizedDocumentSchema,
  optionalEmailSchema,
} from "@/lib/validation/domain-primitives";
export const hospitalSchema = z.object({
  organizationId: cuidSchema,
  legalName: z.string().trim().min(2).max(160),
  tradeName: z.string().trim().max(160).optional(),
  document: normalizedDocumentSchema.optional(),
  internalCode: z.string().trim().min(1).max(50),
  email: optionalEmailSchema,
  phone: z.string().trim().max(30).optional(),
  active: z.boolean().default(true),
});
export const updateHospitalSchema = hospitalSchema
  .partial()
  .omit({ organizationId: true });
export type HospitalInput = z.infer<typeof hospitalSchema>;
