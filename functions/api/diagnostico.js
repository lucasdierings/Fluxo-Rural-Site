// Cloudflare Pages Function — POST /api/diagnostico
// Recebe o lead do diagnóstico de 9 passos do produtor rural, calcula o lead score (0-100),
// empurra pro CRM com observação técnica enriquecida e envia e-mail transacional via Resend.
// Requer as variáveis FLUXO_INGEST_TOKEN e RESEND_API_KEY no Cloudflare Pages.

import { pushCrm, atribuicao, canalOrigem, idEstavel } from '../_lib/crm.js'
import { esc, linha, bloco } from '../_lib/email.js'

const TO = 'lucasdierings12@gmail.com'
const FROM = 'Fluxo Rural <contato@fluxorural.com.br>'

export const NIVEIS = {
  verde: {
    emoji: '🟢',
    label: 'QUENTE',
    prioridade: 'ALTA (SLA < 2h)',
    badgeBg: '#112240',
    badgeBorder: '#4ADE80',
    badgeText: '#4ADE80',
    headerCor: '#1B4F7A',
  },
  amarelo: {
    emoji: '🟡',
    label: 'MORNO',
    prioridade: 'MÉDIA (SLA < 24h)',
    badgeBg: '#112240',
    badgeBorder: '#E8B84B',
    badgeText: '#E8B84B',
    headerCor: '#1B4F7A',
  },
  laranja: {
    emoji: '🟠',
    label: 'FRIO',
    prioridade: 'BAIXA',
    badgeBg: '#112240',
    badgeBorder: '#F97316',
    badgeText: '#F97316',
    headerCor: '#1B4F7A',
  },
  vermelho: {
    emoji: '🔴',
    label: 'MUITO FRIO',
    prioridade: 'NUTRIÇÃO',
    badgeBg: '#112240',
    badgeBorder: '#EF4444',
    badgeText: '#EF4444',
    headerCor: '#1B4F7A',
  },
}

// Rótulos amigáveis para métricas do agronegócio
const LABELS_ATIVIDADE = {
  graos: 'Grãos & Culturas Anuais (Soja, milho, trigo, etc.)',
  pecuaria_corte: 'Pecuária de Corte (Cria, recria, engorda)',
  pecuaria_leite: 'Pecuária de Leite (Intensiva ou a pasto)',
  hortifruti_cafe: 'Café, Frutas ou Hortifrúti',
  mista: 'Operação Mista / Diversificada',
  outra: 'Outra Atividade Agro',
  // Legado
  pecuaria: 'Pecuária',
  hortifruti: 'Hortaliças, frutas ou café',
}

const LABELS_AREA = {
  '<100ha': 'Até 100 hectares (Pequena propriedade)',
  '100-500ha': 'De 100 a 500 hectares (Média operação familiar)',
  '500-2000ha': 'De 500 a 2.000 hectares (Médio a grande porte)',
  '>2000ha': 'Mais de 2.000 hectares (Grande escala / Grupo)',
  'nao-aplica': 'Área não se aplica (Intensivo / Agroindústria)',
  // Legado
  '<50ha': 'Até 50 hectares',
  '50-200ha': 'De 50 a 200 hectares',
  '200-500ha': 'De 200 a 500 hectares',
  '>500ha': 'Mais de 500 hectares',
}

const LABELS_GESTAO = {
  erp_software: 'Software de Gestão Rural / ERP',
  planilhas: 'Planilhas Estruturadas (Excel / Google Sheets)',
  caderno_basico: 'Controles Básicos / Caderno / Bloco',
  nenhuma: 'Sem Controles Formais (Memória / Extrato)',
  // Legado
  'Sim, estruturada': 'Sim, estruturada',
  'Parcialmente (planilhas)': 'Parcialmente (planilhas)',
  Básico: 'Básico',
  Nenhuma: 'Nenhuma',
}

const LABELS_DESAFIO = {
  custos_margem: 'Controle de Custos & Margem Real',
  fluxo_caixa: 'Previsibilidade de Fluxo de Caixa',
  endividamento: 'Gestão de Dívidas & Custeio Bancário',
  sucessao: 'Sucessão Familiar & Governança',
  investimentos: 'Decisão de Investimento / Expansão',
  nao_sei: 'Avaliação Geral / Não sei por onde começar',
  // Legado
  'Gestão financeira': 'Gestão financeira',
  'Fluxo de caixa': 'Fluxo de caixa',
  Dívidas: 'Dívidas',
  'Sucessão familiar': 'Sucessão familiar',
  Crescimento: 'Crescimento',
  Inovação: 'Inovação',
  'Não sei por onde começar': 'Não sei por onde começar',
}

