## Purpose

Define campanhas de envio único e sua entrega aos contatos elegíveis de uma inbox.

## Requirements

### Requirement: Campanhas usam inbox compatível

O sistema SHALL criar campanhas somente para inboxes e tipos de campanha compatíveis.

#### Scenario: Criar campanha WhatsApp elegível
- **WHEN** um usuário autorizado cria uma campanha WhatsApp com inbox e conteúdo válidos
- **THEN** o sistema registra a campanha para processamento

### Requirement: Entrega respeita elegibilidade de destinatário

O sistema MUST enviar uma campanha somente a contatos que atendam aos critérios e às restrições do canal.

#### Scenario: Contato elegível
- **WHEN** a campanha é processada para um contato elegível
- **THEN** o sistema agenda a mensagem da campanha para esse contato

#### Scenario: Contato inelegível
- **WHEN** um contato não atende às restrições do canal ou aos filtros da campanha
- **THEN** o sistema não envia a campanha ao contato
