## 1. Contrato e modelo de dados

- [ ] 1.1 Usar o mapeamento nativo Evolution ↔ Chatwoot e o contrato Baileys já existente para editar a mensagem original; verificar o fluxo com teste de integração ou mock.
- [ ] 1.2 Identificar inboxes vinculadas à integração Evolution e validar que inboxes `whatsapp_cloud` não são elegíveis com testes de canal.

## 2. API e adaptador

- [ ] 2.1 Implementar a operação autenticada de edição local com validações de autoria, tipo, `source_id` e janela de 15 minutos; verificar os exemplos de aceitação e rejeição em spec de controller/serviço.
- [ ] 2.2 Atualizar a integração nativa Evolution/Baileys para receber `message.updated`, editar a mensagem original e não criar mensagem adicional; verificar sucesso e falha com teste de integração ou mock.
- [ ] 2.3 Registrar e comunicar falhas assíncronas da Evolution sem reverter automaticamente o conteúdo local; verificar que nenhuma mensagem adicional é criada.

## 3. Dashboard

- [ ] 3.1 Exibir a ação de editar somente para mensagens elegíveis de inbox compatível e verificar a ausência para Cloud API, anexos e mensagens vencidas.
- [ ] 3.2 Criar a interface de edição, estados de sucesso/erro e traduções em inglês; verificar que o evento de atualização substitui o conteúdo visível e mostra a marca de edição.

## 4. Verificação

- [ ] 4.1 Executar as specs Ruby e JavaScript adicionadas e o lint correspondente, registrando os comandos e resultados no PR.
- [ ] 4.2 Validar manualmente uma edição dentro de 15 minutos, uma tentativa expirada e uma falha de sincronização em uma inbox Evolution de homologação.
