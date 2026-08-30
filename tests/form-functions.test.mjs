import assert from 'node:assert/strict'
import test from 'node:test'
import { onRequest as contato } from '../functions/api/contato.js'
import { onRequest as diagnostico, calcularScore } from '../functions/api/diagnostico.js'
import { onRequest as proposta } from '../functions/api/proposta.js'

const ENV = { FLUXO_INGEST_TOKEN: 'token-teste', RESEND_API_KEY: 'resend-teste' }

function request(path, body) {
  return new Request(`https://fluxorural.com.br${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://fluxorural.com.br' },
    body: JSON.stringify(body),
  })
}

async function executar(handler, path, body, { env = ENV, crmOk = true, resendOk = true } = {}) {
  const originalFetch = globalThis.fetch
  const chamadas = []
  globalThis.fetch = async (url, init = {}) => {
    chamadas.push({ url: String(url), body: init.body ? JSON.parse(init.body) : null })
    if (String(url).includes('/api/ingest')) {
      return new Response(JSON.stringify(crmOk ? { ok: true } : { error: 'não autorizado' }), {
        status: crmOk ? 201 : 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    if (String(url).includes('api.resend.com')) {
      return new Response(
        JSON.stringify(resendOk ? { id: 'email-teste' } : { error: 'falha resend' }),
        { status: resendOk ? 200 : 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
    throw new Error(`URL inesperada: ${url}`)
  }
  try {
    const response = await handler({ request: request(path, body), env, waitUntil() {} })
    return { response, data: await response.json(), chamadas }
  } finally {
    globalThis.fetch = originalFetch
  }
}

test('diagnóstico completo de 9 passos: processa score, CRM ingest enriquecido e e-mail com badge térmico', { concurrency: false }, async () => {
  const payload9Passos = {
    etapa: 'completo',
    perfil: 'produtor',
    nome: 'Lucas Dierings',
    email: 'lucas@fluxorural.com.br',
    whatsapp: '45991447004',
    estado: 'PR',
    cidade: 'Cascavel',
    nome_propriedade: 'Fazenda Santa Rita',
    atividade: 'graos',
    area_ha: '500-2000ha',
    gestao_atual: 'planilhas',
    desafio_principal: 'fluxo_caixa',
    detalhe_desafio: 'Falta previsibilidade anual na entressafra',
    faturamento_anual: '5M-20M',
    urgencia: '30_dias',
    consent_lgpd: true,
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'gestao_rural_pr',
    gclid: 'gclid_teste_123',
    page_url: 'https://fluxorural.com.br/diagnostico',
  }

  const resultado = await executar(diagnostico, '/api/diagnostico', payload9Passos)
  assert.equal(resultado.response.status, 200)
  assert.equal(resultado.data.ok, true)
  assert.equal(resultado.data.crm, true)
  assert.equal(resultado.data.email, true)
  assert.equal(typeof resultado.data.score, 'number')
  assert.equal(resultado.data.score >= 70, true) // 22 (fat) + 25 (urg) + 18 (desafio) + 13 (area) + 8 (gestao) = 86 pts
  assert.equal(resultado.data.qualificationLevel, 'verde')
  assert.equal(resultado.data.submissionId.startsWith('diagnostico:'), true)

  // Validação detalhada do CRM Ingest
  const chamadaCrm = resultado.chamadas.find((c) => c.url.includes('/api/ingest'))
  assert.ok(chamadaCrm, 'Chamada ao CRM Ingest deve ocorrer')
  const ingest = chamadaCrm.body
  assert.equal(ingest.source, 'site-diagnostico')
  assert.equal(ingest.contato.nome, 'Lucas Dierings')
  assert.equal(ingest.contato.email, 'lucas@fluxorural.com.br')
  assert.equal(ingest.contato.whatsapp, '45991447004')
  assert.equal(ingest.contato.uf, 'PR')
  assert.equal(ingest.contato.cidade, 'Cascavel')
  assert.equal(ingest.contato.empresa, 'Fazenda Santa Rita')
  assert.equal(ingest.negocio.produto, 'consultoria')
  assert.equal(ingest.negocio.origem, 'google-ads')
  assert.equal(ingest.negocio.obs.includes('Produtor rural'), true)
  assert.equal(ingest.negocio.obs.includes('nível verde'), true)
  assert.equal(ingest.negocio.obs.includes('Atividade: Grãos & Culturas Anuais'), true)
  assert.equal(ingest.negocio.obs.includes('Área: De 500 a 2.000 hectares'), true)
  assert.equal(ingest.negocio.obs.includes('Município: Cascavel'), true)
  assert.equal(ingest.evento.tipo, 'form_submit')
  assert.equal(ingest.evento.meta.form, 'diagnostico-completo')
  assert.equal(ingest.evento.meta.score, 86)
  assert.equal(ingest.evento.meta.nivel, 'verde')

  // Validação do envio de e-mail Resend
  const chamadaResend = resultado.chamadas.find((c) => c.url.includes('api.resend.com'))
  assert.ok(chamadaResend, 'Chamada ao Resend deve ocorrer')
  const emailBody = chamadaResend.body
  assert.equal(emailBody.to, 'lucasdierings12@gmail.com')
  assert.equal(emailBody.reply_to, 'lucas@fluxorural.com.br')
  assert.equal(emailBody.subject.includes('🟢 Novo Diagnóstico (🌾 Produtor): Lucas — QUENTE · Score 86/100'), true)
  assert.equal(emailBody.html.includes('QUENTE'), true)
  assert.equal(emailBody.html.includes('Cascavel'), true)
  assert.equal(emailBody.html.includes('Fazenda Santa Rita'), true)
})

test('diagnóstico rejeita dados de contato inválidos (nome curto, email inválido, whatsapp < 10 digitos)', { concurrency: false }, async () => {
  const semNome = await executar(diagnostico, '/api/diagnostico', {
    etapa: 'completo', perfil: 'produtor', nome: 'A',
    email: 'email@valido.com', whatsapp: '45999999999',
  })
  assert.equal(semNome.response.status, 400)
  assert.equal(semNome.data.ok, false)

  const emailInvalido = await executar(diagnostico, '/api/diagnostico', {
    etapa: 'completo', perfil: 'produtor', nome: 'Produtor',
    email: 'email-sem-arroba', whatsapp: '45999999999',
  })
  assert.equal(emailInvalido.response.status, 400)

  const whatsInvalido = await executar(diagnostico, '/api/diagnostico', {
    etapa: 'completo', perfil: 'produtor', nome: 'Produtor',
    email: 'produtor@email.com', whatsapp: '12345',
  })
  assert.equal(whatsInvalido.response.status, 400)
})

test('diagnóstico completo rejeita payload com perguntas obrigatórias ausentes', { concurrency: false }, async () => {
  const incompleto = await executar(diagnostico, '/api/diagnostico', {
    etapa: 'completo',
    perfil: 'produtor',
    nome: 'Produtor Teste',
    email: 'produtor@example.com',
    whatsapp: '45999999999',
    estado: 'PR',
    // Faltam: atividade, area_ha, gestao_atual, desafio_principal, faturamento_anual, urgencia
  })
  assert.equal(incompleto.response.status, 400)
  assert.equal(incompleto.data.ok, false)
})

test('diagnóstico não confirma e não dispara e-mail quando o CRM rejeita', { concurrency: false }, async () => {
  const resultado = await executar(diagnostico, '/api/diagnostico', {
    etapa: 'completo',
    perfil: 'produtor',
    nome: 'Produtor Teste',
    email: 'produtor@example.com',
    whatsapp: '44999999999',
    estado: 'PR',
    cidade: 'Maringá',
    atividade: 'graos',
    area_ha: '100-500ha',
    gestao_atual: 'planilhas',
    desafio_principal: 'custos_margem',
    faturamento_anual: '500k-2M',
    urgencia: '30_dias',
  }, { crmOk: false })
  assert.equal(resultado.response.status, 502)
  assert.equal(resultado.data.ok, false)
  assert.equal(resultado.chamadas.some((chamada) => chamada.url.includes('api.resend.com')), false)
})

test('diagnóstico confirma com sucesso mesmo sem RESEND_API_KEY configurada', { concurrency: false }, async () => {
  const resultado = await executar(
    diagnostico,
    '/api/diagnostico',
    {
      etapa: 'completo',
      perfil: 'produtor',
      nome: 'Produtor Teste',
      email: 'produtor@example.com',
      whatsapp: '44999999999',
      estado: 'PR',
      cidade: 'Londrina',
      atividade: 'pecuaria_corte',
      area_ha: '500-2000ha',
      gestao_atual: 'caderno_basico',
      desafio_principal: 'endividamento',
      faturamento_anual: '2M-5M',
      urgencia: '30_dias',
    },
    { env: { FLUXO_INGEST_TOKEN: 'token-teste' } }
  )
  assert.equal(resultado.response.status, 200)
  assert.equal(resultado.data.ok, true)
  assert.equal(resultado.data.crm, true)
  assert.equal(resultado.data.email, false)
})

test('calcularScore: valida pontuações das 5 faixas térmicas', () => {
  // Score 100 / Verde (Máximo)
  const maximo = calcularScore({
    faturamento_anual: '>20M', // 25
    urgencia: '30_dias', // 25
    desafio_principal: 'endividamento', // 20
    area_ha: '>2000ha', // 15
    gestao_atual: 'nenhuma', // 15
  })
  assert.equal(maximo.score, 100)
  assert.equal(maximo.qualificationLevel, 'verde')

  // Score 60 / Amarelo (Médio)
  const medio = calcularScore({
    faturamento_anual: '500k-2M', // 12
    urgencia: '3_meses', // 18
    desafio_principal: 'sucessao', // 16
    area_ha: '100-500ha', // 10
    gestao_atual: 'erp_software', // 5
  })
  assert.equal(medio.score, 61)
  assert.equal(medio.qualificationLevel, 'amarelo')

  // Score 40 / Laranja (Frio)
  const frio = calcularScore({
    faturamento_anual: 'prefiro_nao_informar', // 10
    urgencia: 'ate_fim_ano', // 8
    desafio_principal: 'nao_sei', // 12
    area_ha: '<100ha', // 5
    gestao_atual: 'erp_software', // 5
  })
  assert.equal(frio.score, 40)
  assert.equal(frio.qualificationLevel, 'laranja')

  // Score 20 / Vermelho (Muito Frio)
  const muitoFrio = calcularScore({
    faturamento_anual: '<500k', // 5
    urgencia: 'sem_pressa', // 2
    desafio_principal: 'nao_sei', // 12
    area_ha: '<100ha', // 5
    gestao_atual: 'erp_software', // 5
  })
  assert.equal(muitoFrio.score, 29)
  assert.equal(muitoFrio.qualificationLevel, 'vermelho')
})

test('diagnóstico parcial legado salva contato sem abrir negócio', { concurrency: false }, async () => {
  const resultado = await executar(diagnostico, '/api/diagnostico', {
    etapa: 'contato', perfil: 'produtor', nome: 'Produtor Teste',
    email: 'produtor@example.com', whatsapp: '44999999999', estado: 'PR',
  })
  assert.equal(resultado.response.status, 200)
  const ingest = resultado.chamadas.find((chamada) => chamada.url.includes('/api/ingest')).body
  assert.equal(ingest.source, 'site-diagnostico')
  assert.equal(ingest.negocio, undefined)
})

test('portfólio entra como contato sem negócio', { concurrency: false }, async () => {
  const resultado = await executar(proposta, '/api/proposta', {
    etapa: 'contato', tipo: 'portfolio', nome: 'Contato Teste',
    email: 'contato@example.com', whatsapp: '44999999999',
  })
  assert.equal(resultado.response.status, 200)
  const ingest = resultado.chamadas.find((chamada) => chamada.url.includes('/api/ingest')).body
  assert.equal(ingest.negocio, undefined)
})

test('pedido de evento exige qualificação comercial', { concurrency: false }, async () => {
  const incompleto = await executar(proposta, '/api/proposta', {
    etapa: 'completo', tipo: 'palestra', nome: 'Evento Teste',
    email: 'evento@example.com', whatsapp: '44999999999',
  })
  assert.equal(incompleto.response.status, 400)

  const completo = await executar(proposta, '/api/proposta', {
    etapa: 'completo', tipo: 'palestra', nome: 'Evento Teste',
    email: 'evento@example.com', whatsapp: '44999999999', organizacao: 'Cooperativa',
    formato: 'Presencial', contratante: 'Cooperativa ou sindicato',
    quando: 'Nos próximos 30 dias', cidade: 'Londrina', uf: 'PR',
  })
  assert.equal(completo.response.status, 200)
  const ingest = completo.chamadas.find((chamada) => chamada.url.includes('/api/ingest')).body
  assert.equal(ingest.negocio.produto, 'palestra')
})

test('download de portfólio não deduplica uma proposta comercial posterior', { concurrency: false }, async () => {
  const contato = {
    nome: 'Mesmo Contato', email: 'mesmo@example.com', whatsapp: '44999999999',
  }
  const portfolio = await executar(proposta, '/api/proposta', {
    ...contato, etapa: 'contato', tipo: 'portfolio',
  })
  const comercial = await executar(proposta, '/api/proposta', {
    ...contato, etapa: 'completo', tipo: 'palestra', organizacao: 'Cooperativa',
    formato: 'Presencial', contratante: 'Cooperativa ou sindicato',
    quando: 'Nos próximos 30 dias', cidade: 'Londrina', uf: 'PR',
  })
  assert.notEqual(portfolio.data.submissionId, comercial.data.submissionId)
  assert.equal(comercial.chamadas[0].url.includes('/api/ingest'), true)
})

test('contato comum confirma CRM e e-mail', { concurrency: false }, async () => {
  const resultado = await executar(contato, '/api/contato', {
    form: 'contato', nome: 'Contato Teste', email: 'contato@example.com',
    telefone: '44999999999', cidade: 'Londrina', estado: 'PR',
    interesse: 'Consultoria em Gestão Financeira',
  })
  assert.equal(resultado.response.status, 200)
  assert.equal(resultado.data.crm, true)
  assert.equal(resultado.data.email, true)
})
