# Prompt para Claude Cowork — Configuração Google para fluxorural.com.br

Cole este prompt no Claude Cowork (computer use) com o navegador aberto e logado na conta Google do site.

---

## Prompt

Preciso que você me ajude a configurar as ferramentas do Google para o site **www.fluxorural.com.br** (Fluxo Rural Consultoria — Lucas Dierings). Vou te guiar pelas 3 etapas. Faça uma por vez e me avise quando terminar cada uma.

### ETAPA 1 — Google Search Console

1. Acesse https://search.google.com/search-console
2. Clique em "Adicionar propriedade" (ou "Add property")
3. Escolha a opção **"Domínio"** e digite: `fluxorural.com.br`
   - Se pedir verificação via DNS, me mostre o registro TXT que preciso adicionar no provedor de domínio
   - Se a opção de domínio não funcionar, use **"Prefixo de URL"** com `https://fluxorural.com.br`
4. Depois de verificado, vá em **"Sitemaps"** no menu lateral esquerdo
5. Adicione o sitemap: `https://fluxorural.com.br/sitemap.xml` e envie
6. Vá em **"Inspeção de URL"** (URL Inspection) e solicite indexação para estas páginas:
   - `https://fluxorural.com.br/`
   - `https://fluxorural.com.br/sobre`
   - `https://fluxorural.com.br/servicos`
   - `https://fluxorural.com.br/palestras`
   - `https://fluxorural.com.br/blog`
   - `https://fluxorural.com.br/contato`
   - `https://fluxorural.com.br/blog/inteligencia-artificial-no-campo-o-que-ja-e-realidade`
   - `https://fluxorural.com.br/blog/sucessao-familiar-agronegocio-por-que-planejar-agora`

### ETAPA 2 — Google Analytics (GA4)

1. Acesse https://analytics.google.com
2. Crie uma nova propriedade (property) chamada: **"Fluxo Rural — fluxorural.com.br"**
3. Configure:
   - Fuso horário: **Brasília (GMT-3)**
   - Moeda: **BRL — Real brasileiro**
   - Categoria do negócio: **Agronegócio / Consultoria**
4. Crie um **Web Stream** com a URL: `https://fluxorural.com.br`
5. Copie o **Measurement ID** (formato `G-XXXXXXXXXX`) — eu preciso desse código para colocar no site como variável de ambiente `NEXT_PUBLIC_GA_ID`
6. Ative os eventos recomendados (page_view, scroll, outbound_click, file_download)

### ETAPA 3 — Google Meu Negócio (Business Profile)

1. Acesse https://business.google.com
2. Clique em "Adicionar empresa" ou "Add your business"
3. Preencha com estas informações:
   - **Nome da empresa:** Fluxo Rural Consultoria
   - **Categoria principal:** Consultor agrícola (ou "Agricultural consultant")
   - **Categorias secundárias:** Consultor de gestão (Management consultant), Palestrante (Public speaker)
   - **Endereço:** Londrina, PR, Brasil
   - **Área de atendimento:** Brasil (atendimento nacional)
   - **Telefone:** (usar o WhatsApp do site, se disponível)
   - **Site:** https://fluxorural.com.br
   - **Horário de funcionamento:** Segunda a Sexta, 8h às 18h
   - **Descrição da empresa:**

```
Fluxo Rural Consultoria — fundada por Lucas Dierings, engenheiro agrônomo com MBA USP/ESALQ e destaque nacional CNA Jovem 2021. Oferecemos consultoria em gestão rural, gestão financeira rural, mentoria para sucessão familiar e palestras sobre inteligência artificial no agronegócio. Lucas é host do NH Cast (podcast oficial da New Holland Brasil) e do Agro Jovem Podcast. Atendemos produtores rurais e empresas do agronegócio em todo o Brasil.
```

4. Se pedir verificação, me mostre as opções disponíveis (geralmente por correio, telefone ou e-mail)
5. Depois de criado, adicione fotos se eu tiver disponíveis

---

## Informações de Referência

- **Site:** https://fluxorural.com.br
- **E-mail:** lucas@fluxorural.com.br
- **Localização:** Londrina, PR, Brasil
- **Proprietário:** Lucas Dierings
- **Empresa:** Fluxo Rural Consultoria
- **Redes sociais:**
  - LinkedIn: https://linkedin.com/in/lucasdierings
  - Instagram: https://www.instagram.com/lucasdierings.agro/
  - YouTube (Agrojovem): https://www.youtube.com/@agrojovempodcast

## Depois de Configurar

Me passe:
1. O **Measurement ID do GA4** (G-XXXXXXXXXX) para eu configurar no site
2. O **registro DNS TXT** do Search Console (se necessário) para eu adicionar no provedor de domínio
3. O **status da verificação** do Google Meu Negócio
