# Inventário da reconstrução

## Fonte analisada

Pacote reduzido:

```text
C:\Users\edson\OneDrive\Documents\Camarote Mar\Site\pacote-reconstrucao-camarote
```

HTML principal analisado:

```text
index.html
```

## Assets reaproveitados

### Hero e contagem

- `assets/video/video-camarote-2026.mp4`
- `assets/img/hero/bg-kv-27.webp`
- `assets/img/hero/banner-contagem-2026.webp`
- `assets/img/hero/texto-contagem-2026.webp`
- `assets/img/hero/camarote-mar.jpg`

### Logos e favicon

- `assets/img/logos/logo-mareventos.png`
- `assets/img/favicon/favicon-32x32.png`
- `assets/img/favicon/favicon-192x192.png`
- `assets/img/favicon/apple-touch-icon.png`

### Fontes

- `assets/fonts/NeueMontreal-Regular.woff`
- `assets/fonts/NeueMontreal-Medium.woff`
- `assets/fonts/NeueMontreal-Bold.woff`

## Arquivos descartados do fluxo final

Foram removidas as dependências de:

- WordPress core
- Elementor e Elementor Pro
- Tema Hello Elementor
- jQuery e jQuery UI
- Font Awesome do Elementor
- Instagram Feed, Reviews Feed, Jet Tabs e outros plugins
- `wp-admin/admin-ajax.php`
- scripts de tracking/pixel do export original
- caminhos absolutos `/wp-content/...` e `/2024/wp-content/...`

Esses arquivos podem continuar no pacote reduzido como referência histórica, mas não fazem parte da versão final para GitHub Pages.

## Caminhos quebrados e ausentes

- `wp-content/uploads/2025/09/logo-granado.png` estava referenciado no HTML original, mas não existe no pacote reduzido.
- As referências `gtm.js` e `ns.html` pertencem ao Google Tag Manager externo e não foram incorporadas ao fluxo final.

## Observações de reconstrução

- A contagem original usava o timestamp `1801875600`, equivalente a `2027-02-05T22:00:00-03:00`.
- A tag obrigatória do formulário foi preservada como `Camarote Mar 2027 - SAPUCAÍ`.
- A nova versão usa `index.html`, `styles.css` e `script.js` na raiz, com endpoint único para Google Apps Script.
