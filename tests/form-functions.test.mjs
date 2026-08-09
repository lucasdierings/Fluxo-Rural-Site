import assert from 'node:assert/strict'
import test from 'node:test'
import { onRequest as contato } from '../functions/api/contato.js'
import { onRequest as diagnostico } from '../functions/api/diagnostico.js'
import { onRequest as proposta } from '../functions/api/proposta.js'

const ENV = { FLUXO_INGEST_TOKEN: 'token-teste', RESEND_API_KEY: 'resend-teste' }

function request(path, body) {
  return new Request(`https://fluxorural.com.br${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://fluxorural.com.br' },
    body: JSON.stringify(body),
  })
}

async function executar(handler, path, body, { crmOk = true } = {}) {
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
      return new Response(JSON.stringify({ id: 'email-teste' }), { status: 200 })
    }
    throw new Error(`URL inesperada: ${url}`)
  }
  try {
    const response = await handler({ request: request(path, body), env: ENV, waitUntil() {} })
    return { response, data: await response.json(), chamadas }
  } finally {
    globalThis.fetch = originalFetch
  }
}

test('diagnóstico parcial salva contato sem abrir negócio', { concurrency: false }, async () => {
  const resultado = await executar(diagnostico, '/api/diagnostico', {
    etapa: 'contato', perfil: 'produtor', nome: 'Produtor Teste',
    email: 'produtor@example.com', whatsapp: '44999999999', estado: 'PR',
  })
  assert.equal(resultado.response.status, 200)
  const ingest = resultado.chamadas.find((chamada) => chamada.url.includes('/api/ingest')).body
  assert.equal(ingest.source, 'site-diagnostico')
  assert.equal(ingest.negocio, undefined)
})

test('diagnóstico completo abre negócio de consultoria', { concurrency: false }, async () => {
  const resultado = await executar(diagnostico, '/api/diagnostico', {
    etapa: 'completo', perfil: 'produtor', nome: 'Produtor Teste',
    email: 'produtor@example.com', whatsapp: '44999999999', estado: 'PR',
    atividade: 'graos', faturamento: '500k-1M', hectares: '200-500ha',
    desafios: 'Gestão financeira', gestao: 'Básico', urgencia: 'Próximos 30 dias',
    score: 72, qualificationLevel: 'verde',
  })
  assert.equal(resultado.response.status, 200)
  const ingest = resultado.chamadas.find((chamada) => chamada.url.includes('/api/ingest')).body
  assert.equal(ingest.negocio.produto, 'consultoria')
})

test('diagnóstico não confirma quando o CRM rejeita', { concurrency: false }, async () => {
  const resultado = await executar(diagnostico, '/api/diagnostico', {
    etapa: 'contato', perfil: 'produtor', nome: 'Produtor Teste',
    email: 'produtor@example.com', whatsapp: '44999999999', estado: 'PR',
  }, { crmOk: false })
  assert.equal(resultado.response.status, 502)
  assert.equal(resultado.chamadas.some((chamada) => chamada.url.includes('api.resend.com')), false)
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
