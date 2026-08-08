# Calculadora de Margem — Rodada 2: custos flexíveis, e-mails Resend, GA4 e financeiro rápido

## Contexto

A calculadora (`fluxorural.com.br/calculadora`, repo `/Users/lucasdierings/GitHub /Fluxo-Rural-Site`, espaço após "GitHub") está no ar como isca de leads, mas a exploração revelou lacunas que limitam valor e conversão:

- **Custos só aceitam "total da safra"** — produtor que pensa em R$/ha não tem como informar assim (`custo_mode` fixo em `'total'`, `app.js:73,185`). Sem subcategorias; sem grupo de Comercialização (frete/armazenagem/taxas).
- **O produtor sai de mãos vazias**: o e-mail Resend existente vai só pro Lucas (`sendEmail`, `calculadora.js:222-285`); não há e-mail de entrega, e refresh zera tudo (sem localStorage).
- **Checkbox `interesse_gestao` morto** — campo existe no D1 e no payload mas nenhuma UI o altera (sempre `false`).
- **Funil cego no GA4** — único evento é `generate_lead` no cadastro; não dá pra ver abandono por etapa.
- **Nenhum lead entra na audiência Resend** — a lista de newsletter (estratégia combinada em conversa anterior) não se constrói sozinha.

**Escopo aprovado pelo Lucas:** reforma de custos (toggle R$/ha↔total + 4 grupos com detalhamento opcional, sempre com "Outros"; admin com gastos mensais × meses da safra; assistência técnica; serviços terceirizados; grupo novo Comercialização) + dois e-mails Resend + contato na audiência Resend + card "Financeiro rápido" (ponto de equilíbrio, custo/saca) + funil GA4 instrumentado. **Adições da revisão:** gráfico de composição de custos (% do custo e % da receita por categoria), botão "Refazer cálculo" (wizard pré-preenchido, vale a última), campo "Nome da propriedade" (opcional — permite 2+ propriedades por produtor, muda a chave de dedup), eventos GA4 com nomes em português (exceto `generate_lead`, preso à conversão Ads no GTM). **Fora desta rodada** (decisão dele): permalink do resultado, localStorage, sliders "e se". **Repo:** permanece no monorepo do site — a Function precisa do mesmo projeto Pages pra API same-origin (`/api/calculadora`) e embed sem CORS; separar exigiria subdomínio ou proxy Worker + 2 pipelines. Revisitar se a calculadora virar produto com domínio próprio.

## Design das decisões-chave

### Taxonomia de custos (UI) → colunas D1 (canônicas)

4 grupos colapsáveis (`<details>`), renderizados de uma constante nova `GRUPOS_CUSTO` (substitui `CATEGORIAS`, `app.js:11`). Cada categoria tem campo único; botão "detalhar" abre subcategorias que **somam no pai** (pai vira readonly = soma). Toda lista de subs termina em **"Outros"** com descrição livre opcional.

| Grupo | Categorias (subs) | Coluna D1 |
|---|---|---|
| Insumos | sementes · defensivos (herbicida/fungicida/inseticida/adjuvante/outros) · fertilizantes (base/cobertura/foliar/outros) | `custo_sementes` / `custo_defensivos` / `custo_fertilizantes` |
| Máquinas e operações | combustível · manutenção e peças · seguro · serviços terceirizados · outros | combustível→`custo_diesel`; resto→`custo_manutencao` |
| Pessoas e gestão | mão de obra · assistência técnica · administrativo (**mensal**: energia/internet/gasolina/outros, R$/mês × N meses, default 6, editável) | `custo_mao_obra`; assistência+admin→`custo_admin` |
| Comercialização (**novo**) | armazenagem · frete · taxas · outros | `custo_comercializacao` (**nova coluna**) |

- Colunas existentes permanecem canônicas em R$/ha (nulo = benchmark) — preserva série histórica e comparação com o seed.
- Breakdown completo (subs, modo, meses, descrições) vai íntegro numa coluna nova `custos_detalhe` (JSON) — só entradas do usuário, na unidade digitada.
- **Toggle global R$/ha ↔ Total** por cultura (`custo_modo`, herdado pela cultura seguinte). Novo helper central `custosCanonicosHa(c)` converte e agrega — substitui a lógica hoje triplicada em `calcularTudo` (180-194), `updateCustoLive` (775) e `marginPreviewCultura` (799).
- Benchmark: canônico só cai no benchmark se TODOS os campos que somam nele estiverem vazios.
- `inputmode="decimal"` em todos os numéricos; formatação de milhar on-blur (`Intl.NumberFormat`; `parseNum` já lê "1.250.000").

