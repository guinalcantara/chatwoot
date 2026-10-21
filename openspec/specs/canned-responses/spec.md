## Purpose

Define respostas salvas reutilizáveis para acelerar mensagens de agentes na mesma conta.

## Requirements

### Requirement: Respostas salvas pertencem à conta

O sistema SHALL permitir que usuários autorizados criem, editem, consultem e removam respostas salvas no escopo da conta.

#### Scenario: Criar resposta salva
- **WHEN** um usuário autorizado cria uma resposta com conteúdo válido
- **THEN** a resposta fica disponível para os agentes da conta

#### Scenario: Consultar resposta de outra conta
- **WHEN** um usuário tenta consultar uma resposta salva de outra conta
- **THEN** o sistema não expõe a resposta

### Requirement: Uso de resposta salva não envia automaticamente

O sistema MUST inserir uma resposta salva no editor como conteúdo de rascunho antes do envio pelo agente.

#### Scenario: Selecionar resposta salva
- **WHEN** um agente seleciona uma resposta salva em uma conversa
- **THEN** o conteúdo é inserido no editor sem criar mensagem até a confirmação de envio
