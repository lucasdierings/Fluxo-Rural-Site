# Otimização de captura e medição de leads — Fluxo Rural

## Contexto

O site atende **dois públicos com jornadas diferentes** (consultoria e palestras/treinamentos), mas só um deles tem funil instrumentado. Hoje:

- **Palestras/treinamentos não têm formulário.** Os 8 CTAs da `/palestras` mandam direto pro `wa.me`. O lead chega no WhatsApp do Lucas sem registro no CRM, sem dados de qualificação e sem virar negócio no funil. A campanha Google Ads B2B de palestras está **ATIVA** apontando pra essa página, otimizando por um evento (`palestra_whatsapp_click`) que não corresponde a nenhum lead registrado.
- **O mídia kit é um PDF público** em `/public`, baixável por URL direta, **listado no sitemap** (indexável), e linkado em 4 lugares — dois deles sem evento nenhum. Zero captura de contato.
- **O diagnóstico é moroso**: 12 perguntas (produtor) / 11 (empresa), quase todas em `<select>`, todas exibidas de uma vez numa página longa.

Resultado: leads e contatos entram por caminhos que ninguém consegue medir nem retomar. O objetivo é separar os dois funis, capturar contato em todo ponto de conversão, e deixar cada preenchimento mais leve.

## Decisões já tomadas (Lucas)

1. Diagnóstico: **nova UI + perguntas condicionais** (corta ~40% do tempo percebido).
2. Mídia kit: **PDF sai de `/public`**, só é liberado após o cadastro. Contato entra no CRM como **contato de marketing, sem virar negócio** — "não chega a ser um lead".
3. Palestras: formulário embutido na `/palestras` + landing enxuta `/palestras/proposta` pra tráfego pago. **Nenhum valor/proposta automatizada no site** — o formulário coleta qualificação, o Lucas agenda o briefing e envia a proposta.
4. WhatsApp: **remover dos CTAs de produto e do rodapé**. O **botão flutuante lateral fica**. Botão de WhatsApp só aparece **depois** do envio do formulário.
5. Persistência: **sem planilhas e sem banco novo**. Captura = Cloudflare Function → Resend (e‑mail) + `pushCrm()`. O D1 segue exclusivo da calculadora. O Lucas organiza o resto no CRM.
6. Analytics: **GA4 e Google Ads são alimentados pelo GTM** — confirmado que o container `GTM-NG4CVQ38` tem a tag de configuração do GA4.

---

## O que encontrei de errado (além do que você já apontou)

| # | Problema | Onde |
|---|---|---|
| 1 | Conversão fantasma: `trackLead('diagnostico_contato')` dispara **mesmo quando o POST falha** — o `catch` é silencioso e o fluxo segue. Contradiz o padrão do `ContactForm`, que só marca sucesso com HTTP 200. | `components/forms/DiagnosticoForm.tsx:444-447` |
| 2 | Dois downloads do mídia kit **sem evento nenhum** (link `<a>` cru, não usa `MidiaKitDownload`) — invisíveis no GA4. | `components/layout/Footer.tsx:82-91`, `app/servicos/lideranca/page.tsx:306` |
| 3 | URL do PDF **entra no sitemap de propósito** (`additionalPaths`) → Google indexa e manda tráfego direto pro arquivo, pulando o site inteiro. | `next-sitemap.config.js:44-53` |
| 4 | `/servicos/palestras` tem **redirect 301 no `_redirects` E uma página estática** com `router.replace`. O asset estático responde, o usuário vê um flash "Redirecionando…", e a URL **aparece duplicada no sitemap**. A página ainda usa `<head>` dentro de client component (não funciona no React 19). | `public/_redirects:8-9`, `app/servicos/palestras/page.tsx`, `public/sitemap-0.xml` |
| 5 | Rodapé linka `/servicos/palestras` (passa por redirect) em vez de `/palestras`. | `components/layout/Footer.tsx:71` |
| 6 | Código morto: `app/api/contact/route.ts` (route handler POST não roda com `output: 'export'` — já documentado no `claude.md`) e seus únicos consumidores `lib/resend.ts` + `lib/schema.ts`. | `app/api/contact/route.ts` |
| 7 | `/dashboard` tem números **hardcoded** ("1.978 acessos", "5 leads"). É um print estático, não mede nada — não pode ser tratado como fonte de verdade. | `app/dashboard/page.tsx` |
| 8 | `NEXT_PUBLIC_GA_ID` não setado no build ⇒ GA4 **não carrega** e `gtag` não existe; só o dataLayer do GTM recebe evento. Verificar no Cloudflare Pages. | `components/analytics/AnalyticsGate.tsx:17` |
| 9 | O `<select>` de "interesse" do `/contato` mistura consultoria e palestra no mesmo funil — exatamente os dois públicos embolados que você descreveu. | `components/forms/ContactForm.tsx:20-25` |

