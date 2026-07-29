import { z } from "zod";

export const cuidSchema = z.string().cuid();
export const optionalEmailSchema = z
  .string()
  .email()
  .optional()
  .or(z.literal(""));
export const normalizedDocumentSchema = z
  .string()
  .trim()
  .min(5)
  .max(32)
  .transform((value) => value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase());
export const nonNegativeDecimalSchema = z
  .union([z.string(), z.number()])
  .transform(String)
  .refine(
    (value) => /^\d+(\.\d{1,4})?$/.test(value),
    "Use um decimal não negativo com até quatro casas",
  );
export const confidenceSchema = z.coerce.number().min(0).max(1);
export const percentageSchema = z.coerce.number().min(0).max(100);