const LABELS_FATURAMENTO = {
  '<500k': 'Até R$ 500 mil / ano',
  '500k-2M': 'De R$ 500 mil a R$ 2 milhões / ano',
  '2M-5M': 'De R$ 2 milhões a R$ 5 milhões / ano',
  '5M-20M': 'De R$ 5 milhões a R$ 20 milhões / ano',
  '>20M': 'Mais de R$ 20 milhões / ano',
  prefiro_nao_informar: 'Prefiro não informar',
  'prefiro-nao-informar': 'Prefiro não informar',
  // Legado
  '<100k': 'Até R$ 100 mil / ano',
  '100k-500k': 'De R$ 100 mil a R$ 500 mil / ano',
  '500k-1M': 'De R$ 500 mil a R$ 1 milhão / ano',
  '1M-5M': 'De R$ 1 milhão a R$ 5 milhões / ano',
  '>5M': 'Mais de R$ 5 milhões / ano',
}

const LABELS_URGENCIA = {
  '30_dias': 'Nos próximos 30 dias (Ação imediata)',
  '3_meses': 'Neste trimestre (próximos 3 meses)',
  ate_fim_ano: 'Até o final do ano / Próximo ciclo',
  sem_pressa: 'Apenas conhecendo a consultoria',
  // Legado
  'Próximos 30 dias': 'Próximos 30 dias',
  'Próximos 3 meses': 'Próximos 3 meses',
  'Até fim do ano': 'Até fim do ano',
  'Sem pressa': 'Sem pressa',
}

// Algoritmo de Lead Scoring em 5 dimensões (0 a 100 pontos)
const PONTOS_FATURAMENTO = {
  '>20M': 25,
  '5M-20M': 22,
  '2M-5M': 18,
  '500k-2M': 12,
  prefiro_nao_informar: 10,
  'prefiro-nao-informar': 10,
  '<500k': 5,
  '>5M': 20,
  '1M-5M': 18,
  '500k-1M': 13,
  '100k-500k': 8,
  '<100k': 5,
}

const PONTOS_URGENCIA = {
  '30_dias': 25,
  '3_meses': 18,
  ate_fim_ano: 8,
  sem_pressa: 2,
  'Próximos 30 dias': 25,
  'Próximos 3 meses': 18,
  'Até fim do ano': 8,
  'Sem pressa': 2,
}

const PONTOS_DESAFIO = {
  endividamento: 20,
  fluxo_caixa: 18,
  custos_margem: 17,
  sucessao: 16,
  investimentos: 14,
  nao_sei: 12,
  Dívidas: 20,
  'Fluxo de caixa': 18,
  'Gestão financeira': 17,
  'Sucessão familiar': 16,
  Crescimento: 14,
  Inovação: 14,
  'Não sei por onde começar': 12,
}

const PONTOS_AREA = {
  '>2000ha': 15,
  '500-2000ha': 13,
  '100-500ha': 10,
  'nao-aplica': 8,
  '<100ha': 5,
  '>500ha': 13,
  '200-500ha': 10,
  '50-200ha': 8,
  '<50ha': 5,
}

const PONTOS_GESTAO = {
  nenhuma: 15,
  caderno_basico: 12,
  planilhas: 8,
  erp_software: 5,
  Nenhuma: 15,
  Básico: 12,
  'Parcialmente (planilhas)': 8,
  'Sim, estruturada': 5,
}