---

## Fase 1 — Captura de palestras e treinamentos

**Novo componente** `components/forms/PalestraForm.tsx`, em 2 etapas (espelha o padrão já provado do `DiagnosticoForm`: a etapa 1 grava contato parcial, então quem abandona não some).

**Etapa 1 — contato** (4 campos, envia lead parcial): nome, e‑mail, WhatsApp, organização/empresa.

**Etapa 2 — o evento** (cartões de toque, nada de dropdown):
- **O que procura**: Palestra (keynote) · Treinamento / workshop · Painel / mesa redonda · Ainda não sei
- **Formato**: Presencial · Online · Híbrido · Tanto faz
- **Quem contrata**: Cooperativa · Sindicato / associação · Empresa privada · Evento aberto / feira · Instituição de ensino · Órgão público · Outro
- **Público**: Produtores rurais · Equipe interna · Lideranças / gestores · Estudantes · Misto
- **Tamanho**: Até 50 · 50–150 · 150–500 · +500 · Ainda não definido
- **Quando**: Já tenho data (abre campo de data) · Tenho o mês · Ainda definindo
- **Cidade / UF** do evento, **tema de interesse** (pré-selecionado quando vem do card de um tema) e **observações** (textarea livre)

**Tela de sucesso**: confirmação + o que acontece a seguir (briefing → proposta, sem valor automático) + **botão "Continuar no WhatsApp"** com a mensagem já montada a partir das respostas.

**Backend** `functions/api/palestra.js` — espelha `functions/api/contato.js`, reusando `pushCrm`, `atribuicao`, `canalOrigem` e `idEstavel` de `functions/_lib/crm.js`:
- `etapa: 'contato'` → CRM só com `contato{}` (sem `negocio`), igual ao diagnóstico parcial
- `etapa: 'completo'` → `negocio: { produto: 'palestra', etapa: 'novo', origem: canalOrigem(tracking, 'palestra'), obs: <qualificação completa numa linha> }`
- e‑mail pro Lucas via Resend, com bloco de qualificação e bloco de tracking

Os helpers `esc` / `linha` / `bloco` estão **copiados idênticos** em `contato.js`, `diagnostico.js` e `calculadora.js`. Extrair pra `functions/_lib/email.js` e usar nas funções **novas** (não mexer nas existentes agora, pra manter o diff focado).

**Páginas**:
- `app/palestras/page.tsx`: os 8 `WhatsappCTA` viram âncoras pro formulário (`#proposta`). O botão de cada tema passa o título como `tema` pré-selecionado. Nova seção `#proposta` com o `PalestraForm`.
- **Nova** `app/palestras/proposta/page.tsx`: landing curta (prova social mínima + formulário acima da dobra) pra ser a URL final da campanha B2B do Ads.
- `components/palestras/WhatsappCTA.tsx`: deixa de ser CTA de página e passa a ser usado **só na tela de sucesso**.
- Copy de `/palestras` passa a citar **treinamento in-company** explicitamente (hoje só "workshop" aparece de passagem).

## Fase 2 — Mídia kit com captura

