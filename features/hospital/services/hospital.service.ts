import { AppError, NotFoundError } from "@/lib/errors";
import type { HospitalRepository } from "../repositories/hospital.repository";
import { hospitalSchema, updateHospitalSchema } from "../validators";
export class HospitalService {
  constructor(private readonly repository: HospitalRepository) {}
  async create(input: unknown) {
    const data = hospitalSchema.parse(input);
    if (
      await this.repository.findDuplicate(
        data.organizationId,
        data.document,
        data.internalCode,
      )
    )
      throw new AppError("Hospital já cadastrado.", "HOSPITAL_DUPLICATE", 409);
    return this.repository.create(data);
  }
  async update(id: string, input: unknown) {
    if (!(await this.repository.findById(id)))
      throw new NotFoundError("Hospital");
    return this.repository.update(id, updateHospitalSchema.parse(input));
  }
  async deactivate(id: string) {
    if (!(await this.repository.findById(id)))
      throw new NotFoundError("Hospital");
    return this.repository.deactivate(id);
  }
  findById(id: string) {
    return this.repository.findById(id);
  }
  findMany(organizationId: string) {
    return this.repository.findMany(organizationId);
  }
}
