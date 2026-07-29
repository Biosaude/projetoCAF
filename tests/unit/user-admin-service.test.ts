import { describe, expect, it, vi } from "vitest";
import type { UserRepository } from "@/features/users/repositories/user.repository";
import { UserAdminService } from "@/features/users/services/user-admin.service";

function dependencies() {
  const users = {
    list: vi.fn(),
    findById: vi.fn(),
    updateStatusWithAudit: vi.fn(),
    replaceRoleWithAudit: vi.fn(),
  } satisfies UserRepository;
  return { users, service: new UserAdminService(users) };
}

describe("administração de usuários", () => {
  it("impede que o Administrador altere o próprio perfil", async () => {
    const { service, users } = dependencies();
    await expect(
      service.changeRole("admin-1", "admin-1", "VIEWER"),
    ).rejects.toMatchObject({
      code: "SELF_ROLE_CHANGE_NOT_ALLOWED",
      statusCode: 409,
    });
    expect(users.replaceRoleWithAudit).not.toHaveBeenCalled();
  });

  it("impede que o Administrador inative a própria conta", async () => {
    const { service, users } = dependencies();
    await expect(
      service.changeStatus("admin-1", "admin-1", "INACTIVE"),
    ).rejects.toMatchObject({
      code: "SELF_DEACTIVATION_NOT_ALLOWED",
      statusCode: 409,
    });
    expect(users.updateStatusWithAudit).not.toHaveBeenCalled();
  });

  it("delega perfil e auditoria atômicos para outro usuário", async () => {
    const { service, users } = dependencies();
    await service.changeRole("admin-1", "user-2", "ANALYST");
    expect(users.replaceRoleWithAudit).toHaveBeenCalledWith(
      "user-2",
      "ANALYST",
      "admin-1",
    );
  });

  it("delega status e auditoria atômicos para outro usuário", async () => {
    const { service, users } = dependencies();
    await service.changeStatus("admin-1", "user-2", "BLOCKED");
    expect(users.updateStatusWithAudit).toHaveBeenCalledWith(
      "user-2",
      "BLOCKED",
      "admin-1",
    );
  });

  it("propaga falha transacional sem reportar sucesso", async () => {
    const { service, users } = dependencies();
    vi.mocked(users.updateStatusWithAudit).mockRejectedValue(
      new Error("rollback"),
    );
    await expect(
      service.changeStatus("admin-1", "user-2", "INACTIVE"),
    ).rejects.toThrow("rollback");
  });
});
