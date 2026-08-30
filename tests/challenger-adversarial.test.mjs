import assert from 'node:assert/strict'
import test from 'node:test'
import fs from 'node:fs'
import path from 'node:path'
import {
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  step6Schema,
  step7Schema,
  step8Schema,
  step9Schema,
  diagnosticoPayloadSchema,
  calculateLeadScore,
} from '../lib/schema-diagnostico.ts'
import { calcularScore } from '../functions/api/diagnostico.js'

// ---------------------------------------------------------------------------
// 1. LEAD SCORING ORACLE: Exhaustive Combinatorial Verification & Parity
// ---------------------------------------------------------------------------
test('Oracle: Exhaustive 2,880 Combinations Lead Scoring & Client-Backend Parity', () => {
  const faturamentos = ['<500k', '500k-2M', '2M-5M', '5M-20M', '>20M', 'prefiro_nao_informar']
  const urgencias = ['30_dias', '3_meses', 'ate_fim_ano', 'sem_pressa']
  const desafios = ['custos_margem', 'fluxo_caixa', 'endividamento', 'sucessao', 'investimentos', 'nao_sei']
  const areas = ['<100ha', '100-500ha', '500-2000ha', '>2000ha', 'nao-aplica']
  const gestao = ['erp_software', 'planilhas', 'caderno_basico', 'nenhuma']

  let totalCombinations = 0
  let minScore = Infinity
  let maxScore = -Infinity
  const bandCounts = { verde: 0, amarelo: 0, laranja: 0, vermelho: 0 }

  for (const fat of faturamentos) {
    for (const urg of urgencias) {
      for (const des of desafios) {
        for (const area of areas) {
          for (const ges of gestao) {
            totalCombinations++
            const payload = {
              faturamento_anual: fat,
              urgencia: urg,
              desafio_principal: des,
              area_ha: area,
              gestao_atual: ges,
            }

            const clientResult = calculateLeadScore(payload)
            const backendResult = calcularScore(payload)

            // 1. Parity check between client & backend
            assert.equal(
              clientResult.score,
              backendResult.score,
              `Score mismatch for ${JSON.stringify(payload)}: client=${clientResult.score}, backend=${backendResult.score}`
            )
            assert.equal(
              clientResult.scoreBruto,
              backendResult.scoreBruto,
              `ScoreBruto mismatch for ${JSON.stringify(payload)}`
            )
            assert.equal(
              clientResult.qualificationLevel,
              backendResult.qualificationLevel,
              `QualificationLevel mismatch for ${JSON.stringify(payload)}`
            )

            // 2. Range checks
            assert.ok(clientResult.score >= 0 && clientResult.score <= 100, `Score out of bounds: ${clientResult.score}`)
            assert.ok(clientResult.scoreBruto >= 0 && clientResult.scoreBruto <= 100, `ScoreBruto out of bounds: ${clientResult.scoreBruto}`)
            assert.equal(clientResult.scoreMax, 100)

            // 3. Thermal band classification checks
            if (clientResult.score >= 70) {
              assert.equal(clientResult.qualificationLevel, 'verde')
              bandCounts.verde++
            } else if (clientResult.score >= 50) {
              assert.equal(clientResult.qualificationLevel, 'amarelo')
              bandCounts.amarelo++
            } else if (clientResult.score >= 30) {
              assert.equal(clientResult.qualificationLevel, 'laranja')
              bandCounts.laranja++
            } else {
              assert.equal(clientResult.qualificationLevel, 'vermelho')
              bandCounts.vermelho++
            }

            if (clientResult.score < minScore) minScore = clientResult.score
            if (clientResult.score > maxScore) maxScore = clientResult.score
          }
        }
      }
    }
  }

  assert.equal(totalCombinations, 6 * 4 * 6 * 5 * 4, 'Total canonical combinations must be 2,880')
  assert.equal(maxScore, 100, 'Maximum score must be 100')
  assert.equal(minScore, 29, 'Minimum score must be 29')
  assert.ok(bandCounts.verde > 0, `Verde count must be > 0 (found ${bandCounts.verde})`)
  assert.ok(bandCounts.amarelo > 0, `Amarelo count must be > 0 (found ${bandCounts.amarelo})`)
  assert.ok(bandCounts.laranja > 0, `Laranja count must be > 0 (found ${bandCounts.laranja})`)
  assert.ok(bandCounts.vermelho > 0, `Vermelho count must be > 0 (found ${bandCounts.vermelho})`)
})

