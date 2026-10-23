## Purpose

Define a consulta de métricas operacionais de conversas em recortes autorizados de conta e período.

## Requirements

### Requirement: Relatórios são isolados por conta

O sistema SHALL retornar métricas somente dos recursos pertencentes à conta solicitante.

#### Scenario: Consultar relatório de conta
- **WHEN** um usuário autorizado consulta métricas para um período
- **THEN** o sistema retorna somente dados da conta atual no período solicitado

### Requirement: Relatórios aceitam filtros suportados

O sistema SHALL aplicar filtros suportados de inbox, agente, equipe e label ao calcular métricas.

#### Scenario: Filtrar por inbox
- **WHEN** um usuário consulta relatório filtrado por uma inbox da conta
- **THEN** o sistema calcula as métricas apenas para a inbox informada
