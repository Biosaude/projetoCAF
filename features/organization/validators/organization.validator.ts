import { z } from "zod";
import {
  normalizedDocumentSchema,
  optionalEmailSchema,
} from "@/lib/validation/domain-primitives";
export const organizationSchema = z.object({
  legalName: z.string().trim().min(2).max(160),
  tradeName: z.string().trim().max(160).optional(),
  document: normalizedDocumentSchema.optional(),
  email: optionalEmailSchema,
  phone: z.string().trim().max(30).optional(),
  active: z.boolean().default(true),
});
export type OrganizationInput = z.infer<typeof organizationSchema>;
