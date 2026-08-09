// Cloudflare Pages Function — POST /api/proposta
//
// Captura de TODOS os pedidos do site: consultoria, palestra, treinamento,
// podcast e parceria. Uma rota só porque a qualificação muda por serviço, mas o
// caminho (validar, avisar por e-mail, empurrar pro CRM) é o mesmo.
// Até ago/2026 esse público não tinha formulário nenhum. Os 8 CTAs da /palestras
// mandavam direto pro wa.me, então o lead chegava no WhatsApp do Lucas sem
// registro no CRM, sem qualificação e sem virar negócio no funil, enquanto uma
// campanha do Google Ads otimizava por um clique que não correspondia a lead.
//
// Duas etapas, mesmo padrão do /api/diagnostico:
//   etapa 'contato'  → só contato{} no CRM. Quem abandona na etapa 2 não some.
//   etapa 'completo' → contato{} + negocio{}, e o e-mail com a qualificação.
//
// O front só marca sucesso quando esta Function responde 200.

import { pushCrm, atribuicao, canalOrigem, idEstavel } from '../_lib/crm.js'
import { esc, linha, bloco, moldura } from '../_lib/email.js'

const TO = 'lucasdierings12@gmail.com'
const FROM = 'Fluxo Rural <contato@fluxorural.com.br>'

const ORIGENS = [
  'https://fluxorural.com.br',
  'https://www.fluxorural.com.br',
  'http://localhost:3000',
  'http://localhost:3100',
  'http://localhost:8788',
]

// Tipos de pedido que o formulário oferece.
const TIPOS = {
  portfolio: 'Baixou o portfólio',
  consultoria: 'Consultoria em Gestão Rural',
  palestra: 'Palestra',
  treinamento: 'Treinamento',
  podcast: 'Podcast / Agro Jovem',
  parceria: 'Parceria',
}

// Consultoria é o único que abre negócio com produto próprio. Os outros quatro
// entram como `palestra`: NÃO inventar id fora do catálogo de produtos_servicos
// do CRM, senão a ficha abre com o campo vazio e o save seguinte sobrescreve.
// O tipo real fica em negocio.obs e em evento.meta.tipo_pedido.
const PRODUTO_POR_TIPO = { consultoria: 'consultoria' }

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

/** Resume a qualificação numa linha só, para caber em negocios.obs. */
function resumo(d) {
  return [
    TIPOS[d.tipo] || d.tipo,
    d.tema,
    d.formato,
    d.contratante,
    d.motivo,
    d.atividade,
    d.area,
    d.gestao,
    d.publico && `público: ${d.publico}`,
    d.objetivo && `objetivo: ${d.objetivo}`,
    d.tamanho && `${d.tamanho} pessoas`,
    d.quando,
    d.data,
    [d.cidade, d.uf].filter(Boolean).join('/'),
    d.detalhes,
  ]
    .filter(Boolean)
    .join(' · ')
}

function emailCompleto(d) {
  const corpo = `
    ${bloco('Contato', [
      linha('Nome', d.nome),
      linha('E-mail', d.email),
      linha('WhatsApp', d.whatsapp),
      linha('Organização', d.organizacao),
    ])}
    ${bloco('O pedido', [
      linha('Tipo', TIPOS[d.tipo] || d.tipo),
      linha('Tema', d.tema),
      linha('O que motivou', d.motivo),
      linha('Atividade principal', d.atividade),
      linha('Área', d.area),
      linha('Gestão hoje', d.gestao),
      linha('Objetivo', d.objetivo),
      linha('Formato', d.formato),
      linha('Quem contrata', d.contratante),
      linha('Público', d.publico),
      linha('Tamanho da plateia', d.tamanho),
      linha('Quando', d.quando),
      linha('Data', d.data),
      linha('Cidade', d.cidade),
      linha('UF', d.uf),
      linha('Observações', d.detalhes),
    ])}
    ${bloco('Origem', [
      linha('Canal', d.canal),
      linha('UTM source', d.tracking.utm_source),
      linha('UTM medium', d.tracking.utm_medium),
      linha('UTM campaign', d.tracking.utm_campaign),
      linha('UTM content', d.tracking.utm_content),
      linha('GCLID', d.tracking.gclid),
      linha('Página', d.tracking.page_url),
    ])}`
  return moldura('Novo pedido — Palestras e Treinamentos', corpo, '#1E4D7B')
}

function emailParcial(d) {
  const corpo = `
    <p style="margin:0 0 6px;color:#666;font-size:13px;">${
      d.tipo === 'portfolio'
        ? 'Baixou o portfólio. É contato de base, não oportunidade de venda.'
        : 'Contato preenchido, qualificação ainda não enviada.'
    }</p>
    ${bloco('Contato', [
      linha('Nome', d.nome),
      linha('E-mail', d.email),
      linha('WhatsApp', d.whatsapp),
      linha('Organização', d.organizacao),
    ])}
    ${bloco('Origem', [
      linha('Canal', d.canal),
      linha('UTM source', d.tracking.utm_source),
      linha('UTM campaign', d.tracking.utm_campaign),
      linha('Página', d.tracking.page_url),
    ])}`
  return moldura(d.tipo === 'portfolio' ? 'Download do portfólio' : 'Contato parcial', corpo, '#E8B84B')
}

