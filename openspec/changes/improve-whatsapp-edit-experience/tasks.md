## 1. Descoberta da edição

- [x] 1.1 Separar a elegibilidade estrutural da confirmação e do prazo; verificar em teste que a ação permanece para mensagem Evolution própria sem `sourceId` ou vencida, mas não aparece nos casos incompatíveis.
- [x] 1.2 No clique em Editar, mostrar alertas traduzidos para confirmação pendente e prazo expirado; verificar que o editor só abre para mensagem elegível.

## 2. Editor sem assinatura visível

- [x] 2.1 Reconhecer o prefixo de assinatura do remetente no conteúdo inicial, mostrar apenas o corpo no campo e preservar o prefixo ao salvar; verificar casos com assinatura, sem assinatura e com nome diferente.
- [x] 2.2 Manter a tecla de envio configurada e a quebra de linha no editor; verificar Enter, Cmd/Ctrl+Enter e Shift+Enter.

## 3. Verificação

- [x] 3.1 Executar os testes JavaScript direcionados, lint dos arquivos modificados e `openspec validate --strict`; registrar resultados e limites no relatório da change.
