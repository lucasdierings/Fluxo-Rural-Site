# Setup pós-deploy — 3 passos manuais

IDs já descobertos automaticamente:

| Item | Valor |
|---|---|
| **GTM Container ID** | `GTM-MRLR7HLK` (container "Beweather Fluxo Rural Web") |
| **GA4 Measurement ID** | `G-SC6B0F0F18` (property "Beweather Fluxo Rural Web") |
| **Google Ads Customer ID** | `823-984-2688` |
| **Cloudflare Account ID** | `20492d3a6b98bfc342338d4f2a567c1b` |
| **Cloudflare Pages projeto** | `fluxo-rural-site` |

> **Observação importante:** seu GTM e GA4 estão chamados "Beweather Fluxo Rural Web" — você consolidou pra usar **um único container e uma única property pra os dois sites** (Beweather + Fluxo Rural). Isso contradiz a nota antiga no `CLAUDE.md` que pedia properties separadas. **Vou tratar como decisão atual: 1 GTM + 1 GA4 pra os dois sites**, diferenciando via `page_path` / `hostname` em relatórios. Atualize o `CLAUDE.md` quando puder.

---

## Passo 1 — Cloudflare Pages: adicionar `NEXT_PUBLIC_GTM_ID`

Bati em um bloqueio: o dashboard da Cloudflare não carrega no meu tab group MCP (sessão isolada). **Você precisa fazer manualmente em ~30 segundos:**

1. Abra https://dash.cloudflare.com/20492d3a6b98bfc342338d4f2a567c1b/pages/view/fluxo-rural-site/settings/environment-variables (no seu tab já autenticado)
2. Clique **Edit variables** no bloco **Production**
3. Add:
   - Variable name: `NEXT_PUBLIC_GTM_ID`
   - Value: `GTM-MRLR7HLK`
   - Type: **Plain text** (NÃO secret — secrets só existem em runtime, e Next.js static export precisa da var em build time)
4. Save
5. Repita pra **Preview** environment (mesma variable, mesmo valor)
6. Vá em **Deployments** → **Retry deployment** no último deploy do branch `claude/cool-darwin-be08fb` pra rebuildar com a nova var

---

## Passo 2 — Importar o container GTM

Eu já gerei o JSON completo em [`docs/gtm-container-import.json`](./gtm-container-import.json). Contém:

- 1 **GA4 Configuration Tag** (com seu Measurement ID `G-SC6B0F0F18` já preenchido)
- 5 **GA4 Event Tags**: `form_submit`, `whatsapp_click`, `newsletter_signup`, `video_play`, `diagnostico_scored`
- 5 **Custom Event Triggers** (1 por evento)
- 9 **Data Layer Variables**: `form_name`, `source`, `score`, `level`, `video_id`, `utm_source`, `utm_medium`, `utm_campaign` + uma Constant pro Measurement ID
- 6 **Built-in Variables** habilitadas (Page URL, Page Path, Referrer, Event, Click URL, Click Element)

**Como importar (~1 minuto):**

1. Eu já deixei a tela de import aberta no seu Chrome em https://tagmanager.google.com/#/admin/accounts/6357126025/containers/253416384/import com a opção **"Combinar"** já selecionada (preserva o que já existe).
2. Clique **Escolher arquivo do contêiner**
3. Navegue até: `~/Documents/GitHub/Fluxo-Rural-Site/.claude/worktrees/cool-darwin-be08fb/docs/gtm-container-import.json`
4. Selecione e confirme
5. Revise o preview (vai mostrar 6 novas tags, 5 novos triggers, 9 novas variáveis)
6. Clique **Confirmar**
7. Volte ao workspace → clique **Enviar** (publicar) no canto superior direito → dá um nome tipo "Setup tracking Fluxo Rural" → **Publicar**

**Conversões Google Ads** (opcional, depois): com os triggers prontos, vá em **Tags → Nova → Google Ads Conversion Tracking** pra cada conversão da tabela em [`docs/tracking-setup.md`](./tracking-setup.md). Lucas precisa criar primeiro no Google Ads (Tools → Conversions → New) e copiar Conversion ID + Label.

**Meta Pixel** (depois): mesma lógica — Tags → Nova → Meta Pixel base + Custom Events.

---

## Passo 3 — Vincular Google Ads ↔ GA4

Conversões do GTM mandam dados pro GA4. Pra Google Ads importar essas conversões e usar como goal de campanha:

1. Abra https://analytics.google.com/analytics/web/#/a388909352p538818676/admin/properties/links (no seu tab já autenticado)
2. **Vínculos de produtos → Google Ads → Link**
3. Selecione a conta `823-984-2688` (Google Ads)
4. **Ativar Personalized Advertising** (recomendado pra remarketing)
5. **Concluir**
6. Vá pro Google Ads: https://ads.google.com/aw/conversions
7. **+ Nova conversão → Importar → Google Analytics 4 (GA4)**
8. Selecione a property "Beweather Fluxo Rural Web"
9. Marque os eventos: `form_submit`, `whatsapp_click`, `diagnostico_scored`, `newsletter_signup`
10. Atribua valor estimado pra cada (sugestões em `docs/tracking-setup.md`)
11. **Importar**

Pronto. Suas campanhas vão ter conversões mensuráveis com ROI/CPL.

---

## Validação final (depois dos 3 passos)

1. **Deploy passou?** Veja Cloudflare Pages dashboard se o último deploy tem status verde com a nova env var.
2. **GTM carregando?** Abra fluxorural.com.br no Chrome anônimo → DevTools → Network → filtra por "gtm" → deve aparecer `gtm.js?id=GTM-MRLR7HLK`.
3. **Eventos disparando?** Abra GTM → Preview Mode → cole URL → navegue, preencha forms, clique WhatsApp → conferir que os triggers verdes aparecem.
4. **GA4 recebendo?** GA4 → Relatórios → Em tempo real → deve aparecer suas próprias visitas com os eventos custom.
5. **Beweather não duplica?** Garanta que `/beweather*` carrega `GTM-MRLR7HLK` **uma vez só** (não duas). Se já tava carregando antes via o projeto `beweather-fluxo-rural`, vai ficar carregando duas vezes quando o subdomínio migrar pro projeto `fluxo-rural-site`. Quando isso acontecer, edite `components/analytics/GoogleTagManager.tsx` e **remova** o guard `if (pathname?.startsWith('/beweather')) return null` (já que agora é 1 container pra tudo).

---

## O que está pronto no código (já mergeavel)

- `lib/analytics.ts` — helper `trackEvent` + `getUtmParams`
- `components/analytics/GoogleTagManager.tsx` — injeta GTM via env var
- `components/forms/*` — todos disparam `form_submit` com UTMs
- `components/layout/{FloatingWhatsApp,Footer}.tsx` — disparam `whatsapp_click`
- `app/(beweather)/beweather/BeweatherLanding.tsx` — disparam `video_play`, `whatsapp_click`, `form_submit`
- `docs/tracking-setup.md` — referência completa de tags/triggers/conversões
- `docs/gtm-container-import.json` — JSON pronto pra import (esse arquivo)
- `docs/SETUP_PASSOS_MANUAIS.md` — esse checklist
