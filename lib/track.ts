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

/** Lead/conversão: dispara no GA4 (gtag) e no GTM (dataLayer) de uma vez. */
export function trackLead(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  const w = window as unknown as AnalyticsWindow
  w.gtag?.('event', event, params)
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event, ...params })
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
  /** ads-<utm_source> quando há utm_source, senão 'site'. */
  origem: string
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
    origem: get('utm_source') ? `ads-${get('utm_source')}` : 'site',
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
    return { ...ATTR_VAZIA, ...JSON.parse(decodeURIComponent(bruto)) } as Attribution
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
