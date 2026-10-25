## ADDED Requirements

### Requirement: Ação de edição encontrável e com motivo de indisponibilidade

O sistema SHALL mostrar a ação Editar no menu de mensagens de texto próprias, públicas e não excluídas de inboxes que suportam edição, independentemente da chegada do identificador externo ou do tempo decorrido. Ao selecionar a ação, o sistema MUST abrir o editor somente se a mensagem estiver confirmada e dentro da janela de 15 minutos; caso contrário, MUST informar o motivo e MUST NOT alterar a mensagem.

#### Scenario: Envio ainda sem confirmação externa

- **WHEN** o agente seleciona Editar em uma mensagem própria compatível sem identificador externo
- **THEN** o sistema informa que é necessário aguardar a confirmação do envio e não abre o editor

#### Scenario: Prazo de edição encerrado

- **WHEN** o agente seleciona Editar em uma mensagem própria compatível criada há 15 minutos ou mais
- **THEN** o sistema informa que o prazo terminou e não abre o editor

#### Scenario: Mensagem confirmada dentro do prazo

- **WHEN** o agente seleciona Editar em uma mensagem própria compatível com identificador externo e menos de 15 minutos
- **THEN** o sistema abre o editor, mantendo a validação de elegibilidade no servidor ao salvar

#### Scenario: Mensagem sem suporte à edição

- **WHEN** o menu pertence a uma inbox Cloud API ou a uma mensagem de outro agente, privada, excluída, com anexo ou template
- **THEN** a ação Editar não é exibida

### Requirement: Corpo editável com assinatura preservada

Quando o conteúdo começar com um prefixo de assinatura reconhecido do agente que enviou a mensagem, o editor SHALL mostrar apenas o corpo para edição e MUST preservar o prefixo original ao salvar. Se não houver assinatura reconhecida, SHALL mostrar e salvar o conteúdo integral sem criar assinatura.

#### Scenario: Mensagem com assinatura

- **WHEN** o agente abre a edição de uma mensagem que começa com sua assinatura
- **THEN** o campo apresenta apenas o corpo e a gravação preserva o prefixo original exatamente uma vez

#### Scenario: Mensagem sem assinatura reconhecida

- **WHEN** o agente abre a edição de uma mensagem sem prefixo de assinatura correspondente ao remetente
- **THEN** o campo apresenta o conteúdo integral e a gravação não acrescenta uma assinatura
