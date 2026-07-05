# Estrutura da planilha

Crie uma planilha no Google Sheets com duas abas: `envios` e `logs`.

O Apps Script cria os cabeçalhos automaticamente se as abas estiverem vazias, mas deixar a estrutura pronta facilita a conferência.

## Aba `envios`

Colunas recomendadas:

| coluna | uso |
| --- | --- |
| timestamp | data e hora do envio |
| nome | nome completo informado |
| email | e-mail normalizado em lowercase |
| telefone | telefone apenas com números |
| data_nascimento | data informada no formulário |
| sexo | opção selecionada |
| cep | CEP apenas com números |
| endereco | logradouro |
| numero | número |
| complemento | complemento |
| bairro | bairro |
| cidade | cidade |
| uf | UF em maiúsculas |
| consentimento | valor técnico enviado pelo front-end; atualmente `false`, pois o formulário visual clona o primário sem checkbox |
| origem | origem técnica do envio |
| formulario | identificador do formulário |
| tag | tag enviada ao Mailchimp |
| mailchimp_status | status usado no Mailchimp |
| mailchimp_action | `created`, `updated` ou erro |
| response_status | status retornado ao front-end |
| user_message | mensagem segura exibida ao usuário |

## Aba `logs`

Colunas recomendadas:

| coluna | uso |
| --- | --- |
| timestamp | data e hora do log |
| level | `warn` ou `error` |
| etapa | validação, mailchimp, planilha ou inesperado |
| email | e-mail relacionado, quando existir |
| erro | resumo do erro |
| detalhe | detalhe técnico para auditoria interna |
| payload_resumido | payload sem dados excessivos |

## Observações

Todos os envios devem passar pela planilha, inclusive validações recusadas, atualizações de contato existente e falhas de Mailchimp. Detalhes técnicos ficam apenas em `logs`; o front-end recebe mensagens genéricas e seguras.
