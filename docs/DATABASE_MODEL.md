# Modelo de dados — Módulo 3

## Decisões

- **Multi-organização:** `Organization` é a raiz de isolamento. Relações adicionadas a tabelas legadas são temporariamente opcionais para que a migration não apague nem invente uma organização para dados existentes; os validators exigem `organizationId` em novas gravações.
- **Identificadores:** todos os novos registros usam CUID, mantendo o padrão do Auth.js existente.
- **Histórico:** preços são registros temporais em `SupplierMaterial`; mudanças de solicitação e proposta usam históricos imutáveis, sem `updatedAt`.
- **Exclusão lógica:** cadastros mestres usam `active`; repositories expõem `deactivate`, nunca exclusão física.
- **Dinheiro:** `Decimal(18,4)` é usado em todo valor monetário. Este módulo apenas persiste valores e não os calcula.
- **Confiança:** extração e correspondência usam `Decimal(5,4)` no intervalo fechado de 0 a 1. Não há IA neste módulo.

## Relações principais

`Organization` agrega usuários, hospitais, convênios, fornecedores, fabricantes, materiais, mensagens, solicitações, propostas e auditoria. Hospitais e convênios relacionam-se por `HospitalInsurance`. Fabricantes possuem marcas; materiais pertencem a categoria hierárquica e, opcionalmente, marca. `SupplierMaterial` registra oferta, preço e vigência sem sobrescrever histórico.

`QuotationRequest` referencia hospital, convênio, e-mail estrutural e responsável. Seus itens podem ser identificados posteriormente. `QuotationProposal` versiona uma representação persistente revisável; seus itens armazenam somente valores informados, sem motor financeiro. Históricos usam FKs restritivas para preservar rastreabilidade.

## Índices e constraints

Índices privilegiam tenant, status, atividade, datas e FKs de consulta. Uniques compostos protegem códigos por organização, hospital/convênio, oferta/vigência e versões de proposta. Checks SQL protegem quantidades, valores não negativos, confiança e períodos válidos. Os valores legados `DRAFT`, `OPEN` e `CLOSED` de `QuotationStatus` permanecem apenas para migração não destrutiva.
