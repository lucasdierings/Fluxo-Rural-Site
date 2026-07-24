// Push de leads do site para o CRM (banco fluxo_crm, projeto fluxo-rural-crm).
//
// Best-effort por princípio: o CRM fora do ar não pode quebrar a captura do lead
// nem atrasar a resposta ao produtor. Por isso pushCrm() NUNCA lança, e todo
// chamador envolve a chamada em ctx.waitUntil() — o fetch sobrevive à resposta
// que já foi entregue ao navegador.
//
// Variáveis no Cloudflare Pages (Settings → Environment variables):
//   FLUXO_INGEST_TOKEN  segredo — mesmo valor do projeto fluxo-rural-crm
//   CRM_INGEST_URL      opcional — trocar quando crm.fluxorural.com.br subir
//
// Sem FLUXO_INGEST_TOKEN configurado o push vira no-op silencioso (o lead segue
// pelo e-mail/D1 de sempre): preview e local não precisam do segredo pra rodar.

const CRM_INGEST_PADRAO = 'https://fluxo-rural-crm.pages.dev/api/ingest'

/** Envia um envelope de ingest ao CRM. Resolve sempre — erro só vira log. */
export async function pushCrm(env, payload) {
  if (!env || !env.FLUXO_INGEST_TOKEN) {
    console.warn('[crm] FLUXO_INGEST_TOKEN ausente — push ignorado', payload && payload.source)
    return { ok: false, motivo: 'sem_token' }
  }
  const url = env.CRM_INGEST_URL || CRM_INGEST_PADRAO
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Fluxo-Token': env.FLUXO_INGEST_TOKEN,
      },
      body: JSON.stringify(payload),
    })
    if (!resp.ok) {
      const detail = await resp.text().catch(() => '')
      console.error('[crm] ingest recusou', resp.status, detail.slice(0, 300))
      return { ok: false, motivo: 'http_' + resp.status }
    }
    return { ok: true }
  } catch (err) {
    console.error('[crm] ingest falhou', String(err))
    return { ok: false, motivo: 'fetch_erro' }
  }
}

/** Monta o bloco de atribuição que o /api/ingest grava em primeiro/ultimo_toque. */
export function atribuicao(tr = {}, landingUrl = null) {
  const utm = {
    source: tr.utm_source || null,
    medium: tr.utm_medium || null,
    campaign: tr.utm_campaign || null,
    term: tr.utm_term || null,
    content: tr.utm_content || null,
  }
  const temUtm = Object.values(utm).some(Boolean)
  return {
    utm: temUtm ? utm : null,
    gclid: tr.gclid || null,
    fbclid: tr.fbclid || null,
    ttclid: tr.ttclid || null,
    landing_url: landingUrl || tr.page_url || tr.landing_url || null,
  }
}

/** Canal de origem (id de canais_origem). Mídia paga vence o canal do formulário:
 *  saber que o lead veio do Ads importa mais do que saber em qual form ele caiu —
 *  o formulário já aparece em negocios.produto e no evento. */
export function canalOrigem(tr = {}, padrao = 'site') {
  if (tr.gclid) return 'google-ads'
  if (tr.fbclid) return 'meta-ads'
  if (tr.ttclid) return 'tiktok-ads'
  const s = String(tr.utm_source || '').toLowerCase()
  if (s.includes('google') || s.includes('gads') || s.includes('adwords')) return 'google-ads'
  if (s.includes('facebook') || s.includes('instagram') || s.includes('meta')) return 'meta-ads'
  if (s.includes('tiktok')) return 'tiktok-ads'
  if (s.includes('youtube')) return 'youtube'
  return padrao
}

/** external_id estável para formulários sem id próprio no banco.
 *  Inclui o DIA: reenvio idêntico no mesmo dia (duplo clique, refresh) é o mesmo
 *  lead; a mesma pessoa mandando a mesma mensagem semanas depois é lead novo. */
export async function idEstavel(prefixo, partes) {
  const dia = new Date().toISOString().slice(0, 10)
  const base = [dia, ...partes.map((p) => String(p == null ? '' : p).trim().toLowerCase())].join('|')
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(base))
  const hex = [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
  return `${prefixo}:${hex.slice(0, 24)}`
}
