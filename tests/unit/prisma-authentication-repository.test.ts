import { beforeEach, describe, expect, it, vi } from "vitest";
import { PrismaAuthenticationRepository } from "@/features/authentication/repositories/prisma-authentication.repository";

const database = {
  user: { findUnique: vi.fn(), update: vi.fn() },
  auditLog: { create: vi.fn() },
  $transaction: vi.fn(),
};

describe("PrismaAuthenticationRepository", () => {
  beforeEach(() => vi.clearAllMocks());

  it("maps the persisted user and roles to the authentication boundary", async () => {
    database.user.findUnique.mockResolvedValue({
      id: "user-1",
      name: "Usuário",
      email: "user@example.com",
      image: null,
      status: "ACTIVE",
      roles: [{ role: { key: "VIEWER" } }],
    });

    const repository = new PrismaAuthenticationRepository(database as never);
    await expect(repository.findAuthenticatedUser("user-1")).resolves.toEqual({
      id: "user-1",
      name: "Usuário",
      email: "user@example.com",
      image: null,
      status: "ACTIVE",
      roles: ["VIEWER"],
    });
  });

  it("records login metadata and audit atomically", async () => {
    database.user.update.mockReturnValue({ operation: "update-user" });
    database.auditLog.create.mockReturnValue({ operation: "audit-login" });
    database.$transaction.mockResolvedValue([]);
    const repository = new PrismaAuthenticationRepository(database as never);

    await repository.recordLogin({
      userId: "user-1",
      provider: "google",
      ipAddress: "127.0.0.1",
      userAgent: "test-agent",
    });

    expect(database.$transaction).toHaveBeenCalledWith([
      { operation: "update-user" },
      { operation: "audit-login" },
    ]);
  });

  it("does not place tokens, cookies or secrets in denied-access audit", async () => {
    database.auditLog.create.mockResolvedValue({ id: "audit-1" });
    const repository = new PrismaAuthenticationRepository(database as never);

    await repository.recordAccessDenied({
      userId: "user-1",
      entity: "Route",
      entityId: "/usuarios",
      reason: "ROLE_REQUIRED",
      metadata: { requiredRole: "ADMIN" },
    });

    const payload = database.auditLog.create.mock.calls[0]?.[0];
    expect(JSON.stringify(payload)).not.toMatch(/token|cookie|secret/i);
    expect(payload.data.metadata).toEqual({
      reason: "ROLE_REQUIRED",
      requiredRole: "ADMIN",
    });
  });
});
