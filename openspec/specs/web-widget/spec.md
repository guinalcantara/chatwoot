## Purpose

Define o canal de widget web para iniciar conversas e trocar mensagens com visitantes identificados ou anônimos.

## Requirements

### Requirement: Widget cria conversa no canal configurado

O sistema SHALL permitir que um visitante autorizado pelo token do widget inicie conversa na inbox Web Widget configurada.

#### Scenario: Visitante inicia conversa
- **WHEN** um visitante envia a primeira mensagem válida pelo widget
- **THEN** o sistema cria ou reutiliza a conversa aplicável na inbox do widget

### Requirement: Identificação do visitante preserva contexto

O sistema SHALL associar a identidade fornecida pelo visitante ao contato do widget sem expor contatos de outra conta.

#### Scenario: Widget identifica visitante existente
- **WHEN** um visitante fornece uma identidade reconhecida para a conta
- **THEN** o sistema vincula a sessão ao contato correspondente
