## Purpose

Define a atribuição de conversas a agentes, equipes e políticas automáticas de distribuição.

## Requirements

### Requirement: Atribuição manual de conversa

O sistema SHALL permitir que usuários autorizados atribuam uma conversa a um agente ou equipe elegível na inbox.

#### Scenario: Atribuir a agente elegível
- **WHEN** um usuário atribui uma conversa a um agente elegível
- **THEN** a conversa passa a indicar o agente como responsável

#### Scenario: Atribuir agente não elegível
- **WHEN** um usuário tenta atribuir uma conversa a agente sem acesso à inbox
- **THEN** o sistema rejeita a atribuição

### Requirement: Distribuição automática respeita capacidade

O sistema SHALL aplicar políticas de atribuição automática quando a inbox as habilitar.

#### Scenario: Nova conversa em inbox com distribuição ativa
- **WHEN** uma nova conversa elegível chega a uma inbox com atribuição automática ativa
- **THEN** o sistema seleciona um responsável conforme a política configurada