export function calcularScore(data) {
  const fat = data.faturamento_anual || data.faturamento
  const urg = data.urgencia
  const des = data.desafio_principal || data.desafios || data.desafio
  const area = data.area_ha || data.hectares
  const ges = data.gestao_atual || data.gestao

  const ptsFat = (fat && PONTOS_FATURAMENTO[fat]) != null ? PONTOS_FATURAMENTO[fat] : 0
  const ptsUrg = (urg && PONTOS_URGENCIA[urg]) != null ? PONTOS_URGENCIA[urg] : 0
  const ptsDes = (des && PONTOS_DESAFIO[des]) != null ? PONTOS_DESAFIO[des] : 0
  const ptsArea = (area && PONTOS_AREA[area]) != null ? PONTOS_AREA[area] : 0
  const ptsGes = (ges && PONTOS_GESTAO[ges]) != null ? PONTOS_GESTAO[ges] : 0

  const scoreBruto = ptsFat + ptsUrg + ptsDes + ptsArea + ptsGes
  const scoreMax = 100
  const score = Math.min(100, Math.max(0, Math.round((scoreBruto / scoreMax) * 100)))

  let qualificationLevel = 'vermelho'
  if (score >= 70) {
    qualificationLevel = 'verde'
  } else if (score >= 50) {
    qualificationLevel = 'amarelo'
  } else if (score >= 30) {
    qualificationLevel = 'laranja'
  } else {
    qualificationLevel = 'vermelho'
  }

  return { score, scoreBruto, scoreMax, qualificationLevel }
}

function buildEmail(data, scoreResult) {
  const nivel = NIVEIS[scoreResult.qualificationLevel] || {
    emoji: '⚪',
    label: scoreResult.qualificationLevel || '—',
    prioridade: '?',
    badgeBg: '#112240',
    badgeBorder: '#4ADE80',
    badgeText: '#4ADE80',
  }

  const atividadeRotulo = LABELS_ATIVIDADE[data.atividade] || data.atividade || 'Não informado'
  const areaRotulo = LABELS_AREA[data.area_ha || data.hectares] || data.area_ha || data.hectares || 'Não informado'
  const gestaoRotulo = LABELS_GESTAO[data.gestao_atual || data.gestao] || data.gestao_atual || data.gestao || 'Não informado'
  const desafioRotulo = LABELS_DESAFIO[data.desafio_principal || data.desafios || data.desafio] || data.desafio_principal || data.desafios || 'Não informado'
  const faturamentoRotulo = LABELS_FATURAMENTO[data.faturamento_anual || data.faturamento] || data.faturamento_anual || data.faturamento || 'Não informado'
  const urgenciaRotulo = LABELS_URGENCIA[data.urgencia] || data.urgencia || 'Não informado'

  const contatoBloco = bloco('Contato & Localização', [
    linha('Nome', data.nome),
    linha('WhatsApp', data.whatsapp),
    linha('E-mail', data.email),
    linha('Estado (UF)', data.estado),
    linha('Município', data.cidade),
    linha('Propriedade / Fazenda', data.nome_propriedade || data.empresa || 'Não informado'),
  ])

  const operacaoBloco = bloco('Perfil da Operação', [
    linha('Atividade Principal', atividadeRotulo),
    linha('Área / Dimensão', areaRotulo),
    linha('Faturamento Anual', faturamentoRotulo),
  ])

  const gestaoBloco = bloco('Gestão & Desafios', [
    linha('Gestão Atual', gestaoRotulo),
    linha('Principal Gargalo', desafioRotulo),
    linha('Detalhamento do Desafio', data.detalhe_desafio),
    linha('Previsão de Ação (Urgência)', urgenciaRotulo),
  ])

  const scoringBloco = bloco('Qualificação & SLA Comercial', [
    linha('Pontuação de Maturidade', `${scoreResult.score}/100 pontos`),
    linha('Classificação Térmica', `${nivel.emoji} ${nivel.label}`),
    linha('Prioridade de Atendimento', nivel.prioridade),
  ])

  const trackingBloco = bloco('Tracking & Origem', [
    linha('Canal / Origem', data.origem || 'site'),
    linha('UTM Source', data.utm_source),
    linha('UTM Medium', data.utm_medium),
    linha('UTM Campaign', data.utm_campaign),
    linha('URL da Página', data.page_url),
  ])

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;background:#F8F6F1;">
      <div style="background:#1B4F7A;padding:26px;text-align:center;">
        <h1 style="color:#FFFFFF;margin:0;font-size:22px;letter-spacing:-0.3px;">Novo Diagnóstico — Produtor Rural</h1>
      </div>
      <div style="padding:26px;background:#FFFFFF;">
        <div style="background:${nivel.badgeBg};border:2px solid ${nivel.badgeBorder};color:${nivel.badgeText};display:inline-block;padding:8px 20px;border-radius:24px;font-size:14px;font-weight:700;margin-bottom:12px;">
          ${nivel.emoji} ${esc(nivel.label)} — Score ${scoreResult.score}/100 · Prioridade ${esc(nivel.prioridade)}
        </div>
        ${contatoBloco}
        ${operacaoBloco}
        ${gestaoBloco}
        ${scoringBloco}
        ${trackingBloco}
      </div>
      <div style="background:#1B4F7A;padding:14px;text-align:center;">
        <p style="color:#FFFFFF;margin:0;font-size:12px;">Fluxo Rural Consultoria · Inteligência e Gestão Agro</p>
      </div>
    </div>`
}

function buildEmailParcial(data) {
  const contato = bloco('Contato', [
    linha('Nome', data.nome),
    linha('E-mail', data.email),
    linha('WhatsApp', data.whatsapp),
    linha('Propriedade / Fazenda', data.nome_propriedade || data.empresa),
    linha('Estado', data.estado),
    linha('Município', data.cidade),
  ])
  const tracking = bloco('Tracking', [
    linha('Origem', data.origem),
    linha('UTM source', data.utm_source),
    linha('UTM medium', data.utm_medium),
    linha('UTM campaign', data.utm_campaign),
  ])
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;background:#F8F6F1;">
      <div style="background:#6AAF3D;padding:24px;text-align:center;">
        <h1 style="color:#FFFFFF;margin:0;font-size:20px;">Novo Lead — Produtor Rural (Parcial)</h1>
      </div>
      <div style="padding:24px;background:#FFFFFF;">
        <p style="margin:0 0 14px;color:#1C1C1C;font-size:14px;">Contato capturado na etapa inicial (o produtor ainda não completou as 9 etapas).</p>
        ${contato}
        ${tracking}
      </div>
      <div style="background:#1B4F7A;padding:14px;text-align:center;">
        <p style="color:#FFFFFF;margin:0;font-size:12px;">Fluxo Rural Consultoria</p>
      </div>
    </div>`
}

