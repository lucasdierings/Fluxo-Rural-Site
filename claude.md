# Fluxo Rural: Contexto do Projeto

## Domínio
**Agronegócio** — consultoria rural, gestão financeira para produtores, sucessão familiar, conteúdo (blog + podcast). Público: produtores rurais, famílias do agro, cooperativas.

## Equipe ativa neste projeto
Funções do mapa global (`~/.claude/docs/equipe-agentes.md`) que o **gerente** deve considerar ao delegar neste repo:

- **Engenheiro Chefe** — Next.js 16, App Router, MDX, Cloudflare Pages, Decap CMS
- **Revisor de SEO** — site já tem base forte, manter e evoluir
- **Copywriter de Blog (agro)** — 1 artigo/semana, pauta 100% agronegócio
- **Marketing / Growth** — GA4, campanhas, CRO do /diagnostico
- **Jurídico / Compliance** — formulários coletam PII (LGPD)
- **Security Officer / DevSecOps** — revisão antes de deploy
- **Pesquisador UX** — auditorias pontuais

**NÃO ativas aqui** (não invocar): Vendedores/SDR (sem bot), Financeiro/SaaS metrics (Lucas é consultor solo, não SaaS), Customer Success, Analista BI, Parcerias, Consultor CapEx, Onboarding Specialist, Product Manager.

## Beweather — Arquitetura da landing

Landing oculta em `app/(beweather)/beweather/` — NÃO aparece em nav/footer/sitemap. Só acessível digitando `/beweather` direto na URL. Migrada da pasta `/Volumes/Lucas SSD/Projetos/LB Beweather/beweather-landing/` em abr/2026 (Next 14 → 16).

**Decisão arquitetural aprovada no plano:** rodar no subdomínio `beweather.fluxorural.com`, mesmo repo, blog único compartilhado com tag `brand: beweather` no frontmatter MDX. Gerente orquestrador global em `~/.claude/agents/gerente.md`.

### Estrutura de arquivos
- `app/(beweather)/layout.tsx` — route group layout (herda GA4/fontes do `app/layout.tsx` raiz)
- `app/(beweather)/beweather/page.tsx` — **server component** que exporta `metadata` (title absoluto, sem template do Fluxo Rural) + 4 JSON-LD inline via `dangerouslySetInnerHTML` (Organization, Product, FAQPage, BreadcrumbList)
- `app/(beweather)/beweather/BeweatherLanding.tsx` — **client component** com todas as 13 seções, ROI calc, form, Framer Motion
- `public/beweather/` — imagens + `llms.txt` dedicado
- `tailwind.config.ts` — namespace `beweather.*` (NÃO mexer em `primary`/`navy`/`verde-folha` do Fluxo Rural)

### Isolamento do Fluxo Rural
O root layout renderiza Navbar/Footer/FloatingWhatsApp em volta de `{children}`. Um nested layout não consegue sobrescrever isso. Solução: `usePathname` guard nos 3 componentes retorna `null` quando path começa com `/beweather`. Isso mantém a landing visualmente isolada e o root layout intacto.

### Form de proposta
- `#cotacao` no meio da landing, client component com Zod + máscaras BR (CEP, CPF/CNPJ, telefone)
- POST em modo `no-cors` para Google Apps Script (mesmo padrão do `/diagnostico`). **Falha silenciosa** — UI sempre mostra sucesso; precisa teste ponta-a-ponta antes do go-live.
- Captura UTM automático da URL pra atribuição Meta/Instagram Ads

---

## Beweather — Regras de conteúdo (NUNCA regredir)

Aprendidas em revisões com o Lucas. Futuras sessões: ao editar copy da Beweather, respeitar isto:

### Conectividade
- **Somente WiFi.** Nada de 4G, 2G, 3G ou sinal de celular. A estação conecta via WiFi do roteador ou repetidor no campo. Bluetooth é OK mencionar (config local).

