// Helper único de tracking do site Fluxo Rural (leads + CTAs).
//
// REGRA DE OURO (anti-duplicação): eventos de LEAD vão por gtag (→ GA4) E por
// dataLayer.push (→ GTM → conversão Google Ads) ao mesmo tempo. Para NÃO contar 2x,
// o container GTM-NG4CVQ38 NÃO pode ter nenhuma tag "GA4 Event" escutando esses
// eventos — o GA4 recebe só pelo gtag; o GTM só dispara conversão do Google Ads.
//
// PII (nome/email/telefone) NUNCA passa por aqui — só parâmetros não-sensíveis
// (form_location, interesse, perfil, origem, page, cta, local). PII vai apenas no
// corpo do fetch para o backend.

type AnalyticsWindow = {
  gtag?: (...args: unknown[]) => void
  dataLayer?: Record<string, unknown>[]
}

const PII_KEYS = new Set([
  'nome',
  'name',
  'first_name',
  'last_name',
  'email',
  'mail',
  'whatsapp',
  'telefone',
  'phone',
  'celular',
  'cpf',
  'cnpj',
  'rg',
  'endereco',
  'address',
  'rua',
  'street',
  'cep',
  'zip',
])

function sanitizeParams(params: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(params)) {
    if (!PII_KEYS.has(key.toLowerCase())) {
      clean[key] = value
    }
  }
  return clean
}

/** Lead/conversão: dispara no GA4 (gtag) e no GTM (dataLayer) de uma vez.
 *  Garante estritamente ZERO PII enviado para analytics. */
export function trackLead(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  const safeParams = sanitizeParams(params)
  const w = window as unknown as AnalyticsWindow
  w.gtag?.('event', event, safeParams)
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event, ...safeParams })
}

/** Rastreia visualização de etapa no diagnóstico interativo (Zero PII). */
export function trackDiagnosticoStepView(stepNumber: number, stepName: string) {
  trackLead('diagnostico_step_view', {
    form_location: 'diagnostico',
    step_number: stepNumber,
    step_name: stepName,
  })
}

/** Rastreia conclusão e avanço de etapa no diagnóstico interativo (Zero PII). */
export function trackDiagnosticoStepComplete(stepNumber: number, stepName: string) {
  trackLead('diagnostico_step_complete', {
    form_location: 'diagnostico',
    step_number: stepNumber,
    step_name: stepName,
  })
}

/** Rastreia envio com sucesso do diagnóstico completo (Zero PII). */
export function trackDiagnosticoSubmit(params: {
  score: number
  qualificationLevel: string
  origem?: string
}) {
  trackLead('diagnostico_submit', {
    form_location: 'diagnostico',
    perfil: 'produtor',
    score: params.score,
    nivel: params.qualificationLevel,
    origem: params.origem || 'site',
  })
}

/** Rastreia clique no CTA direto do WhatsApp na tela de sucesso (Zero PII). */
export function trackDiagnosticoWhatsAppDirect() {
  trackLead('diagnostico_whatsapp_direct', {
    form_location: 'diagnostico_sucesso',
  })
}

/** Micro-conversão de clique em CTA de navegação: SÓ GA4 (sem dataLayer, pra não
 *  acionar tag de conversão do GTM por engano). Sempre emite o evento 'cta_click'. */
export function trackCta(params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  const w = window as unknown as AnalyticsWindow
  w.gtag?.('event', 'cta_click', params)
}

export interface Attribution {
  utm_source: string
  utm_medium: string
  utm_campaign: string
  utm_term: string
  utm_content: string
  gclid: string
  fbclid: string
  /** Rótulo curto do canal: 'ads-<source>' só quando é mídia PAGA de verdade,
   *  '<source>' quando é orgânico, 'site' quando não há atribuição nenhuma. */
  origem: string
}

/** Mediums que caracterizam mídia paga. `social` fica de fora: é o medium do
 *  tráfego orgânico de rede social (post, story, link da bio). */
const MEDIUM_PAGO = ['cpc', 'ppc', 'paid', 'ads', 'paidsocial', 'paid-social', 'display']

