# Orientações para agentes

- Preserve a arquitetura por domínio. Código específico pertence a `features/<domínio>`; `components`, `services` e `lib` recebem somente infraestrutura compartilhada.
- Não implemente integrações externas ou regras de negócio sem uma decisão arquitetural documentada.
- Evite acesso direto ao Prisma em componentes. Use contratos de repositório e injeção de dependências nos serviços.
- Toda alteração deve passar por `npm run lint`, `npm run type-check`, `npm run test` e `npm run build`.
- Use o logger estruturado em vez de chamadas diretas a `console` fora do próprio logger.
- Autenticação pertence a `features/authentication`; gestão de identidades pertence a `features/users`; eventos pertencem a `features/audit`.
- Não adicione login por senha. O único provedor habilitado é Google OAuth com `openid email profile`.
- Não solicite escopos do Gmail nem implemente acesso a mensagens antes do Módulo 3.
- Toda rota dentro de `(portal)` deve permanecer protegida e toda ação administrativa deve validar RBAC no servidor.
- A promoção inicial de Administrador só pode ocorrer pelo script controlado, com email e confirmação explícitos; nunca automatize essa promoção.
- Alterações administrativas e seus AuditLogs devem compartilhar a mesma transação de repositório.
- A pipeline principal nunca deve executar OAuth real nem receber credenciais Google reais; homologação OAuth é manual assistida no ambiente protegido.
- O Módulo 3 limita-se à fundação persistente: não adicione Gmail, IA, geração automática de propostas ou cálculo financeiro.
- Novas gravações de domínio devem exigir `organizationId`; a nulabilidade no schema de tabelas legadas existe somente para migração não destrutiva.
- Valores monetários usam `Decimal`; históricos e preços vigentes não devem ser sobrescritos ou excluídos.