### Pagamento
- **Cartão de crédito em até 12x sem juros** OU **PIX à vista com desconto.** Nada mais.
- **Proibido mencionar:** boleto, financiamento agro, parcelamento sem cartão, cheque.

### Instalação
- "Você mesmo instala em ~8 minutos seguindo o vídeo passo a passo."
- **Não citar o cano/mastro** — ele vai junto na caixa pra facilitar, mas é detalhe logístico que complica o pitch. Usar "já vem com tudo que você precisa na caixa".

### Garantia
- **12 meses de fábrica** contra defeitos de fabricação. Suporte técnico com engenheiro agrônomo.

### Preço âncora
- A partir de **R$ 9.900**, 12x sem juros, **frete grátis pra todo Brasil**, entrega em 15 dias.

### Vídeos eProdutor (YouTube IDs oficiais)
- `3T8bvdjBc3E` — Conheça a estação Beweather
- `e1MP7uhvl7o` — Como instalar passo a passo
- `Py9TPstz3b0` — Unboxing: o que vem na caixa

### Tom
Direto, linguagem de campo, métricas específicas (R$, hectares, horas de pivô). Zero jargão corporativo. Headlines provocativas estilo "90% dos prejuízos da lavoura vêm do clima. E você ainda decide olhando o céu?".

---

## Tracking & Analytics (Beweather) — configurar antes de ligar ads

### GA4 — decisão: **criar property separada** para Beweather
Lucas já tem GA4 instalado no Fluxo Rural (`GoogleAnalytics` component em `app/layout.tsx` via env `NEXT_PUBLIC_GA_ID`). **Não reaproveitar a mesma property para Beweather.**

**Por quê property separada:**
- Públicos de Meta/Google Ads não podem contaminar: visitantes da Fluxo Rural (consultoria, gestão financeira) ≠ lead Beweather (produtor rural comprando estação). Misturar destrói lookalikes e relatórios.
- Conversões diferentes: Fluxo Rural mede `Lead` de diagnóstico/contato; Beweather mede `Lead` de cotação de hardware. Mesma tag, funis diferentes.
- Atribuição separada entre domínios se eventualmente o Beweather for pra `beweather.fluxorural.com` (cross-domain tracking opcional).

**Como instalar (quando chegar a hora):**
1. Criar GA4 property nova no Google Analytics, chamar "Beweather B2K"
2. Adicionar env var `NEXT_PUBLIC_GA_BEWEATHER_ID` (formato `G-XXXXX`)
3. No `app/(beweather)/layout.tsx`, importar `GoogleAnalytics` do `@next/third-parties/google` e passar o ID Beweather — **não herdar o GA4 do layout raiz**, porque o raiz usa o ID do Fluxo Rural. O root layout já renderiza um GA4 tag para Fluxo Rural; precisa OU condicionar o root a NÃO renderizar GA4 em rotas `/beweather*` (via pathname check server-side se possível, ou detectar no client), OU deixar ambos rodarem se aceitarmos 2 properties na mesma página.
4. Configurar eventos custom no GA4: `form_start`, `form_submit_beweather`, `whatsapp_click`, `video_play`, `roi_calculated`
5. Linkar com Google Ads Conversion Tracking assim que rodar a primeira campanha

### Meta Pixel — quando configurar
Stubs já estão no código como comentários `{/* TODO-PIXEL: fbq('track', 'Lead') */}` nos eventos críticos (form success, WhatsApp click, video play). Quando for instalar:
1. Criar Pixel novo no Business Manager (próprio Beweather, não do Fluxo Rural)
2. Adicionar script `fbq('init', 'PIXEL_ID')` no `app/(beweather)/layout.tsx`
3. Substituir os TODO-PIXEL pelos `fbq('track', ...)` reais
4. Configurar CAPI server-side via GAS ou Cloudflare Function (complemento do Pixel pra passar iOS 14.5+)
5. Definir Custom Conversions: `Lead Beweather`, `WhatsApp Click Beweather`, `View 50% Video`
6. Ativar Aggregated Event Measurement (AEM) e priorizar `Lead` como evento primário

