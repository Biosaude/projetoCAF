import { describe, expect, it, vi } from "vitest";
import { PrismaUserRepository } from "@/features/users/repositories/prisma-user.repository";

describe("PrismaUserRepository atomicidade", () => {
  it("envia alteração de status e auditoria na mesma transação", async () => {
    const userUpdate = Promise.resolve({});
    const auditCreate = Promise.resolve({});
    const client = {
      user: { update: vi.fn().mockReturnValue(userUpdate) },
      auditLog: { create: vi.fn().mockReturnValue(auditCreate) },
      $transaction: vi.fn().mockResolvedValue([{}, {}]),
    };
    await new PrismaUserRepository(client as never).updateStatusWithAudit(
      "user-2",
      "INACTIVE",
      "admin-1",
    );
    expect(client.$transaction).toHaveBeenCalledWith([userUpdate, auditCreate]);
    expect(client.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        action: "STATUS_CHANGED",
        entityId: "user-2",
        userId: "admin-1",
      }),
    });
  });

  it("propaga falha da transação de status", async () => {
    const client = {
      user: { update: vi.fn().mockReturnValue(Promise.resolve({})) },
      auditLog: { create: vi.fn().mockReturnValue(Promise.resolve({})) },
      $transaction: vi.fn().mockRejectedValue(new Error("rollback")),
    };
    await expect(
      new PrismaUserRepository(client as never).updateStatusWithAudit(
        "user-2",
        "BLOCKED",
        "admin-1",
      ),
    ).rejects.toThrow("rollback");
  });

  it("inclui mudança de perfil e auditoria na transação interativa", async () => {
    const transaction = {
      role: {
        findUniqueOrThrow: vi.fn().mockResolvedValue({ id: "role-manager" }),
      },
      userRole: {
        deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
        create: vi.fn().mockResolvedValue({}),
      },
      auditLog: { create: vi.fn().mockResolvedValue({}) },
    };
    const client = {
      $transaction: vi.fn(
        (callback: (value: typeof transaction) => Promise<unknown>) =>
          callback(transaction),
      ),
    };
    await new PrismaUserRepository(client as never).replaceRoleWithAudit(
      "user-2",
      "MANAGER",
      "admin-1",
    );
    expect(transaction.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        action: "ROLE_CHANGED",
        metadata: { role: "MANAGER" },
      }),
    });
    expect(transaction.userRole.create).toHaveBeenCalledWith({
      data: {
        userId: "user-2",
        roleId: "role-manager",
        assignedBy: "admin-1",
      },
    });
  });
});
