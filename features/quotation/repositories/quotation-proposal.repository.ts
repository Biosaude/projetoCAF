import type { QuotationProposal } from "@prisma/client";
import type { QuotationProposalInput } from "../validators";
export interface QuotationProposalRepository {
  findById(id: string): Promise<QuotationProposal | null>;
  findMany(org: string): Promise<QuotationProposal[]>;
  findDuplicate(
    org: string,
    number: string,
    requestId: string,
    version: number,
  ): Promise<QuotationProposal | null>;
  create(input: QuotationProposalInput): Promise<QuotationProposal>;
  update(
    id: string,
    input: Record<string, unknown>,
  ): Promise<QuotationProposal>;
  deactivate(id: string): Promise<QuotationProposal>;
}
