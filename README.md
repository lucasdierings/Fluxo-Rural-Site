# Fluxo Rural Consultoria — Site Profissional

Site profissional de Lucas Dierings, fundador da Fluxo Rural Consultoria. Engenheiro agrônomo, consultor estratégico, mentor e palestrante especializado em gestão, inovação e sucessão no agronegócio.

## Tecnologias

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Estilo:** Tailwind CSS + shadcn/ui
- **Animações:** Framer Motion
- **Blog:** MDX (next-mdx-remote + gray-matter)
- **Formulários:** React Hook Form + Zod
- **E-mail:** Resend
- **Newsletter:** MailerLite
- **Analytics:** Google Analytics 4
- **SEO:** next-sitemap + JSON-LD

## Pré-requisitos

- Node.js 18+
- npm ou yarn

## Instalação

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/fluxo-rural-site.git
cd fluxo-rural-site

# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env.local
```

## Variáveis de Ambiente

Edite o arquivo `.env.local` com suas chaves:

| Variável | Descrição | Onde obter |
|----------|-----------|------------|
| `RESEND_API_KEY` | API key do Resend para envio de e-mails | [resend.com](https://resend.com) |
| `MAILERLITE_API_KEY` | API key do MailerLite para newsletter | [mailerlite.com](https://mailerlite.com) |
| `NEXT_PUBLIC_SITE_URL` | URL do site em produção | Seu domínio |
| `NEXT_PUBLIC_GA_ID` | ID do Google Analytics 4 | [analytics.google.com](https://analytics.google.com) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número do WhatsApp com DDI | Seu número |

Consulte os guias detalhados em `/docs/`:
- `docs/setup-resend.md` — Configuração do Resend
- `docs/setup-mailerlite.md` — Configuração do MailerLite
- `docs/deploy-firebase.md` — Deploy (Firebase ou Vercel)

## Desenvolvimento

```bash
# Servidor de desenvolvimento
npm run dev

# Acessar em http://localhost:3000
```

## Build

```bash
# Build de produção
npm run build

# Iniciar servidor de produção
npm start
```

## Estrutura do Projeto

```
/app                    → Páginas (App Router)
  /page.tsx             → Home
  /sobre                → Página Sobre
  /servicos             → Páginas de Serviços
  /blog                 → Blog (lista + artigos)
  /palestras            → Palestras
  /newsletter           → Newsletter
  /contato              → Formulário de contato
  /api                  → API Routes (contato, newsletter)
/components
  /layout               → Navbar, Footer, WhatsApp flutuante
  /sections             → Seções da home
  /forms                → Formulários
  /blog                 → Componentes do blog
  /ui                   → Componentes base (shadcn)
/content/blog           → Posts em MDX
/lib                    → Utilitários e integrações
/public/images          → Imagens do site
/docs                   → Guias de configuração
```

## Adicionando Posts ao Blog

1. Crie um arquivo `.mdx` em `/content/blog/`
2. Adicione o frontmatter:

```mdx
---
title: "Título do Post"
date: "2026-04-01"
category: "Gestão"
coverImage: "/images/nome-da-imagem.png"
readingTime: 5
excerpt: "Resumo do post em até 160 caracteres."
---

Conteúdo do post em Markdown...
```

3. Adicione o post ao array em `app/blog/page.tsx` para aparecer na listagem.

## Deploy

### Vercel (Recomendado)
1. Conecte o repositório na [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Firebase
Consulte `docs/deploy-firebase.md`

## Licença

Projeto privado — Fluxo Rural Consultoria. Todos os direitos reservados.
