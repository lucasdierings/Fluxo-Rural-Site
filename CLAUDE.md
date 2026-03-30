# Fluxo Rural Site — Contexto e Próximos Passos

## Sobre o Projeto

Site institucional de **Lucas Dierings** e da **Fluxo Rural Consultoria**.
- **Stack:** Next.js 16 (static export), React 19, Tailwind CSS, TypeScript
- **Blog:** MDX com `next-mdx-remote` (4 artigos publicados em `/content/blog/`)
- **Domínio:** www.fluxorural.com.br
- **Repositório:** github.com/lucasdierings/Fluxo-Rural-Site
- **Branch principal:** `main`

## SEO — Status Atual

O SEO técnico do site está bem configurado:
- Meta tags, Open Graph e Twitter Cards em todas as páginas
- JSON-LD estruturado: Person, ProfessionalService, WebSite, PodcastSeries (NHCast e Agrojovem)
- Sitemap automático com `next-sitemap` (prioridades configuradas)
- robots.txt gerado automaticamente
- Canonical URLs em todas as páginas
- Keywords otimizadas para: Lucas Dierings, Gestão Rural, Fluxo Rural, Agro Jovem Podcast, NH CAST, Inteligência Artificial no Agronegócio

## Pendências — O que falta fazer

### Deploy (PRIORIDADE ALTA)
- [ ] Configurar plataforma de hospedagem (Vercel, Netlify ou Cloudflare Pages)
- [ ] Conectar o repositório GitHub para deploy automático na branch `main`
- [ ] Configurar variáveis de ambiente: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_WHATSAPP_NUMBER`
- [ ] Configurar domínio customizado `fluxorural.com.br`

### Google Search Console (PRIORIDADE ALTA)
- [ ] Cadastrar o site em https://search.google.com/search-console
- [ ] Verificar propriedade do domínio
- [ ] Enviar sitemap: `https://fluxorural.com.br/sitemap.xml`
- [ ] Solicitar indexação das páginas principais

### Google Meu Negócio
- [ ] Criar perfil no Google Business Profile como "Fluxo Rural Consultoria"
- [ ] Adicionar endereço (Londrina, PR), telefone, site, fotos
- [ ] Isso faz aparecer no Google Maps e no painel lateral das buscas

### Backlinks e Autoridade
- [ ] Conseguir links de sites relevantes apontando para fluxorural.com.br
  - Matérias da CNA/SENAR sobre o prêmio CNA Jovem
  - Site da New Holland / NHCast
  - Diretórios de agronegócio
  - Perfis em portais como LinkedIn, YouTube, etc.
- [ ] Bio do Instagram, YouTube e LinkedIn sempre com link para fluxorural.com.br
- [ ] Descrições dos episódios dos podcasts com link para o site

### Conteúdo (Blog)
- [ ] Publicar mais artigos no blog com os termos-alvo
- [ ] Sugestões de artigos:
  - "O que é Gestão Rural e por que ela importa"
  - "Como a Inteligência Artificial está mudando o Agronegócio"
  - "NH Cast: bastidores do podcast da New Holland"
  - "Agro Jovem Podcast: a nova geração do agronegócio"
  - "Guia completo de gestão financeira para produtores rurais"

### Melhorias Futuras no Site
- [ ] Adicionar vídeo reel na página de Palestras (placeholder já existe)
- [ ] Configurar Google Analytics (variável `NEXT_PUBLIC_GA_ID`)
- [ ] Considerar adicionar página dedicada para cada podcast (NHCast e Agrojovem)

## Estrutura de Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Home — Hero, Trust Bar, Serviços, Credenciais, Blog, Mídia, Depoimentos |
| `/sobre` | Sobre Lucas Dierings — Bio, Trajetória, Credenciais, Valores |
| `/servicos` | Visão geral dos 4 serviços |
| `/servicos/consultoria` | Consultoria em Gestão e Inovação (com FAQ JSON-LD) |
| `/servicos/financeiro` | Gestão Financeira Rural (com FAQ JSON-LD) |
| `/servicos/mentoria` | Mentoria para Sucessão Familiar |
| `/servicos/palestras` | Palestras e Workshops |
| `/palestras` | Página alternativa de Palestras + Podcast |
| `/blog` | Lista de artigos com busca e filtro |
| `/blog/[slug]` | Artigo individual (MDX) |
| `/contato` | Formulário de contato (Google Sheets) |
| `/newsletter` | Cadastro na newsletter (MailerLite) |
| `/politica-de-privacidade` | LGPD |

## Integrações

- **Google Sheets:** Formulário de contato envia para planilha via Google Apps Script
- **MailerLite:** Newsletter
- **Resend:** E-mails transacionais
- **Google Analytics:** Configurado via `@next/third-parties/google`
