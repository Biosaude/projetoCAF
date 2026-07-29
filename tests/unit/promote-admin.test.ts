import { describe, expect, it, vi } from "vitest";
import {
  parsePromotionArgs,
  promoteAdministrator,
} from "@/scripts/lib/promote-admin.mjs";

describe("promoção controlada de Administrador", () => {
  it("exige email explícito e confirmação literal", () => {
    expect(() => parsePromotionArgs([])).toThrow(/--email/);
    expect(() => parsePromotionArgs(["--email=user@caf.test"])).toThrow(
      /--confirm=PROMOTE_ADMIN/,
    );
  });

  it("normaliza somente o email recebido explicitamente", () => {
    expect(
      parsePromotionArgs(["--email=USER@CAF.TEST", "--confirm=PROMOTE_ADMIN"]),
    ).toEqual({ email: "user@caf.test" });
  });

  it("promove e audita dentro da mesma transação", async () => {
    const transaction = {
      user: {
        findUnique: vi.fn().mockResolvedValue({
          id: "user-1",
          email: "user@caf.test",
          roles: [{ role: { key: "VIEWER" } }],
        }),
      },
      role: { findUnique: vi.fn().mockResolvedValue({ id: "role-admin" }) },
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

    await expect(
      promoteAdministrator(client as never, "user@caf.test"),
    ).resolves.toBe("user@caf.test");
    expect(transaction.userRole.create).toHaveBeenCalledWith({
      data: {
        userId: "user-1",
        roleId: "role-admin",
        assignedBy: "controlled-cli",
      },
    });
    expect(transaction.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        action: "ROLE_CHANGED",
        entityId: "user-1",
      }),
    });
  });

  it("propaga falha da auditoria para rollback da transação", async () => {
    const transaction = {
      user: {
        findUnique: vi.fn().mockResolvedValue({
          id: "user-1",
          email: "user@caf.test",
          roles: [],
        }),
      },
      role: { findUnique: vi.fn().mockResolvedValue({ id: "role-admin" }) },
      userRole: {
        deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
        create: vi.fn().mockResolvedValue({}),
      },
      auditLog: {
        create: vi.fn().mockRejectedValue(new Error("audit failed")),
      },
    };
    const client = {
      $transaction: vi.fn(
        (callback: (value: typeof transaction) => Promise<unknown>) =>
          callback(transaction),
      ),
    };

    await expect(
      promoteAdministrator(client as never, "user@caf.test"),
    ).rejects.toThrow("audit failed");
  });
});
