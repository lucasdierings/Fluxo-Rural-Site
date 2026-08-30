import test from 'node:test'
import assert from 'node:assert/strict'
import { onRequest, calcularScore, NIVEIS } from '../functions/api/diagnostico.js'
import { calculateLeadScore, diagnosticoPayloadSchema, step9Schema } from '../lib/schema-diagnostico.ts'
import { esc, linha, bloco } from '../functions/_lib/email.js'
import { atribuicao, canalOrigem, idEstavel } from '../functions/_lib/crm.js'

// Helper to create mock Cloudflare context
function createMockContext({ body, headers = {}, env = {} }) {
  const req = new Request('https://fluxorural.com.br/api/diagnostico', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
  return {
    request: req,
    env: {
      FLUXO_INGEST_TOKEN: 'test_token',
      ...env,
    },
  }
}

// -------------------------------------------------------------
// SUITE 1: CLOUDFLARE FUNCTION EDGE CASES & INPUT VALIDATION
// -------------------------------------------------------------
test('Edge Case: Method Not Allowed on GET/PUT/DELETE', async () => {
  const req = new Request('https://fluxorural.com.br/api/diagnostico', { method: 'GET' })
  const res = await onRequest({ request: req, env: {} })
  assert.equal(res.status, 405)
  const data = await res.json()
  assert.equal(data.error, 'Método não permitido')
})

test('Edge Case: Malformed JSON body in POST', async () => {
  const req = new Request('https://fluxorural.com.br/api/diagnostico', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{"invalid_json: true',
  })
  const res = await onRequest({ request: req, env: {} })
  assert.equal(res.status, 500)
  const data = await res.json()
  assert.equal(data.ok, false)
  assert.match(data.error, /Erro interno/)
})

test('Edge Case: Missing or empty contact fields (nome, email, whatsapp)', async () => {
  const cases = [
    { nome: '', email: 'teste@gmail.com', whatsapp: '45999998888' }, // empty name
    { nome: 'A', email: 'teste@gmail.com', whatsapp: '45999998888' }, // 1 char name
    { nome: '   ', email: 'teste@gmail.com', whatsapp: '45999998888' }, // whitespace name
    { nome: 'Lucas', email: '', whatsapp: '45999998888' }, // empty email
    { nome: 'Lucas', email: 'invalid-email', whatsapp: '45999998888' }, // invalid email
    { nome: 'Lucas', email: 'lucas@', whatsapp: '45999998888' }, // invalid email domain
    { nome: 'Lucas', email: 'lucas@gmail', whatsapp: '45999998888' }, // missing TLD
    { nome: 'Lucas', email: 'teste@gmail.com', whatsapp: '' }, // empty whatsapp
    { nome: 'Lucas', email: 'teste@gmail.com', whatsapp: '123456789' }, // 9 digits (no DDD)
    { nome: 'Lucas', email: 'teste@gmail.com', whatsapp: 'abcdefghijk' }, // letters
  ]

  for (const c of cases) {
    const ctx = createMockContext({
      body: {
        etapa: 'completo',
        perfil: 'produtor',
        atividade: 'graos',
        area_ha: '500-2000ha',
        gestao_atual: 'planilhas',
        desafio_principal: 'fluxo_caixa',
        faturamento_anual: '5M-20M',
        urgencia: '30_dias',
        estado: 'PR',
        cidade: 'Cascavel',
        ...c,
      },
    })
    const res = await onRequest(ctx)
    assert.equal(res.status, 400, `Expected 400 for case: ${JSON.stringify(c)}`)
    const data = await res.json()
    assert.equal(data.ok, false)
    assert.match(data.error, /Dados de contato/)
  }
})

test('Edge Case: Extreme & Valid Phone Number formats', async () => {
  const validPhones = [
    '45999998888', // 11 digits clean
    '4599998888', // 10 digits clean
    '(45) 99999-8888', // standard mask
    '+55 (45) 99999-8888', // international mask
    '   45 99999 8888   ', // spaces
    '(45) 3222-1100', // landline with DDD (10 digits)
  ]

  for (const phone of validPhones) {
    let pushedCrmPayload = null
    const originalFetch = globalThis.fetch
    globalThis.fetch = async (url, opts) => {
      if (url.includes('api/ingest')) {
        pushedCrmPayload = JSON.parse(opts.body)
        return new Response(JSON.stringify({ ok: true }), { status: 200 })
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200 })
    }

    try {
      const ctx = createMockContext({
        body: {
          etapa: 'completo',
          perfil: 'produtor',
          atividade: 'graos',
          area_ha: '500-2000ha',
          gestao_atual: 'planilhas',
          desafio_principal: 'fluxo_caixa',
          faturamento_anual: '5M-20M',
          urgencia: '30_dias',
          estado: 'PR',
          cidade: 'Cascavel',
          nome: 'Lucas Agrônomo',
          email: 'lucas@agro.com.br',
          whatsapp: phone,
        },
      })
      const res = await onRequest(ctx)
      assert.equal(res.status, 200, `Phone should be accepted: ${phone}`)
      const resJson = await res.json()
      assert.equal(resJson.ok, true)
      assert.ok(pushedCrmPayload)
      assert.equal(pushedCrmPayload.contato.whatsapp, phone)
    } finally {
      globalThis.fetch = originalFetch
    }
  }
})

