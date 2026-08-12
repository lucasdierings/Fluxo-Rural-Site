// Cloudflare Pages Function — POST /api/contato
//
// Atende os DOIS formulários de contato do site (form de /contato e cotação da
// landing /beweather), que até aqui postavam num Google Apps Script morto com
// `mode: 'no-cors'` — resposta opaca, `fetch` resolvendo em 404, "Mensagem
// enviada!" na tela e o lead no lixo. Agora:
//   1. valida o payload (erro volta a ser erro, com status HTTP de verdade)
//   2. avisa o Lucas por e-mail (Resend), igual ao /api/diagnostico
//   3. confirma o lead no CRM antes de responder sucesso ao formulário
//
// O front só marca sucesso (e só dispara generate_lead no Ads) quando esta
// Function responde 200. Nada de conversão fantasma.

import { pushCrm, atribuicao, canalOrigem, idEstavel } from '../_lib/crm.js'

const TO = 'lucasdierings12@gmail.com'
const FROM = 'Fluxo Rural <contato@fluxorural.com.br>'

// Origens permitidas: o form é servido do mesmo domínio, mas a landing do
// Beweather também roda em beweather.fluxorural.com.br.
const ORIGENS = [
  'https://fluxorural.com.br',
  'https://www.fluxorural.com.br',
  'https://beweather.fluxorural.com.br',
  'http://localhost:3000',
  'http://localhost:8788',
]

// Interesse escolhido no form → produto do CRM (produtos_servicos.id).
// O texto original vai inteiro pra observação do negócio: o mapa simplifica,
// não descarta.
const PRODUTO_POR_INTERESSE = {
  'consultoria em gestão financeira': 'consultoria',
  'liderança e empreendedorismo': 'consultoria',
  'palestra / workshop': 'palestra',
  'quero convidar para um novo projeto': 'consultoria',
}
const PRODUTOS_VALIDOS = ['beweather', 'eprodutor', 'eaware', 'palestra', 'consultoria']

function cors(request) {
  const origin = request.headers.get('Origin')
  const base = { 'Content-Type': 'application/json' }
  if (origin && ORIGENS.includes(origin)) {
    base['Access-Control-Allow-Origin'] = origin
    base['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    base['Access-Control-Allow-Headers'] = 'Content-Type'
    base['Vary'] = 'Origin'
  }
  return base
}

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), { status, headers })
}