- PDF sai de `public/midia-kit-palestras-lucas-dierings.pdf` → `public/assets/mk/midia-kit-palestras-lucas-dierings.pdf`.
- `public/_routes.json`: incluir `/assets/mk/*` (hoje só `/api/*` passa pelas Functions).
- **Nova** `functions/assets/mk/[[path]].js`: sem token válido → 302 pra `/palestras/#midia-kit`; com token → `context.next()` serve o asset. *(Em Pages, Functions rodam **antes** dos assets estáticos; `_routes.json` é quem decide quais rotas passam por elas — por isso o gate funciona.)*
- **Nova** `functions/api/midia-kit.js`: valida nome/telefone/e‑mail, faz `pushCrm` **só com `contato{}`** (`source: 'site-midia-kit'`, `interesse: 'Baixou o mídia kit de palestras'`, sem `negocio` — mesmo padrão da calculadora), devolve `{ url }` com token HMAC de validade curta (`crypto.subtle`, secret `MIDIA_KIT_SECRET`; ausente ⇒ fallback documentado + warn, pra preview/local não quebrar). Manda o link também por e‑mail pra pessoa (valida o endereço e coloca a marca na caixa de entrada dela). **Sem e‑mail pro Lucas** — não é lead, é contato de base.
- `components/palestras/MidiaKitDownload.tsx`: **mesma API de props**, comportamento novo — abre um modal (Radix Dialog, já é dependência) com 3 campos; ao enviar, dispara o download e guarda um flag em `localStorage` pra não pedir de novo. Todos os call sites existentes continuam funcionando sem mudança.
- Trocar os dois links crus (`Footer.tsx:82-91` e `servicos/lideranca/page.tsx:306`) pelo componente.
- `next-sitemap.config.js`: remover o `additionalPaths` do PDF.

## Fase 3 — Diagnóstico dinâmico

Reescrita da camada de apresentação do `DiagnosticoForm.tsx`; a lógica de score fica isolada e testável.

- **Uma pergunta por tela**, cartões de toque grandes (≥44 px), **avanço automático** ao escolher, botão voltar, progresso "3 de 9". Nenhum `<select>` sobra exceto o de UF (o picker nativo do celular é adequado ali).
- **Etapa de contato encolhe pra 4 campos**: nome, WhatsApp, e‑mail, estado. `empresa/propriedade` vira **opcional** e sai da porta de entrada (muito produtor não tem nome de propriedade — hoje é obrigatório e trava).
- **Perguntas condicionais**:
  - Produtor: `filhos`/`situacaoFilhos`/`conflito` só se marcou **Sucessão familiar** nos desafios; `dividas` só se marcou **Dívidas** ou **Fluxo de caixa**; `investimento` só se marcou **Inovação**.
  - Empresa: `presencaDigital`/`processoVendas` só se marcou **Gerar leads** ou **Presença digital fraca**; `cargo` e `tempoOperacao` migram pra etapa de contato.
- **Recalibração do score** (necessária: quem pula bloco pontua 0 nele e nunca chegaria a "verde"): mantém `calculateScore`/`calculateScoreEmpresa` **intactas**, e adiciona `calculateScoreMax(d)` — o máximo alcançável no caminho que a pessoa percorreu. O nível passa a sair de `score_pct = 100 * score / scoreMax`: verde ≥ 66%, amarelo ≥ 46%, laranja ≥ 27%, resto vermelho. **Score bruto e `score_pct` vão os dois** pro e‑mail e pro CRM, então o histórico continua comparável.
- **Correção do bug #1**: `handleContato` só avança e só dispara evento se a resposta for `ok`; senão mostra erro e deixa tentar de novo.
- Eventos de etapa (`form_step`) pra você enxergar **em qual pergunta as pessoas desistem** — hoje isso é cego.

## Fase 4 — Medição

