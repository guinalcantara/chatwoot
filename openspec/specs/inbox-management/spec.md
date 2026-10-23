## Purpose

Define como uma conta administra inboxes e associa cada inbox a um único tipo de canal.

## Requirements

### Requirement: Criação de inbox por canal permitido

O sistema SHALL permitir a criação de inbox para os tipos de canal suportados e MUST criar o canal e a inbox na mesma conta.

#### Scenario: Criar inbox WhatsApp

- **WHEN** um administrador autorizado cria uma inbox com canal WhatsApp e configuração válida
- **THEN** o sistema cria o canal WhatsApp e a inbox vinculada na conta

#### Scenario: Tipo de canal não permitido

- **WHEN** um cliente solicita uma inbox com tipo de canal não suportado
- **THEN** o sistema não cria uma inbox nem um canal

### Requirement: Alteração autorizada de inbox

O sistema SHALL permitir que usuários autorizados alterem os atributos da inbox e os atributos editáveis do respectivo canal.

#### Scenario: Atualizar configurações de uma inbox

- **WHEN** um usuário autorizado atualiza configurações permitidas de uma inbox
- **THEN** o sistema persiste as alterações da inbox e do canal quando aplicável

#### Scenario: Usuário sem acesso à inbox

- **WHEN** um usuário sem permissão tenta alterar uma inbox
- **THEN** o sistema rejeita a alteração