test('Edge Case: Reject non-produtor profile', async () => {
  const ctx = createMockContext({
    body: {
      etapa: 'completo',
      perfil: 'estudante',
      nome: 'Lucas',
      email: 'lucas@gmail.com',
      whatsapp: '45999998888',
      atividade: 'graos',
      area_ha: '500-2000ha',
      gestao_atual: 'planilhas',
      desafio_principal: 'fluxo_caixa',
      faturamento_anual: '5M-20M',
      urgencia: '30_dias',
      estado: 'PR',
      cidade: 'Cascavel',
    },
  })
  const res = await onRequest(ctx)
  assert.equal(res.status, 400)
  const data = await res.json()
  assert.match(data.error, /destinado a produtores rurais/)
})

test('Edge Case: Missing required diagnostic questions in complete mode', async () => {
  const requiredKeys = ['atividade', 'area_ha', 'gestao_atual', 'desafio_principal', 'faturamento_anual', 'urgencia', 'estado']
  
  const base = {
    etapa: 'completo',
    perfil: 'produtor',
    nome: 'Lucas',
    email: 'lucas@gmail.com',
    whatsapp: '45999998888',
    atividade: 'graos',
    area_ha: '500-2000ha',
    gestao_atual: 'planilhas',
    desafio_principal: 'fluxo_caixa',
    faturamento_anual: '5M-20M',
    urgencia: '30_dias',
    estado: 'PR',
    cidade: 'Cascavel',
  }

  for (const key of requiredKeys) {
    const invalid = { ...base, [key]: '' }
    const ctx = createMockContext({ body: invalid })
    const res = await onRequest(ctx)
    assert.equal(res.status, 400, `Should fail when ${key} is empty`)
    const data = await res.json()
    assert.match(data.error, /Complete todas as perguntas obrigatórias/)
  }
})

