# Tracking Setup — Fluxo Rural Site

Guia de configuração do tracking pós-deploy. O site empurra eventos pro `dataLayer`; o GTM faz o roteamento pra GA4, Google Ads e Meta Pixel.

## 1. Variáveis de ambiente

No Cloudflare Pages → Settings → Environment variables (Production + Preview):

| Var | Valor | Origem |
|---|---|---|
| `NEXT_PUBLIC_GTM_ID` | `GTM-XXXXXXX` | Painel GTM → ícone no topo |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | GA4 → Admin → Data Streams → Web |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `5545991447004` | (já configurado) |

`NEXT_PUBLIC_META_PIXEL_ID` e `NEXT_PUBLIC_GOOGLE_ADS_ID` **não são variáveis de ambiente** — ficam configurados dentro do GTM.

## 2. Eventos emitidos pelo site (contrato dataLayer)

| Evento | Payload | Disparado em |
|---|---|---|
| `form_submit` | `{form_name, ...utm}` | Sucesso de qualquer form (contato, diagnóstico, newsletter, beweather, palestra) |
| `diagnostico_step1_complete` | `{}` | Botão "Próximo" no step 1 do diagnóstico |
| `diagnostico_scored` | `{score, level}` | Submit do diagnóstico (level: verde/amarelo/laranja/vermelho) |
| `newsletter_signup` | `{source}` | Submit da newsletter (source: footer/artigo/página) |
| `whatsapp_click` | `{source}` | Clique em qualquer botão WhatsApp (source: floating/footer/beweather) |
| `video_play` | `{video_id, source}` | Play em vídeo YouTube (hoje só Beweather) |

## 3. GTM — Tags, Triggers, Variables

### Variables (built-in + custom)

Habilitar built-in: `Page URL`, `Page Path`, `Referrer`, `Click URL`, `Click Element`.

Custom Data Layer Variables (criar):
- `dlv_form_name` → Data Layer Variable Name: `form_name`
- `dlv_score` → `score`
- `dlv_level` → `level`
- `dlv_source` → `source`
- `dlv_utm_source` → `utm_source`
- `dlv_utm_medium` → `utm_medium`
- `dlv_utm_campaign` → `utm_campaign`

### Triggers (Custom Events)

| Nome | Event name | Filtro |
|---|---|---|
| `Trg - form_submit (todos)` | `form_submit` | — |
| `Trg - form_submit - diagnostico` | `form_submit` | `dlv_form_name` equals `diagnostico` |
| `Trg - form_submit - contato` | `form_submit` | `dlv_form_name` equals `contato` |
| `Trg - form_submit - palestra` | `form_submit` | `dlv_form_name` equals `palestra` |
| `Trg - form_submit - beweather` | `form_submit` | `dlv_form_name` equals `beweather` |
| `Trg - newsletter_signup` | `newsletter_signup` | — |
| `Trg - whatsapp_click` | `whatsapp_click` | — |
| `Trg - video_play` | `video_play` | — |
| `Trg - diagnostico_scored - verde` | `diagnostico_scored` | `dlv_level` equals `verde` (lead quente) |

### Tags

**GA4 — Base**
- Type: Google Tag (GA4 Configuration legacy)
- Measurement ID: `{{NEXT_PUBLIC_GA_ID}}` (use uma Constant variable)
- Trigger: All Pages

**GA4 — Eventos custom** (1 tag por evento, ou usar uma única tag com variável dinâmica)
- Type: GA4 Event
- Event Name: `{{Event}}` (built-in)
- Parameters: `form_name`, `source`, `score`, `level`, `utm_source`, `utm_medium`, `utm_campaign`
- Trigger: `Trg - form_submit (todos)`, `Trg - newsletter_signup`, `Trg - whatsapp_click`, `Trg - video_play`

**Google Ads — Conversion Linker**
- Type: Conversion Linker
- Trigger: All Pages

**Google Ads — Conversions** (criar primeiro no Google Ads → Tools → Conversions, copiar Conversion ID + Label)
| Conversão | Trigger | Valor |
|---|---|---|
| Lead — Palestra | `Trg - form_submit - palestra` | 500 BRL (estimativa) |
| Lead — Contato | `Trg - form_submit - contato` | 100 BRL |
| Lead — Diagnóstico Qualificado | `Trg - diagnostico_scored - verde` | 800 BRL |
| WhatsApp Click | `Trg - whatsapp_click` | 50 BRL |
| Lead — Beweather | `Trg - form_submit - beweather` | 1000 BRL |

**Meta Pixel — Base**
- Type: Custom HTML
- Snippet: o `fbq('init', 'PIXEL_ID')` + base code que o Business Manager gera
- Trigger: All Pages

**Meta Pixel — Lead/Contact/ViewContent** (Custom HTML por evento, ou usar tag Meta Pixel Custom Event)
| Evento Meta | Trigger |
|---|---|
| `Lead` | `Trg - form_submit - palestra`, `Trg - form_submit - contato`, `Trg - form_submit - beweather` |
| `Contact` | `Trg - whatsapp_click` |
| `CompleteRegistration` | `Trg - newsletter_signup` |
| `ViewContent` (video) | `Trg - video_play` |

## 4. GA4 — configuração dentro do painel

- Admin → Events → Mark as conversion: `form_submit`, `whatsapp_click`, `newsletter_signup`, `diagnostico_scored`
- Admin → Custom Definitions → Custom Dimensions:
  - `form_name` (event-scoped)
  - `level` (event-scoped)
  - `source` (event-scoped)
- Admin → Property → Google Ads Links → vincular conta Google Ads (importa conversões automaticamente)

## 5. Validação pós-deploy

1. **GTM Preview Mode**: abrir `fluxorural.com.br` via preview, navegar pelas páginas, preencher formulários. Confirmar que cada evento aparece com payload completo.
2. **GA4 DebugView**: instalar [GA Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) ou usar GTM Preview com `?_dbg=1`. Eventos devem aparecer em tempo real.
3. **Meta Pixel Helper** (extensão Chrome): confirmar Pixel disparou e que eventos Lead/Contact aparecem com parâmetros corretos.
4. **Google Ads → Conversions → Status**: deve mudar de "Não verificada" para "Recente" em até 24h.

## 6. Beweather — observação importante

A landing `/beweather` **não carrega o GTM do Fluxo Rural** (o componente `GoogleTagManager.tsx` retorna `null` em `/beweather*`). Quando for ativar tracking dedicado Beweather, criar um `BeweatherGTM.tsx` no `app/(beweather)/layout.tsx` com `NEXT_PUBLIC_GTM_BEWEATHER_ID` separado. Conforme decisão arquitetural em `CLAUDE.md`.