**Correção de arquitetura.** O `lib/track.ts` hoje tem dois caminhos: `trackLead()` dispara `gtag()` **e** `dataLayer.push()`; `trackCta()` dispara **só `gtag()`**. Como o GA4 é configurado dentro do GTM (confirmado), o `gtag.js` carregado direto pelo site (`AnalyticsGate.tsx:17`, condicionado a `NEXT_PUBLIC_GA_ID`) é um **segundo caminho para a mesma property**:

- com a env var setada ⇒ evento de lead **conta duas vezes** no GA4 (gtag + tag do GTM);
- sem a env var ⇒ `gtag` nem existe, e o **`trackCta()` é um no-op silencioso** — nenhum `cta_click` jamais chegou ao GA4.

Passa tudo a trafegar por **um caminho só: `dataLayer` → GTM → GA4 + Ads**.

- `lib/track.ts`: `trackLead()` deixa de chamar `gtag` e usa só `dataLayer.push`. `trackCta()` idem. Novo `trackMicro(event, params)` para micro-conversões, também no dataLayer — com nome de evento distinto pro GTM rotear pro GA4 **sem** acionar conversão do Ads.
- `AnalyticsGate.tsx`: remover `<GoogleAnalytics>` (a configuração do GA4 vive no GTM). Fica só `<GoogleTagManager>`. Some a contagem dupla.
- Nomes de evento existentes **não são renomeados** (AGENTS.md), só ganham parâmetros.
- **Validar antes de considerar pronto**: GA4 DebugView tem que mostrar `page_view` **uma vez só** por navegação depois da mudança.
- Todo evento de lead passa a carregar **`lead_type`**: `consultoria` | `palestra` | `midia-kit`. É esse parâmetro que finalmente separa os dois públicos nos relatórios.

| Evento | Dispara quando | Canal | `lead_type` |
|---|---|---|---|
Todos vão pelo `dataLayer`; a coluna "roteamento" é o que o **GTM** faz com cada um.

| Evento | Dispara quando | Roteamento no GTM | `lead_type` |
|---|---|---|---|
| `generate_lead` | `/contato` retorna 200 | GA4 + conversão Ads | consultoria |
| `diagnostico_contato` | etapa de contato **retorna 200** | GA4 + conversão Ads | consultoria |
| `diagnostico_submit` | diagnóstico completo | GA4 + conversão Ads | consultoria |
| `palestra_contato` *(novo)* | etapa de contato do form de palestra | GA4 + conversão Ads | palestra |
| `palestra_lead` *(novo)* | formulário de palestra completo | GA4 + conversão Ads | palestra |
| `midia_kit_download` | após captura + entrega | **GA4 só** | midia-kit |
| `form_start` / `form_step` *(novos)* | 1ª interação / avanço de etapa | GA4 só | — |
| `whatsapp_click` | botão flutuante | **GA4 só** | — |
| `palestra_whatsapp_click` | agora só na tela de sucesso | GA4 só | — |

**Fora do repositório — você precisa fazer no painel:**
1. GTM `GTM-NG4CVQ38`: criar gatilhos + tags GA4 Event para `palestra_contato`, `palestra_lead`, `form_start`, `form_step`; criar conversão do Ads só pra `palestra_lead`; **remover** qualquer tag de conversão em `whatsapp_click` e `midia_kit_download`.
2. Google Ads, campanha `Fluxo Rural - B2B - Palestras e Eventos` (ID `24046312702`): trocar a URL final pra `/palestras/proposta/`.
3. Cloudflare Pages (projeto `fluxo-rural-site`): criar `MIDIA_KIT_SECRET`. `NEXT_PUBLIC_GA_ID` deixa de ser usada (pode remover depois de validar o DebugView).
4. GA4: marcar `generate_lead`, `diagnostico_submit` e `palestra_lead` como eventos-chave.

## Fase 5 — Correções e limpeza

