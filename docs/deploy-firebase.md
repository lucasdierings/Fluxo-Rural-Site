# Deploy no Firebase Hosting

## Opção 1: Firebase Hosting com Next.js (via Cloud Run)

Para Next.js com API routes, o Firebase Hosting precisa do Firebase App Hosting ou Cloud Run.

### Passos:

1. **Instalar Firebase CLI:**
```bash
npm install -g firebase-tools
```

2. **Login:**
```bash
firebase login
```

3. **Inicializar projeto:**
```bash
firebase init hosting
```

4. **Build do projeto:**
```bash
npm run build
```

5. **Deploy:**
```bash
firebase deploy --only hosting
```

## Opção 2: Deploy na Vercel (recomendado para Next.js)

A Vercel é a plataforma nativa do Next.js e oferece:
- Deploy automático via GitHub
- SSL automático
- Edge Functions para API routes
- Preview deployments

### Passos:

1. Conecte o repositório GitHub na [Vercel](https://vercel.com).
2. Configure as variáveis de ambiente no painel.
3. O deploy acontece automaticamente a cada push.

### Domínio customizado:
1. Vá em **Settings** > **Domains**.
2. Adicione `fluxorural.com.br`.
3. Configure os registros DNS no seu provedor:
   - CNAME: `www` → `cname.vercel-dns.com`
   - A: `@` → `76.76.21.21`

## Variáveis de Ambiente

Em qualquer plataforma, configure as seguintes variáveis:

```
RESEND_API_KEY=re_xxxxxxxxx
MAILERLITE_API_KEY=eyJxxxxxxxxx
NEXT_PUBLIC_SITE_URL=https://fluxorural.com.br
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_WHATSAPP_NUMBER=5543999999999
```