### Comercialização: comparabilidade e dupla contagem

- **Não entra em nada que compara com benchmark** (mesmo padrão do arrendamento, `app.js:173-174`): `custo_ha`, `margem_bruta_ha`, `pct_vs_estado`, semáforo e percentil seguem só com as 7 canônicas de produção.
- Novos campos: `comerc_ha`, `comerc_total`; `resultado_graos = resultado_producao − comerc_total − arrend_total`. DRE ganha linha "− Comercialização" com nota "fica fora da comparação porque a referência pública não inclui comercialização".
- **Guard de dupla contagem** (copy): tooltip do preço (`index.html:260`) → "use o preço cheio, sem descontar frete/taxas — eles entram depois em Comercialização"; abertura do grupo → "preencha só se o preço informado não estava líquido disso".

### Financeiro rápido (Tela 3 + e-mail)

Por cultura, em `calcularTudo`: `preco_equilibrio = custo_ha/prod` (R$/sc), `prod_equilibrio = custo_ha/preco` (sc/ha), `custo_sc = custo_ha/prod`, `margem_sc = preco − custo_sc`. Card novo `#t3EquilibrioCard` após o Resumo executivo, com variante secundária "com comercialização e arrendamento".

## Passos de execução

### Etapa 0 — Migração D1 (ANTES de qualquer deploy)

```sql
ALTER TABLE calculadora_diagnosticos ADD COLUMN custo_comercializacao REAL;
ALTER TABLE calculadora_diagnosticos ADD COLUMN custo_modo TEXT;      -- 'ha' | 'total'
ALTER TABLE calculadora_diagnosticos ADD COLUMN custos_detalhe TEXT;  -- JSON breakdown
ALTER TABLE calculadora_diagnosticos ADD COLUMN propriedade TEXT;     -- nome da fazenda (opcional)
```

Remoto via `wrangler d1 execute fluxo_calculadora --remote` (ou MCP `d1_database_query`, uuid `a3e4abbd-e962-44b5-b6be-40bd1d29d213`); local sem `--remote` pro `pages dev`. Atualizar `functions/db/schema.sql` (colunas no CREATE TABLE após `custos_rateados` + ALTERs anotados no rodapé). `wrangler.toml` é gitignorado — não versionar.

### Etapa 1 — Front: reforma de custos

- `public/calculadora/index.html:278-307`: trocar `.custos-grid` por segmented `#custoModo` + container `<div id="custosGroups">` (grupos renderizados via JS a partir de `GRUPos_CUSTO`; Insumos aberto por default). Cache-bust `./app.js?v=2` (linha 584).
- `public/calculadora/app.js`: `GRUPOS_CUSTO` + `renderCustosStep()` (delegação de eventos); novo shape em `novaCultura()` (69-75) com `custo_modo`, `meses_admin`, `custos` por categoria da UI, `detalhes`; adaptar `readStep`/`fillStep` do passo custos (594-597, 632-640); `custosCanonicosHa(c)`; `calcularTudo` (169-281) usa o helper + campos de comercialização + financeiro rápido; `updateCustoLive` (775-793) e `marginPreviewCultura` (799-810) idem; remover `CATEGORIA_INPUT_ID` (17-20) e wiring fixo (794-796).
- Renders Tela 3: `renderCostTable` (1136-1173) nas 7 canônicas + linha "Comercialização — sem referência" quando >0; DRE (`renderResumoExecutivo` 1004-1010) com a linha nova; labels: diesel→"Combustível", manutencao→"Máquinas (manut., seguro, serviços)", admin→"Gestão e administrativo" (`CATEGORIA_LABEL` 12-16).
- `public/calculadora/styles.css`: estilos `.cost-group` (details/summary), subcat rows, linha mensal "R$/mês × N meses".

### Etapa 2 — Backend: payload novo

`functions/api/calculadora.js` `payloadToCols` (65-110): `custo_comercializacao`, `custo_modo`, `custos_detalhe` (JSON.stringify de `body.culturas`), `custos_rateados` = modo total. Tolerar payloads antigos (abas abertas): campos ausentes → null/0. Caminho de UPDATE do dedup (160-163) herda automaticamente.

