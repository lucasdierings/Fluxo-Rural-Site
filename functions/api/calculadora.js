// Cloudflare Pages Function — /api/calculadora
// Endpoint único (roteado por `action` no corpo). Binding esperado: env.DB (D1 "fluxo_calculadora").
//   POST {action:'calcular'}  → grava linha ANÔNIMA, devolve {id, ranking}
//   POST {action:'cadastrar'} → associa PII (nome/e-mail/whatsapp) + consentimento, envia e-mail (Resend), devolve {id, ranking}
//   POST {action:'avaliar'}   → grava nota + comentário em calculadora_avaliacoes
//   POST {action:'interesse'} → marca interesse em ferramenta de gestão
//   GET  ?cultura=&estado=    → benchmark/ranking agregado (dados próprios; sem PII)
// PII vai só pro D1/e-mail — nunca pra query string. Todos os writes usam prepared statements (bind).

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
// Monta o objeto de colunas a partir do payload do front (calcular/cadastrar)
// ---------------------------------------------------------------------------
async function payloadToCols(body, request, env) {
  const r = body.resultado || {}
  const local = body.local || {}
  const head = r.headline || {}
  const cu = head.custosUsados || {}
  const dig = (cat) => (cu[cat] && cu[cat].origem === 'usuario') ? num(cu[cat].valor) : null
  const areaTotal = num(r.area_total)
  const arr = body.arrendamento || {}
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
    custos_rateados: head.custo_mode === 'total' ? 1 : 0,
    arrend_valor: num(arr.valor), arrend_unidade: arr.unidade || null,
    tem_divida: div.tem ? 1 : 0, divida_total: num(div.total), divida_parcela: num(div.parcela), divida_juros: num(div.taxa),
    estado: local.uf || null, cidade: local.cidade || null, microrregiao: null,
    culturas_extras: r.itens ? JSON.stringify(r.itens) : null,
    atividades_extras: (body.atividades && body.atividades.length) ? JSON.stringify(body.atividades) : null,
    receita_ha: areaTotal ? num(num(r.receita_total) / areaTotal) : null,
    custo_ha: areaTotal ? num(num(r.custo_total) / areaTotal) : null,
    margem_bruta_ha: num(r.margem_conjunta_ha),
    resultado_graos: num(r.resultado_graos),
    pct_vs_estado: num(r.pct_vs_estado_ponderado),
    diagnostico: r.classe || null,
    percentil: num(head.percentil),
    interesse_gestao: 0,
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
// Ações
// ---------------------------------------------------------------------------
async function handleCalcular(body, request, env) {
  const cols = await payloadToCols(body, request, env)
  const id = await insertRow(cols, env)
  const ranking = await computeRanking(env, cols.cultura, cols.estado, cols.margem_bruta_ha)
  return json({ id, ranking })
}

// E-mail é o balizador de identidade (normalizado: minúsculo + trim — WhatsApp varia de formatação
// e IP é dinâmico/compartilhado, não servem). Mesma e-mail + mesma safra = a mesma pessoa recalculando
// nesta safra → atualiza a linha existente em vez de duplicar (evita lead duplicado no seu inbox e
// viés no ranking/benchmark, que soma margem_bruta_ha de TODAS as linhas sem dedup).
// Mesma e-mail + safra DIFERENTE → linha nova de propósito: é o histórico de evolução entre safras.
async function findLinhaExistente(env, email, safra) {
  if (!safra) return null
  try {
    const row = await env.DB.prepare(
      'SELECT id FROM calculadora_diagnosticos WHERE lower(trim(email))=? AND safra=? ORDER BY created_at DESC LIMIT 1'
    ).bind(String(email).trim().toLowerCase(), safra).first()
    return row ? row.id : null
  } catch (_) { return null } // checagem best-effort; se falhar, segue o fluxo normal (insere linha nova)
}

async function handleCadastrar(body, request, env) {
  const cad = body.cadastro || {}
  if (!cad.nome || !cad.email) return json({ error: 'Dados incompletos' }, 400)
  const nowIso = new Date().toISOString()

  const idExistente = await findLinhaExistente(env, cad.email, body.safra)
  const isReturning = !!idExistente
  let id = idExistente || body.calcId || null

  if (!id) {
    // Sem calcId nem linha anterior nesta safra — insere a linha completa agora pra não perder o lead.
    id = await insertRow(await payloadToCols(body, request, env), env)
  } else if (isReturning) {
    // Achou submissão anterior deste e-mail na mesma safra — atualiza os dados de produção/resultado
    // também (o produtor pode ter recalculado com números diferentes desta vez).
    const cols = await payloadToCols(body, request, env)
    const keys = Object.keys(cols)
    const sql = `UPDATE calculadora_diagnosticos SET ${keys.map((k) => `${k}=?`).join(',')} WHERE id=?`
    await env.DB.prepare(sql).bind(...keys.map((k) => (cols[k] === undefined ? null : cols[k])), id).run()
  }

  if (id) {
    await env.DB.prepare(
      'UPDATE calculadora_diagnosticos SET nome=?, email=?, whatsapp=?, consent_lgpd=1, consent_at=?, interesse_gestao=?, updated_at=? WHERE id=?'
    ).bind(cad.nome, cad.email, cad.whatsapp || null, nowIso, body.interesse_gestao ? 1 : 0, nowIso, id).run()
  }

  if (env.RESEND_API_KEY) {
    try { await sendEmail(env, body, isReturning) } catch (_) { /* e-mail é best-effort; o lead já está no D1 */ }
  }

  const r = body.resultado || {}
  const ranking = await computeRanking(env, (r.headline && r.headline.cultura) || null, (body.local && body.local.uf) || null, num(r.margem_conjunta_ha))
  return json({ success: true, id, isReturning, ranking })
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

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;background:#F8F6F1;">
      <div style="background:#1E4D7B;padding:24px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:20px;">${isReturning ? 'Lead atualizou os dados (mesma safra)' : 'Novo lead'} — Calculadora de Margem</h1>
      </div>
      <div style="padding:24px;background:#fff;">
        ${isReturning ? `<p style="margin:0 0 14px;padding:10px 14px;background:#FFF7E6;border-left:3px solid #E8B84B;color:#8a5a10;font-size:13px;font-weight:600;">Este e-mail já tinha calculado nesta safra — os dados abaixo são a versão mais recente, não um lead novo.</p>` : ''}
        <div style="background:#7AB648;color:#fff;display:inline-block;padding:6px 16px;border-radius:20px;font-size:13px;font-weight:700;">
          ${esc(diag)} · Margem ${fmtBRL(r.margem_conjunta_ha)}/ha · Lead ${esc(leadQ)}
        </div>
        ${bloco('Contato', [
          linha('Nome', cad.nome), linha('E-mail', cad.email), linha('WhatsApp', cad.whatsapp),
          linha('Estado', local.uf), linha('Cidade', local.cidade), linha('Safra', body.safra),
        ])}
        ${bloco('Lavoura (por cultura)', culturasLinhas)}
        ${bloco('Resultado dos grãos', [
          linha('Margem bruta conjunta', `${fmtBRL(r.margem_conjunta_ha)}/ha`),
          linha('Resultado total', fmtBRL(r.resultado_graos)),
          linha('vs. média do estado', r.pct_vs_estado_ponderado == null ? '' : `${r.pct_vs_estado_ponderado > 0 ? '+' : ''}${Math.round(r.pct_vs_estado_ponderado)}%`),
          linha('Diagnóstico', diag),
          linha('Interesse em gestão', body.interesse_gestao ? 'SIM ✅' : 'não'),
        ])}
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
        <p style="color:#fff;margin:0;font-size:12px;">Fluxo Rural · Calculadora de Margem</p>
      </div>
    </div>`

  const subject = isReturning
    ? `🔄 Lead atualizado (mesma safra): ${primeiroNome || 'produtor'} — ${diag} · ${fmtBRL(r.margem_conjunta_ha)}/ha`
    : `🌾 Lead calculadora: ${primeiroNome || 'produtor'} — ${diag} · ${fmtBRL(r.margem_conjunta_ha)}/ha`
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: TO, reply_to: cad.email, subject, html }),
  })
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
      case 'cadastrar': return await handleCadastrar(body, request, env)
      case 'avaliar': return await handleAvaliar(body, env)
      case 'interesse': return await handleInteresse(body, env)
      default: return json({ error: 'Ação desconhecida' }, 400)
    }
  } catch (err) {
    return json({ error: 'Erro interno', detail: String(err) }, 500)
  }
}
