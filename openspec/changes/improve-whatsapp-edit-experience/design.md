## Context

Veja `proposal.md`. `Message.vue` calcula hoje a opção Editar com `canEditMessage`, que exige `sourceId` e prazo válido. `MessageContextMenu.vue` recebe apenas o conteúdo e o ID, abre um textarea com o conteúdo completo e envia a edição por `MessageApi.edit`. A API já verifica a elegibilidade como autoridade. Não há override correspondente desses componentes em `enterprise/`.

## Goals / Non-Goals

**Goals:** Distinguir descoberta da ação e permissão efetiva de edição; conservar a assinatura ao permitir edição do corpo.

**Non-Goals:** Alterar a regra de 15 minutos no servidor, mudar o contrato de webhook da Evolution ou habilitar a Cloud API.

## Decisions

### Separar exibição de validação

Uma função de elegibilidade estrutural compartilhará as restrições estáveis de tipo, autoria e inbox. `sourceId` e prazo serão avaliados no clique, usando o horário atual, para exibir alertas específicos. A alternativa de manter a ação oculta não explica o motivo da indisponibilidade e reproduz o problema de descoberta.

### Preservar o prefixo do conteúdo original

O menu receberá o nome do remetente e separará um prefixo Markdown inicial `**Nome:**` seguido de quebra de linha somente se `Nome` corresponder ao remetente. O campo editará o restante; ao salvar, o prefixo original será reunido ao corpo. A comparação de texto e o botão Salvar usarão o conteúdo completo. A alternativa de gerar uma assinatura a partir da configuração atual alteraria mensagens antigas sem assinatura.

### Manter a API como autoridade

O frontend informa o motivo mais provável antes de abrir o editor; o servidor continua impondo sua validação no `PATCH`. Um erro de corrida durante o prazo ou a confirmação será mostrado pelo fluxo de erro existente.

## Risks / Trade-offs

- [Relógio do navegador diverge do servidor] → preservar a validação da API e seu erro no salvamento.
- [Prefixo em negrito escrito como texto comum] → reconhecer assinatura apenas quando o nome coincidir com o remetente.
- [Identificador externo pode chegar durante o menu aberto] → avaliar a confirmação no momento do clique, sem depender de valor salvo na abertura.

## Migration Plan

Publicar a nova imagem do Chatwoot após a Evolution que deduplica o prefixo. Em rollback, retornar à imagem anterior; não há migração de dados.
