## Purpose

Define o acesso de agentes, administradores, equipes e bots às contas e inboxes do Chatwoot.

## Requirements

### Requirement: Acesso de usuário é limitado à conta

O sistema SHALL limitar a visualização e a administração de recursos à associação ativa do usuário com a conta.

#### Scenario: Agente acessa conta associada
- **WHEN** um agente autenticado abre uma conta da qual participa
- **THEN** o sistema disponibiliza apenas os recursos permitidos para sua função

#### Scenario: Usuário acessa conta não associada
- **WHEN** um usuário tenta acessar uma conta da qual não participa
- **THEN** o sistema nega o acesso

### Requirement: Equipes agrupam agentes para operação

O sistema SHALL permitir que administradores organizem agentes em equipes da mesma conta.

#### Scenario: Adicionar agente à equipe
- **WHEN** um administrador adiciona um agente elegível a uma equipe
- **THEN** o agente passa a integrar a equipe naquela conta
