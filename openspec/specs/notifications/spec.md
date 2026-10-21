## Purpose

Define a geração, leitura e entrega de notificações relacionadas à atividade de conversas.

## Requirements

### Requirement: Eventos relevantes geram notificações

O sistema SHALL criar notificações para usuários elegíveis quando ocorrer atividade de conversa que exija atenção.

#### Scenario: Nova mensagem em conversa atribuída
- **WHEN** uma nova mensagem recebida chega a uma conversa atribuída a um agente elegível
- **THEN** o sistema cria uma notificação para esse agente conforme suas preferências

### Requirement: Leitura de conversa atualiza notificações

O sistema SHALL marcar as notificações relevantes como lidas quando o usuário marcar a conversa como vista.

#### Scenario: Agente abre conversa com mensagens não lidas
- **WHEN** o agente registra a leitura da conversa
- **THEN** as notificações pendentes dessa conversa são atualizadas como lidas
