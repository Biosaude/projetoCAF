/** Contratos compartilhados de persistência. Repositórios específicos pertencem aos domínios. */
export interface Repository<TEntity, TId = string> {
  findById(id: TId): Promise<TEntity | null>;
}
