import { AppError, NotFoundError } from "@/lib/errors";
import type { InsuranceRepository } from "../repositories/insurance.repository";
import { insuranceSchema, updateInsuranceSchema } from "../validators";
export class InsuranceService {
  constructor(private readonly repository: InsuranceRepository) {}
  async create(input: unknown) {
    const data = insuranceSchema.parse(input);
    if (
      await this.repository.findDuplicate(
        data.organizationId,
        data.code,
        data.document,
      )
    )
      throw new AppError("Convênio já cadastrado.", "INSURANCE_DUPLICATE", 409);
    return this.repository.create(data);
  }
  async update(id: string, input: unknown) {
    if (!(await this.repository.findById(id)))
      throw new NotFoundError("Convênio");
    return this.repository.update(id, updateInsuranceSchema.parse(input));
  }
  async deactivate(id: string) {
    if (!(await this.repository.findById(id)))
      throw new NotFoundError("Convênio");
    return this.repository.deactivate(id);
  }
  findById(id: string) {
    return this.repository.findById(id);
  }
  findMany(org: string) {
    return this.repository.findMany(org);
  }
}