function esc(v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function linha(label, valor) {
  if (valor === '' || valor == null) return ''
  return `<tr><td style="padding:6px 0;color:#666;width:180px;vertical-align:top;">${esc(label)}</td><td style="padding:6px 0;color:#1C1C1C;font-weight:600;">${esc(valor)}</td></tr>`
}

function bloco(titulo, linhas) {
  const conteudo = linhas.join('')
  if (!conteudo) return ''
  return `<div style="margin-top:18px;"><p style="margin:0 0 6px;color:#1E4D7B;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:.5px;">${esc(titulo)}</p><table style="width:100%;border-collapse:collapse;">${conteudo}</table></div>`
}

function buildEmail(d, beweather) {
  const titulo = beweather ? 'Nova Cotação — Beweather' : 'Novo Contato — Site'
  const cor = beweather ? '#2E86AB' : '#7AB648'
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;background:#F8F6F1;">
      <div style="background:${cor};padding:24px;text-align:center;">
        <h1 style="color:#FFFFFF;margin:0;font-size:20px;">${esc(titulo)}</h1>
      </div>
      <div style="padding:24px;background:#FFFFFF;">
        ${bloco('Contato', [
          linha('Nome', d.nome),
          linha('E-mail', d.email),
          linha('Telefone / WhatsApp', d.telefone),
          linha('Cidade', d.cidade),
          linha('Estado', d.estado),
          linha('Empresa / Propriedade', d.empresa),
        ])}
        ${bloco(beweather ? 'Cotação' : 'Interesse', [
          linha('Interesse', d.interesse),
          linha('Hectares', d.hectares),
          linha('CPF / CNPJ', d.documento),
          linha('CEP', d.cep),
          linha('Mensagem', d.detalhes),
        ])}
        ${bloco('Origem', [
          linha('Canal', d.canal),
          linha('UTM source', d.tracking.utm_source),
          linha('UTM medium', d.tracking.utm_medium),
          linha('UTM campaign', d.tracking.utm_campaign),
          linha('GCLID', d.tracking.gclid),
          linha('Página', d.tracking.page_url),
        ])}
        ${d.consent ? '<p style="margin:18px 0 0;font-size:12px;color:#666;">Consentimento LGPD registrado em ' + esc(d.consent_ts || '—') + '.</p>' : ''}
      </div>
      <div style="background:#1E4D7B;padding:14px;text-align:center;">
        <p style="color:#FFFFFF;margin:0;font-size:12px;">Fluxo Rural Consultoria</p>
      </div>
    </div>`
}

export async function onRequest(context) {
  const { request, env } = context
  const headers = cors(request)

  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers })
  if (request.method !== 'POST') return json({ error: 'Método não permitido' }, 405, headers)

  let body
  try { body = await request.json() } catch (_) { return json({ error: 'JSON inválido' }, 400, headers) }

  const nome = String(body.nome || '').trim().slice(0, 120)
  const email = String(body.email || '').trim().toLowerCase().slice(0, 180)
  const telefone = String(body.telefone || body.whatsapp || '').trim().slice(0, 30)
  const emailValido = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const telefoneValido = !telefone || telefone.replace(/\D/g, '').length >= 10
  if (!nome || (!email && !telefone) || !emailValido || !telefoneValido) {
    return json({ error: 'Informe nome e ao menos e-mail ou telefone.' }, 400, headers)
  }

  const formOrigem = String(body.form || body._tipo || 'contato')
  const beweather = formOrigem.includes('beweather') || body.produto === 'beweather'
  if (beweather && !(body.consent === true || body.consent === 'true' || body.consent === 1)) {
    return json({ error: 'O consentimento é obrigatório para solicitar a cotação.' }, 400, headers)
  }
  const interesse = String(body.interesse || (beweather ? 'Cotação Beweather' : '')).trim()

  const produtoPedido = String(body.produto || '').toLowerCase()
  const produto = PRODUTOS_VALIDOS.includes(produtoPedido)
    ? produtoPedido
    : (PRODUTO_POR_INTERESSE[interesse.toLowerCase()] || (beweather ? 'beweather' : 'consultoria'))

  const tracking = {
    utm_source: body.utm_source || null,
    utm_medium: body.utm_medium || null,
    utm_campaign: body.utm_campaign || null,
    utm_term: body.utm_term || null,
    utm_content: body.utm_content || null,
    gclid: body.gclid || null,
    fbclid: body.fbclid || null,
    ttclid: body.ttclid || null,
    page_url: body.page_url || body.landing_url || null,
  }

  const dados = {
    nome,
    email,
    telefone,
    cidade: String(body.cidade || '').trim(),
    estado: String(body.estado || body.uf || '').trim().toUpperCase(),
    empresa: String(body.empresa || body.propriedade || '').trim(),
    hectares: body.hectares || '',
    documento: body.documento || '',
    cep: body.cep || '',
    detalhes: String(body.detalhes || body.mensagem || '').trim(),
    interesse,
    consent: body.consent === true || body.consent === 'true' || body.consent === 1,
    consent_ts: body.consent_timestamp || body.consent_ts || null,
    canal: canalOrigem(tracking, 'site'),
    tracking,
  }

  // 1. CRM é a confirmação primária: é a fonte de verdade da operação.
  //    Só depois dele confirmar tentamos o e-mail, evitando sucesso falso.
  const externalId = await idEstavel(beweather ? 'beweather-lp' : 'contato', [
    email, telefone, interesse, dados.detalhes.slice(0, 120),
  ])
  const obs = [interesse, dados.detalhes].filter(Boolean).join(' — ') || null
  const crm = await pushCrm(env, {
    source: beweather ? 'site-beweather' : 'site-contato',
    external_id: externalId,
    contato: {
      nome,
      email: email || null,
      whatsapp: telefone || null,
      cidade: dados.cidade || null,
      uf: dados.estado || null,
      empresa: dados.empresa || null,
      interesse: beweather ? 'Cotação Beweather' : (interesse ? `Interesse: ${interesse}` : null),
      consent_marketing: dados.consent ? 1 : 0,
      consent_ts: dados.consent_ts,
      ...atribuicao(tracking),
    },
    negocio: {
      produto,
      etapa: 'novo',
      valor: beweather ? 9990 : 0,
      origem: dados.canal,
      obs,
    },
    evento: {
      tipo: 'form_submit',
      meta: { form: formOrigem, interesse: interesse || null, hectares: dados.hectares || null },
    },
  })
  if (!crm.ok) {
    return json({ error: 'Não foi possível registrar o contato. Tente novamente.', crm: crm.motivo }, 502, headers)
  }

  // 2. E-mail interno é notificação. Se falhar, o contato continua seguro no CRM.
  let emailOk = false
  if (env.RESEND_API_KEY) {
    try {
      const primeiroNome = nome.split(' ')[0]
      const assunto = beweather
        ? `🌦️ Cotação Beweather: ${primeiroNome}${dados.cidade ? ' — ' + dados.cidade : ''}`
        : `📬 Novo contato: ${primeiroNome}${interesse ? ' — ' + interesse : ''}`
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: FROM,
          to: TO,
          reply_to: email || undefined,
          subject: assunto,
          html: buildEmail(dados, beweather),
        }),
      })
      emailOk = resp.ok
      if (!resp.ok) console.error('Resend recusou:', resp.status, await resp.text().catch(() => ''))
    } catch (err) {
      console.error('Resend falhou:', String(err))
    }
  } else {
    console.error('RESEND_API_KEY ausente — e-mail de contato não enviado')
  }

  return json({ success: true, email: emailOk, crm: true, submissionId: externalId }, 200, headers)
}
