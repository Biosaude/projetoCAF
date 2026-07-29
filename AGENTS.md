# Orientações para agentes

- Preserve a arquitetura por domínio. Código específico pertence a `features/<domínio>`; `components`, `services` e `lib` recebem somente infraestrutura compartilhada.
- Não implemente integrações externas ou regras de negócio sem uma decisão arquitetural documentada.
- Evite acesso direto ao Prisma em componentes. Use contratos de repositório e injeção de dependências nos serviços.
- Toda alteração deve passar por `npm run lint`, `npm run type-check`, `npm run test` e `npm run build`.
- Use o logger estruturado em vez de chamadas diretas a `console` fora do próprio logger.
