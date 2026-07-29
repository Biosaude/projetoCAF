import { describe, expect, it, vi } from "vitest";
import {
  SYSTEM_ROLES,
  UserProvisioningService,
  type ProvisioningRepository,
} from "@/features/authentication/services/user-provisioning.service";

describe("primeiro acesso", () => {
  it("provisiona usuário com os quatro perfis do sistema", async () => {
    const repository: ProvisioningRepository = {
      provision: vi.fn().mockResolvedValue(undefined),
    };
    await new UserProvisioningService(repository).provisionFirstAccess(
      "user-1",
    );
    expect(repository.provision).toHaveBeenCalledWith("user-1", SYSTEM_ROLES);
    expect(SYSTEM_ROLES.map(({ key }) => key)).toEqual([
      "ADMIN",
      "MANAGER",
      "ANALYST",
      "VIEWER",
    ]);
  });
});