export async function onRequest(context) {
  const { request, env } = context
  const headers = cors(request)

  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers })
  if (request.method !== 'POST') return json({ error: 'Método não permitido' }, 405, headers)

  let body
  try {
    body = await request.json()
  } catch (_) {
    return json({ error: 'JSON inválido' }, 400, headers)
  }

  const nome = String(body.nome || '').trim()
  const email = String(body.email || '').trim().toLowerCase()
  const whatsapp = String(body.whatsapp || body.telefone || '').trim()
  if (!nome || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || whatsapp.replace(/\D/g, '').length < 10) {
    return json({ error: 'Informe nome, e-mail e WhatsApp.' }, 400, headers)
  }

  const parcial = body.etapa === 'contato'
  const tipoPedido = String(body.tipo || '').trim()
  if (!Object.prototype.hasOwnProperty.call(TIPOS, tipoPedido)) {
    return json({ error: 'Tipo de pedido inválido.' }, 400, headers)
  }
  if (!parcial && (tipoPedido === 'palestra' || tipoPedido === 'treinamento')) {
    const camposEvento = [body.formato, body.contratante, body.quando, body.organizacao, body.cidade, body.uf]
    if (camposEvento.some((valor) => !String(valor || '').trim())) {
      return json({ error: 'Complete formato, contratante, prazo, organização e local do evento.' }, 400, headers)
    }
    if (body.quando === 'Já tenho uma data definida' && !String(body.data || '').trim()) {
      return json({ error: 'Informe a data do evento.' }, 400, headers)
    }
  }

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

  const d = {
    nome,
    email,
    whatsapp,
    organizacao: String(body.organizacao || body.empresa || '').trim(),
    tipo: tipoPedido,
    tema: String(body.tema || '').trim(),
    formato: String(body.formato || '').trim(),
    contratante: String(body.contratante || '').trim(),
    publico: String(body.publico || '').trim(),
    tamanho: String(body.tamanho || '').trim(),
    quando: String(body.quando || '').trim(),
    data: String(body.data || '').trim(),
    cidade: String(body.cidade || '').trim(),
    uf: String(body.uf || '').trim().toUpperCase(),
    motivo: String(body.motivo || '').trim(),
    atividade: String(body.atividade || '').trim(),
    area: String(body.area || '').trim(),
    gestao: String(body.gestao || '').trim(),
    objetivo: String(body.objetivo || '').trim(),
    detalhes: String(body.detalhes || body.mensagem || '').trim(),
    canal: canalOrigem(tracking, 'site'),
    tracking,
  }

  // 1. CRM. Etapa, tipo e contexto comercial entram no identificador para que
  //    um download de portfólio nunca bloqueie uma proposta posterior. Reenvio
  //    idêntico no mesmo dia continua idempotente.
  const externalId = await idEstavel('proposta', [
    parcial ? 'parcial' : 'completo', d.tipo, email, whatsapp, nome,
    d.tema, d.organizacao, d.quando, d.data,
  ])

  const payload = {
    source: 'site-proposta',
    external_id: externalId,
    contato: {
      nome,
      email,
      whatsapp,
      cidade: d.cidade || null,
      uf: d.uf || null,
      empresa: d.organizacao || null,
      interesse: parcial
        ? d.tipo === 'portfolio'
          ? 'Baixou o portfólio de treinamentos e palestras'
          : 'Iniciou um pedido no site'
        : `Interesse: ${TIPOS[d.tipo] || 'Palestra'}${d.tema ? ' — ' + d.tema : ''}`,
      ...atribuicao(tracking),
    },
    // Parcial não abre negócio, igual ao /api/diagnostico: contato incompleto
    // vira base de marketing, não oportunidade no funil.
    negocio: parcial
      ? undefined
      : {
          produto: PRODUTO_POR_TIPO[d.tipo] || 'palestra',
          etapa: 'novo',
          origem: canalOrigem(tracking, 'palestra'),
          obs: resumo(d) || null,
        },
    evento: {
      tipo: 'form_submit',
      meta: {
        form: 'proposta',
        etapa: parcial ? 'contato' : 'completo',
        tipo_pedido: d.tipo || null,
        tema: d.tema || null,
        tamanho: d.tamanho || null,
      },
    },
  }

  const crm = await pushCrm(env, payload)
  if (!crm.ok) {
    return json({ error: 'Não foi possível registrar o pedido. Tente novamente.', crm: crm.motivo }, 502, headers)
  }

  // 2. E-mail interno é notificação best-effort. O CRM já confirmou a captura,
  //    então falha do Resend não trava o formulário nem induz envio duplicado.
  let emailOk = false
  if (env.RESEND_API_KEY) {
    try {
      const primeiroNome = nome.split(' ')[0]
      const rotulo = TIPOS[d.tipo] || 'Contato'
      const assunto = parcial
        ? d.tipo === 'portfolio'
          ? `📄 Baixou o portfólio: ${primeiroNome}${d.organizacao ? ' - ' + d.organizacao : ''}`
          : `📝 Contato parcial: ${primeiroNome}${d.organizacao ? ' - ' + d.organizacao : ''}`
        : `🎤 Novo pedido de ${rotulo}: ${primeiroNome}${d.organizacao ? ' — ' + d.organizacao : ''}`
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM,
          to: TO,
          reply_to: email,
          subject: assunto,
          html: parcial ? emailParcial(d) : emailCompleto(d),
        }),
      })
      emailOk = resp.ok
      if (!resp.ok) console.error('Resend recusou:', resp.status, await resp.text().catch(() => ''))
    } catch (err) {
      console.error('Resend falhou:', String(err))
    }
  } else {
    console.error('RESEND_API_KEY ausente — e-mail de proposta não enviado')
  }

  return json({ success: true, email: emailOk, crm: true, submissionId: externalId }, 200, headers)
}
