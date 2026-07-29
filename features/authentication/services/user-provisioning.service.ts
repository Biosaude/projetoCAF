import type { RoleKey } from "../types/auth.types";

export const SYSTEM_ROLES = [
  {
    key: "ADMIN",
    name: "Administrador",
    description: "Acesso administrativo completo.",
  },
  {
    key: "MANAGER",
    name: "Gestor",
    description: "Gestão operacional e acompanhamento.",
  },
  {
    key: "ANALYST",
    name: "Analista",
    description: "Execução e análise das operações.",
  },
  {
    key: "VIEWER",
    name: "Visualizador",
    description: "Acesso somente para consulta.",
  },
] satisfies Array<{ key: RoleKey; name: string; description: string }>;

export interface ProvisioningRepository {
  provision(userId: string, roles: typeof SYSTEM_ROLES): Promise<void>;
}

export class UserProvisioningService {
  constructor(private readonly repository: ProvisioningRepository) {}
  provisionFirstAccess(userId: string) {
    return this.repository.provision(userId, SYSTEM_ROLES);
  }
}
