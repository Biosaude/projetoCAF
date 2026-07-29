import { AppError, NotFoundError } from "@/lib/errors";
import type { OrganizationRepository } from "../repositories/organization.repository";
import { organizationSchema } from "../validators/organization.validator";
export class OrganizationService {
  constructor(private readonly repository: OrganizationRepository) {}
  async create(input: unknown) {
    const data = organizationSchema.parse(input);
    if (data.document && (await this.repository.findByDocument(data.document)))
      throw new AppError(
        "Organização já cadastrada.",
        "ORGANIZATION_DUPLICATE",
        409,
      );
    return this.repository.create(data);
  }
  async deactivate(id: string) {
    if (!(await this.repository.findById(id)))
      throw new NotFoundError("Organização");
    return this.repository.deactivate(id);
  }
  findById(id: string) {
    return this.repository.findById(id);
  }
  findMany() {
    return this.repository.findMany();
  }
}
