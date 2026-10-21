## Purpose

Define a publicação de portais, categorias e artigos de central de ajuda por conta.

## Requirements

### Requirement: Conteúdo da central de ajuda pertence ao portal

O sistema SHALL organizar categorias e artigos sob um portal de central de ajuda pertencente à conta.

#### Scenario: Publicar artigo em categoria
- **WHEN** um usuário autorizado publica um artigo em uma categoria do portal
- **THEN** o artigo fica disponível conforme o estado de publicação do portal e da categoria

### Requirement: Conteúdo não publicado não é público

O sistema MUST impedir que visitantes acessem artigos, categorias ou portais não publicados.

#### Scenario: Visitante solicita artigo não publicado
- **WHEN** um visitante acessa o endereço de um artigo não publicado
- **THEN** o sistema não entrega o conteúdo do artigo