/** Rótulo do canal a partir da atribuição crua.
 *
 *  Até 05/08/2026 qualquer `utm_source` virava `ads-<source>`, então o link
 *  orgânico da bio chegava no e-mail interno como "ads-instagram" — o Lucas
 *  lendo aquilo acharia que pagou pelo lead. Agora o prefixo `ads-` exige click
 *  id (gclid/fbclid) ou medium explicitamente pago. */
function rotuloOrigem(source: string, medium: string, gclid: string, fbclid: string): string {
  if (!source) return gclid || fbclid ? 'ads-desconhecido' : 'site'
  const pago = !!gclid || !!fbclid || MEDIUM_PAGO.includes(medium.toLowerCase())
  return pago ? `ads-${source}` : source
}

const ATTR_COOKIE = 'fr_attr'
const ATTR_DIAS = 90

const ATTR_VAZIA: Attribution = {
  utm_source: '', utm_medium: '', utm_campaign: '', utm_term: '',
  utm_content: '', gclid: '', fbclid: '', origem: 'site',
}

function daQueryString(): Attribution | null {
  const p = new URLSearchParams(window.location.search)
  const get = (k: string) => p.get(k) || ''
  const attr: Attribution = {
    utm_source: get('utm_source'),
    utm_medium: get('utm_medium'),
    utm_campaign: get('utm_campaign'),
    utm_term: get('utm_term'),
    utm_content: get('utm_content'),
    gclid: get('gclid'),
    fbclid: get('fbclid'),
    origem: rotuloOrigem(get('utm_source'), get('utm_medium'), get('gclid'), get('fbclid')),
  }
  const temAlgo = Object.entries(attr).some(([k, v]) => k !== 'origem' && v)
  return temAlgo ? attr : null
}

function doCookie(): Attribution | null {
  const bruto = document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${ATTR_COOKIE}=`))
    ?.slice(ATTR_COOKIE.length + 1)
  if (!bruto) return null
  try {
    const attr = { ...ATTR_VAZIA, ...JSON.parse(decodeURIComponent(bruto)) } as Attribution
    // `origem` é RECALCULADO, nunca lido do cookie: o cookie dura 90 dias, e os
    // que foram gravados antes de 05/08/2026 têm o rótulo antigo (todo tráfego
    // com utm_source virava "ads-*", inclusive orgânico). Recalcular faz o
    // cookie velho se corrigir sozinho na próxima leitura.
    attr.origem = rotuloOrigem(attr.utm_source, attr.utm_medium, attr.gclid, attr.fbclid)
    return attr
  } catch {
    return null
  }
}

/** Grava a atribuição do PRIMEIRO toque num cookie primário de 90 dias.
 *
 *  Sem isso, quem clica no anúncio e cai na home converte em /diagnostico ou
 *  /contato sem query string nenhuma: o lead chega "orgânico" e a campanha que
 *  pagou por ele não recebe crédito. Roda a cada pageview, mas só escreve na
 *  primeira vez — primeiro toque não é sobrescrito por navegação interna.
 *
 *  Cookie primário (não é third-party), sem PII, só canal de origem. */
export function captureAttribution() {
  if (typeof window === 'undefined') return
  const atual = daQueryString()
  if (!atual) return
  if (doCookie()) return
  const expira = new Date(Date.now() + ATTR_DIAS * 864e5).toUTCString()
  const seguro = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie =
    `${ATTR_COOKIE}=${encodeURIComponent(JSON.stringify(atual))}` +
    `; path=/; expires=${expira}; SameSite=Lax${seguro}`
}

/** Lê a atribuição do lead: query string da página atual quando existe, senão o
 *  cookie de primeiro toque. Usada só para enriquecer o payload do lead
 *  (e-mail/CRM) — o dashboard GA4 já amarra source/medium/região por sessão. */
export function readAttribution(): Attribution {
  if (typeof window === 'undefined') return ATTR_VAZIA
  return daQueryString() || doCookie() || ATTR_VAZIA
}
