import { AppError, NotFoundError } from "@/lib/errors";
import type { QuotationProposalRepository } from "../repositories/quotation-proposal.repository";
import { quotationProposalSchema } from "../validators";
export class QuotationProposalService {
  constructor(private readonly repository: QuotationProposalRepository) {}
  async create(input: unknown) {
    const data = quotationProposalSchema.parse(input);
    if (
      await this.repository.findDuplicate(
        data.organizationId,
        data.proposalNumber,
        data.quotationRequestId,
        data.version,
      )
    )
      throw new AppError(
        "Proposta ou versão já cadastrada.",
        "PROPOSAL_DUPLICATE",
        409,
      );
    return this.repository.create(data);
  }
  async deactivate(id: string) {
    if (!(await this.repository.findById(id)))
      throw new NotFoundError("Proposta");
    return this.repository.deactivate(id);
  }
  findById(id: string) {
    return this.repository.findById(id);
  }
  findMany(org: string) {
    return this.repository.findMany(org);
  }
}