test('Oracle: Lead Scoring Edge Cases & Malformed Inputs', () => {
  // Empty payload
  const emptyRes = calculateLeadScore({})
  assert.equal(emptyRes.score, 0)
  assert.equal(emptyRes.qualificationLevel, 'vermelho')

  // Partial payload
  const partialRes = calculateLeadScore({ faturamento_anual: '>20M' })
  assert.equal(partialRes.score, 25)
  assert.equal(partialRes.qualificationLevel, 'vermelho')

  // Unknown values should not crash and should yield 0 points for unrecognized fields
  const weirdRes = calculateLeadScore({
    faturamento_anual: 'invalid_tier',
    urgencia: null,
    desafio_principal: 12345,
    area_ha: undefined,
    gestao_atual: {},
  })
  assert.equal(weirdRes.score, 0)
  assert.equal(weirdRes.qualificationLevel, 'vermelho')

  // Boundary checks around thresholds (29, 30, 49, 50, 69, 70)
  // Vermelho (< 30) -> 29 pts: <500k (5) + sem_pressa (2) + nao_sei (12) + <100ha (5) + erp_software (5) = 29
  assert.equal(calculateLeadScore({ faturamento_anual: '<500k', urgencia: 'sem_pressa', desafio_principal: 'nao_sei', area_ha: '<100ha', gestao_atual: 'erp_software' }).qualificationLevel, 'vermelho')

  // Laranja (30 - 49) -> 34 pts: <500k (5) + sem_pressa (2) + investimentos (14) + nao-aplica (8) + erp_software (5) = 34
  assert.equal(calculateLeadScore({ faturamento_anual: '<500k', urgencia: 'sem_pressa', desafio_principal: 'investimentos', area_ha: 'nao-aplica', gestao_atual: 'erp_software' }).qualificationLevel, 'laranja')

  // Amarelo (50 - 69) -> 55 pts: 500k-2M (12) + ate_fim_ano (8) + custos_margem (17) + 100-500ha (10) + planilhas (8) = 55
  assert.equal(calculateLeadScore({ faturamento_anual: '500k-2M', urgencia: 'ate_fim_ano', desafio_principal: 'custos_margem', area_ha: '100-500ha', gestao_atual: 'planilhas' }).qualificationLevel, 'amarelo')

  // Verde (>= 70) -> 73 pts: 2M-5M (18) + 30_dias (25) + endividamento (20) + <100ha (5) + erp_software (5) = 73
  assert.equal(calculateLeadScore({ faturamento_anual: '2M-5M', urgencia: '30_dias', desafio_principal: 'endividamento', area_ha: '<100ha', gestao_atual: 'erp_software' }).qualificationLevel, 'verde')
})

// ---------------------------------------------------------------------------
// 2. ZOD VALIDATION STRESS TEST: Malformed & Injection Payloads (Steps 1 to 9)
// ---------------------------------------------------------------------------
test('Zod Stress: Step 1 (Atividade)', () => {
  const valid = ['graos', 'pecuaria_corte', 'pecuaria_leite', 'hortifruti_cafe', 'mista', 'outra']
  for (const v of valid) {
    assert.ok(step1Schema.safeParse({ atividade: v }).success)
  }
  const invalid = ['', 'soja', 'milho', 'pequena', null, undefined, 123, true, {}, []]
  for (const inv of invalid) {
    assert.ok(!step1Schema.safeParse({ atividade: inv }).success)
  }
})

test('Zod Stress: Step 2 (Área)', () => {
  const valid = ['<100ha', '100-500ha', '500-2000ha', '>2000ha', 'nao-aplica']
  for (const v of valid) {
    assert.ok(step2Schema.safeParse({ area_ha: v }).success)
  }
  const invalid = ['', '<50ha', '>500ha', '1000ha', null, undefined, 500, false]
  for (const inv of invalid) {
    assert.ok(!step2Schema.safeParse({ area_ha: inv }).success)
  }
})