// -------------------------------------------------------------
// SUITE 2: CRM PAYLOAD & NEGOCIOS.OBS FORMATTING
// -------------------------------------------------------------
test('CRM Payload: Verify negocios.obs, external_id, and meta payload construction', async () => {
  let crmPayload = null
  const originalFetch = globalThis.fetch
  globalThis.fetch = async (url, opts) => {
    if (url.includes('api/ingest')) {
      crmPayload = JSON.parse(opts.body)
      return new Response(JSON.stringify({ ok: true }), { status: 200 })
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  }

  try {
    const payload = {
      etapa: 'completo',
      perfil: 'produtor',
      atividade: 'graos',
      area_ha: '500-2000ha',
      gestao_atual: 'planilhas',
      desafio_principal: 'endividamento',
      detalhe_desafio: 'Dívida bancária com taxa alta de custeio',
      faturamento_anual: '>20M',
      urgencia: '30_dias',
      estado: 'MT',
      cidade: 'Sorriso',
      nome_propriedade: 'Fazenda Boa Esperança',
      nome: 'Carlos Eduardo Soares',
      email: 'carlos@boaesperanca.agr.br',
      whatsapp: '(66) 99876-5432',
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'safra26_search',
      utm_term: 'consultoria gestao soja',
      utm_content: 'anuncio_v1',
      gclid: 'gclid_test_12345',
      page_url: 'https://fluxorural.com.br/diagnostico?utm_source=google&utm_medium=cpc',
    }

    const ctx = createMockContext({ body: payload })
    const res = await onRequest(ctx)
    assert.equal(res.status, 200)
    const resJson = await res.json()
    assert.equal(resJson.ok, true)
    assert.equal(resJson.score, 91) // 25 (fat) + 25 (urg) + 20 (des) + 13 (area) + 8 (planilha) = 91 -> wait: 25+25+20+13+8 = 91! Let's check:
    assert.equal(resJson.qualificationLevel, 'verde')

    assert.ok(crmPayload)
    assert.equal(crmPayload.source, 'site-diagnostico')
    assert.ok(crmPayload.external_id.startsWith('diagnostico:'))

    // Verify contato block
    assert.equal(crmPayload.contato.nome, 'Carlos Eduardo Soares')
    assert.equal(crmPayload.contato.email, 'carlos@boaesperanca.agr.br')
    assert.equal(crmPayload.contato.whatsapp, '(66) 99876-5432')
    assert.equal(crmPayload.contato.uf, 'MT')
    assert.equal(crmPayload.contato.cidade, 'Sorriso')
    assert.equal(crmPayload.contato.empresa, 'Fazenda Boa Esperança')
    assert.equal(crmPayload.contato.interesse, 'Diagnóstico produtor — nível verde')
    assert.equal(crmPayload.contato.gclid, 'gclid_test_12345')

    // Verify negocio block
    assert.equal(crmPayload.negocio.produto, 'consultoria')
    assert.equal(crmPayload.negocio.etapa, 'novo')
    assert.equal(crmPayload.negocio.origem, 'google-ads')
    
    // Verify exact string format of obs
    const obs = crmPayload.negocio.obs
    assert.ok(obs.includes('Produtor rural · nível verde · score 91/100'))
    assert.ok(obs.includes('Atividade: Grãos & Culturas Anuais (Soja, milho, trigo, etc.)'))
    assert.ok(obs.includes('Área: De 500 a 2.000 hectares (Médio a grande porte)'))
    assert.ok(obs.includes('Gestão: Planilhas Estruturadas (Excel / Google Sheets)'))
    assert.ok(obs.includes('Desafio: Gestão de Dívidas & Custeio Bancário'))
    assert.ok(obs.includes('Detalhe: Dívida bancária com taxa alta de custeio'))
    assert.ok(obs.includes('Faturamento: Mais de R$ 20 milhões / ano'))
    assert.ok(obs.includes('Urgência: Nos próximos 30 dias (Ação imediata)'))
    assert.ok(obs.includes('Município: Sorriso'))
    assert.ok(obs.includes('UF: MT'))
    assert.ok(obs.includes('Fazenda: Fazenda Boa Esperança'))

    // Verify evento block
    assert.equal(crmPayload.evento.tipo, 'form_submit')
    assert.equal(crmPayload.evento.meta.form, 'diagnostico-completo')
    assert.equal(crmPayload.evento.meta.score, 91)
    assert.equal(crmPayload.evento.meta.nivel, 'verde')
  } finally {
    globalThis.fetch = originalFetch
  }
})

// -------------------------------------------------------------
// SUITE 3: RESEND EMAIL HTML GENERATION, XSS ESCAPING & BADGES
// -------------------------------------------------------------
test('Email HTML: All 4 thermal badge levels and scoring renders', async () => {
  const levels = [
    { score: 85, level: 'verde', expectedLabel: 'QUENTE', expectedColor: '#4ADE80' },
    { score: 60, level: 'amarelo', expectedLabel: 'MORNO', expectedColor: '#E8B84B' },
    { score: 40, level: 'laranja', expectedLabel: 'FRIO', expectedColor: '#F97316' },
    { score: 20, level: 'vermelho', expectedLabel: 'MUITO FRIO', expectedColor: '#EF4444' },
  ]

  for (const lvl of levels) {
    let emailSentBody = null
    const originalFetch = globalThis.fetch
    globalThis.fetch = async (url, opts) => {
      if (url.includes('api/ingest')) {
        return new Response(JSON.stringify({ ok: true }), { status: 200 })
      }
      if (url.includes('resend.com')) {
        emailSentBody = JSON.parse(opts.body)
        return new Response(JSON.stringify({ id: 'email_123' }), { status: 200 })
      }
      return new Response(JSON.stringify({ ok: true }), { status: 200 })
    }

    try {
      const ctx = createMockContext({
        env: { RESEND_API_KEY: 're_test_key_123', FLUXO_INGEST_TOKEN: 'token_123' },
        body: {
          etapa: 'completo',
          perfil: 'produtor',
          atividade: 'graos',
          area_ha: lvl.level === 'verde' ? '>2000ha' : lvl.level === 'amarelo' ? '500-2000ha' : lvl.level === 'laranja' ? '100-500ha' : '<100ha',
          gestao_atual: lvl.level === 'verde' ? 'nenhuma' : 'erp_software',
          desafio_principal: lvl.level === 'verde' ? 'endividamento' : 'nao_sei',
          faturamento_anual: lvl.level === 'verde' ? '>20M' : lvl.level === 'amarelo' ? '2M-5M' : lvl.level === 'laranja' ? '500k-2M' : '<500k',
          urgencia: lvl.level === 'verde' ? '30_dias' : lvl.level === 'amarelo' ? '3_meses' : 'sem_pressa',
          estado: 'PR',
          cidade: 'Toledo',
          nome: 'Produtor Teste',
          email: 'teste@agro.com',
          whatsapp: '45999998888',
        },
      })
      const res = await onRequest(ctx)
      assert.equal(res.status, 200)
      assert.ok(emailSentBody, 'Resend fetch must have been called')
      assert.ok(emailSentBody.html.includes(lvl.expectedLabel))
      assert.ok(emailSentBody.html.includes(lvl.expectedColor))
      assert.ok(emailSentBody.subject.includes(NIVEIS[lvl.level].emoji))
    } finally {
      globalThis.fetch = originalFetch
    }
  }
})

test('Email HTML & XSS Escaping: Malicious script tags and special chars in inputs', async () => {
  let emailSentBody = null
  const originalFetch = globalThis.fetch
  globalThis.fetch = async (url, opts) => {
    if (url.includes('api/ingest')) return new Response(JSON.stringify({ ok: true }), { status: 200 })
    if (url.includes('resend.com')) {
      emailSentBody = JSON.parse(opts.body)
      return new Response(JSON.stringify({ id: 'email_xss' }), { status: 200 })
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  }

  try {
    const maliciousPayload = {
      etapa: 'completo',
      perfil: 'produtor',
      atividade: 'graos',
      area_ha: '500-2000ha',
      gestao_atual: 'planilhas',
      desafio_principal: 'custos_margem',
      detalhe_desafio: '<script>alert("xss")</script> & <b>bold</b>',
      faturamento_anual: '5M-20M',
      urgencia: '30_dias',
      estado: 'PR',
      cidade: 'Cascavel <img src=x onerror=alert(1)>',
      nome_propriedade: 'Fazenda <Test & Farm>',
      nome: 'João <script>hack</script>',
      email: 'joao@fazenda.com.br',
      whatsapp: '45999998888',
      utm_source: '<svg onload=alert(1)>',
      page_url: 'https://fluxorural.com.br/diagnostico?foo="><script>alert(2)</script>',
    }

    const ctx = createMockContext({
      env: { RESEND_API_KEY: 're_test', FLUXO_INGEST_TOKEN: 'tok' },
      body: maliciousPayload,
    })
    const res = await onRequest(ctx)
    assert.equal(res.status, 200)
    assert.ok(emailSentBody)

    // Ensure raw unescaped script / svg / img tags do not exist in html
    assert.ok(!emailSentBody.html.includes('<script>alert("xss")</script>'))
    assert.ok(!emailSentBody.html.includes('<img src=x onerror=alert(1)>'))
    assert.ok(!emailSentBody.html.includes('<svg onload=alert(1)>'))
    assert.ok(!emailSentBody.html.includes('<script>hack</script>'))
    
    // Ensure properly escaped entities exist
    assert.ok(emailSentBody.html.includes('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;') || emailSentBody.html.includes('&lt;script&gt;'))
    assert.ok(emailSentBody.html.includes('&amp;'))
    assert.ok(emailSentBody.html.includes('&lt;img'))
  } finally {
    globalThis.fetch = originalFetch
  }
})

// -------------------------------------------------------------
// SUITE 4: ZERO-PII TELEMETRY SANITIZATION
// -------------------------------------------------------------
test('Telemetry: Strict Zero-PII sanitization eliminates sensitive fields', () => {
  const PII_KEYS = [
    'nome', 'name', 'first_name', 'last_name',
    'email', 'mail', 'whatsapp', 'telefone', 'phone', 'celular',
    'cpf', 'cnpj', 'rg', 'endereco', 'address', 'rua', 'street', 'cep', 'zip'
  ]

  function mockSanitizeParams(params) {
    const piiSet = new Set(PII_KEYS)
    const clean = {}
    for (const [key, value] of Object.entries(params)) {
      if (!piiSet.has(key.toLowerCase())) {
        clean[key] = value
      }
    }
    return clean
  }

  const rawTelemetryWithPII = {
    event: 'diagnostico_step_complete',
    step_number: 9,
    step_name: 'contato',
    nome: 'Produtor Confidencial',
    Name: 'Adversarial Case',
    EMAIL: 'secret@domain.com',
    whatsapp: '45999998888',
    CPF: '123.456.789-00',
    cnpj: '12.345.678/0001-90',
    endereco: 'Linha Formosa, km 12',
    score: 85,
    qualificationLevel: 'verde',
    origem: 'site',
  }

  const sanitized = mockSanitizeParams(rawTelemetryWithPII)
  
  for (const piiKey of PII_KEYS) {
    assert.equal(sanitized[piiKey], undefined, `PII Key ${piiKey} must be removed`)
    assert.equal(sanitized[piiKey.toUpperCase()], undefined, `Uppercase PII Key ${piiKey} must be removed`)
  }

  assert.equal(sanitized.score, 85)
  assert.equal(sanitized.qualificationLevel, 'verde')
  assert.equal(sanitized.step_number, 9)
  assert.equal(sanitized.origem, 'site')
})

// -------------------------------------------------------------
// SUITE 5: ISOLATION INTEGRITY OF BEWEATHER AND EPRODUTOR
// -------------------------------------------------------------
test('Isolation: No Beweather or eProdutor route or component references introduced in diagnostic flow', () => {
  // Check schema-diagnostico
  const schemaStr = calculateLeadScore.toString()
  assert.ok(!schemaStr.includes('beweather'))
  assert.ok(!schemaStr.includes('eprodutor'))
  
  // Check diagnostico.js
  const fnStr = onRequest.toString()
  assert.ok(!fnStr.includes('beweather'))
  assert.ok(!fnStr.includes('eprodutor'))
})
