import assert from 'node:assert/strict'
import test from 'node:test'
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

test('Lead Scoring: Pontuação máxima e qualificação verde (100 pts)', () => {
  const data = {
    faturamento_anual: '>20M', // 25 pts
    urgencia: '30_dias', // 25 pts
    desafio_principal: 'endividamento', // 20 pts
    area_ha: '>2000ha', // 15 pts
    gestao_atual: 'nenhuma', // 15 pts
  }
  const result = calculateLeadScore(data)
  assert.equal(result.scoreBruto, 100)
  assert.equal(result.score, 100)
  assert.equal(result.scoreMax, 100)
  assert.equal(result.qualificationLevel, 'verde')
})

test('Lead Scoring: Pontuação alta e qualificação verde (>= 70 pts)', () => {
  const data = {
    faturamento_anual: '5M-20M', // 22 pts
    urgencia: '3_meses', // 18 pts
    desafio_principal: 'fluxo_caixa', // 18 pts
    area_ha: '500-2000ha', // 13 pts
    gestao_atual: 'caderno_basico', // 12 pts
  }
  const result = calculateLeadScore(data)
  assert.equal(result.scoreBruto, 83)
  assert.equal(result.score, 83)
  assert.equal(result.qualificationLevel, 'verde')
})

test('Lead Scoring: Pontuação média e qualificação amarelo (50-69 pts)', () => {
  const data = {
    faturamento_anual: '2M-5M', // 18 pts
    urgencia: '3_meses', // 18 pts
    desafio_principal: 'investimentos', // 14 pts
    area_ha: '100-500ha', // 10 pts
    gestao_atual: 'planilhas', // 8 pts
  }
  const result = calculateLeadScore(data)
  assert.equal(result.scoreBruto, 68)
  assert.equal(result.score, 68)
  assert.equal(result.qualificationLevel, 'amarelo')
})

test('Lead Scoring: Pontuação baixa e qualificação laranja (30-49 pts)', () => {
  const data = {
    faturamento_anual: '500k-2M', // 12 pts
    urgencia: 'ate_fim_ano', // 8 pts
    desafio_principal: 'nao_sei', // 12 pts
    area_ha: '<100ha', // 5 pts
    gestao_atual: 'planilhas', // 8 pts
  }
  const result = calculateLeadScore(data)
  assert.equal(result.scoreBruto, 45)
  assert.equal(result.score, 45)
  assert.equal(result.qualificationLevel, 'laranja')
})

test('Lead Scoring: Pontuação mínima e qualificação vermelho (< 30 pts)', () => {
  const data = {
    faturamento_anual: '<500k', // 5 pts
    urgencia: 'sem_pressa', // 2 pts
    desafio_principal: 'nao_sei', // 12 pts
    area_ha: '<100ha', // 5 pts
    gestao_atual: 'erp_software', // 5 pts
  }
  const result = calculateLeadScore(data)
  assert.equal(result.scoreBruto, 29)
  assert.equal(result.score, 29)
  assert.equal(result.qualificationLevel, 'vermelho')
})

test('Lead Scoring: Compatibilidade com aliases legados', () => {
  const data = {
    faturamento: 'prefiro_nao_informar', // 10 pts
    urgencia: '30_dias', // 25 pts
    desafios: 'custos_margem', // 17 pts
    hectares: 'nao-aplica', // 8 pts
    gestao: 'nenhuma', // 15 pts
  }
  const result = calculateLeadScore(data)
  assert.equal(result.scoreBruto, 75)
  assert.equal(result.score, 75)
  assert.equal(result.qualificationLevel, 'verde')
})

test('Zod Schemas: Validação dos passos 1 a 9', () => {
  // Passo 1
  assert.ok(step1Schema.safeParse({ atividade: 'graos' }).success)
  assert.ok(!step1Schema.safeParse({ atividade: 'invalido' }).success)

  // Passo 2
  assert.ok(step2Schema.safeParse({ area_ha: '500-2000ha' }).success)
  assert.ok(!step2Schema.safeParse({ area_ha: '9999ha' }).success)

  // Passo 3
  assert.ok(step3Schema.safeParse({ gestao_atual: 'erp_software' }).success)
  assert.ok(!step3Schema.safeParse({ gestao_atual: 'nenhum_controle' }).success)

  // Passo 4
  assert.ok(step4Schema.safeParse({ desafio_principal: 'custos_margem' }).success)
  assert.ok(!step4Schema.safeParse({ desafio_principal: 'outro' }).success)

  // Passo 5
  assert.ok(step5Schema.safeParse({ detalhe_desafio: 'Leve — compromete até 20%' }).success)
  assert.ok(step5Schema.safeParse({}).success)

  // Passo 6
  assert.ok(step6Schema.safeParse({ faturamento_anual: '5M-20M' }).success)
  assert.ok(!step6Schema.safeParse({ faturamento_anual: '100B' }).success)

  // Passo 7
  assert.ok(step7Schema.safeParse({ urgencia: '30_dias' }).success)
  assert.ok(!step7Schema.safeParse({ urgencia: 'amanha' }).success)

  // Passo 8
  assert.ok(step8Schema.safeParse({ estado: 'PR', cidade: 'Londrina', nome_propriedade: 'Fazenda Boa Vista' }).success)
  assert.ok(!step8Schema.safeParse({ estado: 'PARANA', cidade: 'L' }).success)

  // Passo 9
  const step9Valido = step9Schema.safeParse({
    nome: 'Produtor Teste',
    whatsapp: '(45) 99144-7004',
    email: 'produtor@exemplo.com.br',
    consent_lgpd: true,
  })
  assert.ok(step9Valido.success)
  if (step9Valido.success) {
    assert.equal(step9Valido.data.whatsapp, '45991447004')
  }

  const step9Invalido = step9Schema.safeParse({
    nome: 'P',
    whatsapp: '123',
    email: 'invalido',
    consent_lgpd: false,
  })
  assert.ok(!step9Invalido.success)
})

test('Zod Schemas: Validação do diagnosticoPayloadSchema completo', () => {
  const payloadValido = {
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
    cidade: 'Londrina',
    nome_propriedade: 'Fazenda Modelo',
    nome: 'Lucas Dierings',
    whatsapp: '45991447004',
    email: 'lucas@fluxorural.com.br',
    consent_lgpd: true,
    score: 80,
    scoreBruto: 80,
    scoreMax: 100,
    qualificationLevel: 'verde',
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'gestao-rural',
    origem: 'site',
    page_url: 'https://fluxorural.com.br/diagnostico',
  }

  const parseResult = diagnosticoPayloadSchema.safeParse(payloadValido)
  assert.ok(parseResult.success)
})
