# CAF Gestão

Plataforma corporativa para centralizar solicitações, cadastros, autenticação e auditoria do processo administrativo de cotações. O projeto ainda não contém Gmail API, leitura ou parsing de mensagens, planilha OPME, cálculos financeiros ou IA.

## Stack

Next.js 15 com App Router, React 19, TypeScript strict, Tailwind CSS, shadcn/ui, Prisma/PostgreSQL, Auth.js, Google OAuth, Zod, React Hook Form, TanStack Query/Table, Vitest, Testing Library e Playwright.

## Configuração local

1. Use Node.js 22 e execute `npm ci`. O comando exige `package-lock.json` versionado e sincronizado; não substitua por instalação não determinística em CI.
2. Copie `.env.example` para `.env.local`.
3. Configure PostgreSQL em `DATABASE_URL`.
4. Gere um segredo com `npx auth secret` e salve em `AUTH_SECRET`.
5. Configure as credenciais Google descritas abaixo.
6. Execute `npx prisma migrate deploy` e `npx prisma generate`.
7. Inicie com `npm run dev` e acesse `http://localhost:3000`.

### Validação local

Com PostgreSQL de teste disponível e as variáveis configuradas, execute:

```bash
npm ci
npx prisma generate
npx prisma migrate deploy
npx prisma migrate status
NODE_ENV=test npm run db:validate-auth
npm run lint
npm run type-check
npm run test
npm run test:coverage
npm run format:check
npm run build
npx playwright install chromium
npm run test:e2e
```

`db:validate-auth` é somente leitura e recusa execução quando `NODE_ENV` não é `test`.

## Google OAuth

### Criar credenciais

1. No Google Cloud Console, crie ou selecione um projeto.
2. Em **Google Auth Platform**, configure a tela de consentimento.
3. Solicite somente os escopos básicos `openid`, `email` e `profile`.
4. Em **Clients**, crie um cliente **Web application**.
5. Adicione `http://localhost:3000` às origens JavaScript autorizadas.
6. Adicione `http://localhost:3000/api/auth/callback/google` às URIs de redirecionamento.
7. Copie o Client ID e Client Secret para `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`.

Não habilite Gmail API e não adicione escopos como `gmail.readonly`. A conexão com Gmail pertence exclusivamente ao Módulo 3.

### Callback de produção

Para cada domínio usado em produção, cadastre `https://SEU_DOMINIO/api/auth/callback/google`. O domínio de `AUTH_URL` e a callback cadastrada no Google devem coincidir exatamente, inclusive protocolo e ausência de barra final.

## Deploy na Vercel

1. Configure Node.js 22.
2. Adicione as variáveis abaixo em **Project Settings → Environment Variables** para Production e Preview conforme aplicável.
3. Cadastre cada domínio de deploy estável e sua callback no cliente OAuth do Google.
4. Execute a migration contra o PostgreSQL de produção antes de liberar o tráfego.
5. Faça o primeiro login e atribua o perfil Administrador por procedimento operacional controlado no banco; novos usuários recebem Visualizador por padrão.

O build usa uma URL PostgreSQL exclusivamente sintática durante `prisma generate` quando `DATABASE_URL` não existe. Ela não abre conexão e nunca substitui a credencial necessária em runtime.

### Promover o primeiro Administrador

O sistema nunca promove automaticamente o primeiro usuário. Depois que a pessoa fizer o primeiro login e o usuário existir no banco, um operador com acesso ao ambiente deve executar deliberadamente:

```bash
npm run admin:promote -- --email=usuario@empresa.com --confirm=PROMOTE_ADMIN
```

O comando exige o email explícito e a confirmação literal, valida usuário e perfil dentro de uma transação, substitui o perfil atual por Administrador e cria um `AuditLog`. Não existe email privilegiado fixo no código. Execute somente com `DATABASE_URL` apontando para o ambiente pretendido e registre a aprovação operacional fora do sistema.

## Variáveis de ambiente

