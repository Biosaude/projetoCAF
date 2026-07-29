# Mapa LGPD

## Classificação

| Classe                           | Campos                                                                                                     | Tratamento                                                                     |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Dados comuns                     | nomes empresariais, códigos, produtos, preços                                                              | acesso conforme RBAC e organização                                             |
| Potencialmente pessoais          | `User.name/email/image`, remetentes/destinatários, médico solicitante, `patientReference`, IP e user-agent | minimização, auditoria e retenção futura                                       |
| Conteúdo potencialmente sensível | corpo e anexos de e-mail                                                                                   | persistência preparada; integração, leitura e retenção ainda não implementadas |
| Não permitido                    | diagnóstico, prontuário, documento, nome completo ou dados clínicos detalhados do paciente                 | não há campos dedicados; validators descartam propriedades desconhecidas       |

`patientReference` deve conter somente referência pseudonimizada. Binários não são gravados no PostgreSQL: `EmailAttachment.storageKey` reserva uma referência para storage futuro. Tokens, cookies, segredos e credenciais nunca pertencem a `AuditLog.metadata`, `before` ou `after`.

Retenção, anonimização e eliminação serão definidas em decisão arquitetural futura. Até lá, timestamps, histórico imutável, organização e auditoria fornecem a rastreabilidade mínima sem ampliar a coleta.
