## Purpose

Define o cadastro, a consulta e a manutenção de contatos e de suas identidades por inbox.

## Requirements

### Requirement: Contatos pertencem à conta

O sistema SHALL criar e consultar contatos somente no escopo da conta autenticada.

#### Scenario: Criar contato
- **WHEN** um usuário autorizado cria um contato com atributos válidos
- **THEN** o contato fica disponível somente na conta atual

### Requirement: Identidade de contato é vinculada à inbox

O sistema SHALL associar identificadores externos de contato à inbox que os utiliza.

#### Scenario: Receber mensagem com nova identidade
- **WHEN** um canal recebe uma mensagem de um identificador externo ainda não associado
- **THEN** o sistema cria ou associa a identidade à inbox correspondente

### Requirement: Contatos suportam atributos e labels

O sistema SHALL permitir atributos personalizados e labels para segmentação de contatos.

#### Scenario: Atualizar atributo de contato
- **WHEN** um usuário autorizado atualiza um atributo permitido de um contato
- **THEN** o sistema persiste o novo valor no contato
