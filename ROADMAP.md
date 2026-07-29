# Roadmap

## Módulo 1 — Fundação (concluído)

- Arquitetura, design system, persistência inicial, segurança preparada, qualidade e testes.

## Módulo 2 — Identidade e acesso (atual)

- Google OAuth, criação automática de usuários, RBAC, gestão de status/perfis e auditoria de autenticação.
- Antes do merge: gerar lockfile em registry acessível e obter aprovação das pipelines, PostgreSQL, coverage, E2E público e homologação OAuth manual.

## Próximas etapas (não incluídas nesta entrega)

- Implementar casos de uso e persistência dos cadastros.
- Definir, validar e somente então desenvolver o módulo OPME.
- Avaliar separadamente Gmail, processamento de mensagens, cálculos e IA.

Cada etapa futura exige critérios de aceite, avaliação de segurança e decisão arquitetural própria.

## Estado atualizado

- Módulo 2 — desenvolvido; homologação externa de OAuth/PostgreSQL permanece pendente.
- Módulo 3 — em desenvolvimento nesta branch: fundação de dados, sem integrações, IA ou motor financeiro.
