## Why

A ação de editar uma mensagem Evolution desaparece enquanto o identificador externo não chega e depois de 15 minutos. Isso torna difícil encontrá-la e não explica ao agente por que a edição está indisponível. O editor também expõe a assinatura que já veio no conteúdo da mensagem.

## What Changes

- Mostrar a ação Editar no menu de mensagens próprias de texto em inboxes que suportam edição, mesmo quando o envio ainda aguarda confirmação ou o prazo terminou.
- Ao selecionar a ação, informar por alerta quando falta a confirmação do envio ou quando a janela de 15 minutos expirou; abrir o editor apenas para mensagens atualmente elegíveis.
- No editor, ocultar o prefixo de assinatura reconhecido no conteúdo e preservá-lo ao salvar, para que o agente edite apenas o corpo da mensagem.
- Preservar a restrição atual para Cloud API, anexos, templates, mensagens privadas, excluídas e mensagens de outros agentes.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `whatsapp-message-editing`: descoberta da ação, feedback de indisponibilidade e edição do corpo sem expor a assinatura.

## Impact

- Interface de mensagens em `components-next/message` e menu contextual em `modules/conversations/components`.
- Textos de interface localizados no dashboard; API e contrato com a Evolution permanecem os mesmos.