| Variável               | Obrigatória | Finalidade                                       |
| ---------------------- | ----------- | ------------------------------------------------ |
| `DATABASE_URL`         | Sim         | Conexão PostgreSQL em runtime e migrations       |
| `AUTH_SECRET`          | Sim         | Assinatura e criptografia dos tokens do Auth.js  |
| `AUTH_URL`             | Sim         | URL canônica da aplicação                        |
| `GOOGLE_CLIENT_ID`     | Sim         | Identificador do cliente OAuth                   |
| `GOOGLE_CLIENT_SECRET` | Sim         | Segredo do cliente OAuth; nunca expor no browser |
| `LOG_LEVEL`            | Não         | Nível do logger estruturado                      |

## Autenticação e RBAC

- Login exclusivo com Google e estratégia de sessão JWT de oito horas.
- Cookies seguros são exigidos em produção; CSRF e OAuth state são administrados pelo Auth.js.
- Novos usuários são criados pelo adapter Prisma, ativados e associados ao perfil Visualizador.
- Perfis disponíveis: Administrador, Gestor, Analista e Visualizador.
- Usuários inativos, bloqueados ou pendentes não acessam o portal.
- Usuários e auditoria são áreas exclusivas do Administrador.
- Login, logout, primeiro acesso, alteração de perfil/status e acesso negado são auditados.
- Nem a interface nem as ações server-side permitem que um Administrador altere o próprio perfil ou desative a própria conta.

O modelo `Session` permanece disponível para uma futura decisão por sessões persistidas, mas a estratégia atual é JWT para permitir proteção no middleware sem executar Prisma no Edge runtime.

## Integração contínua

`.github/workflows/ci.yml` valida Node.js 22, instalação reproduzível, PostgreSQL 16, migrations, estrutura do banco, lint, tipos, testes, coverage, formatação, build, Prisma, diff e E2E público. A pipeline usa apenas credenciais fictícias e não executa OAuth real.

`.github/workflows/e2e-auth.yml` é manual e recebe secrets do ambiente protegido `auth-homologation`. Ela não digita senha Google nem tenta contornar CAPTCHA ou MFA. A homologação OAuth é manual assistida: um revisor valida consentimento, callback, criação de `User`/`Account`, perfil Visualizador, Dashboard, logout e bloqueios de status no ambiente de teste, registrando evidências sem copiar tokens, cookies ou secrets.

## Limitações conhecidas

- OAuth Google real ainda deve ser homologado com credenciais e banco exclusivos de teste.
- Uma Content-Security-Policy deve ser projetada e testada com scripts do Next.js/Auth.js antes de ser ativada; adicionar uma política não testada poderia bloquear login ou hidratação. Os demais headers defensivos permanecem habilitados.
- O workflow depende de `package-lock.json`; se ele estiver ausente, gere-o em ambiente com registry npm acessível, revise e versione antes do merge.

## Arquitetura

- `app`: composição de rotas e layouts, sem regras de domínio.
- `features`: módulos verticais com componentes, serviços, repositórios, tipos e validadores próprios.
- `components`: design system, layout e blocos verdadeiramente compartilhados.
- `lib`, `services`, `repositories`: adaptadores e contratos transversais.
- `prisma`: schema e migrations PostgreSQL.
- `tests`: testes unitários, de componentes e end-to-end.

Consulte [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) e [`CONTRIBUTING.md`](CONTRIBUTING.md) antes de alterar o projeto.

## Fundação de banco do Módulo 3

O schema multi-organização, sua migration incremental e o seed técnico são descritos em [docs/DATABASE_MODEL.md](docs/DATABASE_MODEL.md), [docs/DATA_DICTIONARY.md](docs/DATA_DICTIONARY.md) e [docs/LGPD_DATA_MAP.md](docs/LGPD_DATA_MAP.md).

```bash
npm ci
npx prisma generate
npx prisma migrate deploy
npm run db:seed
npm run test
```

O seed é idempotente e contém somente roles e permissões técnicas. Não contém organização, hospital, fornecedor, material, paciente, preço, e-mail ou usuário real. O Módulo 3 não acessa Gmail, não executa IA, não gera propostas e não calcula preços.
