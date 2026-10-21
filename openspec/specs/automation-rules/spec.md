## Purpose

Define regras automáticas que avaliam eventos de conversa e executam ações configuradas pela conta.

## Requirements

### Requirement: Regras avaliam condições configuradas

O sistema SHALL avaliar regras ativas para os eventos de conversa compatíveis e executar ações somente quando as condições forem satisfeitas.

#### Scenario: Condições satisfeitas
- **WHEN** um evento de conversa satisfaz todas as condições de uma regra ativa
- **THEN** o sistema executa as ações configuradas para a regra

#### Scenario: Condições não satisfeitas
- **WHEN** um evento não satisfaz as condições de uma regra ativa
- **THEN** o sistema não executa as ações da regra

### Requirement: Regras podem ser desativadas

O sistema MUST ignorar regras inativas.

#### Scenario: Evento em regra inativa
- **WHEN** ocorre um evento compatível com uma regra inativa
- **THEN** nenhuma ação da regra é executada