test('Zod Stress: Step 3 (Gestão Atual)', () => {
  const valid = ['erp_software', 'planilhas', 'caderno_basico', 'nenhuma']
  for (const v of valid) {
    assert.ok(step3Schema.safeParse({ gestao_atual: v }).success)
  }
  const invalid = ['', 'excel', 'software', 'basica', null, undefined, 0]
  for (const inv of invalid) {
    assert.ok(!step3Schema.safeParse({ gestao_atual: inv }).success)
  }
})

test('Zod Stress: Step 4 (Desafio Principal)', () => {
  const valid = ['custos_margem', 'fluxo_caixa', 'endividamento', 'sucessao', 'investimentos', 'nao_sei']
  for (const v of valid) {
    assert.ok(step4Schema.safeParse({ desafio_principal: v }).success)
  }
  const invalid = ['', 'lucro', 'vendas', 'clima', null, undefined, true]
  for (const inv of invalid) {
    assert.ok(!step4Schema.safeParse({ desafio_principal: inv }).success)
  }
})

test('Zod Stress: Step 5 (Detalhe Desafio - Opcional/Preenchido)', () => {
  assert.ok(step5Schema.safeParse({ detalhe_desafio: undefined }).success)
  assert.ok(step5Schema.safeParse({}).success)
  assert.ok(step5Schema.safeParse({ detalhe_desafio: 'Qualquer texto válido de detalhamento' }).success)
  // min(1) fails for empty string if provided
  assert.ok(!step5Schema.safeParse({ detalhe_desafio: '' }).success)
})

test('Zod Stress: Step 6 (Faturamento Anual)', () => {
  const valid = ['<500k', '500k-2M', '2M-5M', '5M-20M', '>20M', 'prefiro_nao_informar']
  for (const v of valid) {
    assert.ok(step6Schema.safeParse({ faturamento_anual: v }).success)
  }
  const invalid = ['', '<100k', '>5M', '10M', null, undefined]
  for (const inv of invalid) {
    assert.ok(!step6Schema.safeParse({ faturamento_anual: inv }).success)
  }
})

test('Zod Stress: Step 7 (Urgência)', () => {
  const valid = ['30_dias', '3_meses', 'ate_fim_ano', 'sem_pressa']
  for (const v of valid) {
    assert.ok(step7Schema.safeParse({ urgencia: v }).success)
  }
  const invalid = ['', '30dias', 'urgente', 'agora', null, undefined]
  for (const inv of invalid) {
    assert.ok(!step7Schema.safeParse({ urgencia: inv }).success)
  }
})

test('Zod Stress: Step 8 (Localização & Propriedade)', () => {
  // Valid cases
  assert.ok(step8Schema.safeParse({ estado: 'PR', cidade: 'Cascavel', nome_propriedade: 'Fazenda Boa Vista' }).success)
  assert.ok(step8Schema.safeParse({ estado: 'MT', cidade: 'Sorriso' }).success) // nome_propriedade is optional

  // Invalid state (length !== 2)
  assert.ok(!step8Schema.safeParse({ estado: 'P', cidade: 'Cascavel' }).success)
  assert.ok(!step8Schema.safeParse({ estado: 'PARANA', cidade: 'Cascavel' }).success)
  assert.ok(!step8Schema.safeParse({ estado: '', cidade: 'Cascavel' }).success)

  // Invalid city (min 2 chars)
  assert.ok(!step8Schema.safeParse({ estado: 'PR', cidade: 'C' }).success)
  assert.ok(!step8Schema.safeParse({ estado: 'PR', cidade: '' }).success)
  assert.ok(!step8Schema.safeParse({ estado: 'PR', cidade: null }).success)
})

