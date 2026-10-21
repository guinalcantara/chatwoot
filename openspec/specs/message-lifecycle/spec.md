## Purpose

Define a criação, a entrega e a atualização observável das mensagens que compõem uma conversa.

## Requirements

### Requirement: Criação de mensagem na conversa

O sistema SHALL criar mensagens no escopo da conversa, usando o remetente compatível com sua direção e preservando conteúdo, anexos e atributos de conteúdo permitidos.

#### Scenario: Agente envia mensagem de saída

- **WHEN** um agente autorizado cria uma mensagem de saída em uma conversa
- **THEN** o sistema associa a mensagem ao agente, à conta, à inbox e à conversa

#### Scenario: Mensagem recebida fora de inbox API

- **WHEN** um cliente tenta criar uma mensagem recebida em uma inbox que não seja API
- **THEN** o sistema rejeita a criação

### Requirement: Entrega de mensagens por canal

O sistema SHALL encaminhar mensagens públicas de saída e templates ao serviço do canal da inbox. O sistema MUST NOT encaminhar notas privadas, mensagens com identificador de origem externo ou indicadores de chamada de voz.

#### Scenario: Enviar resposta pública

- **WHEN** uma mensagem pública de saída é criada para um canal configurado
- **THEN** o sistema agenda a entrega pelo serviço desse canal

#### Scenario: Criar nota privada

- **WHEN** um agente cria uma nota privada
- **THEN** o sistema mantém a nota na conversa sem enviá-la ao canal externo

### Requirement: Atualização de status de entrega

O sistema SHALL refletir os status de entrega aceitos pelo canal e disponibilizar falhas externas na mensagem.

#### Scenario: Canal confirma leitura

- **WHEN** o canal informa que uma mensagem foi lida
- **THEN** o sistema atualiza o status da mensagem para lida

#### Scenario: Canal informa falha

- **WHEN** o canal informa falha de entrega com um motivo
- **THEN** o sistema marca a mensagem como falha e preserva o motivo externo
