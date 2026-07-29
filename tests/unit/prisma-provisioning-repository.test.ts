import { describe, expect, it, vi } from "vitest";
import { PrismaProvisioningRepository } from "@/features/authentication/repositories/prisma-provisioning.repository";
import { SYSTEM_ROLES } from "@/features/authentication/services/user-provisioning.service";

describe("provisionamento Prisma do primeiro acesso", () => {
  it("ativa usuário, atribui Visualizador e audita atomicamente", async () => {
    const transaction = {
      role: {
        upsert: vi.fn().mockResolvedValue({}),
        findUniqueOrThrow: vi.fn().mockResolvedValue({ id: "role-viewer" }),
      },
      user: { update: vi.fn().mockResolvedValue({}) },
      userRole: { create: vi.fn().mockResolvedValue({}) },
      auditLog: { create: vi.fn().mockResolvedValue({}) },
    };
    const client = {
      $transaction: vi.fn(
        (callback: (value: typeof transaction) => Promise<unknown>) =>
          callback(transaction),
      ),
    };
    await new PrismaProvisioningRepository(client as never).provision(
      "user-1",
      SYSTEM_ROLES,
    );
    expect(transaction.role.upsert).toHaveBeenCalledTimes(4);
    expect(transaction.user.update).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: { status: "ACTIVE" },
    });
    expect(transaction.userRole.create).toHaveBeenCalledWith({
      data: { userId: "user-1", roleId: "role-viewer" },
    });
    expect(transaction.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        action: "FIRST_ACCESS",
        userId: "user-1",
      }),
    });
  });
});