### Etapa 3 — Financeiro rápido + composição de custos

- **Equilíbrio**: campos em `calcularTudo` + `renderEquilibrio(r)` chamado em `renderTela3` (1400-1415) + card no `index.html` (após linha 482) + ids no `grab` (322-345).
- **Composição — card "Onde seu custo pesa"** (`renderComposicaoCustos(r)`, novo, na Tela 3 junto de "Seus custos vs média"): por cultura, barra empilhada 100% do custo com segmento por categoria (usa `custosUsados` — valores efetivos, incluindo benchmark dos vazios) + legenda com R$/ha, **% do custo total** e **% da receita** (`valor_ha/receita_ha`). Comercialização e arrendamento entram como faixas separadas com nota (fora do custo de produção). Linha-síntese: "Seus custos consomem X% da receita — sobram Y% de margem". CSS reaproveita o padrão de barras existente (sem lib de gráfico).

### Etapa 3b — Refazer cálculo + propriedade

- **Botão "🔁 Refazer com outros números"** na seção de CTAs da Tela 3 (`index.html:548-560`): volta ao wizard no passo fazenda com o estado `S` intacto (o `fillStep` existente já reconstrói os campos ao navegar) — o produtor só corrige o que esqueceu. Barra de progresso e `S.screen` resetadas; `S.calcId` PRESERVADO.
- **Backend — evitar linha órfã**: `handleCalcular` passa a aceitar `body.calcId`; se presente e a linha existir, faz UPDATE (mesmo caminho do dedup, `calculadora.js:160-163`) em vez de INSERT. Recálculo = mesma linha; "vale sempre a última". O `cadastrar` re-deduplica normalmente.
- **Campo propriedade**: input `lPropriedade` (opcional, placeholder "Ex.: Fazenda Santa Maria") no passo fazenda (`index.html:150-183`, após cidade) — identifica a simulação, não a pessoa, e já entra na fase anônima. Vai no payload → coluna `propriedade` em `payloadToCols`.
- **Dedup por propriedade**: `findLinhaExistente` (135-143) passa a casar `email+safra+propriedade` (`lower(trim(coalesce(propriedade,'')))`) — 2 propriedades do mesmo produtor = 2 linhas; sem o campo, comportamento igual ao atual. Nota: o contato na audiência Resend é único por e-mail — as properties (cultura/diagnóstico/margem_faixa) ficam com a última propriedade cadastrada (aceitável; documentar).

### Etapa 4 — Resend + interesse_gestao

- **Checkbox interesse** na Tela 2 (`index.html` ~452, antes do LGPD): "Quero conhecer uma ferramenta de gestão completa (com depreciação, custo de oportunidade e inventário)". `app.js`: ler no submit (1454-1468) → `S.interesse_gestao`. Payload/backend já persistem (`calculadora.js:169`).
- **E-mail do produtor** (novo `sendEmailProdutor` em `calculadora.js`): assunto `🌾 Sua margem: R$X/ha — seu diagnóstico completo`; blocos: header marca → saudação + contexto (cultura(s) · propriedade se houver · cidade/UF · safra) → hero margem/ha + resultado total → lavoura por cultura → comparação (% vs estado + faixa) → financeiro rápido (equilíbrio, custo/saca) + "Seus 3 maiores custos" (categoria, % do custo, % da receita) → diagnóstico + recomendação (mapa estático `DIAG_TEXTOS` duplicando os 5 textos de `app.js:283-309`) → CTA WhatsApp `wa.me/5544991447004` + link `fluxorural.com.br/calculadora/?utm_source=resend&utm_medium=email&utm_campaign=calc-resultado` → footer disclaimer margem bruta + descadastro. Reusar helpers `esc/linha/bloco`.
- **E-mail do Lucas**: manter (222-285); enriquecer com propriedade, linha Comercialização, modo de custos e bloco "Custos detalhados" (subs preenchidas).
- **Robustez**: os dois envios checam `resp.ok` + leem `detail` (padrão `diagnostico.js:200-221`), `console.error` no catch; best-effort. `handleCadastrar` (145-179) devolve `{ emailProdutor: bool }`.
- **Audiência Resend**: após UPDATE de PII (167-169), `POST /audiences/${env.RESEND_AUDIENCE_ID}/contacts` com properties: cultura, estado, cidade, diagnostico, percentil, interesse_gestao, safra, `margem_faixa` (banda: negativa / 0-1000 / 1000-2500 / 2500-4000 / 4000+ R$/ha); contato existente → PATCH. Nova env `RESEND_AUDIENCE_ID` no painel Pages (produção + preview).
- **Setup one-time fora do código** (via MCP Resend): criar audiência (se não houver) + contact properties (text: cultura, estado, cidade, diagnostico, margem_faixa, safra; number: percentil; boolean: interesse_gestao).