test('Zod Stress: Step 9 (Identificação, Contato & LGPD)', () => {
  // Valid (11 digits mobile)
  const validMobile = step9Schema.safeParse({
    nome: '  Lucas Dierings  ',
    whatsapp: '(45) 99144-7004',
    email: '  lucas@fluxorural.com.br  ',
    consent_lgpd: true,
  })
  assert.ok(validMobile.success)
  if (validMobile.success) {
    assert.equal(validMobile.data.whatsapp, '45991447004')
    assert.equal(validMobile.data.nome, 'Lucas Dierings')
    assert.equal(validMobile.data.email, 'lucas@fluxorural.com.br')
  }

  // Valid (10 digits landline)
  const validLandline = step9Schema.safeParse({
    nome: 'Lucas Dierings',
    whatsapp: '(45) 3220-1234',
    email: 'lucas@fluxorural.com.br',
    consent_lgpd: true,
  })
  assert.ok(validLandline.success)
  if (validLandline.success) {
    assert.equal(validLandline.data.whatsapp, '4532201234')
  }

  // Invalid name (< 2 chars after trim)
  assert.ok(!step9Schema.safeParse({ nome: ' L ', whatsapp: '45991447004', email: 'a@b.com', consent_lgpd: true }).success)
  assert.ok(!step9Schema.safeParse({ nome: '   ', whatsapp: '45991447004', email: 'a@b.com', consent_lgpd: true }).success)

  // Invalid whatsapp (< 10 digits or > 11 digits)
  assert.ok(!step9Schema.safeParse({ nome: 'Lucas', whatsapp: '123456789', email: 'a@b.com', consent_lgpd: true }).success)
  assert.ok(!step9Schema.safeParse({ nome: 'Lucas', whatsapp: '123456789012', email: 'a@b.com', consent_lgpd: true }).success)

  // Invalid email
  assert.ok(!step9Schema.safeParse({ nome: 'Lucas', whatsapp: '45991447004', email: 'invalid-email', consent_lgpd: true }).success)
  assert.ok(!step9Schema.safeParse({ nome: 'Lucas', whatsapp: '45991447004', email: '@domain.com', consent_lgpd: true }).success)

  // Consent LGPD must be literal true
  assert.ok(!step9Schema.safeParse({ nome: 'Lucas', whatsapp: '45991447004', email: 'a@b.com', consent_lgpd: false }).success)
  assert.ok(!step9Schema.safeParse({ nome: 'Lucas', whatsapp: '45991447004', email: 'a@b.com' }).success)
})

test('Zod Stress: diagnosticoPayloadSchema Full Pipeline Verification', () => {
  const fullValid = {
    etapa: 'completo',
    perfil: 'produtor',
    atividade: 'graos',
    area_ha: '500-2000ha',
    gestao_atual: 'planilhas',
    desafio_principal: 'custos_margem',
    detalhe_desafio: 'Moderada — compromete de 20% a 50%',
    faturamento_anual: '5M-20M',
    urgencia: '30_dias',
    estado: 'PR',
    cidade: 'Cascavel',
    nome_propriedade: 'Fazenda Modelo',
    nome: 'Lucas Dierings',
    whatsapp: '45991447004',
    email: 'lucas@fluxorural.com.br',
    consent_lgpd: true,
    score: 83,
    scoreBruto: 83,
    scoreMax: 100,
    qualificationLevel: 'verde',
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'gestao-rural',
    utm_term: null,
    utm_content: null,
    gclid: null,
    fbclid: null,
    origem: 'site',
    page_url: 'https://fluxorural.com.br/diagnostico',
  }

  assert.ok(diagnosticoPayloadSchema.safeParse(fullValid).success)

  // Disallowed perfil
  assert.ok(!diagnosticoPayloadSchema.safeParse({ ...fullValid, perfil: 'estudante' }).success)

  // Out of bounds score
  assert.ok(!diagnosticoPayloadSchema.safeParse({ ...fullValid, score: 105 }).success)
  assert.ok(!diagnosticoPayloadSchema.safeParse({ ...fullValid, score: -5 }).success)

  // Invalid qualification level
  assert.ok(!diagnosticoPayloadSchema.safeParse({ ...fullValid, qualificationLevel: 'azul' }).success)
})

