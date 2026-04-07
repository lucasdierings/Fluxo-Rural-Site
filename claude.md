# Fluxo Rural: Contexto do Projeto

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

### Status: CONCLUIDO (formulario + scoring)
- Formulario 2-step: Identificacao (nome, email, whatsapp, estado) + Pre-diagnostico (17 campos)
- Scoring 0-150 pontos (backend only, user nao ve)
- Qualificacao: Verde/Amarelo/Laranja/Vermelho (enviado pro Google Sheets)
- UTM tracking no formulario
- Apps Script com notificacao por email

### Integracao
- Google Apps Script: recebe dados do formulario + scoring + UTM
- Script URL configurada nos formularios (contato + diagnostico)

---

## Formularios e APIs
- `/api/contact` — formulario de contato (Resend)
- `/api/newsletter` — newsletter (MailerLite + Resend welcome email)
- Formulario de diagnostico envia direto pro Google Apps Script (client-side)

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
- [ ] Aumentar logo Navbar (muito pequeno)
- [ ] Investigar badge "3 Issues" (canto inferior esquerdo)
- [ ] Configurar sequencia de email automatica (MailerLite)
- [ ] Campanha Google Ads com R$ 880
- [ ] Google Search Console — verificar indexacao
- [ ] Depoimentos com nomes reais e fotos (credibilidade)

---

**Ultima atualizacao:** 07 de abril de 2026
**Status:** Revisao completa UX/UI/Mobile/SEO mergeada na main. Todas as imagens otimizadas. Breadcrumbs, OG images, newsletter nativa, robots.txt para IA.