### Etapa 5 — GA4 (client-side, gtag + dataLayer, sem PII, GTM intocado)

Helper `fireEvent(name, params)` ao lado de `fireGenerateLead` (366-382); primeiro passo chama `window._loadAnalytics()` (definida em `index.html:71`) pra eliminar corrida com o lazy-load.

**Nomes em português** (regra GA4: ASCII sem acento/ç, letras/números/`_`, começa com letra, ≤40 chars). `generate_lead` NÃO muda — é evento recomendado do Google e a conversão Ads no GTM (Versão 3) escuta exatamente esse nome.

| Evento | Disparo | Params |
|---|---|---|
| `calculadora_inicio` | `goNext()` case intro (~660) | — |
| `calculadora_etapa` | `goNext()` pós-validação (657) | etapa |
| `calculadora_resultado` | `finishWizard()` (716-724) | cultura, estado, faixa_area, diagnostico |
| `generate_lead` | existente (1464) | mantém (conversão Ads) |
| `email_enviado` | submit cadastro (1462) se `res.emailProdutor` | diagnostico |
| `compartilhou_card` | `wireShareCard` (1384) | — |
| `clicou_whatsapp` | `btnConvidar` (1294) + fallback share (1395) | origem |
| `avaliou_ferramenta` | envio avaliação (1441) | estrelas |
| `interesse_gestao` | change do checkbox novo (ao marcar) | — |
| `refez_calculo` | clique no botão Refazer (novo) | — |

## Verificação ponta a ponta

1. `npm run build` → `npx wrangler pages dev out` com D1 local migrado (schema + ALTERs).
2. Browser pane (viewport mobile): **regressão** — 1 cultura, modo total, mesmos números de antes → margem idêntica. Depois: modo R$/ha, detalhar defensivos, admin mensal (150/mês × 6 = 900 total), comercialização preenchida → conferir DRE, card equilíbrio (conta manual custo_ha÷prod), e no D1: `SELECT custo_modo, custo_comercializacao, custos_detalhe FROM calculadora_diagnosticos ORDER BY id DESC LIMIT 1`.
3. Cadastro com `RESEND_API_KEY` real em `.dev.vars`: chegam os 2 e-mails; contato criado na audiência com properties; recadastro mesmo e-mail+safra não duplica contato (dedup 135-143).
4. GA4 DebugView (`?debug_mode=1`, G-VTCGYR206P): os 9 eventos ao percorrer o funil; clicar link do e-mail → sessão `utm_source=resend` no Realtime.
5. Deploy: push → main → repetir fluxo em produção com dado de teste (apagar a linha depois) + Pages Functions logs.

## Riscos

1. **Migração × deploy fora de ordem** → INSERT falha, lead perdido. Etapa 0 antes do merge, obrigatória.
2. **Cache app.js antigo × HTML novo** → `?v=2` + remover ids antigos juntos.
3. **Admin mensal em modo R$/ha** → pai readonly sempre exibe na unidade do modo com sub-texto "R$/mês × N meses = total".
4. **Dupla contagem frete** → mitigada por copy; monitorar `custo_comercializacao` × `pct_vs_estado` no D1 nas primeiras semanas.
5. **Wizard mais longo** → grupos colapsados por default + campo pai único preservam o caminho rápido; acompanhar `calc_step` no GA pra medir abandono (é exatamente pra isso que o funil entra).
6. **Payloads antigos** (abas abertas no deploy) → `payloadToCols` tolera campos ausentes.

## Fora desta rodada (backlog consciente)

Permalink do resultado + OG dinâmico · localStorage (retomar progresso + comparar safras) · sliders "e se" · benchmark da cidade + e-mail "sua cidade chegou a N produtores" (checkbox `avisarCidade` também está morto hoje) · saída do `noindex` + JSON-LD `WebApplication`.
