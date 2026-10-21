## Context

Veja `proposal.md` para a motivação. O Chatwoot já entrega mensagens de saída em segundo plano e persiste o identificador externo em `messages.source_id`. O endpoint `PATCH /conversations/:conversation_id/messages/:id` existente aceita apenas atualização de status em inboxes API. O dashboard já possui um menu contextual de mensagem e recebe atualizações pelo evento de mensagem.

O WhatsApp permite que um remetente edite mensagens de texto por até 15 minutos após o envio. Baileys expõe essa operação enviando uma mensagem com a chave da mensagem original. A Cloud API oficial da Meta não expõe endpoint de edição; portanto, não há implementação correta para esse provedor.

## Goals / Non-Goals

**Goals:**

- Permitir uma única experiência de edição somente a provedores declarados como compatíveis.
- Impor no servidor autoria, tipo de mensagem, ausência de anexos, `source_id`, janela de 15 minutos e conteúdo válido.
- Atualizar o conteúdo local e sinalizar que a mensagem foi editada, encaminhando a alteração para a integração nativa sem duplicar o histórico que já pertence ao WhatsApp.
- Não mostrar uma ação que inevitavelmente falhará em uma inbox Cloud API.

**Non-Goals:**

- Editar mensagens recebidas, privadas, de campanha, template, mídia, legenda ou mensagem fora da janela.
- Simular edição para Cloud API enviando uma mensagem de correção ou alterando apenas o banco de dados.
- Implementar a Evolution API sem seu contrato e localização no projeto.

## Decisions

### Capacidade explícita por provedor

O canal exporá uma capacidade de edição; a interface a utilizará apenas como pista de exibição e a API a verificará como autoridade. Isso evita condicionar a interface ao nome de um provedor e impede que chamadas manuais habilitem edição para a Cloud API. A alternativa de testar `provider == 'evolution'` no frontend e backend espalharia conhecimento de integração e não resolve outros provedores futuros.

### Janela calculada a partir do envio registrado

O servidor aceitará edição até `message.created_at + 15 minutos`, usando o relógio do servidor. A mensagem precisa ter `source_id`, pois é a chave necessária para a edição remota. A alternativa de confiar somente no relógio do navegador permite discrepâncias e tentativas fora do prazo.

### Sincronização assíncrona pela integração nativa

O Chatwoot atualizará o conteúdo e disparará `message.updated`; a integração nativa já configurada na Evolution receberá o evento, localizará o mapeamento da mensagem e chamará Baileys para editar no WhatsApp. Em caso de falha remota, a Evolution registrará e comunicará a falha, sem criar mensagem adicional nem reverter automaticamente o conteúdo local. A alternativa síncrona exigiria novas credenciais e uma chamada direta do Chatwoot à Evolution, duplicando a integração existente.

### Cloud API como capacidade não suportada

`Whatsapp::Providers::WhatsappCloudService` não ganhará chamada de edição porque a Cloud API oficial não possui essa operação. A alternativa de usar um endpoint não documentado comprometeria a integração oficial e não é aceitável.

### Evolução da integração nativa da Evolution

A Evolution já possui o serviço Baileys e o mapeamento entre a chave WhatsApp e a mensagem do Chatwoot. O tratamento de `messages.edit` e `send.message.update` será corrigido para atualizar a mensagem vinculada em vez de criar o texto adicional “Mensagem editada”. Não será adicionado provider, URL, API key ou `instanceName` à inbox do Chatwoot.

## Risks / Trade-offs

- [Evolution pode rejeitar silenciosamente uma edição fora da janela] → validar localmente os 15 minutos e registrar falhas no processamento pela integração.
- [Relógios entre Chatwoot e o provedor podem divergir] → a interface encerra a opção ao atingir a janela e a falha de sincronização fica observável.
- [Atualização local pode divergir do WhatsApp em caso de falha] → usar o webhook nativo para processamento e observabilidade, sem criar uma segunda mensagem enganosa.
- [O histórico anterior não fica no Chatwoot] → o WhatsApp permanece a fonte de histórico; o produto deliberadamente não exige cópia local.

## Migration Plan

1. Implantar API e interface para inboxes vinculadas à integração nativa Evolution.
2. Implantar o tratamento assíncrono no repositório Evolution e validá-lo em homologação.
3. Em rollback, desabilitar a edição no Chatwoot; mensagens já editadas permanecem com seu conteúdo atualizado.
