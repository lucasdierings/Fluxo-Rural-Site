# Fluxo Rural: Contexto do Projeto

## Sobre Lucas Dierings
- Engenheiro Agrônomo (UFPR), MBA Agronegócios USP/ESALQ (2023)
- Consultor estratégico, palestrante, professor MBA PUCPR (2025)
- Consultor SENAR/PR (2025), host NHCast (New Holland) + Agrojovem Podcast
- Destaque Nacional CNA Jovem 2021 (1 de 5 entre 3.742 jovens)
- 7 anos em software de gestão rural (24 estados)
- Baseado em Londrina, PR
- Email: lucas@fluxorural.com.br
- WhatsApp: +55 45 99144-7004
- LinkedIn: linkedin.com/in/lucasdierings
- Instagram: instagram.com/lucasdierings.agro

---

## Stack Técnica
- **Framework:** Next.js 16.2.1 (App Router, static export)
- **Linguagem:** TypeScript 5.7.2
- **Styling:** Tailwind CSS 3.4.17 + Radix UI + Framer Motion 11.15
- **Fontes:** Plus Jakarta Sans (headings) + Inter (body)
- **Forms:** React Hook Form + Zod + Google Apps Script (no-cors)
- **Email:** Resend (API) + Typeform (newsletter footer)
- **Blog:** MDX (next-mdx-remote) — conteúdo ainda não publicado
- **Analytics:** Google Analytics 4 (@next/third-parties)
- **SEO:** next-sitemap, JSON-LD (Person, ProfessionalService, WebSite, FAQPage, Article)
- **Deployment:** Cloudflare Pages (static export)
- **Repo:** github.com/lucasdierings/fluxo-rural-site (privado)

### Brand Colors
| Nome | Hex | Uso |
|------|-----|-----|
| Navy | `#1E4D7B` | Primary, headers, navbar |
| Verde Folha | `#7AB648` | CTAs, badges, destaque |
| Dourado | `#E8B84B` | Acentos, ícones, hover |
| Verde Escuro | `#1B4332` | Seções escuras |
| Off-White | `#F8F6F1` | Backgrounds claros |
| Carvão | `#1C1C1C` | Texto body |

---

## Estrutura de Páginas
| Rota | Descrição |
|------|-----------|
| `/` | Homepage (Hero + TrustBar + Services + Credentials + ContentCTA + Blog + NaMidia + Testimonials + FinalCTA) |
| `/sobre` | Biografia, timeline, credenciais, valores, mídia |
| `/servicos` | Grid de 4 serviços |
| `/servicos/consultoria` | Consultoria em Gestão — fases, resultados, FAQ |
| `/servicos/financeiro` | Gestão Financeira Rural — inclui, FAQ |
| `/servicos/mentoria` | Mentoria Sucessão Familiar — passos, depoimentos |
| `/servicos/palestras` | Redirect para /palestras |
| `/palestras` | Palestras — temas, podcast, como contratar |
| `/blog` | Listagem com busca e filtro por categoria |
| `/blog/[slug]` | Post individual (MDX) |
| `/contato` | Formulário + sidebar (email, WhatsApp, LinkedIn) |
| `/diagnostico` | Formulário 2-step com scoring inteligente |
| `/newsletter` | Inscrição com nome + email + LGPD |
| `/politica-de-privacidade` | Política LGPD |

---

## Formulários e Integrações
- **ContactForm** → Google Apps Script (POST no-cors) → Google Sheets + email notificação
- **DiagnosticoForm** → Google Apps Script (POST no-cors) → Sheets com score + UTM tracking
- **NewsletterForm (footer/inline)** → Abre Typeform (mOomZZiC) em nova aba
- **NewsletterPage** → Google Apps Script direto (nome + email + LGPD)
- **SCRIPT_URL:** `https://script.google.com/macros/s/AKfycbzf4afizws5cwq0vcPcc7LTaBxUERprs6Ahgy0QzwiYHOOakPWS9VdmBqM7YOHkiK0Iug/exec`

### Sistema de Scoring do Diagnóstico (backend only)
- Score: 0-150 pontos (NÃO mostrado ao usuário)
- Qualificação: verde (100+) / amarelo (70-99) / laranja (40-69) / vermelho (<40)
- Enviado para Google Sheets com UTM params