### WhatsApp — número dedicado pra Beweather
Hoje `WHATSAPP_URL` em `BeweatherLanding.tsx` aponta pro número pessoal do Lucas (5545991447004). Antes de ligar ads:
1. Comprar chip/linha nova dedicada à Beweather (recomendado — evita ban + separa lead tracking)
2. Ativar WhatsApp Business API via Evolution API (já previsto na `estrategia-n8n.md`)
3. Atualizar `WHATSAPP_URL` em `BeweatherLanding.tsx` (constante no topo do arquivo)
4. Configurar click-to-chat com pré-texto customizado por UTM source (ex: Instagram → "Oi, vim do Instagram...")

---

## TODO Beweather (pendências antes do go-live)

### 🟢 Feito
- [x] Migração Next 14 → 16 pro repo Fluxo Rural (abr/2026)
- [x] Route group `(beweather)` isolado, sem nav/footer do Fluxo Rural
- [x] SEO completo: metadata, 3 JSON-LD (Organization/Brand, Product com SKU+seller+shipping, FAQ verbatim), llms.txt linkado via `<link rel=alternate>`
- [x] 3 vídeos reais do canal eProdutor: `3T8bvdjBc3E` (conheça), `e1MP7uhvl7o` (instalação), `Py9TPstz3b0` (unboxing)
- [x] Remoção total de 4G, boleto, financiamento agro, cano/mastro
- [x] **Compressão de imagens: 39MB → 2.2MB** (PNG→JPEG 1600px max via `sips -Z 1600 -s format jpeg -s formatOptions 82`). Hero: 7.6MB→430KB. CTA aerial: 7.7MB→384KB. Pulverização: 8.6MB→590KB. Packshot: 5.4MB→180KB.
- [x] YouTube facade (click-to-load) — carrega só a thumbnail até o usuário clicar play
- [x] Consentimento LGPD explícito no form (checkbox required, Zod `z.literal(true)`, link pra `/politica-de-privacidade`, envia `consent` + `consent_timestamp` + `consent_text` pro GAS como prova de consentimento Art. 7)
- [x] Price card flutuante: `static` no mobile, `absolute` no desktop (fim da colisão em 375px)
- [x] Floating WhatsApp: form section ganhou `pb-28 md:pb-12` pra não cobrir o botão submit
- [x] Social proof fake removido, substituído por 3 trust badges honestos (garantia 12m, frete grátis, agrônomo)
- [x] Harmonia de cores: hover states nos sensor cards + FAQ, contraste copy `/60`→`/75` (WCAG AA), drop-shadow no CTA final, CTA amarela com sombra amarelada
- [x] Stubs `TODO-PIXEL` nos eventos críticos (form submit, WhatsApp, video play)
- [x] Accessibility: `motion-reduce` guards, touch targets ≥44px, `fetchPriority="high"` no hero, `loading="lazy"` below-fold, `width/height` attrs (CLS)

### 🔴 Antes de ligar Meta Ads (bloqueantes)
- [ ] **Criar Google Apps Script real** pro form Beweather — hoje `GAS_URL` é placeholder. Script deve salvar em Sheets + enviar notificação email + capturar UTM + `consent_*` pra LGPD. Testar ponta-a-ponta (form → planilha → email) antes do go-live.
- [ ] **Instalar Meta Pixel** (property própria Beweather, ver seção Tracking acima)
- [ ] **Instalar GA4 property separada Beweather** (ver seção Tracking acima)
- [ ] **Trocar `WHATSAPP_URL`** pelo número oficial Beweather quando definido (hoje é do Lucas)
- [ ] **Criar OG image dedicado** `public/beweather/og-image.jpg` (1200×630 landscape, pesado ≤200KB) — hoje reusa `hero-soja-goldenhour.jpg` (já comprimido, 430KB, formato retrato 1568×2730 não é ideal pro preview do Facebook)

