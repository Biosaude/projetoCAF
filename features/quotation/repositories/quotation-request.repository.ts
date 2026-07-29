import type { QuotationRequest } from "@prisma/client";
import type { QuotationRequestInput } from "../validators";
export interface QuotationRequestRepository {
  findById(id: string): Promise<QuotationRequest | null>;
  findMany(org: string): Promise<QuotationRequest[]>;
  findByNumber(org: string, number: string): Promise<QuotationRequest | null>;
  create(input: QuotationRequestInput): Promise<QuotationRequest>;
  update(id: string, input: Record<string, unknown>): Promise<QuotationRequest>;
  deactivate(id: string, reason: string): Promise<QuotationRequest>;
}
