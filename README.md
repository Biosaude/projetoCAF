# CAF Gestão

Fundação corporativa para centralizar solicitações, cadastros e auditoria do processo administrativo de cotações. Esta primeira entrega estabelece somente arquitetura, interface e infraestrutura — sem regras da planilha OPME, Gmail, parser, cálculos financeiros ou IA.

## Stack

Next.js 15 (App Router), React 19, TypeScript strict, Tailwind CSS, componentes shadcn/ui, Prisma/PostgreSQL, Auth.js, Zod, React Hook Form, TanStack Query/Table, Vitest, Testing Library e Playwright.

## Início rápido

1. Use Node.js 20 ou superior e execute `npm install`.
2. Copie `.env.example` para `.env` e ajuste `DATABASE_URL` e `AUTH_SECRET`.
3. Execute `npx prisma generate` e, com PostgreSQL disponível, `npx prisma migrate dev`.
4. Inicie com `npm run dev` e acesse `http://localhost:3000`.

## Arquitetura

- `app`: composição de rotas e layouts, sem lógica de domínio.
- `features`: módulos verticais com componentes, serviços, repositórios, tipos e validadores próprios.
- `components`: design system, layout e blocos verdadeiramente compartilhados.
- `lib`, `services`, `repositories`: adaptadores e contratos transversais.
- `prisma`: estrutura inicial de persistência PostgreSQL.
- `tests`: testes unitários, de integração visual e end-to-end.

Consulte [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) e [`CONTRIBUTING.md`](CONTRIBUTING.md) antes de alterar o projeto.
