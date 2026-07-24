// Cloudflare Pages Function — /api/calculadora
// Endpoint único (roteado por `action` no corpo). Binding esperado: env.DB (D1 "fluxo_calculadora").
//   POST {action:'calcular'}  → grava linha ANÔNIMA, devolve {id, ranking}
//   POST {action:'cadastrar'} → associa PII (nome/e-mail/whatsapp) + consentimento, envia e-mail (Resend), devolve {id, ranking}
//   POST {action:'avaliar'}   → grava nota + comentário em calculadora_avaliacoes
//   POST {action:'interesse'} → marca interesse em ferramenta de gestão
//   GET  ?cultura=&estado=    → benchmark/ranking agregado (dados próprios; sem PII)
// PII vai só pro D1/e-mail — nunca pra query string. Todos os writes usam prepared statements (bind).

import { pushCrm, atribuicao, canalOrigem } from '../_lib/crm.js'

const TO = 'lucasdierings12@gmail.com'
const FROM = 'Fluxo Rural <contato@fluxorural.com.br>'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}
const JSON_HEADERS = { 'Content-Type': 'application/json', ...CORS }

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: JSON_HEADERS })
}
function num(v) { const n = Number(v); return isFinite(n) ? n : null }
function esc(v) {
  return String(v == null ? '' : v).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
}
async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}
function fmtBRL(v) {
  if (v == null || isNaN(v)) return '—'
  return 'R$ ' + Math.round(v).toLocaleString('pt-BR')
}

