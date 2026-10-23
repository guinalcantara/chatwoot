## Purpose

Permitir que agentes corrijam mensagens recentes em provedores WhatsApp compatíveis sem exibir capacidades que a integração oficial não suporta.

## ADDED Requirements

### Requirement: Elegibilidade de edição de mensagem WhatsApp

O sistema SHALL permitir a edição somente de mensagem de texto de saída, não privada, sem anexos, enviada pelo agente autenticado, com identificador externo presente e cuja inbox declare suporte à edição. O sistema MUST rejeitar a solicitação quando mais de 15 minutos tiverem transcorrido desde a criação da mensagem.

#### Scenario: Mensagem Evolution elegível dentro da janela

- **WHEN** um agente edita uma mensagem de texto de sua autoria, enviada por uma inbox Evolution compatível há menos de 15 minutos
- **THEN** o sistema aceita a solicitação para o adaptador do provedor

#### Scenario: Mensagem fora da janela de edição

- **WHEN** um agente tenta editar uma mensagem criada há 15 minutos ou mais
- **THEN** o sistema rejeita a solicitação sem alterar o conteúdo local ou remoto

#### Scenario: Tipo de mensagem não compatível

- **WHEN** um agente tenta editar uma mensagem recebida, privada, com anexo, template ou sem identificador externo
- **THEN** o sistema rejeita a solicitação sem chamar o provedor

### Requirement: Edição conforme capacidade do provedor

O sistema SHALL atualizar localmente uma mensagem elegível e emitir o evento de atualização para a integração nativa da Evolution. A Evolution MUST usar o mapeamento existente da mensagem para editar a mensagem original no WhatsApp e MUST NOT criar uma nova mensagem no Chatwoot para representar a edição.

#### Scenario: Edição local encaminhada à Evolution

- **WHEN** um agente edita uma mensagem elegível
- **THEN** o histórico mostra o novo conteúdo, a mensagem fica marcada como editada, clientes conectados recebem a atualização e a integração nativa recebe o evento de atualização

#### Scenario: Edição remota recusada

- **WHEN** a Evolution não consegue editar a mensagem no WhatsApp
- **THEN** a integração registra e comunica a falha sem criar uma nova mensagem no Chatwoot ou reverter automaticamente o conteúdo local

#### Scenario: Assinatura original preservada na edição

- **WHEN** um agente edita uma mensagem que foi enviada ao WhatsApp com assinatura
- **THEN** a Evolution mantém a assinatura e o nome presentes na mensagem original ao substituir o texto

#### Scenario: Mensagem originalmente sem assinatura

- **WHEN** um agente edita uma mensagem enviada ao WhatsApp sem assinatura
- **THEN** a Evolution não acrescenta assinatura, mesmo se a configuração atual da inbox estiver ativada

### Requirement: Restrição da WhatsApp Cloud API oficial

O sistema MUST tratar inboxes `whatsapp_cloud` como não compatíveis com edição de mensagens, pois a Cloud API oficial da Meta não oferece essa operação.

#### Scenario: Mensagem enviada pela Cloud API

- **WHEN** um agente abre o menu de uma mensagem de texto enviada por uma inbox WhatsApp Cloud API
- **THEN** a ação de editar não é exibida

#### Scenario: Chamada direta para mensagem Cloud API

- **WHEN** um cliente chama a operação de edição para uma mensagem de uma inbox WhatsApp Cloud API
- **THEN** o sistema responde que o provedor não suporta edição e não altera a mensagem

### Requirement: Localização dos textos de edição

O sistema SHALL apresentar a ação, o editor, o estado de edição e os erros de edição no idioma selecionado pelo usuário ou pela conta. O sistema MUST disponibilizar traduções em português brasileiro para os textos desta funcionalidade.

#### Scenario: Interface em português brasileiro

- **WHEN** um agente com idioma `pt_BR` abre a ação de edição ou visualiza seu resultado
- **THEN** os textos da interface de edição aparecem em português brasileiro

#### Scenario: Erro de edição em português brasileiro

- **WHEN** uma solicitação de edição inválida é feita com localidade `pt_BR`
- **THEN** a API retorna a mensagem de erro traduzida em português brasileiro