---

## Histórico de Sessões

### Sessão 1-6 (mar/2025) — Construção Inicial
- Site completo criado: todas as páginas, componentes, formulários
- Design system Apple-style com glassmorphism
- Diagnóstico inteligente com scoring
- Integração Google Apps Script
- UTM tracking nos formulários
- SEO completo com JSON-LD schemas

### Sessão 7 (31/mar/2026) — Revisão Completa UX/UI/Mobile/SEO
**Branch:** `claude/review-ux-ui-mobile-zBBVM`

**Problemas encontrados e corrigidos:**
1. **Hero sem foto no mobile** — Foto do Lucas ficava `hidden lg:flex`. Adicionada versão menor (128-160px) no mobile
2. **NaMidia cards inconsistentes** — Agrojovem transbordava h-72, NHCast com cores erradas sob gradient. Todos uniformizados
3. **Blog sem metadata SEO** — Page usava `'use client'`, impossível exportar metadata. Criado `app/blog/layout.tsx`
4. **Canonical hardcoded** — Layout tinha canonical da home em TODAS as páginas. Removido
5. **robots.txt sem crawlers IA** — Adicionados GPTBot, ClaudeBot, Google-Extended, PerplexityBot, etc.
6. **llms.txt criado** — Arquivo estruturado para crawlers de IA
7. **LinkedIn URL inconsistente** — Footer/contato usavam `lucas-dierings`, JSON-LD `lucasdierings`. Padronizado
8. **Imagem com espaço** — `Lucas discurso JCI.JPG` → `lucas-discurso-jci.jpg`
9. **ContactForm grid fixo** — cidade/estado era `grid-cols-2` sem breakpoint. Corrigido para responsivo
10. **Rotas duplicadas** — `/servicos/palestras` agora redireciona para `/palestras`

**Correções adicionais (mesma sessão):**
11. **Logo branca comprimida** — 5.8MB → 92KB (redimensionada 2048→480px, quantizada 128 cores)
12. **Apple-touch-icon criado** — 180x180 a partir do icon.png existente
13. **Newsletter nativa** — Removido Typeform, agora envia direto ao Google Apps Script sem sair do site
14. **WhatsApp tooltip** — Tooltip "Fale pelo WhatsApp" ao hover no botão flutuante
15. **Footer otimizado** — Logo com `sizes` e `loading="lazy"`
16. **Blog posts** — Conteúdo MDX já existia (4 artigos completos), não era placeholder

**Sugestões pendentes:**
- [ ] Adicionar OG images específicas por página de serviço
- [ ] Adicionar breadcrumbs nas páginas internas
- [ ] Substituir placeholder "Video Reel em Breve" na página de palestras
- [ ] Depoimentos com nomes reais e fotos (credibilidade)
- [ ] Google Search Console — verificar indexação
- [ ] Campanha Google Ads com R$ 880
- [ ] Mergear branch `claude/review-ux-ui-mobile-zBBVM` na main e deploy

---

## Cloudflare Pages
- **Conta:** Lucasdierings@live.com (ID: 20492d3a6b98bfc342338d4f2a567c1b)
- **Deploy:** Cloudflare Pages (confirmado por `_headers` file)
- **Nota:** MCP do Cloudflare não tem tools para listar/gerenciar Pages projects diretamente, apenas Workers/D1/KV/R2
- **Headers configurados:** X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin

## Notas Importantes
- Deploy é **static export** (`output: 'export'`) — sem server-side features (redirect(), API routes não funcionam em prod)
- Formulários usam `mode: 'no-cors'` — não é possível ler resposta do servidor, então error handling é limitado
- Imagens são `unoptimized: true` por causa do static export
- Newsletter agora envia direto ao Google Apps Script (não abre mais Typeform)
- Blog posts existem em `content/blog/` como MDX com conteúdo real (4 artigos)
- Favicon já existia em `app/icon.png` (logo Fluxo Rural colorida)

---

**Última atualização:** 31 de março de 2026 — Sessão 7 (continuação)
**Status:** Todas as prioridades altas concluídas, pendente merge na main