// ---------------------------------------------------------------------------
// Ranking a partir de dados próprios (fallback = null → o front usa o seed)
//
// Política de amostra (bootstrap): no início, com poucos produtores, contamos TODAS as linhas
// (inclusive as anônimas, sem cadastro) pra povoar o ranking mais rápido. Quando já tiver volume
// suficiente, muda pra contar só quem deu consentimento (consent_lgpd=1, ou seja, completou o
// cadastro) — ativa isso setando a env var CALC_SOMENTE_CONSENTIDOS=1 no painel do Cloudflare
// Pages (Settings → Environment variables); normalmente exige um novo deploy pra valer.
// ---------------------------------------------------------------------------
async function computeRanking(env, cultura, estado, userMargem) {
  if (!cultura || !estado || userMargem == null) return null
  try {
    const somenteConsentidos = env.CALC_SOMENTE_CONSENTIDOS === '1' || env.CALC_SOMENTE_CONSENTIDOS === 'true'
    const filtroConsent = somenteConsentidos ? ' AND consent_lgpd=1' : ''
    const q = await env.DB
      .prepare(`SELECT margem_bruta_ha FROM calculadora_diagnosticos WHERE cultura=? AND estado=? AND margem_bruta_ha IS NOT NULL${filtroConsent}`)
      .bind(cultura, estado).all()
    const arr = (q.results || []).map((r) => r.margem_bruta_ha).filter((v) => v != null).sort((a, b) => a - b)
    if (arr.length < 10) return null
    const below = arr.filter((x) => x < userMargem).length
    const percentil = Math.min(99, Math.max(1, Math.round((100 * below) / arr.length)))
    const quant = (p) => arr[Math.min(arr.length - 1, Math.max(0, Math.round(p * (arr.length - 1))))]
    return { fonte: 'propria', n: arr.length, percentil, P25: quant(0.25), mediana: quant(0.5), P75: quant(0.75) }
  } catch (_) { return null }
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Monta o objeto de colunas a partir do payload do front (calcular/cadastrar)
// ---------------------------------------------------------------------------
async function payloadToCols(body, request, env) {
  const r = body.resultado || {}
  const local = body.local || {}
  const head = r.headline || {}
  const cu = head.custosUsados || {}
  const dig = (cat) => (cu[cat] && cu[cat].origem === 'usuario') ? num(cu[cat].valor) : null
  const areaTotal = num(r.area_total)
  // O front envia o arrendamento dentro de `terra` (arrend_valor/arrend_unidade)
  const terra = body.terra || {}
  const arr = body.arrendamento || { valor: terra.arrend_valor, unidade: terra.arrend_unidade }
  const div = body.divida || {}
  const tr = body.tracking || {}
  const ip = request.headers.get('CF-Connecting-IP') || ''
  const ua = request.headers.get('User-Agent') || ''
  const ipHash = ip ? await sha256(ip + '|' + (env.CALC_IP_SALT || 'fluxo-rural-calc-v1')) : null
  const leadQ = areaTotal == null ? null : (areaTotal < 200 ? 'baixa' : areaTotal < 250 ? 'media' : 'alta')

  return {
    cultura: head.cultura || null,
    safra: body.safra || null,
    area_ha: areaTotal,
    produtividade_sc_ha: num(head.prod),
    preco_sc: num(head.preco),
    custo_sementes: dig('sementes'), custo_defensivos: dig('defensivos'),
    custo_fertilizantes: dig('fertilizantes'), custo_diesel: dig('diesel'),
    custo_mao_obra: dig('mao_obra'), custo_manutencao: dig('manutencao'), custo_admin: dig('admin'),
    custo_comercializacao: dig('comercializacao'),
    custos_rateados: head.custo_mode === 'total' ? 1 : 0,
    custo_modo: body.culturas && body.culturas[0] ? body.culturas[0].custo_modo : null,
    custos_detalhe: body.custos_detalhe ? JSON.stringify(body.custos_detalhe) : null,
    arrend_valor: num(arr.valor), arrend_unidade: arr.unidade || null,
    tem_divida: div.tem ? 1 : 0, divida_total: num(div.total), divida_parcela: num(div.parcela), divida_juros: num(div.taxa),
    estado: local.uf || null, cidade: local.cidade || null, microrregiao: null,
    propriedade: local.propriedade || null,
    culturas_extras: r.itens ? JSON.stringify(r.itens) : null,
    atividades_extras: (body.atividades && body.atividades.length) ? JSON.stringify(body.atividades) : null,
    receita_ha: areaTotal ? num(num(r.receita_total) / areaTotal) : null,
    custo_ha: areaTotal ? num(num(r.custo_total) / areaTotal) : null,
    margem_bruta_ha: num(r.margem_conjunta_ha),
    resultado_graos: num(r.resultado_graos),
    pct_vs_estado: num(r.pct_vs_estado_ponderado),
    diagnostico: r.classe || null,
    percentil: num(head.percentil),
    interesse_gestao: body.interesse_gestao ? 1 : 0,
    lead_quality: leadQ,
    status: 'novo',
    utm_source: tr.utm_source || null, utm_medium: tr.utm_medium || null, utm_campaign: tr.utm_campaign || null,
    utm_term: tr.utm_term || null, utm_content: tr.utm_content || null,
    gclid: tr.gclid || null, fbclid: tr.fbclid || null, origem: tr.origem || null,
    ip_hash: ipHash, user_agent: ua.slice(0, 300),
  }
}

async function insertRow(cols, env) {
  const keys = Object.keys(cols)
  const sql = `INSERT INTO calculadora_diagnosticos (${keys.join(',')}) VALUES (${keys.map(() => '?').join(',')})`
  const vals = keys.map((k) => (cols[k] === undefined ? null : cols[k]))
  const res = await env.DB.prepare(sql).bind(...vals).run()
  return res.meta ? res.meta.last_row_id : null
}

// ---------------------------------------------------------------------------
// Helpers de benchmark municipal
// ---------------------------------------------------------------------------
async function countCityLeads(env, cultura, estado, cidade) {
  if (!cultura || !estado || !cidade) return 0
  try {
    const q = await env.DB
      .prepare('SELECT COUNT(DISTINCT email) as cnt FROM calculadora_diagnosticos WHERE cultura=? AND estado=? AND lower(trim(cidade))=? AND consent_lgpd=1')
      .bind(cultura, estado, String(cidade).trim().toLowerCase())
      .first()
    return q ? q.cnt : 0
  } catch (_) { return 0 }
}

async function getCityBenchmark(env, cultura, estado, cidade) {
  if (!cultura || !estado || !cidade) return null
  try {
    const q = await env.DB
      .prepare('SELECT AVG(margem_bruta_ha) as avg_margem, COUNT(DISTINCT email) as cnt FROM calculadora_diagnosticos WHERE cultura=? AND estado=? AND lower(trim(cidade))=? AND consent_lgpd=1')
      .bind(cultura, estado, String(cidade).trim().toLowerCase())
      .first()
    if (q && q.cnt >= 5) {
      return { avg_margem: q.avg_margem, n: q.cnt }
    }
    return null
  } catch (_) { return null }
}

// ---------------------------------------------------------------------------
// Ações
// ---------------------------------------------------------------------------
async function handleCalcular(body, request, env) {
  const cols = await payloadToCols(body, request, env)
  let id = body.calcId || null
  if (id) {
    try {
      const keys = Object.keys(cols)
      const sql = `UPDATE calculadora_diagnosticos SET ${keys.map((k) => `${k}=?`).join(',')} WHERE id=?`
      await env.DB.prepare(sql).bind(...keys.map((k) => (cols[k] === undefined ? null : cols[k])), id).run()
    } catch (_) {
      id = null
    }
  }
  if (!id) {
    id = await insertRow(cols, env)
  }
  const ranking = await computeRanking(env, cols.cultura, cols.estado, cols.margem_bruta_ha)
  const nCidade = await countCityLeads(env, cols.cultura, cols.estado, cols.cidade)
  const cityBench = await getCityBenchmark(env, cols.cultura, cols.estado, cols.cidade)
  return json({ id, ranking, n_cidade: nCidade, city_benchmark: cityBench })
}

// E-mail é o balizador de identidade. Mesma e-mail + mesma safra + propriedade = recálculo.
async function findLinhaExistente(env, email, safra, propriedade) {
  if (!safra) return null
  try {
    const propClean = String(propriedade || '').trim().toLowerCase()
    let row
    if (propClean) {
      row = await env.DB.prepare(
        'SELECT id FROM calculadora_diagnosticos WHERE lower(trim(email))=? AND safra=? AND lower(trim(coalesce(propriedade,\'\')))=? ORDER BY created_at DESC LIMIT 1'
      ).bind(String(email).trim().toLowerCase(), safra, propClean).first()
    } else {
      row = await env.DB.prepare(
        'SELECT id FROM calculadora_diagnosticos WHERE lower(trim(email))=? AND safra=? AND (propriedade IS NULL OR trim(propriedade)=\'\') ORDER BY created_at DESC LIMIT 1'
      ).bind(String(email).trim().toLowerCase(), safra).first()
    }
    return row ? row.id : null
  } catch (_) { return null }
}

// A calculadora é isca de topo de funil: o lead vai para a BASE DE MARKETING do
// CRM, sem virar negócio. Quem pedir consultoria depois vira negócio na mesma
// ficha (o dedup por e-mail junta os dois).
// external_id = calculadora:<id> — o mesmo que o scripts/backfill.mjs do CRM usa,
// então backfill e captura ao vivo nunca duplicam a mesma linha.
async function empurrarCalcParaCrm(env, body, id, cols) {
  const cad = body.cadastro || {}
  const local = body.local || {}
  const r = body.resultado || {}
  const tracking = body.tracking || {}

  return pushCrm(env, {
    source: 'calculadora',
    external_id: `calculadora:${id}`,
    contato: {
      nome: cad.nome,
      email: cad.email || null,
      whatsapp: cad.whatsapp || null,
      cidade: local.cidade || null,
      uf: local.uf || null,
      propriedade: local.propriedade || null,
      interesse: `Calculadora — ${cols.cultura || 'cultura não informada'}${r.classe ? ' (' + r.classe + ')' : ''}`,
      consent_marketing: 1,               // o cadastro exige aceite LGPD
      consent_ts: new Date().toISOString(),
      ...atribuicao(tracking),
    },
    // negocio ausente de propósito → base de marketing, não funil.
    evento: {
      tipo: 'form_submit',
      meta: {
        form: 'calculadora',
        canal: canalOrigem(tracking, 'calculadora'),
        cultura: cols.cultura || null,
        safra: body.safra || null,
        area_ha: cols.area_ha || null,
        margem_bruta_ha: cols.margem_bruta_ha || null,
        diagnostico: r.classe || null,
        percentil: cols.percentil || null,
        interesse_gestao: body.interesse_gestao ? 1 : 0,
        lead_quality: cols.lead_quality || null,
      },
    },
  })
}

async function handleCadastrar(body, request, env, ctx) {
  const cad = body.cadastro || {}
  if (!cad.nome || !cad.email) return json({ error: 'Dados incompletos' }, 400)
  const nowIso = new Date().toISOString()
  const propVal = body.local ? body.local.propriedade : null

  const idExistente = await findLinhaExistente(env, cad.email, body.safra, propVal)
  const isReturning = !!idExistente
  let id = idExistente || body.calcId || null

  const cols = await payloadToCols(body, request, env)

  if (!id) {
    id = await insertRow(cols, env)
  } else {
    const keys = Object.keys(cols)
    const sql = `UPDATE calculadora_diagnosticos SET ${keys.map((k) => `${k}=?`).join(',')} WHERE id=?`
    await env.DB.prepare(sql).bind(...keys.map((k) => (cols[k] === undefined ? null : cols[k])), id).run()
  }

  if (id) {
    await env.DB.prepare(
      'UPDATE calculadora_diagnosticos SET nome=?, email=?, whatsapp=?, consent_lgpd=1, consent_at=?, interesse_gestao=?, updated_at=? WHERE id=?'
    ).bind(cad.nome, cad.email, cad.whatsapp || null, nowIso, body.interesse_gestao ? 1 : 0, nowIso, id).run()
  }

  // CRM em waitUntil(): não atrasa a resposta do cálculo nem quebra a captura se
  // o CRM estiver fora do ar.
  if (id && ctx) ctx.waitUntil(empurrarCalcParaCrm(env, body, id, cols))

  // E-mails e audiência são best-effort (o lead já está no D1), mas cada um em seu próprio
  // try/catch: falha no e-mail interno não pode derrubar o e-mail do produtor, e vice-versa.
  let emailProdutorEnviado = false
  if (env.RESEND_API_KEY) {
    try { await sendEmail(env, body, isReturning) } catch (err) { console.error('email interno falhou:', err) }
    try { emailProdutorEnviado = await sendEmailProdutor(env, body) } catch (err) { console.error('email produtor falhou:', err) }
    if (env.RESEND_AUDIENCE_ID) {
      try { await addContactToResendAudience(env, cad, cols, body.safra) } catch (err) { console.error('audiencia falhou:', err) }
    }
  }

  const r = body.resultado || {}
  const ranking = await computeRanking(env, (r.headline && r.headline.cultura) || null, (body.local && body.local.uf) || null, num(r.margem_conjunta_ha))
  const nCidade = await countCityLeads(env, (r.headline && r.headline.cultura) || null, (body.local && body.local.uf) || null, (body.local && body.local.cidade) || null)
  const cityBench = await getCityBenchmark(env, (r.headline && r.headline.cultura) || null, (body.local && body.local.uf) || null, (body.local && body.local.cidade) || null)

  return json({ success: true, id, isReturning, ranking, n_cidade: nCidade, city_benchmark: cityBench, emailProdutor: emailProdutorEnviado })
}

async function handleAvaliar(body, env) {
  const av = body.avaliacao || {}
  const nota = parseInt(av.estrelas, 10)
  if (!(nota >= 1 && nota <= 5)) return json({ error: 'Nota inválida' }, 400)
  await env.DB.prepare('INSERT INTO calculadora_avaliacoes (diagnostico_id, nota, comentario) VALUES (?,?,?)')
    .bind(body.calcId || null, nota, (av.comentario || '').slice(0, 1000)).run()
  return json({ success: true })
}

async function handleInteresse(body, env) {
  if (!body.calcId) return json({ success: false })
  await env.DB.prepare('UPDATE calculadora_diagnosticos SET interesse_gestao=?, updated_at=? WHERE id=?')
    .bind(body.interesse_gestao ? 1 : 0, new Date().toISOString(), body.calcId).run()
  return json({ success: true })
}

async function handleGet(request, env) {
  const url = new URL(request.url)
  const cultura = url.searchParams.get('cultura')
  const estado = url.searchParams.get('estado')
  if (!cultura || !estado) return json({ error: 'Informe cultura e estado' }, 400)
  const ranking = await computeRanking(env, cultura, estado, 0) // percentil aqui é irrelevante; interessa P25/mediana/P75/n
  return json({ ranking })
}

// ---------------------------------------------------------------------------
// E-mail (Resend) — mesmo padrão do functions/api/diagnostico.js
// ---------------------------------------------------------------------------
function linha(label, valor) {
  if (valor === '' || valor == null) return ''
  return `<tr><td style="padding:6px 0;color:#666;width:180px;vertical-align:top;">${esc(label)}</td><td style="padding:6px 0;color:#1C1C1C;font-weight:600;">${esc(valor)}</td></tr>`
}
function bloco(titulo, linhas) {
  const conteudo = linhas.join('')
  if (!conteudo) return ''
  return `<div style="margin-top:18px;"><p style="margin:0 0 6px;color:#1E4D7B;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:.5px;">${esc(titulo)}</p><table style="width:100%;border-collapse:collapse;">${conteudo}</table></div>`
}
const DIAG_LABEL = {
  margem: 'Problema de Margem', caixa: 'Problema de Caixa', endividamento: 'Problema de Endividamento',
  saudavel: 'Situação Saudável', multiplos: 'Múltiplos Desafios',
}
async function sendEmail(env, body, isReturning) {
  const cad = body.cadastro || {}
  const r = body.resultado || {}
  const local = body.local || {}
  const div = body.divida || {}
  const itens = Array.isArray(r.itens) ? r.itens : []
  const primeiroNome = String(cad.nome || '').split(' ')[0]
  const diag = DIAG_LABEL[r.classe] || r.classe || '—'
  const leadQ = num(r.area_total) == null ? '?' : (r.area_total < 200 ? 'baixa' : r.area_total < 250 ? 'média' : 'alta')

  const culturasLinhas = itens.map((i) =>
    linha(`${(i.cultura || '').toUpperCase()} · ${fmtBRL(i.margem_bruta_ha)}/ha`,
      `${i.area || '—'} ha · ${i.prod || '—'} sc/ha · ${fmtBRL(i.resultado)} no total`)
  )
  const atividades = (body.atividades || []).map((a) => linha(a.tipo, fmtBRL(a.faturamento)))

  // Subcategorias que o produtor detalhou (breakdown fiel, direto do custos_detalhe)
  const detLinhas = []
  const detalhe = body.custos_detalhe || {}
  ;(detalhe.culturas || []).forEach((c) => {
    Object.keys(c.cats || {}).forEach((catId) => {
      const e = c.cats[catId]
      if (!e || !e.detalhado || !Array.isArray(e.subs)) return
      const unidade = e.mensal ? `R$/mês × ${e.meses || 6} meses` : (c.modo === 'ha' ? 'R$/ha' : 'R$ total')
      const txt = e.subs.map((s) => `${s.id}${s.desc ? ` (${s.desc})` : ''}: ${fmtBRL(s.valor_mes != null ? s.valor_mes : s.valor)}`).join(' · ')
      detLinhas.push(linha(`${c.cultura} · ${catId}`, `${txt} — ${unidade}`))
    })
  })

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;background:#F8F6F1;">
      <div style="background:#1E4D7B;padding:24px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:20px;">${isReturning ? 'Lead atualizou os dados (mesma safra)' : 'Novo lead'} — Benchmark da Safra</h1>
      </div>
      <div style="padding:24px;background:#fff;">
        ${isReturning ? `<p style="margin:0 0 14px;padding:10px 14px;background:#FFF7E6;border-left:3px solid #E8B84B;color:#8a5a10;font-size:13px;font-weight:600;">Este e-mail já tinha calculado nesta safra — os dados abaixo são a versão mais recente, não um lead novo.</p>` : ''}
        <div style="background:#7AB648;color:#fff;display:inline-block;padding:6px 16px;border-radius:20px;font-size:13px;font-weight:700;">
          ${esc(diag)} · Margem ${fmtBRL(r.margem_conjunta_ha)}/ha · Lead ${esc(leadQ)}
        </div>
        ${bloco('Contato', [
          linha('Nome', cad.nome), linha('E-mail', cad.email), linha('WhatsApp', cad.whatsapp),
          linha('Estado', local.uf), linha('Cidade', local.cidade), linha('Propriedade', local.propriedade), linha('Safra', body.safra),
        ])}
        ${bloco('Lavoura (por cultura)', culturasLinhas)}
        ${bloco('Resultado dos grãos', [
          linha('Margem bruta conjunta', `${fmtBRL(r.margem_conjunta_ha)}/ha`),
          linha('Custo Comercialização', r.comerc_total ? fmtBRL(r.comerc_total) : null),
          linha('Resultado total', fmtBRL(r.resultado_graos)),
          linha('vs. média do estado', r.pct_vs_estado_ponderado == null ? '' : `${r.pct_vs_estado_ponderado > 0 ? '+' : ''}${Math.round(r.pct_vs_estado_ponderado)}%`),
          linha('Diagnóstico', diag),
          linha('Interesse em gestão', body.interesse_gestao ? 'SIM ✅' : 'não'),
          linha('Modo de custos', body.culturas && body.culturas[0] && body.culturas[0].custo_modo === 'ha' ? 'Por hectare (R$/ha)' : 'Total da safra (R$)'),
        ])}
        ${bloco('Custos detalhados (subcategorias)', detLinhas)}
        ${div.tem ? bloco('Dívida', [
          linha('Total', fmtBRL(div.total)), linha('Parcela anual', fmtBRL(div.parcela)),
          linha('Juros a.a.', div.taxa == null ? '' : div.taxa + '%'),
        ]) : ''}
        ${bloco('Outras atividades', atividades)}
        ${bloco('Origem', [
          linha('Origem', (body.tracking || {}).origem),
          linha('UTM source', (body.tracking || {}).utm_source),
          linha('UTM campaign', (body.tracking || {}).utm_campaign),
          linha('GCLID', (body.tracking || {}).gclid),
        ])}
      </div>
      <div style="background:#1E4D7B;padding:14px;text-align:center;">
        <p style="color:#fff;margin:0;font-size:12px;">Fluxo Rural · Benchmark da Safra</p>
      </div>
    </div>`

  const subject = isReturning
    ? `🔄 Lead atualizado (mesma safra): ${primeiroNome || 'produtor'} — ${diag} · ${fmtBRL(r.margem_conjunta_ha)}/ha`
    : `🌾 Lead calculadora: ${primeiroNome || 'produtor'} — ${diag} · ${fmtBRL(r.margem_conjunta_ha)}/ha`
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: TO, reply_to: cad.email, subject, html }),
  })
  if (!resp.ok) {
    const detail = await resp.text().catch(() => '')
    console.error('Resend (interno) recusou:', resp.status, detail)
  }
}

const DIAG_TEXTOS = {
  margem: 'Seu custo de produção está muito próximo ou acima da receita, o que está consumindo o seu resultado por hectare. O foco deve ser a otimização de custos e o mapeamento dos gargalos por cultura.',
  caixa: 'Sua lavoura gera margem positiva, mas a parcela anual da dívida (ou arrendamento) consome uma fatia perigosa do caixa. O problema não é técnico, é de fluxo de caixa.',
  endividamento: 'O nível de endividamento por hectare está alto em relação à margem média da propriedade, gerando alta alavancagem.',
  saudavel: 'Sua propriedade apresenta boa eficiência de custos e margem saudável por hectare. O desafio é consolidar essa gestão para manter a consistência nas próximas safras.',
  multiplos: 'A lavoura enfrenta desafios combinados de custos elevados e pressões financeiras de curto prazo (dívidas/arrendamento). Requer atenção imediata no planejamento e controle.',
}

const DIAG_RECOMENDACOES = {
  margem: 'Identifique os 3 insumos mais caros da sua safra e faça cotações comparativas. Considere ratear custos fixos e revisar o ponto de equilíbrio de vendas.',
  caixa: 'Projete seu fluxo de caixa para os próximos 12 meses e considere renegociar o vencimento das parcelas no banco ou o arrendamento para prazos mais longos.',
  endividamento: 'Evite novos investimentos financiados no curto prazo. Mantenha o caixa líquido e foque em amortizar a dívida mais cara.',
  saudavel: 'Crie uma reserva de caixa próprio para diminuir a necessidade de crédito de custeio na próxima safra e aumentar seu poder de barganha na compra de insumos.',
  multiplos: 'Faça um diagnóstico financeiro aprofundado. Evite novos desembolsos e priorize a reestruturação das dívidas urgentes.',
}

async function sendEmailProdutor(env, body) {
  const cad = body.cadastro || {}
  const r = body.resultado || {}
  const local = body.local || {}
  const div = body.divida || {}
  const itens = Array.isArray(r.itens) ? r.itens : []
  const primeiroNome = String(cad.nome || '').split(' ')[0]
  const diag = DIAG_LABEL[r.classe] || r.classe || '—'
  const diagTexto = DIAG_TEXTOS[r.classe] || ''
  const diagReco = DIAG_RECOMENDACOES[r.classe] || ''

  const margemHaFmt = fmtBRL(r.margem_conjunta_ha)
  const resultadoFmt = fmtBRL(r.resultado_graos)

  const culturasLinhas = itens.map((i) =>
    linha(`${(i.cultura || '').toUpperCase()} · ${fmtBRL(i.margem_bruta_ha)}/ha`,
      `${i.area || '—'} ha · ${i.prod || '—'} sc/ha · Preço: ${fmtBRL(i.preco)}/sc · Custo: ${fmtBRL(i.custo_ha)}/ha`)
  )

  // Financeiro rápido: ponto de equilíbrio + sobra por saca (campos existem a partir da rodada 2 do front)
  const eqLinhas = itens.filter((i) => i.preco_equilibrio != null).map((i) =>
    linha((i.cultura || '').toUpperCase(),
      `Equilíbrio: ${fmtBRL(i.preco_equilibrio)}/sc ou ${Math.round(i.prod_equilibrio || 0)} sc/ha · sobra ${fmtBRL(i.margem_sc)}/saca`)
  )

  // Top-3 custos da cultura principal (% da receita ajuda o produtor a priorizar)
  const CAT_LABEL_MAIL = {
    sementes: 'Sementes', defensivos: 'Defensivos', fertilizantes: 'Fertilizantes', diesel: 'Combustível',
    mao_obra: 'Mão de obra', manutencao: 'Máquinas', admin: 'Gestão e administrativo', comercializacao: 'Comercialização',
  }
  const headCu = (r.headline && r.headline.custosUsados) || {}
  const receitaHaHead = num(r.headline && r.headline.receita_ha)
  const top3 = Object.keys(headCu)
    .map((k) => ({ k, v: num(headCu[k] && headCu[k].valor) || 0 }))
    .filter((x) => x.v > 0)
    .sort((a, b) => b.v - a.v)
    .slice(0, 3)
  const top3Linhas = top3.map((x, i) => {
    const pctRec = receitaHaHead > 0 ? ` · ${Math.round((x.v / receitaHaHead) * 100)}% da receita` : ''
    return linha(`${i + 1}º maior custo`, `${CAT_LABEL_MAIL[x.k] || x.k}: ${fmtBRL(x.v)}/ha${pctRec}`)
  })

  const divLinhas = div.tem ? [
    linha('Dívida Total', fmtBRL(div.total)),
    linha('Parcela Anual', fmtBRL(div.parcela)),
    linha('Juros Anual', div.taxa ? `${div.taxa}% a.a.` : '—')
  ] : []

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;background:#F7F5EF;color:#202522;border:1px solid #E8E5DA;border-radius:12px;overflow:hidden;">
      <div style="background:#1B4F7A;padding:32px 24px;text-align:center;">
        <p style="color:#E8B84B;margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Fluxo Rural · Benchmark da Safra</p>
        <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:800;letter-spacing:-0.5px;">Seu Diagnóstico de Safra</h1>
      </div>
      <div style="padding:32px 24px;background:#ffffff;">
        <p style="margin:0 0 20px;font-size:16px;line-height:1.5;">Olá, <strong>${esc(primeiroNome)}</strong>!</p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#555;">Aqui está o resumo e o diagnóstico de eficiência da sua lavoura gerado a partir do seu teste no <strong>Benchmark da Safra</strong>. Guarde este e-mail para acompanhar sua evolução.</p>
        
        <div style="background:#F7F5EF;border-left:4px solid #6AAF3D;padding:16px;margin-bottom:28px;border-radius:0 8px 8px 0;">
          <p style="margin:0 0 4px;font-size:12px;color:#666;text-transform:uppercase;font-weight:600;letter-spacing:0.5px;">Desempenho Geral</p>
          <p style="margin:0;font-size:20px;font-weight:700;color:#1B4F7A;">Margem: ${esc(margemHaFmt)}/ha</p>
          <p style="margin:4px 0 0;font-size:14px;color:#555;">Resultado total estimado: <strong>${esc(resultadoFmt)}</strong></p>
          ${r.pct_vs_estado_ponderado != null ? `<p style="margin:4px 0 0;font-size:13px;color:#666;">Você está ${r.pct_vs_estado_ponderado > 0 ? 'acima' : 'abaixo'} da média do seu estado em <strong>${Math.abs(Math.round(r.pct_vs_estado_ponderado))}%</strong>.</p>` : ''}
        </div>

        ${bloco('Dados da Propriedade', [
          linha('Nome da Fazenda', local.propriedade || '—'),
          linha('Cidade / UF', local.cidade ? `${local.cidade} - ${local.uf}` : local.uf),
          linha('Safra', body.safra),
          linha('Área de Grãos', r.area_total ? `${r.area_total} ha` : '—')
        ])}

        ${bloco('Detalhamento da Lavoura', culturasLinhas)}

        ${bloco('Financeiro Rápido', eqLinhas)}

        ${bloco('Seus 3 Maiores Custos', top3Linhas)}

        ${div.tem ? bloco('Endividamento & Compromisso', divLinhas) : ''}

        <div style="background:#1B4F7A;color:#ffffff;padding:20px;border-radius:8px;margin-top:24px;margin-bottom:28px;">
          <p style="margin:0 0 6px;font-size:11px;color:#E8B84B;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Diagnóstico de Gestão</p>
          <h3 style="margin:0 0 10px;font-size:17px;font-weight:700;">Situação: ${esc(diag)}</h3>
          <p style="margin:0 0 16px;font-size:14px;line-height:1.5;color:#E8E5DA;">${esc(diagTexto)}</p>
          <div style="border-top:1px solid rgba(255,255,255,0.15);padding-top:12px;font-size:13px;line-height:1.5;">
            <strong style="color:#6AAF3D;">💡 O que fazer:</strong> ${esc(diagReco)}
          </div>
        </div>

        <div style="text-align:center;margin:32px 0 12px;">
          <a href="https://wa.me/5545991447004?text=Ola%20Lucas,%20fiz%20o%20Benchmark%20da%20Safra%20e%20gostaria%20de%20conversar%20sobre%20meu%20diagnostico%20de%20${esc(r.classe)}" style="background:#6AAF3D;color:#ffffff;padding:12px 24px;border-radius:6px;font-weight:700;font-size:15px;text-decoration:none;display:inline-block;box-shadow:0 2px 4px rgba(0,0,0,0.1);">Conversar com Lucas pelo WhatsApp</a>
          <p style="margin:14px 0 0;font-size:13px;"><a href="https://fluxorural.com.br/calculadora/?utm_source=resend&utm_medium=email&utm_campaign=calc-resultado" style="color:#1B4F7A;font-weight:600;">Refazer meu cálculo ou calcular outra propriedade →</a></p>
        </div>
      </div>
      <div style="background:#1B4F7A;padding:24px;text-align:center;font-size:12px;color:#E8E5DA;line-height:1.5;">
        <p style="margin:0 0 8px;"><strong>Fluxo Rural Consultoria</strong> · Curitiba, PR</p>
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.6);">Os valores calculados são estimativas de margem bruta a partir de referências públicas e dos dados que você informou. Este e-mail é de uso exclusivo do destinatário.</p>
      </div>
    </div>
  `

  const subject = `🌾 Seu diagnóstico de safra: ${margemHaFmt}/ha — ${diag}`
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: cad.email, reply_to: TO, subject, html }),
  })
  if (!resp.ok) {
    const detail = await resp.text().catch(() => '')
    console.error('Resend (produtor) recusou:', resp.status, detail)
  }
  return resp.ok
}

