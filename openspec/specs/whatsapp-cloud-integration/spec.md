## Purpose

Define a troca de mensagens e a segurança de webhooks para inboxes conectadas à WhatsApp Cloud API oficial.

## Requirements

### Requirement: Envio pela Cloud API dentro da janela de conversa

O sistema SHALL enviar mensagens de sessão de uma inbox WhatsApp Cloud API somente quando a conversa puder receber resposta livre. Fora dessa janela, o sistema MUST marcar a mensagem como falha em vez de enviá-la.

#### Scenario: Resposta durante janela ativa

- **WHEN** um agente envia uma mensagem de sessão em uma conversa WhatsApp elegível
- **THEN** o sistema envia a mensagem pela Cloud API e armazena o identificador externo retornado

#### Scenario: Resposta fora da janela ativa

- **WHEN** um agente envia uma mensagem de sessão em uma conversa WhatsApp sem janela ativa
- **THEN** o sistema não envia a mensagem e registra a falha de janela de conversação

### Requirement: Processamento autenticado de webhook WhatsApp

O sistema MUST verificar a assinatura de payloads de webhook quando a configuração do canal Cloud API exigir verificação antes de enfileirar o processamento.

#### Scenario: Webhook com assinatura válida

- **WHEN** a Cloud API envia um webhook com assinatura válida para um canal ativo
- **THEN** o sistema responde com sucesso e agenda o processamento assíncrono do evento

#### Scenario: Webhook com assinatura inválida

- **WHEN** um webhook exige assinatura e a assinatura recebida é inválida
- **THEN** o sistema rejeita o payload e não agenda seu processamento

### Requirement: Mensagens e status recebidos da Cloud API

O sistema SHALL criar ou atualizar registros de mensagem a partir de eventos válidos recebidos da Cloud API e MUST deduplicar eventos da mesma mensagem externa.

#### Scenario: Receber nova mensagem externa

- **WHEN** a Cloud API entrega uma mensagem ainda não processada para uma inbox ativa
- **THEN** o sistema associa o contato e a conversa corretos e registra a mensagem com seu identificador externo

#### Scenario: Receber status de mensagem conhecida

- **WHEN** a Cloud API entrega um status para uma mensagem externa conhecida
- **THEN** o sistema atualiza o status de entrega correspondente