async function empurrarParaCrm(env, data, scoreResult) {
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
    parcial ? 'parcial' : 'completo',
    data.email,
    data.whatsapp,
    data.perfil || 'produtor',
  ])

  const atividade = LABELS_ATIVIDADE[data.atividade] || data.atividade || null
  const area = LABELS_AREA[data.area_ha || data.hectares] || data.area_ha || data.hectares || null
  const gestao = LABELS_GESTAO[data.gestao_atual || data.gestao] || data.gestao_atual || data.gestao || null
  const desafio = LABELS_DESAFIO[data.desafio_principal || data.desafios || data.desafio] || data.desafio_principal || data.desafios || null
  const faturamento = LABELS_FATURAMENTO[data.faturamento_anual || data.faturamento] || data.faturamento_anual || data.faturamento || null
  const urgencia = LABELS_URGENCIA[data.urgencia] || data.urgencia || null

  const obsPartes = parcial
    ? ['Produtor rural (contato inicial, incompleto)']
    : [
        'Produtor rural',
        `nível ${scoreResult.qualificationLevel}`,
        `score ${scoreResult.score}/100`,
        atividade ? `Atividade: ${atividade}` : null,
        area ? `Área: ${area}` : null,
        gestao ? `Gestão: ${gestao}` : null,
        desafio ? `Desafio: ${desafio}` : null,
        data.detalhe_desafio ? `Detalhe: ${data.detalhe_desafio}` : null,
        faturamento ? `Faturamento: ${faturamento}` : null,
        urgencia ? `Urgência: ${urgencia}` : null,
        data.cidade ? `Município: ${data.cidade}` : null,
        data.estado ? `UF: ${data.estado}` : null,
        data.nome_propriedade ? `Fazenda: ${data.nome_propriedade}` : null,
      ].filter(Boolean)

  const resultado = await pushCrm(env, {
    source: 'site-diagnostico',
    external_id: externalId,
    contato: {
      nome: data.nome,
      email: data.email || null,
      whatsapp: data.whatsapp || null,
      uf: data.estado || null,
      cidade: data.cidade || null,
      empresa: data.nome_propriedade || data.empresa || null,
      interesse: parcial
        ? 'Diagnóstico (contato, ainda sem responder)'
        : `Diagnóstico produtor — nível ${scoreResult.qualificationLevel}`,
      ...atribuicao(tracking),
    },
    negocio: parcial
      ? undefined
      : {
          produto: 'consultoria',
          etapa: 'novo',
          origem: canalOrigem(tracking, 'diagnostico'),
          obs: obsPartes.join(' · '),
        },
    evento: {
      tipo: 'form_submit',
      meta: {
        form: parcial ? 'diagnostico-parcial' : 'diagnostico-completo',
        perfil: data.perfil || 'produtor',
        score: scoreResult.score,
        nivel: scoreResult.qualificationLevel,
        atividade: data.atividade || null,
        area_ha: data.area_ha || data.hectares || null,
        gestao_atual: data.gestao_atual || data.gestao || null,
        desafio_principal: data.desafio_principal || data.desafios || null,
        faturamento_anual: data.faturamento_anual || data.faturamento || null,
        urgencia: data.urgencia || null,
        cidade: data.cidade || null,
        estado: data.estado || null,
      },
    },
  })

  return { ...resultado, externalId }
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

    if (
      !data ||
      !data.nome ||
      String(data.nome).trim().length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email || '').trim()) ||
      String(data.whatsapp || '').replace(/\D/g, '').length < 10
    ) {
      return new Response(JSON.stringify({ ok: false, error: 'Dados de contato incompletos ou inválidos.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (data.perfil && data.perfil !== 'produtor') {
      return new Response(
        JSON.stringify({ ok: false, error: 'Este diagnóstico é destinado a produtores rurais.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const isCompleto = data.etapa !== 'contato'

    if (isCompleto) {
      const atividade = data.atividade
      const area = data.area_ha || data.hectares
      const gestao = data.gestao_atual || data.gestao
      const desafio = data.desafio_principal || data.desafios || data.desafio
      const faturamento = data.faturamento_anual || data.faturamento
      const urgencia = data.urgencia
      const estado = data.estado

      const obrigatorios = [atividade, area, gestao, desafio, faturamento, urgencia, estado]
      if (obrigatorios.some((valor) => !String(valor || '').trim())) {
        return new Response(
          JSON.stringify({ ok: false, error: 'Complete todas as perguntas obrigatórias do diagnóstico.' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }
    }

    // Calcula o lead scoring de 100 pontos e nível térmico
    const scoreResult = calcularScore(data)

    // O CRM é a fonte da verdade do funil comercial
    const crm = await empurrarParaCrm(env, data, scoreResult)
    if (!crm.ok) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Não foi possível registrar o diagnóstico no CRM. Tente novamente.',
          crm: crm.motivo,
        }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Sem Resend configurado em preview/dev: confirma sucesso do CRM com status
    if (!env.RESEND_API_KEY) {
      return new Response(
        JSON.stringify({
          ok: true,
          success: true,
          crm: true,
          email: false,
          score: scoreResult.score,
          qualificationLevel: scoreResult.qualificationLevel,
          submissionId: crm.externalId,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    const primeiroNome = String(data.nome).trim().split(' ')[0]
    const tag = '🌾 Produtor'
    const nivel = NIVEIS[scoreResult.qualificationLevel] || { emoji: '🟢', label: 'QUENTE' }

    let subject
    let html
    if (!isCompleto) {
      subject = `🆕 Lead parcial (${tag}): ${primeiroNome}${data.nome_propriedade ? ' — ' + data.nome_propriedade : ''}`
      html = buildEmailParcial(data)
    } else {
      subject = `${nivel.emoji} Novo Diagnóstico (${tag}): ${primeiroNome} — ${nivel.label} · Score ${scoreResult.score}/100`
      html = buildEmail(data, scoreResult)
    }

    let emailSent = false
    try {
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
      emailSent = resp.ok
      if (!resp.ok) {
        const detail = await resp.text().catch(() => '')
        console.error('Resend recusou diagnóstico:', resp.status, detail)
      }
    } catch (err) {
      console.error('Resend indisponível no diagnóstico:', String(err))
    }

    return new Response(
      JSON.stringify({
        ok: true,
        success: true,
        crm: true,
        email: emailSent,
        score: scoreResult.score,
        qualificationLevel: scoreResult.qualificationLevel,
        submissionId: crm.externalId,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Erro interno no processamento', detail: String(err) }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
