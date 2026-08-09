-- Fluxo Rural — Calculadora de Margem por Hectare (Cloudflare D1 / SQLite)
-- Banco: fluxo_calculadora (uuid a3e4abbd-e962-44b5-b6be-40bd1d29d213)

-- Uma linha por submissão. Nasce ANÔNIMA no clique em "Calcular" (Tela 1) e é
-- atualizada com PII no cadastro (Tela 2). Assim o dado agronômico já ajuda mesmo
-- que o produtor abandone o gate.
CREATE TABLE IF NOT EXISTS calculadora_diagnosticos (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at            TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at            TEXT,

  -- PII (nulos enquanto anônimo; preenchidos no cadastro com consentimento)
  nome                  TEXT,
  email                 TEXT,
  whatsapp              TEXT,
  consent_lgpd          INTEGER NOT NULL DEFAULT 0,
  consent_at            TEXT,
  avisar_media_cidade   INTEGER NOT NULL DEFAULT 0,
  consent_conteudos     INTEGER NOT NULL DEFAULT 0,

  -- Produção (cultura principal)
  cultura               TEXT,           -- soja | milho | trigo
  safra                 TEXT,           -- 2025/2026 | 2024/2025
  area_ha               REAL,
  produtividade_sc_ha   REAL,
  preco_sc              REAL,

  -- Custos por hectare (nulo = usou benchmark)
  custo_sementes        REAL,
  custo_defensivos      REAL,
  custo_fertilizantes   REAL,
  custo_diesel          REAL,
  custo_mao_obra        REAL,
  custo_manutencao      REAL,
  custo_admin           REAL,
  custo_comercializacao REAL,           -- armazenagem + frete + taxas (fora da comparação com benchmark)
  custos_rateados       INTEGER NOT NULL DEFAULT 0,  -- 1 = custos "da lavoura" rateados por área
  custo_modo            TEXT,           -- 'ha' | 'total' — como o produtor informou os custos
  custos_detalhe        TEXT,           -- JSON: breakdown de subcategorias por cultura (só entradas do usuário)

  -- Arrendamento
  arrend_valor          REAL,
  arrend_unidade        TEXT,           -- rs_ha | sc_ha

  -- Endividamento (opcional)
  tem_divida            INTEGER NOT NULL DEFAULT 0,
  divida_total          REAL,
  divida_parcela        REAL,
  divida_juros          REAL,

  -- Localização
  estado                TEXT,
  cidade                TEXT,
  microrregiao          TEXT,
  propriedade           TEXT,           -- nome da fazenda (opcional) — permite 2+ propriedades por produtor

  -- Diversificação (JSON)
  culturas_extras       TEXT,           -- [{cultura,area_ha,produtividade_sc_ha,preco_sc}]
  atividades_extras     TEXT,           -- [{tipo,faturamento}]

  -- Resultados calculados (margem BRUTA — não líquida)
  receita_ha            REAL,
  custo_ha              REAL,
  margem_bruta_ha       REAL,
  resultado_graos       REAL,
  pct_vs_estado         REAL,
  diagnostico           TEXT,           -- margem | caixa | endividamento | saudavel | multiplos
  percentil             INTEGER,

  -- Qualificação / interesse
  interesse_gestao      INTEGER NOT NULL DEFAULT 0,
  lead_quality          TEXT,           -- INTERNO: baixa | media | alta
  status                TEXT NOT NULL DEFAULT 'novo',

  -- Tracking (não-PII)
  utm_source            TEXT,
  utm_medium            TEXT,
  utm_campaign          TEXT,
  utm_term              TEXT,
  utm_content           TEXT,
  gclid                 TEXT,
  fbclid                TEXT,
  origem                TEXT,
  ip_hash               TEXT,
  user_agent            TEXT
);

CREATE INDEX IF NOT EXISTS idx_calc_cultura_estado ON calculadora_diagnosticos (cultura, estado);
CREATE INDEX IF NOT EXISTS idx_calc_created_at     ON calculadora_diagnosticos (created_at);
CREATE INDEX IF NOT EXISTS idx_calc_email          ON calculadora_diagnosticos (email);

-- Avaliação da ferramenta (estrelas + comentário) — melhoria contínua e sinal de SEO.
CREATE TABLE IF NOT EXISTS calculadora_avaliacoes (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  diagnostico_id INTEGER REFERENCES calculadora_diagnosticos(id),
  nota           INTEGER NOT NULL,     -- 1..5
  comentario     TEXT,
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_aval_diag ON calculadora_avaliacoes (diagnostico_id);

-- ── Migração 2026-07 (rodada 2) ─────────────────────────────────────────────
-- Aplicada em bancos existentes com os ALTERs abaixo (colunas já incluídas no
-- CREATE TABLE acima para instalações limpas):
--   ALTER TABLE calculadora_diagnosticos ADD COLUMN custo_comercializacao REAL;
--   ALTER TABLE calculadora_diagnosticos ADD COLUMN custo_modo TEXT;
--   ALTER TABLE calculadora_diagnosticos ADD COLUMN custos_detalhe TEXT;
--   ALTER TABLE calculadora_diagnosticos ADD COLUMN propriedade TEXT;
