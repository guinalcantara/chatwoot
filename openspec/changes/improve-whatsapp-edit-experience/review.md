# Revisão da implementação

## Comportamento

- A ação Editar permanece no menu de mensagem própria de texto de uma inbox compatível durante a confirmação de envio e após os 15 minutos. Mensagens incompatíveis continuam sem a ação.
- O clique informa quando a confirmação ainda está pendente ou o prazo terminou. A API continua validando a elegibilidade ao salvar.
- Um prefixo inicial `**Nome:**` com o nome do remetente fica fora do campo de edição e é preservado no conteúdo enviado. Texto sem assinatura correspondente permanece integral.
- Enter, Cmd/Ctrl+Enter e Shift+Enter seguem a preferência de envio existente.

## Verificações

- `pnpm vitest run app/javascript/dashboard/components-next/message/messageEditing.spec.js`: 14 testes passaram.
- `pnpm exec eslint app/javascript/dashboard/components-next/message/messageEditing.js app/javascript/dashboard/components-next/message/messageEditing.spec.js app/javascript/dashboard/components-next/message/Message.vue app/javascript/dashboard/modules/conversations/components/MessageContextMenu.vue`: passou.
- JSON de `en/conversation.json` e `pt_BR/conversation.json`: válido.
- `openspec validate improve-whatsapp-edit-experience --strict`: passou.
- `git diff --check`: passou.

Não foi executado teste manual em navegador com WhatsApp real nesta sessão.