### 🟡 Go-live depende
- [ ] **Cloudflare Pages Function `functions/_middleware.js`** pra rotear `beweather.fluxorural.com` → `/beweather` (Next.js middleware não funciona em `output: 'export'`)
- [ ] Copiar `Ficha Técnica Beweather eProdutor.pdf` do SSD pra `public/beweather/` + adicionar botão "Baixar ficha técnica" na seção CTA final como lead magnet low-commitment
- [ ] Definir seller real no Product JSON-LD — hoje está `Fluxo Rural Consultoria` como seller. Se a venda for via eProdutor ou outra razão social, ajustar

### 🔵 Nice to have (pós-launch)
- [ ] Converter imagens JPEG → WebP/AVIF (outra redução de ~30%) usando `sharp` ou `cwebp` quando instalar
- [ ] `next/image` com `unoptimized: true` pra ganhar `srcSet` responsivo
- [ ] Adicionar `VideoObject` JSON-LD pros 3 vídeos YouTube (descoberta por IA)
- [ ] Adicionar `HowTo` schema pro fluxo de instalação em 8 min
- [ ] Reduzir form a 2 etapas (step 1: nome+whatsapp+hectares; step 2: endereço/CPF após primeiro contato) — reduz abandono em ~40%
- [ ] Depoimentos reais de produtores com foto+nome+fazenda (preencher social proof hoje vazio)

## Sobre Lucas Dierings
- **Agronomo, consultor rural, podcast host (NHCast + AgroJovem Podcast)**
- Especialista em: Gestao financeira, sucessao familiar, inovacao em agronegocio
- **Lucas pessoalmente:** Baseado em Londrina, Parana
- **Empresa (Fluxo Rural Consultoria):** Sede em Curitiba, PR (documentos, contratos, termos de uso)
- Email pessoal: lucas@fluxorural.com.br
- Email empresa/contato: contato@fluxorural.com.br
- WhatsApp: 5545991447004

---

## Projeto Atual: Site Fluxo Rural
**Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, MDX
**Deployment:** Cloudflare Pages (static export com `output: 'export'` + `trailingSlash: true`)
**Email:** Resend + MailerLite (newsletter)
**Repo:** github.com/lucasdierings/Fluxo-Rural-Site (privado)

### Brand Colors
- Primary Blue (navy): `#1E4D7B`
- Leaf Green (verde-folha): `#7AB648`
- Gold Yellow (dourado): `#E8B84B`
- Dark Green: `#1B4332`

---

## Arquitetura do Blog

