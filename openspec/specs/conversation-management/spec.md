## Purpose

Define o ciclo de vida observável das conversas entre contatos, inboxes e agentes em uma conta Chatwoot.

## Requirements

### Requirement: Conversas pertencem a uma conta, inbox e contato

O sistema SHALL criar uma conversa no escopo da conta autenticada, vinculada a uma inbox e a uma identidade de contato existente nessa inbox.

#### Scenario: Criar conversa para um contato de inbox

- **WHEN** um usuário autorizado cria uma conversa informando uma inbox e uma identidade de contato pertencentes à conta
- **THEN** o sistema cria a conversa no escopo dessa conta e inbox

#### Scenario: Acessar recurso fora da conta

- **WHEN** um usuário tenta acessar uma conversa de outra conta
- **THEN** o sistema não expõe a conversa ao usuário

### Requirement: Conversas controlam seu estado operacional

O sistema SHALL permitir que usuários autorizados alterem o estado operacional de uma conversa entre os estados suportados e MUST notificar os consumidores em tempo real sobre a alteração.

#### Scenario: Resolver uma conversa aberta

- **WHEN** um agente autorizado altera uma conversa aberta para resolvida
- **THEN** a conversa passa a ter estado resolvido e os clientes conectados recebem a atualização

#### Scenario: Reabrir uma conversa

- **WHEN** um agente autorizado altera uma conversa resolvida para aberta
- **THEN** a conversa volta ao estado aberto
