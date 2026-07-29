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
