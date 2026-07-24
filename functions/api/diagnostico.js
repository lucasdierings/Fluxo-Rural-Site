// Cloudflare Pages Function — POST /api/diagnostico
// Recebe o lead do diagnóstico (produtor OU empresa), empurra pro CRM e envia
// por e-mail via Resend.
// Requer a env var RESEND_API_KEY no Cloudflare Pages e o domínio do remetente verificado no Resend.

import { pushCrm, atribuicao, canalOrigem, idEstavel } from '../_lib/crm.js'

const TO = 'lucasdierings12@gmail.com'
const FROM = 'Fluxo Rural <contato@fluxorural.com.br>'

const NIVEIS = {
  verde: { emoji: '🟢', label: 'QUENTE', prioridade: 'ALTA' },
  amarelo: { emoji: '🟡', label: 'MORNO', prioridade: 'MÉDIA' },
  laranja: { emoji: '🟠', label: 'FRIO', prioridade: 'BAIXA' },
  vermelho: { emoji: '🔴', label: 'MUITO FRIO', prioridade: 'BAIXA' },
}

// Escapa input do lead antes de injetar no HTML do e-mail
function esc(v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function linha(label, valor) {
  if (!valor) return ''
  return `<tr><td style="padding:6px 0;color:#666;width:180px;vertical-align:top;">${esc(label)}</td><td style="padding:6px 0;color:#1C1C1C;font-weight:600;">${esc(valor)}</td></tr>`
}

function bloco(titulo, linhas) {
  const conteudo = linhas.join('')
  if (!conteudo) return ''
  return `<div style="margin-top:18px;"><p style="margin:0 0 6px;color:#1E4D7B;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:.5px;">${esc(titulo)}</p><table style="width:100%;border-collapse:collapse;">${conteudo}</table></div>`
}

function buildEmail(data) {
  const nivel = NIVEIS[data.qualificationLevel] || { emoji: '⚪', label: data.qualificationLevel || '—', prioridade: '?' }
  const isEmpresa = data.perfil === 'empresa'
  const titulo = isEmpresa ? 'Novo Diagnóstico — Empresa do Agro' : 'Novo Diagnóstico — Produtor Rural'

  const blocos = isEmpresa
    ? [
        bloco('Contato', [
          linha('Nome', data.nome),
          linha('E-mail', data.email),
          linha('WhatsApp', data.whatsapp),
          linha('Estado', data.estado),
          linha('Empresa', data.empresa),
          linha('Cargo', data.cargo),
        ]),
        bloco('A Empresa', [
          linha('Segmento', data.segmento),
          linha('Faturamento', data.faturamentoEmpresa),
          linha('Funcionários', data.funcionarios),
          linha('Tempo de operação', data.tempoOperacao),
          linha('Gestão estruturada', data.gestao),
        ]),
        bloco('Marketing & Vendas', [
          linha('Como gera clientes', data.geraClientes),
          linha('Presença digital', data.presencaDigital),
          linha('Processo de vendas', data.processoVendas),
        ]),
        bloco('Desafios & Urgência', [
          linha('Desafios', data.desafios),
          linha('Urgência', data.urgencia),
          linha('Expectativa', data.expectativa),
        ]),
      ]
    : [
        bloco('Contato', [
          linha('Nome', data.nome),
          linha('E-mail', data.email),
          linha('WhatsApp', data.whatsapp),
          linha('Estado', data.estado),
        ]),
        bloco('Propriedade', [
          linha('Atividade', data.atividade),
          linha('Faturamento', data.faturamento),
          linha('Hectares', data.hectares),
        ]),
        bloco('Gestão', [
          linha('Desafios', data.desafios),
          linha('Gestão estruturada', data.gestao),
          linha('Dívidas', data.dividas),
          linha('Investimento tech/ano', data.investimento),
        ]),
        bloco('Sucessão', [
          linha('Filhos/herdeiros', data.filhos),
          linha('Situação', data.situacaoFilhos),
          linha('Conflito familiar', data.conflito),
        ]),
        bloco('Urgência & Expectativa', [
          linha('Urgência', data.urgencia),
          linha('Consultor anterior', data.consultor),
          linha('Expectativa', data.expectativa),
        ]),
      ]

  const tracking = bloco('Tracking', [
    linha('Origem', data.origem),
    linha('UTM source', data.utm_source),
    linha('UTM medium', data.utm_medium),
    linha('UTM campaign', data.utm_campaign),
  ])

  const badgeBg = data.qualificationLevel === 'verde' ? '#7AB648' : '#1E4D7B'

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;background:#F8F6F1;">
      <div style="background:#1E4D7B;padding:28px;text-align:center;">
        <h1 style="color:#FFFFFF;margin:0;font-size:22px;">${esc(titulo)}</h1>
      </div>
      <div style="padding:28px;background:#FFFFFF;">
        <div style="background:${badgeBg};color:#FFFFFF;display:inline-block;padding:6px 18px;border-radius:20px;font-size:14px;font-weight:700;">
          ${nivel.emoji} ${esc(nivel.label)} — Score ${esc(data.score)} · Prioridade ${esc(nivel.prioridade)}
        </div>
        ${blocos.join('')}
        ${tracking}
      </div>
      <div style="background:#1E4D7B;padding:16px;text-align:center;">
        <p style="color:#FFFFFF;margin:0;font-size:12px;">Fluxo Rural Consultoria</p>
      </div>
    </div>`
}

// E-mail do LEAD PARCIAL (etapa de contato — antes das perguntas)
function buildEmailParcial(data) {
  const isEmpresa = data.perfil === 'empresa'
  const titulo = isEmpresa ? 'Novo Lead — Empresa do Agro (parcial)' : 'Novo Lead — Produtor Rural (parcial)'
  const contato = bloco('Contato', [
    linha('Nome', data.nome),
    linha('E-mail', data.email),
    linha('WhatsApp', data.whatsapp),
    linha('Empresa / Propriedade', data.empresa),
    linha('Estado', data.estado),
  ])
  const tracking = bloco('Tracking', [
    linha('Origem', data.origem),
    linha('UTM source', data.utm_source),
    linha('UTM medium', data.utm_medium),
    linha('UTM campaign', data.utm_campaign),
  ])
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;background:#F8F6F1;">
      <div style="background:#7AB648;padding:24px;text-align:center;">
        <h1 style="color:#FFFFFF;margin:0;font-size:20px;">${esc(titulo)}</h1>
      </div>
      <div style="padding:24px;background:#FFFFFF;">
        <p style="margin:0 0 14px;color:#1C1C1C;font-size:14px;">Contato capturado no inicio do diagnostico (a pessoa ainda NAO completou as perguntas).</p>
        ${contato}
        ${tracking}
      </div>
      <div style="background:#1E4D7B;padding:16px;text-align:center;">
        <p style="color:#FFFFFF;margin:0;font-size:12px;">Fluxo Rural Consultoria</p>
      </div>
    </div>`
}

// Empurra o lead do diagnóstico pro CRM. A etapa importa:
//   etapa='contato'  → lead PARCIAL (só o contato, ainda não respondeu nada):
//                      entra como pessoa na base, sem negócio no funil.
//   diagnóstico completo → cria o negócio de consultoria, com score na observação.
// Se a pessoa abandona no meio e volta dias depois, o dedup por e-mail junta os
// dois toques na mesma ficha.
async function empurrarParaCrm(env, data) {
  const parcial = data.etapa === 'contato'
  const tracking = {
    utm_source: data.utm_source || null,
    utm_medium: data.utm_medium || null,
    utm_campaign: data.utm_campaign || null,
    utm_term: data.utm_term || null,
    utm_content: data.utm_content || null,
    gclid: data.gclid || null,
    fbclid: data.fbclid || null,
    page_url: data.page_url || null,
  }
  const externalId = await idEstavel('diagnostico', [
    parcial ? 'parcial' : 'completo', data.email, data.whatsapp, data.perfil,
  ])
  const obsPartes = [
    data.perfil === 'empresa' ? 'Empresa do agro' : 'Produtor rural',
    data.qualificationLevel ? `nível ${data.qualificationLevel}` : null,
    data.score != null ? `score ${data.score}` : null,
    data.urgencia ? `urgência: ${data.urgencia}` : null,
    data.desafios ? `desafios: ${String(data.desafios).slice(0, 200)}` : null,
  ].filter(Boolean)

  return pushCrm(env, {
    source: 'site-diagnostico',
    external_id: externalId,
    contato: {
      nome: data.nome,
      email: data.email || null,
      whatsapp: data.whatsapp || null,
      uf: data.estado || null,
      empresa: data.empresa || null,
      interesse: parcial
        ? 'Diagnóstico (contato, ainda sem responder)'
        : `Diagnóstico ${data.perfil === 'empresa' ? 'empresa' : 'produtor'}${data.qualificationLevel ? ' — nível ' + data.qualificationLevel : ''}`,
      ...atribuicao(tracking),
    },
    // Lead parcial não vira negócio: o funil é pra quem respondeu.
    negocio: parcial ? undefined : {
      produto: 'consultoria',
      etapa: 'novo',
      origem: canalOrigem(tracking, 'diagnostico'),
      obs: obsPartes.join(' · '),
    },
    evento: {
      tipo: 'form_submit',
      meta: {
        form: parcial ? 'diagnostico-parcial' : 'diagnostico-completo',
        perfil: data.perfil || null,
        score: data.score ?? null,
        nivel: data.qualificationLevel || null,
      },
    },
  })
}

export async function onRequest(context) {
  const { request, env } = context

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método não permitido' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const data = await request.json()

    if (!data || !data.nome || !data.email) {
      return new Response(JSON.stringify({ error: 'Dados incompletos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // CRM antes do e-mail, e em waitUntil(): o push não atrasa a resposta ao
    // produtor, e o lead entra no funil mesmo se o Resend estiver fora do ar.
    context.waitUntil(empurrarParaCrm(env, data))

    if (!env.RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY não configurada' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const primeiroNome = String(data.nome).split(' ')[0]
    const tag = data.perfil === 'empresa' ? '🏢 Empresa' : '🌾 Produtor'

    let subject
    let html
    if (data.etapa === 'contato') {
      // Lead parcial (so contato) — disparado na etapa de contato
      subject = `🆕 Lead parcial (${tag}): ${primeiroNome}${data.empresa ? ' — ' + data.empresa : ''}`
      html = buildEmailParcial(data)
    } else {
      // Diagnostico completo
      const nivel = NIVEIS[data.qualificationLevel] || { emoji: '⚪', label: data.qualificationLevel || '—' }
      subject = `${nivel.emoji} Novo Diagnóstico (${tag}): ${primeiroNome} — ${nivel.label} · Score ${data.score ?? '-'}`
      html = buildEmail(data)
    }

    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: TO,
        reply_to: data.email,
        subject,
        html,
      }),
    })

    if (!resp.ok) {
      const detail = await resp.text()
      return new Response(JSON.stringify({ error: 'Falha no envio do e-mail', detail }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Erro interno', detail: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