- `Footer.tsx`: remove o ícone de WhatsApp (mantém LinkedIn/Instagram), corrige `/servicos/palestras` → `/palestras`, troca o link cru do mídia kit pelo componente.
- `app/servicos/lideranca/page.tsx`: "Falar com o Lucas" → `/palestras/proposta`; PDF cru → `MidiaKitDownload`.
- **Apagar** `app/servicos/palestras/page.tsx` (o 301 do `_redirects` passa a valer sozinho; some a duplicata do sitemap e o flash "Redirecionando…").
- **Apagar** `app/api/contact/route.ts`, `lib/resend.ts`, `lib/schema.ts` (código morto — nada mais importa esses arquivos).
- `ContactForm.tsx`: a opção "Palestra / Workshop" passa a **redirecionar pra `/palestras/proposta`** em vez de submeter no funil de consultoria.
- `FloatingWhatsApp.tsx`: **mantido** como está (sua decisão), só migra pra `trackMicro`.
- `/dashboard`: sem mudança de escopo agora, mas adicionar um aviso visível de que os números são estáticos — pra não ser confundido com medição real.
- Atualizar `AGENTS.md` (as regras "`/palestras` converte prioritariamente por WhatsApp" e "formulários … são destinados à consultoria" ficam falsas) e `claude.md` (nova sessão com a arquitetura dos dois funis).

---

## Arquivos

**Novos**: `components/forms/PalestraForm.tsx` · `components/palestras/MidiaKitGate.tsx` · `app/palestras/proposta/page.tsx` · `functions/api/palestra.js` · `functions/api/midia-kit.js` · `functions/assets/mk/[[path]].js` · `functions/_lib/email.js`

**Alterados**: `components/forms/DiagnosticoForm.tsx` (reescrita da UI) · `components/palestras/MidiaKitDownload.tsx` · `components/palestras/WhatsappCTA.tsx` · `components/layout/Footer.tsx` · `components/layout/FloatingWhatsApp.tsx` · `components/forms/ContactForm.tsx` · `app/palestras/page.tsx` · `app/servicos/lideranca/page.tsx` · `lib/track.ts` · `next-sitemap.config.js` · `public/_routes.json` · `AGENTS.md` · `claude.md`

**Removidos**: `app/servicos/palestras/page.tsx` · `app/api/contact/route.ts` · `lib/resend.ts` · `lib/schema.ts`

**Movido**: `public/midia-kit-palestras-lucas-dierings.pdf` → `public/assets/mk/`

**Intocado**: `/beweather` (marca isolada, regras próprias no `claude.md`) · `public/calculadora/` · `functions/api/calculadora.js` · as duas funções de score do produtor/empresa.

## Verificação

1. `npm install && npm run build` — precisa passar limpo (atenção especial após remover o route handler).
2. `npx wrangler pages dev out` e exercitar as Functions:
   - `POST /api/palestra` nas duas etapas → 200, e‑mail sai, payload do CRM correto (`produto: 'palestra'` só no completo)
   - `POST /api/midia-kit` → 200 com `{ url }`; abrir a URL → PDF; abrir `/assets/mk/…pdf` **sem token** → 302 pra `/palestras/`
   - `POST /api/diagnostico` com resposta forçada em erro → o front **não** pode avançar nem disparar evento
3. Percorrer o diagnóstico nos 4 caminhos (produtor com/sem sucessão, empresa com/sem dor comercial) e conferir que `score_pct` e o nível fazem sentido nos quatro.
4. `npm run build` e conferir `out/sitemap-0.xml`: sem a URL do PDF e sem `/servicos/palestras/`.
5. GA4 DebugView: cada evento **uma vez só**, `lead_type` presente, e nada de lead disparando com POST falhando.
6. Mobile real (≤390 px): alvos de toque ≥44 px em todos os cartões, e o botão flutuante não cobrindo CTA de formulário.

## Sequência de entrega

Fases 1 → 2 → 4 (medição junto, senão sobe cego) → 3 → 5, em commits separados na branch `claude/lead-capture-forms-optimization-14txt4`. A Fase 1 sozinha já para o vazamento maior — a campanha de palestras que está ativa hoje.
