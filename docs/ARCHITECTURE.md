# Arquitetura

## Direção de dependências

Rotas compõem telas; componentes de feature acionam serviços; serviços dependem de contratos de repositório; adaptadores implementam esses contratos com Prisma. Domínios não devem importar implementações internas de outros domínios. Elementos transversais estáveis ficam nas camadas compartilhadas.

## Domínios

Authentication, Users, Email, Quotation, Hospital, Insurance, Supplier, Material, Audit e Dashboard possuem limites em `features`. Cada módulo oferece pontos de entrada para componentes, serviços, repositórios, tipos e validação.

## Decisões

- Server Components são o padrão; Client Components existem somente para interação ou bibliotecas client-side.
- TanStack Query prepara cache de estado remoto; TanStack Table renderiza tabelas desacopladas dos dados.
- Zod valida fronteiras; React Hook Form gerencia formulários; erros tipados normalizam falhas.
- O Prisma Client é singleton durante desenvolvimento e PostgreSQL é o único datasource.
- Auth.js está deliberadamente sem provedor até que a estratégia de identidade seja aprovada.
- Logger estruturado centraliza emissão e permite troca futura por um transportador observável.

## Identidade e acesso

- `features/authentication` concentra configuração, sessão, proteção, OAuth e RBAC.
- `features/users` concentra repositório, validações, casos de uso e UI administrativa de usuários.
- `features/audit` registra e consulta eventos de segurança por contrato de repositório.
- O adapter oficial Prisma persiste usuários e contas OAuth; a sessão atual usa JWT para ser validada no middleware sem Prisma no Edge.
- O middleware realiza autenticação ampla; layouts e ações server-side revalidam status e papéis diretamente no banco.
- Google solicita apenas `openid email profile`. Gmail API e escopos de mensagens não fazem parte deste módulo.

## Fundação persistente do Módulo 3

`Organization` delimita o tenant. Componentes e rotas não importam Prisma; cada domínio expõe validators Zod, contrato de repository, implementação Prisma com dependência injetada e service. Cadastros são desativados logicamente. Preços e históricos são temporais/imutáveis. A migration mantém colunas de tenant opcionais apenas nas tabelas legadas para preservar dados existentes, enquanto os services exigem organização para toda nova entrada.
