import type {
  RoleKey,
  UserStatus,
} from "@/features/authentication/types/auth.types";
import { AppError } from "@/lib/errors";
import type { UserRepository } from "../repositories/user.repository";

export class UserAdminService {
  constructor(private readonly users: UserRepository) {}

  listUsers() {
    return this.users.list();
  }

  async changeStatus(actorId: string, userId: string, status: UserStatus) {
    if (actorId === userId && status !== "ACTIVE") {
      throw new AppError(
        "O administrador não pode desativar a própria conta.",
        "SELF_DEACTIVATION_NOT_ALLOWED",
        409,
      );
    }
    await this.users.updateStatusWithAudit(userId, status, actorId);
  }

  async changeRole(actorId: string, userId: string, role: RoleKey) {
    if (actorId === userId) {
      throw new AppError(
        "O administrador não pode alterar o próprio perfil.",
        "SELF_ROLE_CHANGE_NOT_ALLOWED",
        409,
      );
    }
    await this.users.replaceRoleWithAudit(userId, role, actorId);
  }
}
