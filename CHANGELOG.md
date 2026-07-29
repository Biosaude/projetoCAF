# Changelog

Todas as mudanças relevantes serão documentadas neste arquivo, seguindo Keep a Changelog.

## [Unreleased]

### Added

- Fundação Next.js e arquitetura modular por domínio.
- Shell corporativo responsivo, componentes reutilizáveis e páginas vazias.
- Estrutura inicial de Prisma, Auth.js, logs, erros, qualidade e testes.
- Google OAuth com Auth.js e adapter oficial do Prisma.
- Proteção do portal, sessão segura, perfil do usuário e RBAC.
- Gestão administrativa de usuários e auditoria dos eventos de autenticação.
- Modelos Account, Session, VerificationToken, UserRole e RolePermission.
- Procedimento controlado e auditável para promover o primeiro Administrador.
- Cobertura V8 com limites mínimos para autenticação, usuários e auditoria.
- Pipelines de CI com PostgreSQL 16 e homologação OAuth manual assistida.
- Validador read-only da estrutura de autenticação em banco de teste.

### Changed

- Alterações de perfil/status e seus eventos de auditoria agora são atômicos.

### Fixed

- Build na Vercel sem credenciais de banco em tempo de compilação e versão do
  Node.js estabilizada em 22 LTS.

## [Unreleased] — Módulo 3

### Added

- Modelo PostgreSQL multi-organização para cadastros OPME, solicitações, e-mails estruturais, propostas e históricos.
- Repositories Prisma injetáveis, services de domínio, validators Zod, migration incremental e seed técnico idempotente.
- Documentação do modelo, dicionário de dados e mapa LGPD.

### Security

- Minimização de dados do paciente, checks de integridade, exclusão lógica e auditoria com snapshots JSON sem segredos.
