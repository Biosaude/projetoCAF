# Validação do Módulo 2

## Migration

A migration `20260729172000_google_auth` foi revisada estaticamente para PostgreSQL 16. Ela usa enums, tabelas, índices, constraints, foreign keys e `INSERT ... ON CONFLICT` suportados nessa versão.

Os modelos Auth.js (`Account`, `Session`, `VerificationToken`), as relações explícitas (`UserRole`, `RolePermission`), `AuditLog` e os enums de identidade são criados antes das respectivas constraints. O seed contém somente os quatro perfis de sistema e não contém email, credencial ou dado de produção.

O SQL completo não deve ser executado manualmente duas vezes. A idempotência operacional é responsabilidade do Prisma Migrate, que registra a migration em `_prisma_migrations`; reexecuções de `prisma migrate deploy` não reaplicam migrations concluídas. O `ON CONFLICT` do seed protege especificamente as chaves dos perfis.

Compatibilidade real, estado de constraints e ausência de drift somente ficam aprovados depois que CI executar `migrate deploy`, `migrate status` e `db:validate-auth` contra o service PostgreSQL 16.

## Homologação OAuth manual assistida

Automatizar credenciais Google com email e senha é frágil e pode violar MFA, CAPTCHA ou políticas organizacionais. A workflow manual prepara banco e aplicação, mas um revisor humano deve:

1. abrir `/dashboard` sem sessão e registrar o redirecionamento para `/login`;
2. confirmar que existe somente “Entrar com Google” e nenhum campo de senha;
3. autenticar em conta de teste respeitando consentimento e MFA;
4. confirmar callback `/api/auth/callback/google` e Dashboard;
5. verificar no banco `User`, `Account`, status `ACTIVE`, perfil `VIEWER` e `AuditLog`;
6. efetuar logout e confirmar novo bloqueio da rota privada;
7. testar separadamente `INACTIVE`, `BLOCKED` e `PENDING`;
8. promover um Administrador pelo script controlado e validar RBAC/auditoria;
9. nunca anexar tokens, cookies, senhas ou secrets às evidências.

## Content-Security-Policy

CSP permanece pendente. Ela deve ser validada com nonces/hashes do Next.js, endpoints Auth.js, imagens do Google e callbacks OAuth. Não foi adicionada uma política permissiva ou não testada apenas para satisfazer checklist.
