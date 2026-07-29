import type {
  AuditEntry,
  AuditRepository,
} from "../repositories/audit.repository";

export class AuditService {
  constructor(private readonly repository: AuditRepository) {}

  async record(entry: AuditEntry) {
    await this.repository.create(entry);
  }

  list(userId?: string) {
    return this.repository.list(userId);
  }
}