### CMS: Decap CMS (Git-based)
- Editor visual em `/admin` (public/admin/index.html + config.yml)
- Commits direto no GitHub, Cloudflare rebuilda automaticamente
- **OAuth:** Cloudflare Functions em `functions/api/auth.js` + `functions/api/callback.js`
- **REQUER:** Variaveis de ambiente no Cloudflare Pages: `GITHUB_CLIENT_ID` e `GITHUB_CLIENT_SECRET`
- **REQUER:** GitHub OAuth App criada em github.com/settings/developers (Homepage URL + Callback URL = https://fluxorural.com.br)
- `_routes.json` em public/ limita Functions apenas a `/api/*` (preserva static requests gratuitos)
- **IMPORTANTE:** O script `decap-cms.js` DEVE ficar no `<body>`, NAO no `<head>`. No `<head>` causa erro `appendChild null` porque o DOM ainda nao existe
- Schema: titulo, data, categoria, imagem, readingTime, excerpt, FAQs opcionais, conteudo markdown

### Posts MDX
- Diretorio: `content/blog/`
- Parsed por `lib/mdx.ts` (getAllPosts, getPostBySlug, getAllCategories)
- Interface BlogPost: slug, title, date, category, coverImage, readingTime, excerpt, content, faqs?
- Blog listing (`app/blog/page.tsx`) usa `getAllPosts()` dinamicamente (server component)
- Filtro/busca client-side em `components/blog/BlogList.tsx`

### SEO e Otimizacoes para IA
- **JSON-LD global:** Person, ProfessionalService, WebSite (em `app/layout.tsx`)
- **JSON-LD por artigo:** Article (completo), BreadcrumbList, FAQPage condicional (em `app/blog/[slug]/page.tsx`)
- **llms.txt:** `public/llms.txt` para discoverability por LLMs
- **robots.txt:** Permite GPTBot, PerplexityBot, ClaudeBot, Google-Extended, Applebot-Extended, ChatGPT-User
- **Sitemap:** next-sitemap (postbuild), exclui /api/* e /admin
- **FAQ Schema:** Campo opcional `faqs` no frontmatter MDX, gera FAQPage JSON-LD + acordeoes visuais

### Cloudflare Pages
- `trailingSlash: true` no next.config.js (OBRIGATORIO - sem isso da 404 nos posts)
- `_headers` em public/ com security headers
- Static export: `output: 'export'`, `images.unoptimized: true`

---

## Diagnostico Inteligente (/diagnostico)

### Status: CONCLUIDO — com SELETOR DE PERFIL (produtor B2C + empresa B2B) desde jun/2026
- **Step 1** tem seletor de perfil: **Produtor Rural** vs **Empresa do Agro** (default produtor). Para empresa, o Step 1 ganha `empresa` (obrigatorio) e `cargo` (opcional).
- **Step 2 ramifica por perfil** (`components/forms/DiagnosticoForm.tsx`, render condicional, NAO data-driven):
  - **Produtor** (inalterado): Atividade Rural, Gestao, Sucessao & Familia, Saude Financeira, Urgencia.
  - **Empresa (B2B)**: A Empresa (segmento/faturamento/funcionarios/tempo), Gestao, **Marketing & Vendas** (geraClientes/presencaDigital/processoVendas), Desafios & Urgencia. Foco = gestao + marketing/vendas digitais.
- **Scoring profile-aware**: `calculateScore` (produtor, byte-for-byte intacto) + `calculateScoreEmpresa`; mesma escala 0-150 e tiers Verde(>=100)/Amarelo(>=70)/Laranja(>=40)/Vermelho. Oculto do usuario.
- `setPerfil` reseta TODOS os campos ramificados ao trocar de perfil (evita vazamento no scoring/payload). UTM tracking mantido.
- Pagina `/diagnostico` agora e **dual-audience** (copy produtor + empresa).

### Integracao — MIGRADO de Apps Script/Sheets para Cloudflare Function + Resend (jun/2026)
- O diagnostico **NAO usa mais Google Sheets/Apps Script**. Faz **POST real** (nao mais `no-cors`) para **`functions/api/diagnostico.js`** (Cloudflare Pages Function).
- A Function envia o lead por **e-mail via Resend** (REST API, HTML formatado por perfil, com escape) para `lucasdierings12@gmail.com`, `reply_to` = e-mail do lead. Resposta real → o form so mostra sucesso se o e-mail saiu (acabou o envio as cegas).
- **REQUER** env var `RESEND_API_KEY` no Cloudflare Pages (projeto `fluxo-rural-site`, Production) — setada com key dedicada **"fluxorural-pages-prod"** (Sending access). Dominio `fluxorural.com.br` ja verificado no Resend (remetente `contato@fluxorural.com.br`).
- **Testado ponta-a-ponta (jun/2026): POST → 200 → e-mail Delivered no Gmail.** ✓
- Email-only (sem armazenar lista). Registro futuro, se quiser: Cloudflare D1/KV ou Airtable (NAO voltar pro Sheets).

---

## Formularios e APIs
- **Diagnostico** (`/diagnostico`) → **POST real** para `functions/api/diagnostico.js` (Cloudflare Function) → e-mail via Resend. NAO usa mais GAS (ver secao Diagnostico).
- **Contato e Newsletter** → ainda enviam client-side `no-cors` pro **Google Apps Script** (`docs/google-apps-script.js`: grava em Sheets + e-mail via MailApp). As rotas Next `/api/contact` e `/api/newsletter` (Resend, `lib/resend.ts`) existem no codigo mas **NAO rodam em producao** (static export nao executa route handlers). Migrar pra Cloudflare Function + Resend tambem e um TODO futuro, se quiser sair do Sheets nesses tambem.
- **Resend:** 1 conta cobre todos os forms (limite = volume: 3k e-mails/mes no free, NAO "nº de forms"). Keys existentes: `beweather-pages-prod`, `fluxorural-pages-prod`. **Cloudflare Pages e projeto SEPARADO por marca:** `fluxo-rural-site` (consultoria) ≠ `beweather-fluxo-rural` (estacoes) — cada um com suas env vars.

---

## Decisoes Tecnicas Importantes
1. **trailingSlash: true** — Sem isso, Cloudflare Pages retorna 404 em rotas dinamicas como /blog/[slug]
2. **Blog listing dinamico** — `app/blog/page.tsx` e server component que chama `getAllPosts()`. NÃO usar array hardcoded
3. **Static export** — Site e 100% estatico. Nao tem SSR. APIs (/api/*) nao funcionam em producao no Cloudflare Pages com static export
4. **Sempre fazer rebase no main** antes de merge — main pode ter commits de outras sessoes
5. **async params (Next.js 15+)** — Em rotas dinamicas como [slug], `params` e uma Promise. SEMPRE usar `const { slug } = await params`. Sem isso, params.slug e undefined e a pagina gera 404 silencioso
6. **Cloudflare Functions** — O diretorio `functions/` na raiz do projeto e detectado automaticamente pelo Cloudflare Pages. `_routes.json` em public/ controla quais rotas passam pelas Functions
7. **Localizacao empresa vs pessoal** — Curitiba: footer, politica privacidade, contato, emails transacionais, JSON-LD negocio. Londrina: consultoria, diagnostico, TrustBar, SEO, llms.txt. Sobre: citar ambas
8. **Pagina de contato** — Sidebar so mostra email (contato@fluxorural.com.br), localizacao (Curitiba) e tempo de resposta. Sem WhatsApp/LinkedIn (nao estimula lead a preencher formulario)

---

## Sessao 7 abr/2026 — Revisao UX/UI/Mobile/SEO + Otimizacoes

### Correcoes feitas e mergeadas na main:
- [x] Logo branca comprimida: 5.8MB → 92KB (2048→480px, quantizada)
- [x] lucas-palestrante.JPG comprimida: 5.5MB → 103KB
- [x] nh-cast-new-holland.png comprimida: 7.6MB → 149KB
- [x] Apple-touch-icon criado (180x180)
- [x] Blog metadata via layout.tsx (antes nao tinha SEO)
- [x] robots.txt com crawlers de IA (GPTBot, ClaudeBot, PerplexityBot, etc.)
- [x] Breadcrumbs com JSON-LD em servicos, consultoria, financeiro, mentoria, contato
- [x] OG images especificas por pagina de servico
- [x] Newsletter envia direto ao Apps Script (sem abrir Typeform)
- [x] WhatsApp flutuante com tooltip ao hover
- [x] Depoimentos com badge de servico
- [x] /servicos/palestras redireciona para /palestras
- [x] Placeholder "Video Reel em Breve" removido
- [x] ContactForm grid responsivo (cidade/estado)
- [x] Imagem JCI renomeada (sem espacos)
- [x] Footer logo com lazy loading e sizes

## Pendencias
- [x] Logo Navbar — resolvida: nova logo horizontal branca + tamanho ajustado (jun/2026)
- [ ] Investigar badge "3 Issues" (canto inferior esquerdo)
- [ ] Configurar sequencia de email automatica (MailerLite)
- [ ] Campanha Google Ads com R$ 880
- [ ] Google Search Console — verificar indexacao
- [ ] Depoimentos com nomes reais e fotos (credibilidade)

---

## Sessao 03 jun/2026 — Pivo B2B: Marketing/Vendas + Diagnostico empresa + entrega via Resend

Tudo deployado na main (commits `bdb20ab` e `c8f53ec`) e no ar em fluxorural.com.br.

### Marca / Logo (Navbar)
- Nova **logo horizontal branca sem fundo**: `public/logo-fluxo-rural-branco-horizontal.png` (~60KB, alpha limpo via Pillow). Substitui `logo-colorido.svg` (que era PNG embutido em SVG).
- **Header navy solido nas paginas internas** (guard `isHome` em `components/layout/Navbar.tsx`): home segue transparente→navy no scroll; demais paginas (topo claro, ex. /blog, /contato) ficam navy desde o topo pra a logo branca ter contraste.
- Logo reduzida ~20% a pedido do Lucas: className `h-8 sm:h-10 lg:h-12`. (Resolve a antiga pendencia "logo Navbar muito pequeno".)

### Pivo de servico: Mentoria/Sucessao → **Marketing e Vendas Digitais**
- Lucas focou **B2B (empresas do agro)** alem do produtor. "Mentoria para Sucessao Familiar" foi **substituido** por **"Marketing e Vendas Digitais"** em TODO o site: card da home (`ServicesPreview`), `/servicos`, footer, ContactForm (assunto), JSON-LD do `layout.tsx`.
- **Nova pagina** `app/servicos/marketing-digital/page.tsx` (3 pilares + "O que esta incluido", SEM depoimento fake). **Redirect 301** `/servicos/mentoria` → `/servicos/marketing-digital` em `public/_redirects` (rota antiga removida).
- Hero H1 → **"Inovacao e Gestao Estrategica no Agronegocio"**. "Sucessao" de-enfatizada no posicionamento, mas **mantida** como expertise no JSON-LD e como artigo de blog / tema de palestra legitimos.

### Na Midia (homepage, `NaMidia.tsx`)
- **JCI** estava quebrada (path `/images/Lucas discurso JCI.JPG` com espacos/maiusculo) → corrigido pra `lucas-discurso-jci.jpg` + comprimida (5.7MB→142KB).
- **NH Cast**: trocado o logo pela **foto do Lucas no estudio** (`public/images/lucas-nhcast.jpg`, 89KB).

### Diagnostico B2B + backend Resend
Ver secao **"Diagnostico Inteligente"** acima (seletor de perfil, perguntas/scoring B2B, migracao do envio pra Cloudflare Function + Resend — testado, e-mail Delivered).

### Observacoes p/ proximas sessoes
- **Capas do blog pesadas** (`public/images/gestao-blog.png` ~8MB e outras) — comprimir com sips (padrao do repo) pra melhorar LCP. **Oferta ainda pendente.**
- **Arquivos soltos nao commitados** (tooling local, fora do site): `.agents/`, `AGENTS.md`, `public/google-ads/`, `scripts/` — decidir gitignore vs commit.
- Contato/Newsletter ainda no Apps Script/Sheets (so o diagnostico migrou pro Resend).

---

**Ultima atualizacao:** 03 de junho de 2026
**Status:** Pivo B2B no ar. Diagnostico com seletor de perfil (produtor/empresa) entregando lead por e-mail via Cloudflare Function + Resend (testado ponta-a-ponta, Delivered). Servico "Marketing e Vendas Digitais" substituiu "Mentoria/Sucessao". Logo horizontal branca (-20%) no header. Anterior (07/abr/2026): revisao UX/UI/Mobile/SEO, imagens otimizadas, breadcrumbs, OG images, newsletter nativa, robots.txt para IA.
