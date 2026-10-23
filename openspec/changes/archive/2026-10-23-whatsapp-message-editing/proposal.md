## Why

Agentes precisam corrigir uma mensagem de texto logo após o envio sem criar uma nova mensagem no histórico. O WhatsApp limita essa ação a 15 minutos e a capacidade difere entre os provedores conectados ao produto.

## What Changes

- Disponibilizar a ação de editar para mensagens de texto de saída que o provedor WhatsApp conectado suporte, dentro de 15 minutos do envio.
- Garantir que a elegibilidade seja validada pelo servidor, além de ocultar a ação na interface quando ela não for permitida.
- Atualizar o conteúdo local e emitir o evento de atualização já entregue à integração nativa da Evolution.
- Fazer a Evolution editar a mensagem original no WhatsApp a partir do mapeamento existente, sem criar uma mensagem adicional no Chatwoot.
- Não oferecer edição para inboxes da WhatsApp Cloud API: a API oficial da Meta não expõe uma operação de edição de mensagens enviadas.
- Preservar a Cloud API oficial como não compatível com edição.

## Capabilities

### New Capabilities

- `whatsapp-message-editing`: Define a edição segura de mensagens de texto de saída conforme a capacidade do provedor WhatsApp.

### Modified Capabilities

- Nenhuma.

## Impact

- Dashboard: menu contextual, editor de mensagem e traduções da conversa.
- API de mensagens da conta: nova operação de edição, autorização e respostas de erro.
- Modelo de mensagem: marca de edição e evento de atualização em tempo real; o WhatsApp permanece responsável pelo histórico anterior.
- Integração nativa Evolution API/Baileys: recebe `message.updated`, edita a mensagem original no WhatsApp e sincroniza o resultado sem criar uma nova mensagem no Chatwoot.
- O adaptador `whatsapp_cloud` é explicitamente não compatível.