async function addContactToResendAudience(env, cad, cols, safra) {
  const email = String(cad.email).trim().toLowerCase()
  const nome = String(cad.nome).trim()
  const primeiroNome = nome.split(' ')[0]
  const sobrenome = nome.split(' ').slice(1).join(' ') || ''
  
  const m = cols.margem_bruta_ha
  let margemFaixa = 'zero'
  if (m === null || isNaN(m)) margemFaixa = 'nula'
  else if (m < 0) margemFaixa = 'negativa'
  else if (m < 1000) margemFaixa = '0-1000'
  else if (m < 2500) margemFaixa = '1000-2500'
  else if (m < 4000) margemFaixa = '2500-4000'
  else margemFaixa = '4000+'

  // API do Resend: propriedades custom vão em `properties` (valores string|number|null — sem boolean).
  const properties = {
    cultura: cols.cultura || '',
    estado: cols.estado || '',
    cidade: cols.cidade || '',
    diagnostico: cols.diagnostico || '',
    percentil: cols.percentil != null ? Number(cols.percentil) : null,
    interesse_gestao: cols.interesse_gestao === 1 ? 'sim' : 'nao',
    safra: safra || '',
    margem_faixa: margemFaixa,
  }
  const headers = { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }

  let resp = await fetch(`https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, first_name: primeiroNome, last_name: sobrenome, unsubscribed: false, properties }),
  })
  if (!resp.ok) {
    // Contato já existe → atualiza. NÃO enviar `unsubscribed` aqui: reinscrever quem se descadastrou é proibido.
    resp = await fetch(`https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts/${encodeURIComponent(email)}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ first_name: primeiroNome, last_name: sobrenome, properties }),
    })
  }
  if (!resp.ok) {
    const detail = await resp.text().catch(() => '')
    console.error('Resend (audiência) recusou:', resp.status, detail)
  }
}

// ---------------------------------------------------------------------------
export async function onRequest(context) {
  const { request, env } = context
  if (request.method === 'OPTIONS') return new Response(null, { headers: CORS })
  if (request.method === 'GET') return handleGet(request, env)
  if (request.method !== 'POST') return json({ error: 'Método não permitido' }, 405)
  if (!env.DB) return json({ error: 'D1 (DB) não configurado' }, 500)

  let body
  try { body = await request.json() } catch (_) { return json({ error: 'JSON inválido' }, 400) }

  try {
    switch (body.action) {
      case 'calcular': return await handleCalcular(body, request, env)
      case 'cadastrar': return await handleCadastrar(body, request, env, context)
      case 'avaliar': return await handleAvaliar(body, env)
      case 'interesse': return await handleInteresse(body, env)
      default: return json({ error: 'Ação desconhecida' }, 400)
    }
  } catch (err) {
    return json({ error: 'Erro interno', detail: String(err) }, 500)
  }
}
