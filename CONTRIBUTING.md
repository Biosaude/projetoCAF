# Contribuindo

## Fluxo

1. Crie uma branch curta a partir da base atual.
2. Mantenha mudanças específicas dentro do domínio responsável.
3. Adicione ou atualize testes e documentação.
4. Execute lint, verificação de tipos, testes e build.
5. Use Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).

Não acople UI ao Prisma, não espalhe `console.log` e não exponha segredos no repositório. Novos casos de uso devem depender de interfaces, recebendo implementações por injeção de dependências.