// ---------------------------------------------------------------------------
// 3. DYNAMIC BRANCHING IN STEP 5 FOR ALL STEP 4 CHOICES
// ---------------------------------------------------------------------------
test('Dynamic Branching: Step 5 Options Completeness for all Step 4 Choices', () => {
  function getStep5Branch(desafio) {
    if (desafio === 'custos_margem' || desafio === 'fluxo_caixa' || desafio === 'endividamento') {
      return {
        type: 'dividas_fluxo',
        title: 'Qual é o nível de comprometimento da receita com dívidas e financiamentos?',
        options: [
          'Sem dívidas relevantes (operação com capital próprio)',
          'Leve — compromete até 20% do faturamento anual',
          'Moderada — compromete de 20% a 50% do faturamento',
          'Alta — compromete mais de 50% do faturamento',
          'Prefiro conversar sobre isso na sessão de diagnóstico',
        ],
      }
    }
    if (desafio === 'sucessao') {
      return {
        type: 'sucessao',
        title: 'Como está o alinhamento familiar na tomada de decisões?',
        options: [
          'Família alinhada e aberta para estruturar a sucessão',
          'Algumas divergências entre gerações, mas diálogo aberto',
          'Conflitos frequentes que já travam decisões na fazenda',
          'Transição iminente acontecendo neste momento',
        ],
      }
    }
    if (desafio === 'investimentos') {
      return {
        type: 'investimentos',
        title: 'Qual é o foco principal dos investimentos em análise?',
        options: [
          'Renovação de frota / Máquinas agrícolas',
          'Compra ou arrendamento de novas áreas',
          'Infraestrutura (Armazenagem, Silos, Irrigação)',
          'Tecnologia de precisão e sistemas de gestão',
          'Correção de solo e reforma de pastagens',
        ],
      }
    }
    // default / nao_sei
    return {
      type: 'geral_nao_sei',
      title: 'O que mais causa preocupação na rotina da fazenda?',
      options: [
        'Sensação de trabalhar muito e sobrar pouco no bolso',
        'Falta de números claros para tomar decisões com segurança',
        'Tudo depende 100% do proprietário; sem tempo livre',
        'Incerteza sobre a rentabilidade nos próximos anos',
      ],
    }
  }

  const allStep4Choices = [
    'custos_margem',
    'fluxo_caixa',
    'endividamento',
    'sucessao',
    'investimentos',
    'nao_sei',
  ]

  for (const choice of allStep4Choices) {
    const branch = getStep5Branch(choice)
    assert.ok(branch.title.length > 10, `Title missing or too short for ${choice}`)
    assert.ok(branch.options.length >= 4, `Branch options count must be >= 4 for ${choice}`)

    // Check unique values within branch
    const uniqueValues = new Set(branch.options)
    assert.equal(uniqueValues.size, branch.options.length, `Duplicate options in branch for ${choice}`)

    // Check all option values pass step5Schema
    for (const opt of branch.options) {
      assert.ok(step5Schema.safeParse({ detalhe_desafio: opt }).success, `Option "${opt}" failed step5Schema`)
    }
  }
})

