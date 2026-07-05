# Variáveis e publicação do Apps Script

## 1. Criar a planilha

1. Crie uma planilha no Google Sheets.
2. Crie as abas `envios` e `logs`, ou deixe o Apps Script criá-las no primeiro envio.
3. Copie o `SHEET_ID` da URL.

Exemplo:

```text
https://docs.google.com/spreadsheets/d/SHEET_ID_AQUI/edit
```

## 2. Criar o Apps Script

1. Acesse `Extensões > Apps Script` dentro da planilha, ou crie um projeto em `script.google.com`.
2. Cole o conteúdo de `apps-script/Code.gs`.
3. Salve o projeto.

## 3. Configurar Properties Service

No editor do Apps Script:

1. Abra `Configurações do projeto`.
2. Em `Propriedades do script`, adicione:

| variável | valor |
| --- | --- |
| `MAILCHIMP_API_KEY` | chave privada da API do Mailchimp |
| `MAILCHIMP_SERVER_PREFIX` | prefixo do datacenter, como `us21` |
| `MAILCHIMP_LIST_ID` | Audience/List ID do Mailchimp |
| `SHEET_ID` | ID da planilha |
| `DOUBLE_OPT_IN` | `true` para pending ou `false` para subscribed |

Nunca coloque `MAILCHIMP_API_KEY` no HTML, CSS ou JavaScript público.

## 4. Publicar como Web App

1. Clique em `Implantar > Nova implantação`.
2. Selecione `Aplicativo da Web`.
3. Execute como: `Eu`.
4. Quem tem acesso: `Qualquer pessoa`.
5. Publique e copie a URL do Web App.

## 5. Inserir endpoint no front-end

Abra `script.js` e troque:

```js
const APPS_SCRIPT_ENDPOINT = "COLE_AQUI_A_URL_DO_WEB_APP_APPS_SCRIPT";
```

pela URL publicada do Web App.

## 6. Testar sem expor chaves

1. Abra `index.html` localmente ou via servidor local.
2. Preencha o formulário com um e-mail de teste.
3. Confirme se uma linha entrou em `envios`.
4. Confirme se o contato foi criado ou atualizado no Mailchimp.
5. Em caso de erro, veja a aba `logs`.

O front-end só deve saber a URL do Apps Script. Todas as credenciais e decisões de Mailchimp ficam no Apps Script.
