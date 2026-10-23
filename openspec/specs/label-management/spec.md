## Purpose

Define a criação e a aplicação de labels para classificar conversas e contatos por conta.

## Requirements

### Requirement: Labels são isoladas por conta

O sistema SHALL criar labels no escopo de uma única conta e MUST impedir seu uso por outra conta.

#### Scenario: Criar label
- **WHEN** um administrador cria uma label com título válido
- **THEN** a label fica disponível para recursos da mesma conta

### Requirement: Aplicação de labels em conversas e contatos

O sistema SHALL permitir associar e remover labels de conversas e contatos autorizados.

#### Scenario: Marcar conversa
- **WHEN** um usuário adiciona uma label a uma conversa
- **THEN** a conversa passa a exibir a label

#### Scenario: Remover label de contato
- **WHEN** um usuário remove uma label de um contato
- **THEN** a associação deixa de constar no contato