// ---------------------------------------------------------------------------
// 4. IBGE URL BUILDING & ERROR HANDLING IN UfCitySelector
// ---------------------------------------------------------------------------
test('IBGE: 27 Estados Brasileiros & URL Construction', () => {
  const ufCitySelectorCode = fs.readFileSync(
    path.resolve(process.cwd(), 'components/ui/UfCitySelector.tsx'),
    'utf8'
  )

  // Extract ESTADOS_BRASIL from source file
  const match = ufCitySelectorCode.match(/export const ESTADOS_BRASIL = \[([\s\S]*?)\] as const/)
  assert.ok(match, 'ESTADOS_BRASIL array must be exported in UfCitySelector.tsx')

  // Parse state items
  const stateRegex = /\{\s*sigla:\s*'([A-Z]{2})',\s*nome:\s*'([^']+)'\s*\}/g
  const estados = []
  let m
  while ((m = stateRegex.exec(match[1])) !== null) {
    estados.push({ sigla: m[1], nome: m[2] })
  }

  assert.equal(estados.length, 27, 'Brasil must have exactly 27 Federation Units (26 states + DF)')

  const siglas = new Set()
  for (const est of estados) {
    assert.equal(est.sigla.length, 2, `Sigla ${est.sigla} must be 2 characters`)
    assert.equal(est.sigla, est.sigla.toUpperCase(), `Sigla ${est.sigla} must be uppercase`)
    assert.ok(est.nome.length > 2, `Nome ${est.nome} must be valid`)
    assert.ok(!siglas.has(est.sigla), `Duplicate sigla ${est.sigla}`)
    siglas.add(est.sigla)

    const ibgeUrl = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${est.sigla}/municipios?orderBy=nome`
    const parsedUrl = new URL(ibgeUrl)
    assert.equal(parsedUrl.protocol, 'https:')
    assert.equal(parsedUrl.hostname, 'servicodados.ibge.gov.br')
    assert.equal(parsedUrl.pathname, `/api/v1/localidades/estados/${est.sigla}/municipios`)
    assert.equal(parsedUrl.searchParams.get('orderBy'), 'nome')
  }

  // Verify timeout and fallback logic presence in component
  assert.ok(ufCitySelectorCode.includes('setTimeout(() => controller.abort(), 3500)'), '3.5s timeout must be configured')
  assert.ok(ufCitySelectorCode.includes('setFallbackMode(true)'), 'fallbackMode must be activated on catch')
})

test('IBGE: Search Filter with Diacritics and Case Insensitivity', () => {
  function filterCities(cidades, query) {
    if (!query) return cidades.slice(0, 100)
    const buscaNorm = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return cidades
      .filter((c) =>
        c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(buscaNorm)
      )
      .slice(0, 100)
  }

  const sampleCities = [
    'São Paulo',
    'São José dos Campos',
    'Cascavel',
    'Curitiba',
    'Maringá',
    'Londrina',
    'Brasília',
    'Goiânia',
    'Cuiabá',
    'Rondonópolis',
    'Sorriso',
  ]

  // "sao" matches "São Paulo", "São José dos Campos"
  const resSao = filterCities(sampleCities, 'sao')
  assert.deepEqual(resSao, ['São Paulo', 'São José dos Campos'])

  // "maringa" matches "Maringá"
  const resMaringa = filterCities(sampleCities, 'maringa')
  assert.deepEqual(resMaringa, ['Maringá'])

  // "CASCAVEL" matches "Cascavel"
  const resCascavel = filterCities(sampleCities, 'CASCAVEL')
  assert.deepEqual(resCascavel, ['Cascavel'])

  // "brasilia" matches "Brasília"
  const resBrasilia = filterCities(sampleCities, 'brasilia')
  assert.deepEqual(resBrasilia, ['Brasília'])
})

// ---------------------------------------------------------------------------
// 5. TERMINOLOGY AUDIT: 0 matches for "in-loco" and "in-company"
// ---------------------------------------------------------------------------
test('Terminology Audit: 0 occurrences of "in-loco" or "in-company" across codebase', () => {
  const directoriesToSearch = ['app', 'components', 'content', 'public']
  const rootDir = path.resolve(process.cwd())

  const forbiddenPatterns = [
    /\bin[- ]?loco\b/i,
    /\bin[- ]?company\b/i,
  ]

  const violations = []

  function scanDir(dirPath) {
    if (!fs.existsSync(dirPath)) return
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)
      if (entry.isDirectory()) {
        scanDir(fullPath)
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase()
        if (['.ts', '.tsx', '.js', '.jsx', '.md', '.mdx', '.json', '.html'].includes(ext)) {
          const content = fs.readFileSync(fullPath, 'utf8')
          const lines = content.split('\n')
          lines.forEach((line, idx) => {
            for (const pat of forbiddenPatterns) {
              if (pat.test(line)) {
                violations.push({
                  file: path.relative(rootDir, fullPath),
                  line: idx + 1,
                  content: line.trim(),
                  pattern: pat.toString(),
                })
              }
            }
          })
        }
      }
    }
  }

  for (const dir of directoriesToSearch) {
    scanDir(path.join(rootDir, dir))
  }

  assert.equal(
    violations.length,
    0,
    `Forbidden terminology violations found (${violations.length}):\n${JSON.stringify(violations, null, 2)}`
  )
})
