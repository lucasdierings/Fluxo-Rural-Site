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

/** Lê a atribuição da query string atual (UTMs + click ids). Usada só para
 *  enriquecer o payload do lead (e-mail/planilha) — o dashboard GA4 já amarra
 *  source/medium/região automaticamente por sessão. */
export function readAttribution(): Attribution {
  const empty: Attribution = {
    utm_source: '', utm_medium: '', utm_campaign: '', utm_term: '',
    utm_content: '', gclid: '', fbclid: '', origem: 'site',
  }
  if (typeof window === 'undefined') return empty
  const p = new URLSearchParams(window.location.search)
  const get = (k: string) => p.get(k) || ''
  const utm_source = get('utm_source')
  return {
    utm_source,
    utm_medium: get('utm_medium'),
    utm_campaign: get('utm_campaign'),
    utm_term: get('utm_term'),
    utm_content: get('utm_content'),
    gclid: get('gclid'),
    fbclid: get('fbclid'),
    origem: utm_source ? `ads-${utm_source}` : 'site',
  }
}
