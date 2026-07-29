import { AppError, NotFoundError } from "@/lib/errors";
import type { QuotationRequestRepository } from "../repositories/quotation-request.repository";
import {
  quotationRequestSchema,
  updateQuotationRequestSchema,
} from "../validators";
export class QuotationRequestService {
  constructor(private readonly repository: QuotationRequestRepository) {}
  async create(input: unknown) {
    const data = quotationRequestSchema.parse(input);
    if (
      await this.repository.findByNumber(
        data.organizationId,
        data.requestNumber,
      )
    )
      throw new AppError(
        "Solicitação já cadastrada.",
        "QUOTATION_DUPLICATE",
        409,
      );
    return this.repository.create(data);
  }
  async update(id: string, input: unknown) {
    if (!(await this.repository.findById(id)))
      throw new NotFoundError("Solicitação");
    return this.repository.update(
      id,
      updateQuotationRequestSchema.parse(input),
    );
  }
  async deactivate(id: string, reason: string) {
    if (!reason.trim())
      throw new AppError(
        "Motivo do cancelamento é obrigatório.",
        "CANCELLATION_REASON_REQUIRED",
        422,
      );
    if (!(await this.repository.findById(id)))
      throw new NotFoundError("Solicitação");
    return this.repository.deactivate(id, reason);
  }
  findById(id: string) {
    return this.repository.findById(id);
  }
  findMany(org: string) {
    return this.repository.findMany(org);
  }
}
