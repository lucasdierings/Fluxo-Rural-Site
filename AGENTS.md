# AGENTS.md — Fluxo Rural Site

## Escopo

Este repositório contém o site institucional da Fluxo Rural Consultoria, o blog em MDX, o diagnóstico de leads, a página de palestras e a landing isolada da Beweather.

Tratar Lucas Dierings como fundador, engenheiro agrônomo CREA-PR 179906/D, consultor e palestrante. A Fluxo Rural é uma empresa de consultoria, gestão, inovação, marketing e palestras para o agronegócio.

## Prioridades

Ao decidir entre alternativas, priorizar nesta ordem:

1. Conversão honesta e clareza comercial.
2. Confiança, autoridade técnica e acessibilidade.
3. Performance, SEO e descoberta por IA.
4. Manutenção simples para um desenvolvedor solo.
5. Refinamento visual sem aumentar a operação manual.

Evitar refatorações amplas sem benefício mensurável. Preferir a menor mudança segura.

## Stack e comandos

- Next.js 16 com App Router e `output: 'export'`.
- TypeScript estrito.
- Tailwind CSS e componentes shadcn/ui.
- MDX em `content/blog/`.
- Cloudflare Pages e Functions.
- npm exclusivamente. Não usar yarn ou pnpm sem autorização.

Após editar código:

1. Rodar `npm run typecheck` se o script existir.
2. Rodar `npm test` se o script existir.
3. Rodar `npm run build` para mudanças em páginas, rotas, metadata ou configuração.
4. Conferir `git diff` e não incluir arquivos gerados ou alterações alheias.

## Convenções de código

- Componentes em PascalCase.
- Arquivos de componentes em kebab-case quando criar novos módulos.
- Funções e variáveis em camelCase.
- Variáveis de ambiente em `.env.local`; nunca versionar segredos.
- Commits em Conventional Commits.
- Preservar componentes existentes quando a composição já resolve o problema.
- Não adicionar dependência sem justificar custo, manutenção e impacto no bundle.

## Identidade visual Fluxo Rural

- Navy principal: `#1B4F7A`.
- Verde: `#6AAF3D`.
- Ouro: `#E8B84B`.
- Fundo quente recomendado: `#F7F5EF`.
- Carvão para texto: `#202522`.

Direção: editorial rural premium, humana, objetiva e confiável. Usar fotos reais de campo, palco, produtores e bastidores. Evitar estética SaaS genérica, excesso de glassmorphism, gradientes decorativos, sombras pesadas e animações sem função.

Usar navy para estrutura e autoridade, verde para ação e progresso, ouro como destaque restrito. Não distribuir as três cores com o mesmo peso.

## UX e conteúdo

- Cada página deve ter uma ação principal clara.
- `/palestras` converte prioritariamente por WhatsApp.
- Formulários de contato e diagnóstico são destinados à consultoria.
- Não inventar métricas, depoimentos, clientes, resultados ou prêmios.
- Não usar alegações como “número 1”, “líder” ou garantias de resultado sem prova.
- Escrever em português brasileiro direto, com linguagem do campo e sem jargão corporativo ou acadêmico (proibido usar termos pedantes/artificiais de IA como “metodologia canônica”, “dissecar”, etc.; preferir termos naturais como “metodologia oficial da Conab”, “fórmula padrão”, “mostrar na prática”). Não subestimar o leitor explicando conceitos óbvios (usar diretamente “barracão” ou “estrutura coberta” em vez de usar “abrigo” e tentar explicar); reservar explicações didáticas apenas para siglas e termos técnicos genuínos (ex.: TMR, fator de carga, ROA, LCDPR).
- Manter títulos descritivos, blocos curtos, contraste WCAG AA e alvos de toque de pelo menos 44 px.
- Respeitar `prefers-reduced-motion` e evitar animações contínuas que disputem atenção com o CTA.

## SEO, GEO e analytics

- Preservar metadata, canonical, sitemap, robots, JSON-LD, `llms.txt` e `llms-full.txt`.
- Não alterar nomes de eventos ou IDs de analytics sem conferir `lib/track.ts`, GTM e documentação do projeto.
- Nunca enviar PII para GA4, GTM ou Meta Pixel.
- Ao criar ou alterar artigo, revisar FAQ, linkagem interna, fonte de dados e CTA contextual.
- Separar fatos verificados de inferências. Não publicar estatística sem fonte confiável.

## Beweather

- Manter `/beweather` isolada visualmente e analiticamente da Fluxo Rural.
- Não expor Beweather na navegação, footer ou sitemap principal sem decisão explícita.
- Conectividade: somente Wi-Fi e Bluetooth; nunca afirmar 4G, 3G ou 2G.
- Pagamento: cartão em até 12x sem juros ou PIX à vista com desconto.
- Não exibir “B2K Technology”; usar Beweather ou E-Aware Technologies.
- Não ligar mídia paga enquanto formulário, analytics e WhatsApp dedicado não estiverem validados ponta a ponta.

## Segurança e mudanças de risco

- Não apagar arquivos, limpar Git, alterar produção ou executar migração destrutiva sem aprovação explícita.
- Mostrar SQL ou script destrutivo antes de executar.
- Preservar trabalho existente e mudanças não relacionadas.
- Não usar `git reset --hard`, `git clean -fd`, `git checkout -- .` ou push forçado sem explicar o risco e obter confirmação.

## Documentação

Atualizar `claude.md` quando houver mudança material de arquitetura, campanha, integração, status de deploy, bloqueador ou decisão de produto. Manter documentação enxuta e remover instruções obsoletas quando substituídas.

