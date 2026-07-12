// Fluxo Rural — Calculadora de Margem por Hectare.
// Fase 1 (Round 2): wizard guiado + culturas individuais (array). Cálculo 100% no navegador (benchmark-inicial.json).
// Fase 2 (futura): apiCalcular/apiCadastrar/apiAvaliar passam a chamar POST /api/calculadora de verdade.

(function () {
  'use strict';

  // ============================================================
  // Constantes
  // ============================================================
  const CATEGORIAS = ['sementes', 'defensivos', 'fertilizantes', 'diesel', 'mao_obra', 'manutencao', 'admin'];
  const CATEGORIA_LABEL = {
    sementes: 'Sementes', defensivos: 'Defensivos', fertilizantes: 'Fertilizantes',
    diesel: 'Diesel / combustível', mao_obra: 'Mão de obra', manutencao: 'Manutenção de máquinas',
    admin: 'Despesas administrativas'
  };
  const CATEGORIA_INPUT_ID = {
    sementes: 'cSementes', defensivos: 'cDefensivos', fertilizantes: 'cFertilizantes',
    diesel: 'cDiesel', mao_obra: 'cMaoObra', manutencao: 'cManutencao', admin: 'cAdmin'
  };
  const CULTURAS_GRAO = ['soja', 'milho', 'trigo']; // wizard: só as que têm benchmark
  const CULTURA_LABEL = { soja: 'Soja', milho: 'Milho', trigo: 'Trigo' };
  const CULTURA_EMOJI = { soja: '🌱', milho: '🌽', trigo: '🌾' };
  const TERRA_LABEL = { propria: 'terra própria', arrendada: 'terra arrendada', mista: 'terra própria + arrendada' };
  const TERRA_LABEL_CURTO = { propria: 'Própria', arrendada: 'Arrendada', mista: 'Própria + arrendada' };
  // Faixa de área — a comparação separa produtores por tamanho de área.
  const FAIXA_AREA_BANDS = [
    { max: 100, label: 'até 100 ha' },
    { max: 200, label: '100–200 ha' },
    { max: 500, label: '200–500 ha' },
    { max: 1000, label: '500–1.000 ha' },
    { max: Infinity, label: 'acima de 1.000 ha' }
  ];
  function faixaAreaLabel(ha) {
    if (!(ha > 0)) return '';
    return (FAIXA_AREA_BANDS.find((b) => ha <= b.max) || FAIXA_AREA_BANDS[FAIXA_AREA_BANDS.length - 1]).label;
  }
  const ATIVIDADE_LABEL = {
    pecuaria_corte: 'Pecuária de corte', pecuaria_leite: 'Pecuária de leite', aves: 'Aves',
    suinos: 'Suínos', peixes: 'Peixes', outra: 'Outra atividade'
  };
  const UF_LIST = [
    ['AC', 'Acre'], ['AL', 'Alagoas'], ['AP', 'Amapá'], ['AM', 'Amazonas'], ['BA', 'Bahia'],
    ['CE', 'Ceará'], ['DF', 'Distrito Federal'], ['ES', 'Espírito Santo'], ['GO', 'Goiás'],
    ['MA', 'Maranhão'], ['MT', 'Mato Grosso'], ['MS', 'Mato Grosso do Sul'], ['MG', 'Minas Gerais'],
    ['PA', 'Pará'], ['PB', 'Paraíba'], ['PR', 'Paraná'], ['PE', 'Pernambuco'], ['PI', 'Piauí'],
    ['RJ', 'Rio de Janeiro'], ['RN', 'Rio Grande do Norte'], ['RS', 'Rio Grande do Sul'],
    ['RO', 'Rondônia'], ['RR', 'Roraima'], ['SC', 'Santa Catarina'], ['SP', 'São Paulo'],
    ['SE', 'Sergipe'], ['TO', 'Tocantins']
  ];

  const STAR_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.7-4.9 4.5 1.3 6.6L12 17.1l-5.9 3.3 1.3-6.6-4.9-4.5 6.6-.7z"/></svg>';
  const ICON_MAGIC = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 2v3M10 15v3M2 10h3M15 10h3M4.5 4.5l2 2M13.5 13.5l2 2M15.5 4.5l-2 2M6.5 13.5l-2 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

  // Passos do wizard (ordem lógica de progresso na barra da Tela 1)
  const STEP_PROGRESS = {
    intro: 0.03, fazenda: 0.12, terra: 0.22, cultura_escolha: 0.34, cultura_producao: 0.48,
    cultura_custos: 0.62, cultura_add: 0.72, divida: 0.86, atividades: 0.96
  };
  const STEP_LABEL = {
    intro: 'Bem-vindo', fazenda: 'Sua fazenda', terra: 'Sua terra', cultura_escolha: 'Sua lavoura',
    cultura_producao: 'Produção', cultura_custos: 'Custos', cultura_add: 'Suas culturas',
    divida: 'Dívida', atividades: 'Outras atividades'
  };

  // ============================================================
  // Estado global (Round 2 — culturas individuais em array)
  // ============================================================
  function novaCultura() {
    return {
      cultura: '', area: null, prod: null, preco: null,
      custo_mode: 'total', // sempre "total gasto por categoria" → convertido p/ R$/ha na conta
      custos: { sementes: null, defensivos: null, fertilizantes: null, diesel: null, mao_obra: null, manutencao: null, admin: null }
    };
  }

  const S = {
    screen: 1,
    tracking: {},
    safra: '2025/2026',
    local: { uf: '', cidade: '' },
    // Perfil de propriedade + arrendamento (passo Terra, logo após a fazenda)
    terra: { tipo: 'propria', ha_proprio: null, ha_arrendado: null, arrend_unidade: 'sc_ha', arrend_valor: 0 },
    culturas: [],       // [{ cultura, area, prod, preco, custo_mode, custos:{...} }]
    editIndex: -1,      // índice da cultura sendo editada no loop
    divida: { tem: false, total: 0, parcela: 0, taxa: null },
    atividades: [],
    cadastro: { nome: '', email: '', whatsapp: '', lgpd: false },
    interesse_gestao: false,
    avisar_media_cidade: false,
    avaliacao: { estrelas: 0, comentario: '' },
    resultado: null,
    calcId: null
  };

  let BENCH = { culturas: {}, nacional: {} };
  let benchReady = false;

  // ============================================================
  // Utilitários
  // ============================================================
  function parseNum(v) {
    if (v === null || v === undefined) return NaN;
    let s = String(v).trim();
    if (s === '') return NaN;
    s = s.replace(/\s/g, '');
    if (s.includes(',')) {
      // Vírgula é o decimal pt-BR → pontos são separador de milhar.
      s = s.replace(/\./g, '').replace(',', '.');
    } else if (/^\d{1,3}(\.\d{3})+$/.test(s)) {
      // Sem vírgula, mas no padrão "500.000" / "1.250.000" → ponto de milhar, não decimal.
      s = s.replace(/\./g, '');
    }
    return parseFloat(s);
  }
  function numOrNull(v) { const n = parseNum(v); return isNaN(n) ? null : n; }
  function numOrZero(v) { const n = parseNum(v); return isNaN(n) ? 0 : n; }

  const fmtBRLCache = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  function fmtBRL(v) { return (v === null || v === undefined || isNaN(v)) ? '—' : fmtBRLCache.format(v); }
  const fmtNumCache = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
  function fmtNum(v) { return (v === null || v === undefined || isNaN(v)) ? '—' : fmtNumCache.format(v); }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }
  function scrollToTop() {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }
  function erf(x) {
    const sign = x < 0 ? -1 : 1; x = Math.abs(x);
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    const t = 1 / (1 + p * x);
    const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
  }
  function normalCDF(z) { return 0.5 * (1 + erf(z / Math.SQRT2)); }

  // ============================================================
  // Engine de benchmark
  // ============================================================
  function custoBenchmark(cultura, uf) {
    const c = BENCH.culturas && BENCH.culturas[cultura];
    if (!c || !c.estados) return null;
    const e = c.estados[uf];
    return e ? e.custos : null;
  }
  function estadoBenchmark(cultura, uf) {
    const c = BENCH.culturas && BENCH.culturas[cultura];
    if (!c || !c.estados) return null;
    return c.estados[uf] || null;
  }
  function margemRefEstado(cultura, uf) {
    const e = estadoBenchmark(cultura, uf);
    if (e && e.custos) {
      const custoTotal = CATEGORIAS.reduce((s, cat) => s + (e.custos[cat] || 0), 0);
      return e.prod * e.preco - custoTotal;
    }
    const nac = BENCH.nacional && BENCH.nacional[cultura];
    return nac ? nac.margem_bruta_ha_ref : 0;
  }

  // ============================================================
  // Engine de cálculo — margem bruta (culturas individuais)
  // ============================================================
  function calcularTudo() {
    const uf = S.local.uf;
    const culturas = S.culturas.filter((c) => c.cultura && c.area > 0 && c.prod > 0 && c.preco > 0);

    // Custos por cultura (sempre "total gasto" ÷ área da cultura). Arrendamento NÃO entra aqui:
    // é custo da fazenda, tratado à parte, para a margem da lavoura comparar com o benchmark (que também não inclui arrendamento).
    const itens = culturas.map((c) => {
      const receita_ha = c.prod * c.preco;
      const bench = custoBenchmark(c.cultura, uf);
      const custosUsados = {};
      let custo_ha = 0;
      CATEGORIAS.forEach((cat) => {
        const digitado = c.custos[cat];
        let valor_ha, origem, valorDigitado = null;
        if (digitado !== null && digitado !== undefined && !isNaN(digitado)) {
          valorDigitado = digitado;
          valor_ha = c.area > 0 ? digitado / c.area : 0; // total gasto ÷ área
          origem = 'usuario';
        } else if (bench && bench[cat] !== undefined) {
          valor_ha = bench[cat]; origem = 'benchmark';
        } else {
          valor_ha = 0; origem = 'zero';
        }
        custosUsados[cat] = { valor: valor_ha, origem, valorDigitado, mode: 'total' };
        custo_ha += valor_ha;
      });
      const margem_bruta_ha = receita_ha - custo_ha; // margem da LAVOURA (sem arrendamento)
      const resultado = margem_bruta_ha * c.area;

      // Benchmark POR CULTURA (referência exclui arrendamento — comparável à margem da lavoura)
      const ref = margemRefEstado(c.cultura, uf);
      const pct_vs_estado = ref !== 0 ? ((margem_bruta_ha - ref) / ref) * 100 : null;
      let semaforo = 'verde';
      if (margem_bruta_ha < 0.8 * ref) semaforo = 'vermelho';
      else if (margem_bruta_ha < ref) semaforo = 'amarelo';

      const sd = 0.4 * Math.abs(ref) || 1;
      const z = (margem_bruta_ha - ref) / sd;
      const percentil = clamp(Math.round(100 * normalCDF(z)), 1, 99);

      return {
        cultura: c.cultura, area: c.area, prod: c.prod, preco: c.preco, custo_mode: 'total',
        receita_ha, custo_ha, custosUsados, arrend_rs_ha: 0, margem_bruta_ha, resultado,
        ref, pct_vs_estado, semaforo, percentil, temBenchmarkEstado: !!bench,
        P25: ref * 0.75, mediana: ref, P75: ref * 1.3
      };
    });

    const area_total = itens.reduce((s, i) => s + i.area, 0);
    const receita_total = itens.reduce((s, i) => s + i.receita_ha * i.area, 0);
    const custo_producao_total = itens.reduce((s, i) => s + i.custo_ha * i.area, 0);
    const resultado_producao = itens.reduce((s, i) => s + i.resultado, 0); // antes do arrendamento

    // Arrendamento: custo da fazenda, só sobre os hectares arrendados. Sacas → R$ pelo preço médio ponderado.
    const precoMedio = area_total > 0 ? itens.reduce((s, i) => s + i.preco * i.area, 0) / area_total : 0;
    const haArrendado = (S.terra.tipo !== 'propria' && S.terra.ha_arrendado > 0) ? S.terra.ha_arrendado : 0;
    const arrendPorHa = S.terra.arrend_unidade === 'sc_ha' ? (S.terra.arrend_valor || 0) * precoMedio : (S.terra.arrend_valor || 0);
    const arrend_total = arrendPorHa * haArrendado;
    const arrend_sacas = S.terra.arrend_unidade === 'sc_ha' ? (S.terra.arrend_valor || 0) * haArrendado : (precoMedio > 0 ? arrend_total / precoMedio : 0);
    const arrend_rs_ha_medio = area_total > 0 ? arrend_total / area_total : 0;

    // Resultado dos grãos = produção − arrendamento (o que a fazenda fez depois de pagar a terra)
    const resultado_graos = resultado_producao - arrend_total;
    const margem_conjunta_ha = area_total > 0 ? resultado_graos / area_total : 0;       // líquida de arrendamento (herói)
    const margem_producao_ha = area_total > 0 ? resultado_producao / area_total : 0;    // bruta da lavoura (p/ comparação)
    const margem_pct = receita_total > 0 ? (resultado_graos / receita_total) * 100 : null;
    const custo_total = custo_producao_total + arrend_total;

    // Caixa disponível = resultado dos grãos − parcela anual da dívida
    const parcela = S.divida.tem ? (S.divida.parcela || 0) : 0;
    const caixa_disponivel = resultado_graos - parcela;

    // Benchmark PONDERADO por área — compara a margem da LAVOURA (bruta), consistente com a referência
    const ref_ponderado = area_total > 0 ? itens.reduce((s, i) => s + i.ref * i.area, 0) / area_total : 0;
    const pct_vs_estado_ponderado = ref_ponderado !== 0 ? ((margem_producao_ha - ref_ponderado) / ref_ponderado) * 100 : null;
    let semaforo_headline = 'verde';
    if (margem_producao_ha < 0.8 * ref_ponderado) semaforo_headline = 'vermelho';
    else if (margem_producao_ha < ref_ponderado) semaforo_headline = 'amarelo';

    const headline = itens.reduce((best, i) => (!best || i.area > best.area ? i : best), null) || itens[0];

    // Dívida
    let divida = null;
    if (S.divida.tem) {
      const custo_divida_ha = area_total > 0 ? S.divida.parcela / area_total : 0;
      const pct_margem_comprometida = resultado_graos > 0 ? (S.divida.parcela / resultado_graos) * 100 : null;
      const alavancagem_anos = resultado_graos > 0 ? S.divida.total / resultado_graos : null;
      divida = { custo_divida_ha, pct_margem_comprometida, alavancagem_anos };
    }

    // Diagnóstico (margem da lavoura vs benchmark ponderado)
    const p_margem = margem_producao_ha < 0.8 * ref_ponderado;
    const p_caixa = S.divida.tem && (divida.pct_margem_comprometida === null || divida.pct_margem_comprometida > 30);
    const p_end = S.divida.tem && (resultado_graos <= 0 || S.divida.total > 2 * resultado_graos);
    const nFlags = [p_margem, p_caixa, p_end].filter(Boolean).length;

    let classe;
    if (nFlags >= 2) classe = 'multiplos';
    else if (p_margem) classe = 'margem';
    else if (p_end) classe = 'endividamento';
    else if (p_caixa) classe = 'caixa';
    else classe = 'saudavel';

    return {
      uf, itens, headline, multi: itens.length >= 2,
      terra: S.terra.tipo, area_total, precoMedio,
      resultado_producao, resultado_graos, margem_conjunta_ha, margem_producao_ha, margem_pct,
      receita_total, custo_total, caixa_disponivel,
      arrend_total, arrend_sacas, arrend_rs_ha_medio, haArrendado,
      ref_ponderado, pct_vs_estado_ponderado, semaforo_headline,
      divida, classe, flags: { p_margem, p_caixa, p_end }
    };
  }

  const DIAGNOSTICOS = {
    margem: {
      titulo: 'Problema de Margem',
      texto: 'A margem bruta da sua fazenda de grãos está abaixo de 80% da média do seu estado. Isso costuma vir de custo de produção alto, produtividade abaixo do potencial ou preço de venda ruim — geralmente uma combinação dos três.',
      recomendacao: 'Revise primeiro a categoria de custo mais pesada (normalmente fertilizante ou defensivo) e compare cotações com pelo menos 2 fornecedores antes da próxima safra.'
    },
    caixa: {
      titulo: 'Problema de Caixa',
      texto: 'A parcela da sua dívida está comprometendo uma fatia grande do resultado dos grãos deste ano. Mesmo com a lavoura saudável, isso pode apertar o caixa na hora de pagar fornecedor e financiar a próxima safra.',
      recomendacao: 'Priorize negociar prazo ou rolagem da dívida com o banco antes do vencimento da parcela, para ganhar fôlego de caixa no curto prazo.'
    },
    endividamento: {
      titulo: 'Problema de Endividamento',
      texto: 'Sua dívida total equivale a mais de 2 anos de resultado dos grãos. É um nível de alavancagem estrutural alto — mesmo uma safra boa demora para reequilibrar a conta.',
      recomendacao: 'Busque reestruturar a dívida atual (alongar prazo, trocar linha) e evite tomar crédito novo até essa relação melhorar.'
    },
    saudavel: {
      titulo: 'Situação Saudável',
      texto: 'Sua margem está saudável em relação à média do seu estado e a dívida, se existe, está sob controle. Você está numa posição sólida em relação à maioria dos produtores da sua região.',
      recomendacao: 'Mantenha a disciplina de custos que trouxe você até aqui e avalie diversificação ou expansão com cautela, sem comprometer o caixa.'
    },
    multiplos: {
      titulo: 'Múltiplos Desafios',
      texto: 'Você tem dois ou mais problemas ao mesmo tempo — margem, caixa e/ou endividamento. Isoladamente cada um seria administrável, mas juntos exigem um plano priorizado.',
      recomendacao: 'Busque orientação especializada para montar um plano por etapas: primeiro estabilizar o caixa do ano corrente, depois reestruturar a dívida, só então atacar a margem.'
    }
  };

  const SEMAFORO_META = {
    verde: { label: 'Acima da média', cls: 'badge-verde', icon: '<svg viewBox="0 0 20 20" fill="none"><path d="M4 10l4 4 8-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    amarelo: { label: 'Próximo da média', cls: 'badge-amarelo', icon: '<svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="2"/></svg>' },
    vermelho: { label: 'Abaixo da média', cls: 'badge-vermelho', icon: '<svg viewBox="0 0 20 20" fill="none"><path d="M10 3l8 14H2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 8v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="10" cy="14" r=".9" fill="currentColor"/></svg>' }
  };

  // ============================================================
  // DOM refs
  // ============================================================
  const el = {};
  function grab(id) { el[id] = document.getElementById(id); }
  [
    'siteHeader', 'siteFooter', 'progressWrap', 'progressFill', 'progressLabel',
    'tela1', 'tela2', 'tela3',
    'btnComecar',
    'lUf', 'lCidade', 'cityCombo', 'cityList', 'lCidadeHint', 'pSafra',
    'terraTipo', 'terraHectares', 'fHaProprio', 'fHaArrendado', 'haProprio', 'haArrendado',
    'arrendUnidade', 'arrendValor', 'arrendValorLabel', 'arrendHint',
    'wzEscolhaTitle', 'culturaChips', 'escolhaError',
    'wzProdCultura', 'pArea', 'pProd', 'pPreco', 'wzReceitaLive',
    'wzCustosCultura', 'wzCustosArea', 'wzCustoLive',
    'cSementes', 'cDefensivos', 'cFertilizantes', 'cDiesel', 'cMaoObra', 'cManutencao', 'cAdmin',
    'culturasResumo', 'btnAddOutra',
    'dividaToggle', 'dividaCampos', 'dTotal', 'dParcela', 'dTaxa',
    'atividadesList', 'btnAddAtividade', 'btnVerMargem',
    't2Margem', 't2MargemHa', 't2Metrics',
    'formCadastro', 'regNome', 'regEmail', 'regWhats', 'regLgpd', 'btnVerDiagnostico',
    't3Subtitulo', 't3ResumoGrid', 't3CulturasBlocks', 't3Benchmark', 't3Completeness', 't3CostTable',
    't3Tier', 't3ShareCard', 'shareCanvas', 'btnShareCard',
    't3DividaCard', 't3DividaExplain', 't3DividaGrid', 't3Alavancagem', 't3DividaCallout',
    't3DiversifCard', 't3DiversifNote', 't3DiagCard',
    't3RankingTexto', 't3RankStats', 't3PercentileMarker',
    'btnPdf', 'btnConvidar', 'ctaInviteNote', 'avisarCidade', 'avisarCidadeNome',
    'ratingStars', 'ratingComentario', 'btnEnviarAvaliacao', 'ratingThanks'
  ].forEach(grab);

  // ============================================================
  // Rede — /api/calculadora (Fase 2). Falha de rede nunca trava o fluxo do usuário.
  // ============================================================
  async function postAPI(action, extra) {
    try {
      const r = await fetch('/api/calculadora', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.assign({ action: action }, extra))
      });
      if (!r.ok) return { ok: false };
      const data = await r.json();
      return Object.assign({ ok: true }, data);
    } catch (_) { return { ok: false }; }
  }
  function apiCalcular(payload) { return postAPI('calcular', payload); }
  function apiCadastrar(payload) { return postAPI('cadastrar', payload); }
  function apiAvaliar(payload) { return postAPI('avaliar', payload); }

  // Dispara generate_lead sem PII (GA4 via gtag se existir + GTM/Google Ads via dataLayer).
  function fireGenerateLead(r) {
    const head = (r && r.headline) || {};
    const band = (a) => a == null ? '' : (a < 200 ? '<200' : a < 500 ? '200-500' : a < 1000 ? '500-1000' : '1000+');
    const params = {
      cultura: head.cultura || '',
      estado: (S.local && S.local.uf) || '',
      faixa_area: band(r && r.area_total),
      diagnostico: (r && r.classe) || '',
      percentil: (head && head.percentil) || null,
      value: Math.round((r && r.margem_conjunta_ha) || 0),
      currency: 'BRL'
    };
    try { if (window.gtag) window.gtag('event', 'generate_lead', params); } catch (_) {}
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: 'generate_lead' }, params));
  }

  // ============================================================
  // Navegação entre telas + progresso
  // ============================================================
  function goToScreen(n) {
    S.screen = n;
    el.tela1.hidden = n !== 1;
    el.tela2.hidden = n !== 2;
    el.tela3.hidden = n !== 3;
    if (n === 1) {
      updateWizardProgress();
    } else {
      el.progressFill.style.width = (n === 2 ? 66.66 : 100) + '%';
      el.progressLabel.textContent = `Etapa ${n} de 3`;
    }
    scrollToTop();
  }
  function updateWizardProgress() {
    const frac = STEP_PROGRESS[curStep] != null ? STEP_PROGRESS[curStep] : 0;
    el.progressFill.style.width = (frac * 33.33) + '%';
    el.progressLabel.textContent = `Etapa 1 de 3 · ${STEP_LABEL[curStep] || ''}`;
  }

  // ============================================================
  // Segmentados (toggle)
  // ============================================================
  function wireSegmented(container, onChange) {
    container.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', 'false'));
        btn.setAttribute('aria-pressed', 'true');
        onChange(btn.dataset.val);
      });
    });
  }
  function setSegmented(container, val) {
    container.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.val === val ? 'true' : 'false'));
  }

  // Popula UF
  UF_LIST.forEach(([code, name]) => {
    const opt = document.createElement('option');
    opt.value = code; opt.textContent = `${name} (${code})`;
    el.lUf.appendChild(opt);
  });

  // ============================================================
  // Cidades — filtradas pelo estado (IBGE). Fallback p/ texto livre se a lista falhar.
  // Dado limpo hoje = média por cidade amanhã.
  // ============================================================
  // Combobox de busca: input com lupa + lista filtrada (do IBGE) do estado escolhido.
  const cidadeCache = {};
  let cidadeLista = [];        // cidades do estado atual
  let cidadeFallback = false;  // IBGE falhou → aceita texto livre
  let cityActiveIdx = -1;

  function getCidadeValue() { return el.lCidade.value.trim(); }
  function isCidadeValida() {
    const v = getCidadeValue().toLowerCase();
    if (!v) return false;
    if (cidadeFallback) return true;
    return cidadeLista.some((c) => c.toLowerCase() === v);
  }
  function fecharCityList() {
    el.cityList.hidden = true;
    el.lCidade.setAttribute('aria-expanded', 'false');
    cityActiveIdx = -1;
  }
  function abrirCityList(filtro) {
    if (cidadeFallback || !cidadeLista.length) return;
    const f = (filtro || '').trim().toLowerCase();
    const matches = (f ? cidadeLista.filter((c) => c.toLowerCase().includes(f)) : cidadeLista).slice(0, 80);
    if (!matches.length) { fecharCityList(); return; }
    el.cityList.innerHTML = matches.map((c) => `<li role="option" data-city="${escapeHtml(c)}">${escapeHtml(c)}</li>`).join('');
    el.cityList.hidden = false;
    el.lCidade.setAttribute('aria-expanded', 'true');
    cityActiveIdx = -1;
  }
  function selecionarCidade(nome) {
    el.lCidade.value = nome; markInvalid(el.lCidade, false); fecharCityList();
  }
  function moveCityActive(delta) {
    const items = Array.from(el.cityList.querySelectorAll('li'));
    if (!items.length) return;
    cityActiveIdx = (cityActiveIdx + delta + items.length) % items.length;
    items.forEach((li, i) => li.classList.toggle('active', i === cityActiveIdx));
    items[cityActiveIdx].scrollIntoView({ block: 'nearest' });
  }
  function loadCidadeLista(uf) {
    cidadeFallback = false; fecharCityList();
    if (!uf) { cidadeLista = []; el.lCidade.disabled = true; el.lCidade.placeholder = 'Selecione o estado primeiro'; return; }
    el.lCidade.disabled = false;
    if (cidadeCache[uf]) { cidadeLista = cidadeCache[uf]; el.lCidade.placeholder = 'Busque sua cidade'; return; }
    cidadeLista = []; el.lCidade.placeholder = 'Carregando cidades…';
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => { cidadeCache[uf] = data.map((m) => m.nome); cidadeLista = cidadeCache[uf]; el.lCidade.placeholder = 'Busque sua cidade'; })
      .catch(() => { cidadeFallback = true; cidadeLista = []; el.lCidade.placeholder = 'Digite sua cidade'; el.lCidadeHint.textContent = 'Não consegui carregar a lista — pode digitar sua cidade.'; });
  }
  el.lUf.addEventListener('change', () => { el.lCidade.value = ''; markInvalid(el.lCidade, false); loadCidadeLista(el.lUf.value); });
  el.lCidade.addEventListener('input', () => abrirCityList(el.lCidade.value));
  el.lCidade.addEventListener('focus', () => { if (!el.lCidade.disabled) abrirCityList(el.lCidade.value); });
  el.lCidade.addEventListener('keydown', (e) => {
    if (el.cityList.hidden) { if (e.key === 'ArrowDown') abrirCityList(el.lCidade.value); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); moveCityActive(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); moveCityActive(-1); }
    else if (e.key === 'Enter') {
      const items = el.cityList.querySelectorAll('li');
      if (cityActiveIdx >= 0 && items[cityActiveIdx]) { e.preventDefault(); selecionarCidade(items[cityActiveIdx].dataset.city); }
    } else if (e.key === 'Escape') { fecharCityList(); }
  });
  el.cityList.addEventListener('mousedown', (e) => {
    const li = e.target.closest('li[data-city]');
    if (li) { e.preventDefault(); selecionarCidade(li.dataset.city); }
  });
  document.addEventListener('click', (e) => { if (el.cityCombo && !el.cityCombo.contains(e.target)) fecharCityList(); });

  // ============================================================
  // WIZARD — controlador
  // ============================================================
  const STEP_EL = {
    intro: 'wz-intro', fazenda: 'wz-fazenda', terra: 'wz-terra', cultura_escolha: 'wz-cultura_escolha',
    cultura_producao: 'wz-cultura_producao', cultura_custos: 'wz-cultura_custos',
    cultura_add: 'wz-cultura_add', divida: 'wz-divida', atividades: 'wz-atividades'
  };
  let curStep = 'intro';

  function cur() { return S.culturas[S.editIndex]; }

  function showStep(step) {
    curStep = step;
    Object.keys(STEP_EL).forEach((k) => {
      document.getElementById(STEP_EL[k]).hidden = (k !== step);
    });
    fillStep(step);
    updateWizardProgress();
    scrollToTop();
    // Foco no 1º campo interativo do passo
    const panel = document.getElementById(STEP_EL[step]);
    const focusable = panel.querySelector('.input, .chip, [data-focus]');
    if (focusable) { try { focusable.focus({ preventScroll: true }); } catch (e) { focusable.focus(); } }
  }

  // ---------- Validação por passo ----------
  function markInvalid(inputEl, invalid) {
    const field = inputEl.closest('.field');
    if (field) { field.classList.toggle('invalid', invalid); }
    inputEl.classList.toggle('has-error', invalid);
  }
  function validateStep(step) {
    if (step === 'fazenda') {
      const ufOk = el.lUf.value !== '';
      markInvalid(el.lUf, !ufOk);
      const cidOk = isCidadeValida();
      markInvalid(el.lCidade, !cidOk);
      if (!ufOk) { el.lUf.focus(); return false; }
      if (!cidOk) { el.lCidade.focus(); return false; }
      return true;
    }
    if (step === 'terra') {
      const tipo = el.terraTipo.querySelector('[aria-pressed="true"]').dataset.val;
      if (tipo === 'propria') return true;
      let ok = true, first = null;
      const okArr = numOrZero(el.haArrendado.value) > 0;
      markInvalid(el.haArrendado, !okArr);
      if (!okArr) { ok = false; first = el.haArrendado; }
      if (tipo === 'mista') {
        const okProp = numOrZero(el.haProprio.value) > 0;
        markInvalid(el.haProprio, !okProp);
        if (!okProp) { ok = false; if (!first) first = el.haProprio; }
      }
      if (first) first.focus();
      return ok;
    }
    if (step === 'cultura_escolha') {
      const ok = !!(cur() && cur().cultura);
      el.escolhaError.style.display = ok ? 'none' : 'block';
      return ok;
    }
    if (step === 'cultura_producao') {
      const checks = [
        [el.pArea, numOrZero(el.pArea.value) > 0],
        [el.pProd, numOrZero(el.pProd.value) > 0],
        [el.pPreco, numOrZero(el.pPreco.value) > 0]
      ];
      let ok = true, first = null;
      checks.forEach(([inp, valid]) => { markInvalid(inp, !valid); if (!valid) { ok = false; if (!first) first = inp; } });
      if (first) first.focus();
      return ok;
    }
    return true;
  }

  // ---------- Ler passo atual -> estado ----------
  function readStep(step) {
    if (step === 'fazenda') {
      S.local.uf = el.lUf.value;
      S.local.cidade = getCidadeValue();
      S.safra = el.pSafra.value;
    } else if (step === 'terra') {
      S.terra.tipo = el.terraTipo.querySelector('[aria-pressed="true"]').dataset.val;
      S.terra.ha_proprio = numOrNull(el.haProprio.value);
      S.terra.ha_arrendado = numOrNull(el.haArrendado.value);
      S.terra.arrend_unidade = el.arrendUnidade.querySelector('[aria-pressed="true"]').dataset.val;
      S.terra.arrend_valor = numOrZero(el.arrendValor.value);
      if (S.terra.tipo === 'propria') { S.terra.ha_arrendado = null; S.terra.arrend_valor = 0; }
    } else if (step === 'cultura_producao') {
      const c = cur(); if (!c) return;
      c.area = numOrZero(el.pArea.value);
      c.prod = numOrZero(el.pProd.value);
      c.preco = numOrZero(el.pPreco.value);
    } else if (step === 'cultura_custos') {
      const c = cur(); if (!c) return;
      c.custo_mode = 'total'; // sempre total gasto
      CATEGORIAS.forEach((cat) => { c.custos[cat] = numOrNull(document.getElementById(CATEGORIA_INPUT_ID[cat]).value); });
    } else if (step === 'divida') {
      S.divida.tem = el.dividaToggle.querySelector('[aria-pressed="true"]').dataset.val === 'sim';
      S.divida.total = numOrZero(el.dTotal.value);
      S.divida.parcela = numOrZero(el.dParcela.value);
      S.divida.taxa = numOrNull(el.dTaxa.value);
    } else if (step === 'atividades') {
      S.atividades = collectAtividades();
    }
  }

  // ---------- Preencher passo a partir do estado ----------
  function fillStep(step) {
    if (step === 'fazenda') {
      el.lUf.value = S.local.uf;
      loadCidadeLista(S.local.uf);
      el.lCidade.value = S.local.cidade || '';
      el.pSafra.value = S.safra;
    } else if (step === 'terra') {
      setSegmented(el.terraTipo, S.terra.tipo);
      el.haProprio.value = S.terra.ha_proprio != null ? String(S.terra.ha_proprio).replace('.', ',') : '';
      el.haArrendado.value = S.terra.ha_arrendado != null ? String(S.terra.ha_arrendado).replace('.', ',') : '';
      setSegmented(el.arrendUnidade, S.terra.arrend_unidade);
      el.arrendValor.value = S.terra.arrend_valor ? String(S.terra.arrend_valor).replace('.', ',') : '';
      updateTerraUI();
    } else if (step === 'cultura_escolha') {
      renderChips();
    } else if (step === 'cultura_producao') {
      const c = cur(); if (!c) return;
      el.wzProdCultura.textContent = CULTURA_LABEL[c.cultura] || '';
      el.pArea.value = c.area != null ? String(c.area).replace('.', ',') : '';
      el.pProd.value = c.prod != null ? String(c.prod).replace('.', ',') : '';
      el.pPreco.value = c.preco != null ? String(c.preco).replace('.', ',') : '';
      [el.pArea, el.pProd, el.pPreco].forEach((i) => markInvalid(i, false));
      updateReceitaLive();
    } else if (step === 'cultura_custos') {
      const c = cur(); if (!c) return;
      el.wzCustosCultura.textContent = CULTURA_LABEL[c.cultura] || '';
      el.wzCustosArea.textContent = c.area > 0 ? `· ${fmtNum(c.area)} ha` : '';
      CATEGORIAS.forEach((cat) => {
        const inp = document.getElementById(CATEGORIA_INPUT_ID[cat]);
        inp.value = c.custos[cat] != null ? String(c.custos[cat]).replace('.', ',') : '';
      });
      updateCustoLive();
    } else if (step === 'cultura_add') {
      renderResumoCulturas();
    } else if (step === 'divida') {
      setSegmented(el.dividaToggle, S.divida.tem ? 'sim' : 'nao');
      el.dividaCampos.hidden = !S.divida.tem;
      el.dTotal.value = S.divida.total ? String(S.divida.total).replace('.', ',') : '';
      el.dParcela.value = S.divida.parcela ? String(S.divida.parcela).replace('.', ',') : '';
      el.dTaxa.value = S.divida.taxa != null ? String(S.divida.taxa).replace('.', ',') : '';
    }
    // atividades: linhas persistem no DOM, nada a preencher
  }

  // ---------- Navegação: próximo / voltar ----------
  function goNext() {
    const step = curStep;
    if (!validateStep(step)) return;
    readStep(step);

    switch (step) {
      case 'intro':
        showStep('fazenda'); break;
      case 'fazenda':
        showStep('terra'); break;
      case 'terra':
        S.culturas.push(novaCultura()); S.editIndex = S.culturas.length - 1;
        showStep('cultura_escolha'); break;
      case 'cultura_escolha':
        showStep('cultura_producao'); break;
      case 'cultura_producao':
        showStep('cultura_custos'); break;
      case 'cultura_custos':
        showStep('cultura_add'); break;
      case 'divida':
        showStep('atividades'); break;
      case 'atividades':
        finishWizard(); break;
    }
  }

  function goBack() {
    const step = curStep;
    // preserva o que foi digitado ao voltar
    if (step !== 'intro') readStep(step);

    switch (step) {
      case 'fazenda':
        showStep('intro'); break;
      case 'terra':
        showStep('fazenda'); break;
      case 'cultura_escolha':
        // descarta a cultura em edição (ainda incompleta)
        S.culturas.splice(S.editIndex, 1); S.editIndex = -1;
        if (S.culturas.length) { S.editIndex = S.culturas.length - 1; showStep('cultura_add'); }
        else showStep('terra');
        break;
      case 'cultura_producao':
        showStep('cultura_escolha'); break;
      case 'cultura_custos':
        showStep('cultura_producao'); break;
      case 'cultura_add':
        S.editIndex = S.culturas.length - 1; showStep('cultura_custos'); break;
      case 'divida':
        showStep('cultura_add'); break;
      case 'atividades':
        showStep('divida'); break;
      default:
        break;
    }
  }

  function addAnotherCultura() {
    S.culturas.push(novaCultura()); S.editIndex = S.culturas.length - 1;
    showStep('cultura_escolha');
  }

  async function finishWizard() {
    S.resultado = calcularTudo();
    el.btnVerMargem.disabled = true;
    const res = await apiCalcular(buildCalcPayload());
    S.calcId = res.id;
    el.btnVerMargem.disabled = false;
    renderTela2();
    goToScreen(2);
  }

  // Delegação dos botões de ação do wizard
  el.tela1.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'next') goNext();
    else if (action === 'back') goBack();
    else if (action === 'add-another') addAnotherCultura();
    else if (action === 'continue') { showStep('divida'); }
  });

  // ---------- Chips de cultura ----------
  function renderChips() {
    const usadas = S.culturas.filter((_, i) => i !== S.editIndex).map((c) => c.cultura);
    const disponiveis = CULTURAS_GRAO.filter((c) => !usadas.includes(c));
    const selecionada = cur() ? cur().cultura : '';
    el.escolhaError.style.display = 'none';
    el.wzEscolhaTitle.textContent = S.culturas.length > 1 ? 'Qual a próxima cultura?' : 'Qual cultura?';
    if (!disponiveis.length) {
      el.culturaChips.innerHTML = '<p class="chips-empty">Você já adicionou todas as culturas disponíveis.</p>';
      return;
    }
    el.culturaChips.innerHTML = disponiveis.map((c) => `
      <button type="button" class="chip" data-cultura="${c}" aria-pressed="${c === selecionada ? 'true' : 'false'}">
        <span class="chip-emoji" aria-hidden="true">${CULTURA_EMOJI[c]}</span>${CULTURA_LABEL[c]}
      </button>`).join('');
    el.culturaChips.querySelectorAll('.chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        el.culturaChips.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', 'false'));
        chip.setAttribute('aria-pressed', 'true');
        if (cur()) cur().cultura = chip.dataset.cultura;
        el.escolhaError.style.display = 'none';
      });
    });
  }

  function updateReceitaLive() {
    const prod = numOrZero(el.pProd.value), preco = numOrZero(el.pPreco.value);
    if (prod > 0 && preco > 0) {
      el.wzReceitaLive.classList.remove('empty');
      el.wzReceitaLive.innerHTML = `<span class="lf-item">Receita estimada: <b>${fmtBRL(prod * preco)}</b>/ha</span>`;
    } else {
      el.wzReceitaLive.classList.add('empty');
      el.wzReceitaLive.textContent = 'Preencha produtividade e preço para ver a receita estimada.';
    }
  }
  [el.pArea, el.pProd, el.pPreco].forEach((i) => i.addEventListener('input', updateReceitaLive));

  // ---------- Custos: sempre "total gasto" → convertido p/ R$/ha pela área da cultura ----------
  function updateCustoLive() {
    const c = cur(); if (!c) return;
    const area = numOrZero(el.pArea.value) || c.area || 0;
    const eb = estadoBenchmark(c.cultura, S.local.uf);
    const bench = eb ? eb.custos : null;
    let custo_ha = 0;
    CATEGORIAS.forEach((cat) => {
      const dig = numOrNull(document.getElementById(CATEGORIA_INPUT_ID[cat]).value);
      if (dig !== null) custo_ha += (area > 0 ? dig / area : 0);
      else if (bench && bench[cat] !== undefined) custo_ha += bench[cat];
    });
    const receita_ha = (numOrZero(el.pProd.value) || c.prod || 0) * (numOrZero(el.pPreco.value) || c.preco || 0);
    const margem_prev = receita_ha - custo_ha; // sem arrendamento (é custo da fazenda, não da cultura)
    el.wzCustoLive.classList.remove('empty');
    el.wzCustoLive.innerHTML =
      `<span class="lf-item">Custo: <b>${fmtBRL(custo_ha)}</b>/ha</span>` +
      `<span class="lf-sep">·</span>` +
      `<span class="lf-item">Margem da lavoura: <b class="${margem_prev < 0 ? 'negativo' : ''}">${fmtBRL(margem_prev)}</b>/ha</span>`;
  }
  CATEGORIAS.forEach((cat) => {
    document.getElementById(CATEGORIA_INPUT_ID[cat]).addEventListener('input', updateCustoLive);
  });

  // ---------- Resumo de culturas (2d) ----------
  function marginPreviewCultura(c) {
    if (!(c.cultura && c.area > 0 && c.prod > 0 && c.preco > 0)) return null;
    const receita_ha = c.prod * c.preco;
    const bench = custoBenchmark(c.cultura, S.local.uf);
    let custo_ha = 0;
    CATEGORIAS.forEach((cat) => {
      const dig = c.custos[cat];
      if (dig !== null && dig !== undefined && !isNaN(dig)) custo_ha += (c.custo_mode === 'total' ? (c.area > 0 ? dig / c.area : 0) : dig);
      else if (bench && bench[cat] !== undefined) custo_ha += bench[cat];
    });
    return receita_ha - custo_ha; // preview sem arrendamento
  }
  function renderResumoCulturas() {
    const list = S.culturas.filter((c) => c.cultura && c.area > 0 && c.prod > 0 && c.preco > 0);
    el.culturasResumo.innerHTML = list.map((c) => {
      const m = marginPreviewCultura(c);
      return `
        <div class="cult-chip">
          <div class="cc-name">
            <span class="cc-emoji" aria-hidden="true">${CULTURA_EMOJI[c.cultura] || ''}</span>
            <span>${CULTURA_LABEL[c.cultura] || c.cultura}<span class="cc-meta">${fmtNum(c.area)} ha · ${fmtNum(c.prod)} sc/ha</span></span>
          </div>
          <div class="cc-margem ${m < 0 ? 'negativo' : ''}">${fmtBRL(m)}<small>margem/ha</small></div>
        </div>`;
    }).join('');
    // Esconde "adicionar" se todas as culturas já foram usadas
    const usadas = S.culturas.map((c) => c.cultura).filter(Boolean);
    el.btnAddOutra.style.display = CULTURAS_GRAO.every((c) => usadas.includes(c)) ? 'none' : '';
  }

  // ---------- Terra (perfil de propriedade) + arrendamento ----------
  wireSegmented(el.terraTipo, (val) => { S.terra.tipo = val; updateTerraUI(); });
  wireSegmented(el.arrendUnidade, (val) => { S.terra.arrend_unidade = val; updateArrendLabel(); });
  function updateArrendLabel() {
    const sc = el.arrendUnidade.querySelector('[aria-pressed="true"]').dataset.val === 'sc_ha';
    el.arrendValorLabel.textContent = sc ? 'Valor do arrendamento (sc/ha)' : 'Valor do arrendamento (R$/ha)';
    el.arrendHint.textContent = sc
      ? 'Em sacas, convertemos pelo seu preço médio de venda — só sobre os hectares arrendados.'
      : 'Aplicado só sobre os hectares arrendados.';
  }
  function updateTerraUI() {
    const tipo = el.terraTipo.querySelector('[aria-pressed="true"]').dataset.val;
    el.terraHectares.hidden = tipo === 'propria';
    // Terra 100% arrendada não pergunta hectares próprios.
    el.fHaProprio.style.display = tipo === 'arrendada' ? 'none' : '';
    updateArrendLabel();
  }

  // ---------- Dívida ----------
  wireSegmented(el.dividaToggle, (val) => {
    S.divida.tem = val === 'sim';
    el.dividaCampos.hidden = !S.divida.tem;
  });

  // ---------- Atividades (linhas repetíveis) ----------
  function addAtividadeRow() {
    const wrap = document.createElement('div');
    wrap.className = 'repeat-row';
    wrap.innerHTML = `
      <div class="repeat-row-head">
        <span>Atividade</span>
        <button type="button" class="btn-remove" aria-label="Remover esta atividade">×</button>
      </div>
      <div class="field-row">
        <div class="mini-field"><span>Tipo</span>
          <select class="input" data-f="tipo" aria-label="Tipo de atividade">
            <option value="pecuaria_corte">Pecuária de corte</option><option value="pecuaria_leite">Pecuária de leite</option>
            <option value="aves">Aves</option><option value="suinos">Suínos</option><option value="peixes">Peixes</option><option value="outra">Outra</option>
          </select>
        </div>
        <div class="mini-field"><span>Faturamento no último ano (R$)</span>
          <input class="input" type="text" inputmode="decimal" data-f="faturamento" placeholder="Ex: 150.000" aria-label="Faturamento da atividade" />
        </div>
      </div>`;
    wrap.querySelector('.btn-remove').addEventListener('click', () => wrap.remove());
    el.atividadesList.appendChild(wrap);
  }
  el.btnAddAtividade.addEventListener('click', addAtividadeRow);
  function collectAtividades() {
    return Array.from(el.atividadesList.querySelectorAll('.repeat-row')).map((row) => ({
      tipo: row.querySelector('[data-f="tipo"]').value,
      faturamento: numOrZero(row.querySelector('[data-f="faturamento"]').value)
    })).filter((a) => a.faturamento > 0);
  }

  // ============================================================
  // Cadastro — Tela 2
  // ============================================================
  function maskPhone(v) {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }
  el.regWhats.addEventListener('input', () => {
    const pos = el.regWhats.selectionStart;
    el.regWhats.value = maskPhone(el.regWhats.value);
    el.regWhats.setSelectionRange(pos, pos);
  });
  el.regLgpd.addEventListener('change', () => { el.btnVerDiagnostico.disabled = !el.regLgpd.checked; });

  function validateCadastro() {
    let ok = true; let firstInvalid = null;
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.regEmail.value.trim());
    const whatsDigits = el.regWhats.value.replace(/\D/g, '');
    const checks = [
      [el.regNome, el.regNome.value.trim().length >= 2],
      [el.regEmail, emailValido],
      [el.regWhats, whatsDigits.length === 10 || whatsDigits.length === 11]
    ];
    checks.forEach(([input, valid]) => {
      markInvalid(input, !valid);
      if (!valid) { ok = false; if (!firstInvalid) firstInvalid = input; }
    });
    if (!ok && firstInvalid) firstInvalid.focus();
    return ok;
  }

  // ============================================================
  // Payloads (formato final que a Fase 2 vai consumir)
  // ============================================================
  function buildCalcPayload() {
    return {
      safra: S.safra, local: S.local, terra: S.terra,
      culturas: S.culturas, divida: S.divida, atividades: S.atividades,
      tracking: S.tracking, resultado: S.resultado
    };
  }
  function buildCadastroPayload() {
    return {
      calcId: S.calcId, cadastro: S.cadastro, interesse_gestao: S.interesse_gestao,
      avisar_media_cidade: S.avisar_media_cidade,
      safra: S.safra, local: S.local, terra: S.terra, culturas: S.culturas,
      divida: S.divida, atividades: S.atividades,
      tracking: S.tracking, resultado: S.resultado
    };
  }
  function buildAvaliacaoPayload() {
    return { calcId: S.calcId, avaliacao: S.avaliacao, tracking: S.tracking };
  }

  // ============================================================
  // Render — Tela 2 (headline = margem conjunta vs benchmark ponderado)
  // ============================================================
  function renderTela2() {
    const r = S.resultado;
    // Herói = resultado dos grãos em R$ (a fazenda inteira, depois do arrendamento)
    el.t2Margem.innerHTML = `${fmtBRL(r.resultado_graos)}`;
    el.t2Margem.classList.toggle('negativo', r.resultado_graos < 0);
    el.t2MargemHa.textContent = `${fmtBRL(r.margem_conjunta_ha)}/ha em ${fmtNum(r.area_total)} ha`;

    const pctTxt = r.margem_pct === null ? '—' : `${r.margem_pct.toFixed(0)}%`;
    const temDivida = S.divida.tem;
    const cells = [
      { v: fmtBRL(r.margem_conjunta_ha), k: 'Margem por hectare', neg: r.margem_conjunta_ha < 0 },
      { v: pctTxt, k: 'Margem sobre a receita', neg: (r.margem_pct || 0) < 0 },
      {
        v: fmtBRL(r.caixa_disponivel),
        k: temDivida ? 'Caixa disponível (após a parcela)' : 'Caixa disponível',
        neg: r.caixa_disponivel < 0
      }
    ];
    el.t2Metrics.innerHTML = cells.map((c) =>
      `<div class="metric-item"><div class="mv ${c.neg ? 'negativo' : ''}">${c.v}</div><div class="mk">${c.k}</div></div>`
    ).join('');
  }

  // ============================================================
  // Render — Tela 3
  // ============================================================
  // Custo em sacas — o produtor sente melhor "quantas sacas o custo comeu".
  function renderSacasNote(r, custoProducao) {
    if (!(r.precoMedio > 0) || !(r.area_total > 0)) return '';
    const prodMedia = r.itens.reduce((s, i) => s + i.prod * i.area, 0) / r.area_total;
    const custoScHa = (custoProducao / r.area_total) / r.precoMedio;
    const arrendScHa = r.area_total > 0 ? (r.arrend_sacas / r.area_total) : 0;
    const sobra = prodMedia - custoScHa - arrendScHa;
    const arrendTxt = arrendScHa > 0.1 ? ` e mais <b>${fmtNum(arrendScHa)} sc/ha</b> de arrendamento` : '';
    return `<p class="sacas-note">Traduzindo em sacas: seu custo de produção equivale a <b>${fmtNum(custoScHa)} sc/ha</b>${arrendTxt}. Você colheu <b>${fmtNum(prodMedia)} sc/ha</b> — sobram <b class="${sobra < 0 ? 'negativo' : ''}">${fmtNum(sobra)} sc/ha</b> de margem.</p>`;
  }

  // Arrendamento É custo de produção real (reduz a margem) — só fica de fora da comparação com a
  // média abaixo porque nem todo produtor paga arrendamento (não seria justo comparar quem paga com
  // quem não paga). Aqui mostramos o tamanho desse impacto, na mesma lógica didática da dívida.
  function renderArrendNote(r) {
    if (!(r.arrend_total > 0)) return '';
    const impactoPct = r.resultado_producao > 0 ? (r.arrend_total / r.resultado_producao) * 100 : null;
    const impactoTxt = impactoPct === null ? 'todo o resultado da lavoura (e mais)' : `${impactoPct.toFixed(0)}% da margem da lavoura`;
    return `<div class="arrend-note">
      <strong>O arrendamento é custo de produção real</strong> — ele reduz sua margem. Sem ele, sua margem seria de
      <strong>${fmtBRL(r.margem_producao_ha)}/ha</strong> em vez de ${fmtBRL(r.margem_conjunta_ha)}/ha: hoje o arrendamento consome
      <strong>${impactoTxt}</strong>. Ele fica de fora da comparação abaixo porque nem todo produtor paga arrendamento —
      não seria justo comparar quem paga com quem não paga. <em>Em breve, vamos comparar também o seu custo de arrendamento
      com a média do estado e do Brasil.</em>
    </div>`;
  }

  function renderResumoExecutivo(r) {
    const custoProducao = r.custo_total - r.arrend_total;
    const temArrend = r.arrend_total > 0;
    const arrendLabel = r.arrend_sacas > 0
      ? `− Arrendamento <span class="dre-sub">(${fmtNum(r.arrend_sacas)} sc · ${fmtNum(r.haArrendado)} ha)</span>`
      : '− Arrendamento';
    // DRE simples: receita − custo − arrendamento = resultado dos grãos
    el.t3ResumoGrid.innerHTML = `
      <div class="dre">
        <div class="dre-row"><span>Receita total</span><span>${fmtBRL(r.receita_total)}</span></div>
        <div class="dre-row dre-neg"><span>− Custo operacional (COE)</span><span>${fmtBRL(custoProducao)}</span></div>
        ${temArrend ? `<div class="dre-row dre-neg"><span>${arrendLabel}</span><span>${fmtBRL(r.arrend_total)}</span></div>` : ''}
        <div class="dre-row dre-total"><span>= Resultado dos grãos</span><span class="${r.resultado_graos < 0 ? 'negativo' : ''}">${fmtBRL(r.resultado_graos)}</span></div>
      </div>
      <p class="dre-note"><strong>COE = Custo Operacional Efetivo:</strong> o que você gastou em dinheiro na safra (sementes, defensivos, fertilizantes, diesel, mão de obra...). Não inclui depreciação de máquinas nem custo de oportunidade da terra — por isso o resultado é <strong>margem bruta</strong>, não líquida.</p>
      ${renderArrendNote(r)}
      <div class="summary-grid" style="margin-top:1rem">
        <div class="summary-item"><div class="k">Margem por hectare</div><div class="v ${r.margem_conjunta_ha < 0 ? 'negativo' : ''}">${fmtBRL(r.margem_conjunta_ha)}</div></div>
        <div class="summary-item"><div class="k">Margem sobre a receita</div><div class="v ${(r.margem_pct || 0) < 0 ? 'negativo' : ''}">${r.margem_pct === null ? '—' : r.margem_pct.toFixed(0) + '%'}</div></div>
      </div>
      ${renderSacasNote(r, custoProducao)}
    `;

    if (r.multi) {
      el.t3CulturasBlocks.innerHTML = r.itens.map((it) => {
        const meta = SEMAFORO_META[it.semaforo];
        const pct = it.pct_vs_estado === null ? '' :
          `<span class="badge ${meta.cls}" style="font-size:var(--fs-xs);padding:.3rem .6rem">${meta.icon}${Math.abs(it.pct_vs_estado).toFixed(0)}% ${it.pct_vs_estado >= 0 ? 'acima' : 'abaixo'}</span>`;
        return `
          <div class="cultura-block">
            <div class="cb-head">
              <h3>${CULTURA_EMOJI[it.cultura] || ''} ${CULTURA_LABEL[it.cultura] || it.cultura} — ${fmtNum(it.area)} ha</h3>
              ${pct}
            </div>
            <div class="row"><span>Margem bruta isolada</span><span>${fmtBRL(it.margem_bruta_ha)}/ha</span></div>
            <div class="row"><span>Resultado</span><span>${fmtBRL(it.resultado)}</span></div>
          </div>`;
      }).join('');
    } else {
      el.t3CulturasBlocks.innerHTML = '';
    }
  }

  // Semáforo vs referência: verde = na média ou acima, amarelo = 80–100%, vermelho = abaixo de 80%.
  // (mesma régua do it.semaforo calculado em calcularTudo)
  function semaforoVs(you, ref) {
    if (!isFinite(ref) || ref === 0) return 'amarelo';
    if (ref < 0) return you >= ref ? 'verde' : 'vermelho';
    if (you >= ref) return 'verde';
    if (you >= 0.8 * ref) return 'amarelo';
    return 'vermelho';
  }

  // Gráfico com LINHA DE ZERO: barras crescem pra direita (positivo) ou pra esquerda (negativo).
  // Assim margem negativa nunca "parece na frente" das médias. "Você" ganha a cor do semáforo.
  function divergingChart(nome, isCurrency, you, ref, national, perfilLabel, usaNacional) {
    const fmt = isCurrency ? ((v) => fmtBRL(v)) : ((v) => fmtNum(v) + ' sc');
    const cor = you < 0 ? 'vermelho' : semaforoVs(you, ref);
    const rows = [{ label: 'Você', value: you, you: true, cor }];
    if (!usaNacional) rows.push({ label: perfilLabel, value: ref });
    rows.push({ label: 'Média Brasil', value: national });

    const vals = rows.map((x) => x.value).filter((v) => isFinite(v));
    let dmin = Math.min(0, ...vals), dmax = Math.max(0, ...vals);
    const range = (dmax - dmin) || 1;
    dmax += range * 0.16; if (dmin < 0) dmin -= range * 0.05;
    const span = (dmax - dmin) || 1;
    const pos = (v) => ((v - dmin) / span) * 100;
    const zero = pos(0);

    const pct = isFinite(ref) && ref !== 0 ? Math.round(((you - ref) / Math.abs(ref)) * 100) : null;
    let badge = '';
    if (pct !== null) {
      const meta = SEMAFORO_META[cor];
      const txt = Math.abs(pct) <= 2 ? 'na média' : `${Math.abs(pct)}% ${pct > 0 ? 'acima' : 'abaixo'} da média`;
      badge = `<span class="badge ${meta.cls} cmp-badge">${meta.icon}${txt}</span>`;
    }
    const zeroLine = dmin < 0 ? `<span class="dv-zero" style="left:${zero}%"></span>` : '';
    const rowsHtml = rows.map((row) => {
      const p = pos(row.value);
      const left = Math.min(zero, p), width = Math.max(Math.abs(p - zero), 0.8);
      const fillCls = row.you ? `dv-fill dv-${row.cor}` : 'dv-fill dv-ref';
      return `
        <div class="dv-row${row.you ? ' dv-row-you' : ''}">
          <span class="dv-label">${row.label}</span>
          <span class="dv-track">${zeroLine}<span class="${fillCls}" style="left:${left}%;width:${width}%"></span></span>
          <span class="dv-val ${row.value < 0 ? 'negativo' : ''}">${fmt(row.value)}</span>
        </div>`;
    }).join('');
    return `
      <div class="dv-chart">
        <div class="cmp-head"><span class="cmp-name">${nome}</span>${badge}</div>
        <div class="dv-plot">${rowsHtml}</div>
      </div>`;
  }

  function renderBenchmark(r) {
    const refLabel = 'Média ' + r.uf;
    const faixa = faixaAreaLabel(r.area_total);
    const tag = `<div class="perfil-tag">
      <svg width="13" height="13" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 17h14M6 17V9M10 17V5M14 17v-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      <span>Comparado com produtores na sua faixa de área${faixa ? ` (${faixa})` : ''}, na média do <strong>${r.uf}</strong> e do <strong>Brasil</strong></span>
    </div>`;
    const body = r.itens.map((it) => {
      const uf = r.uf;
      const eb = estadoBenchmark(it.cultura, uf);
      const nac = BENCH.nacional[it.cultura];
      const usaNacional = !eb;
      const margemEstado = usaNacional ? (nac ? nac.margem_bruta_ha_ref : 0) : it.ref;
      const margemNacional = nac ? nac.margem_bruta_ha_ref : 0;
      const prodEstado = usaNacional ? (nac ? nac.prod : 0) : eb.prod;
      const prodNacional = nac ? nac.prod : 0;
      const head = r.multi
        ? `<div class="cult-bench-head"><span class="cbh-emoji" aria-hidden="true">${CULTURA_EMOJI[it.cultura] || ''}</span> ${CULTURA_LABEL[it.cultura] || it.cultura}</div>`
        : '';
      const note = usaNacional
        ? `<p class="cmp-note">Ainda não temos média de ${CULTURA_LABEL[it.cultura] || it.cultura} para ${uf} — comparamos com a média do Brasil.</p>`
        : '';
      return `<div class="cult-bench-block">
        ${head}
        ${divergingChart('Margem da lavoura (R$/ha)', true, it.margem_bruta_ha, margemEstado, margemNacional, refLabel, usaNacional)}
        ${divergingChart('Produtividade (sc/ha)', false, it.prod, prodEstado, prodNacional, refLabel, usaNacional)}
        ${note}
      </div>`;
    }).join('');
    el.t3Benchmark.innerHTML = tag + body +
      `<p class="cmp-note">Em breve, vamos trazer também a média da sua <strong>região</strong> e da sua <strong>cidade</strong>.</p>`;
  }

  // Semáforo de CUSTO (invertido: gastar menos que a média é bom).
  function custoSemaforo(you, ref) {
    if (ref === null || ref === undefined || !isFinite(ref) || ref <= 0) return null;
    const eps = ref * 0.05;
    if (you > ref + eps) return 'vermelho';
    if (you < ref - eps) return 'verde';
    return 'amarelo';
  }
  const CUSTO_STATUS_LABEL = { verde: 'abaixo da média', amarelo: 'na média', vermelho: 'acima da média' };

  function renderCostTable(r) {
    el.t3CostTable.innerHTML = r.itens.map((it) => {
      const uf = r.uf;
      const bench = custoBenchmark(it.cultura, uf);
      const head = r.multi
        ? `<h3 style="font-size:var(--fs-sm);color:var(--navy);margin:.25rem 0 .6rem">${CULTURA_EMOJI[it.cultura] || ''} ${CULTURA_LABEL[it.cultura] || it.cultura}</h3>`
        : '';
      const rows = CATEGORIAS.map((cat) => {
        const used = it.custosUsados[cat];
        const benchVal = (bench && bench[cat] !== undefined) ? bench[cat] : null;
        const cor = custoSemaforo(used.valor, benchVal);
        const pill = cor
          ? `<span class="cost-status status-${cor}">${CUSTO_STATUS_LABEL[cor]}</span>`
          : `<span class="cost-status status-neutro">sem referência</span>`;
        const scale = Math.max(used.valor, benchVal || 0, 1) * 1.15;
        const fillW = clamp((used.valor / scale) * 100, 1, 100);
        const refPos = benchVal !== null ? clamp((benchVal / scale) * 100, 0, 100) : null;
        let tag = '';
        if (used.origem === 'benchmark') tag = '<div class="bench-tag">você deixou em branco — usamos a média do estado</div>';
        else if (used.origem === 'zero') tag = '<div class="bench-tag">sem referência para este estado — considerado R$ 0</div>';
        else if (used.origem === 'usuario' && used.mode === 'total') tag = `<div class="bench-tag">de ${fmtBRL(used.valorDigitado)} total ÷ ${fmtNum(it.area)} ha</div>`;
        return `
          <div class="cost-row">
            <div class="cost-row-head"><span class="cat">${CATEGORIA_LABEL[cat]}</span>${pill}</div>
            <div class="cost-bar">
              <span class="cost-bar-fill cost-${cor || 'neutro'}" style="width:${fillW}%"></span>
              ${refPos !== null ? `<span class="cost-bar-ref" style="left:${refPos}%" title="média ${uf}"></span>` : ''}
            </div>
            <div class="cost-row-foot">
              <span>Você: <b>${fmtBRL(used.valor)}</b>/ha</span>
              ${benchVal !== null ? `<span>média ${uf}: ${fmtBRL(benchVal)}/ha</span>` : ''}
            </div>
            ${tag}
          </div>`;
      }).join('');
      return `${head}<div class="cost-table" style="margin-bottom:${r.multi ? '1.25rem' : '0'}">${rows}</div>`;
    }).join('');
  }

  function renderDivida(r) {
    if (!S.divida.tem) { el.t3DividaCard.hidden = true; return; }
    el.t3DividaCard.hidden = false;
    const d = r.divida;
    const pctTxt = d.pct_margem_comprometida === null ? null : d.pct_margem_comprometida.toFixed(0);

    // Didática: parcela não é custo de produção — é saída de caixa.
    el.t3DividaExplain.innerHTML = pctTxt === null
      ? 'A parcela do financiamento <strong>não é custo de produção</strong> — por isso ela não entra na conta da margem. Mas ela sai do seu <strong>caixa</strong>: como o resultado dos grãos ficou zerado ou negativo, a parcela deste ano vai depender de outra renda ou de renegociação.'
      : `A parcela do financiamento <strong>não é custo de produção</strong> — por isso ela não aparece na sua margem. Mas ela sai do seu <strong>caixa</strong>: este ano, consome <strong>${pctTxt}%</strong> do que a lavoura deixa.`;

    el.t3DividaGrid.innerHTML = `
      <div class="debt-item"><div class="k">Parcela por hectare</div><div class="v">${fmtBRL(d.custo_divida_ha)}/ha</div></div>
      <div class="debt-item"><div class="k">Quanto consome do resultado</div><div class="v">${pctTxt === null ? '—' : pctTxt + '%'}</div></div>
    `;
    el.t3Alavancagem.innerHTML = d.alavancagem_anos === null
      ? 'Não deu para calcular quantos anos de lavoura a dívida representa: o resultado dos grãos está zerado ou negativo.'
      : `Sua dívida total equivale a <strong>${d.alavancagem_anos.toFixed(1)} anos</strong> do resultado atual dos seus grãos.`;

    // Margem boa + parcela pesada = aperto de CAIXA, não de margem.
    const margemOk = r.semaforo_headline !== 'vermelho';
    const caixaApertado = d.pct_margem_comprometida === null || d.pct_margem_comprometida > 30;
    el.t3DividaCallout.innerHTML = (margemOk && caixaApertado)
      ? `<div class="debt-callout"><b>Margem boa não é caixa folgado.</b> Sua lavoura vai bem, mas a parcela leva ${pctTxt === null ? 'mais do que o resultado do ano' : pctTxt + '% do que sobra'} — o aperto aqui é de <b>caixa</b>, não de margem. Vale conversar com o banco sobre prazo antes do vencimento.</div>`
      : '';
  }

  function renderDiversificacao() {
    if (!S.atividades.length) { el.t3DiversifCard.hidden = true; return; }
    el.t3DiversifCard.hidden = false;
    const total = S.atividades.reduce((s, a) => s + a.faturamento, 0);
    const tipos = [...new Set(S.atividades.map((a) => ATIVIDADE_LABEL[a.tipo] || a.tipo))].join(', ');
    el.t3DiversifNote.textContent = `Fora dos grãos, você informou ${fmtBRL(total)} de faturamento em ${tipos} no último ano — isso não entra na margem dos grãos acima.`;
  }

  function renderDiagnostico(r) {
    const d = DIAGNOSTICOS[r.classe];
    el.t3DiagCard.className = `diag-card diag-${r.classe}`;
    el.t3DiagCard.innerHTML = `
      <h2>${d.titulo}</h2>
      <p>${d.texto}</p>
      <div class="reco"><span>💡</span><span><b>O que fazer:</b> ${d.recomendacao}</span></div>
    `;
  }

  // Faixa de status — "top 25%" é conquista que produtor persegue (mais forte que "percentil N").
  function tierFromPercentil(p) {
    if (p >= 75) return { label: 'Top 25% mais eficientes', cls: 'tier-top' };
    if (p >= 50) return { label: 'Acima da média da região', cls: 'tier-acima' };
    if (p >= 25) return { label: 'Na média da região', cls: 'tier-media' };
    return { label: 'Abaixo da média da região', cls: 'tier-abaixo' };
  }

  function renderRanking(r) {
    const h = r.headline;
    const cultura = CULTURA_LABEL[h.cultura] || h.cultura;
    const tier = tierFromPercentil(h.percentil);
    el.t3Tier.innerHTML = `<div class="tier-badge ${tier.cls}"><span class="tier-dot"></span>${tier.label}</div>`;
    el.t3RankingTexto.innerHTML = `Sua margem está à frente de <strong class="rank-num" data-target="${h.percentil}">0%</strong> dos produtores de ${cultura} em ${r.uf}${r.multi ? ' <span class="hint" style="display:inline">(sua cultura de maior área)</span>' : ''}.`;
    el.t3RankStats.innerHTML = `
      <div class="rank-stat"><div class="v">${fmtBRL(h.P25)}</div><div class="k">1 em cada 4 ganha menos que isso</div></div>
      <div class="rank-stat"><div class="v">${fmtBRL(h.mediana)}</div><div class="k">O produtor típico</div></div>
      <div class="rank-stat"><div class="v">${fmtBRL(h.P75)}</div><div class="k">1 em cada 4 ganha mais que isso</div></div>
    `;
    el.t3PercentileMarker.dataset.label = 'Você';
    el.t3PercentileMarker.dataset.target = h.percentil;
    el.t3PercentileMarker.style.left = '-1.5px'; // começa no 0; animateRanking() preenche
  }

  // Reveal: conta o "à frente de X%" subindo + o marcador andando até a posição. Pico emocional da tela.
  function animateRanking() {
    const numEl = el.tela3.querySelector('.rank-num');
    const marker = el.t3PercentileMarker;
    const target = +(marker.dataset.target || 0);
    const setFinal = () => {
      if (numEl) numEl.textContent = target + '%';
      marker.style.left = `calc(${target}% - 1.5px)`;
    };
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof requestAnimationFrame !== 'function') { setFinal(); return; }
    const dur = 950; let t0 = null;
    function frame(t) {
      if (t0 === null) t0 = t;
      const k = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      if (numEl) numEl.textContent = Math.round(target * eased) + '%';
      marker.style.left = `calc(${(target * eased).toFixed(1)}% - 1.5px)`;
      if (k < 1) requestAnimationFrame(frame); else setFinal();
    }
    requestAnimationFrame(frame);
  }

  // Medidor de completude — gamifica a QUALIDADE do dado (o que o negócio precisa coletar).
  function renderCompleteness(r) {
    const slots = r.itens.length * CATEGORIAS.length;
    let filled = 0;
    r.itens.forEach((it) => CATEGORIAS.forEach((cat) => { if (it.custosUsados[cat].origem === 'usuario') filled++; }));
    const frac = slots > 0 ? filled / slots : 0;
    const pctReal = Math.round(60 + 40 * frac); // 60% base (produção/terra) + 40% pelos custos reais
    const emBranco = slots - filled;
    const completa = emBranco === 0;
    el.t3Completeness.innerHTML = `
      <div class="completeness ${completa ? 'is-full' : ''}">
        <div class="cpl-top">Sua análise está <b>${pctReal}%</b> baseada nos seus números reais</div>
        <div class="cpl-bar"><span class="cpl-fill" style="width:${pctReal}%"></span></div>
        ${completa
          ? '<p class="cpl-note">Análise completa — todos os custos são seus números reais.</p>'
          : `<p class="cpl-note">Você deixou <b>${emBranco}</b> ${emBranco === 1 ? 'categoria' : 'categorias'} de custo em branco (preenchidas com a média do estado). Refaça informando seus custos reais para a comparação ser 100% sua.</p>`}
      </div>`;
  }

  // Convite genérico — vende a ideia, cita que é gratuito, SEM dados do usuário.
  function buildConviteTexto() {
    return 'Fiz o teste numa calculadora gratuita da Fluxo Rural: em 2 minutos ela mostra a margem por hectare da lavoura e compara com a média do seu estado. Vale fazer a sua: https://fluxorural.com.br/calculadora';
  }
  function renderCTAs(r) {
    const cidade = S.local.cidade ? `${S.local.cidade}, ${r.uf}` : `${r.uf}`;
    el.ctaInviteNote.innerHTML = `As médias que você viu aqui ficam mais precisas a cada produtor que participa. Ajude a destravar a média de <strong>${escapeHtml(cidade)}</strong> — quanto mais gente da sua região usar a calculadora, mais rápido ela sai. <strong>É gratuito.</strong>`;
    el.avisarCidadeNome.textContent = cidade;
    el.btnConvidar.onclick = () => window.open(`https://wa.me/?text=${encodeURIComponent(buildConviteTexto())}`, '_blank', 'noopener');
  }
  el.avisarCidade.addEventListener('change', () => { S.avisar_media_cidade = el.avisarCidade.checked; });

  // ---------- Card compartilhável (orgulho) — PNG desenhado em canvas ----------
  function roundRectPath(ctx, x, y, w, h, rad) {
    if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, w, h, rad); return; }
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.arcTo(x + w, y, x + w, y + h, rad); ctx.arcTo(x + w, y + h, x, y + h, rad);
    ctx.arcTo(x, y + h, x, y, rad); ctx.arcTo(x, y, x + w, y, rad); ctx.closePath();
  }
  const TIER_COLOR = { 'tier-top': '#7AB648', 'tier-acima': '#7AB648', 'tier-media': '#E8B84B', 'tier-abaixo': '#E4572E' };

  async function renderShareCard(r) {
    const canvas = el.shareCanvas; if (!canvas || !canvas.getContext) return;
    try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch (_) {}
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const h = r.headline;
    const tier = tierFromPercentil(h.percentil);
    const head = 'Plus Jakarta Sans, sans-serif';
    const body = 'Inter, sans-serif';
    const center = W / 2;

    // Fundo navy
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#1E4D7B'); g.addColorStop(1, '#0F3352');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center';

    // Marca
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `800 46px ${head}`;
    ctx.fillText('FLUXO RURAL', center, 130);
    ctx.fillStyle = 'rgba(255,255,255,.6)';
    ctx.font = `600 30px ${body}`;
    ctx.fillText('CALCULADORA DE MARGEM', center, 180);

    // Painel claro
    const px = 90, pw = W - px * 2, py = 250, ph = 850;
    ctx.fillStyle = '#F7F4EC';
    roundRectPath(ctx, px, py, pw, ph, 48); ctx.fill();

    // Cultura + local
    ctx.fillStyle = '#5B5B57';
    ctx.font = `700 34px ${body}`;
    ctx.fillText(`${(CULTURA_LABEL[h.cultura] || h.cultura).toUpperCase()} · ${((S.local.cidade ? S.local.cidade + ', ' : '') + r.uf).toUpperCase()}`, center, py + 90);

    // Produtividade (métrica de orgulho do produtor)
    ctx.fillStyle = '#1E4D7B';
    ctx.font = `800 150px ${head}`;
    ctx.fillText(`${fmtNum(h.prod)}`, center, py + 250);
    ctx.fillStyle = '#5B5B57';
    ctx.font = `700 40px ${body}`;
    ctx.fillText('sacas por hectare', center, py + 305);

    // Divisor
    ctx.strokeStyle = 'rgba(28,28,28,.12)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(px + 80, py + 360); ctx.lineTo(px + pw - 80, py + 360); ctx.stroke();

    // Margem por hectare (líquida)
    ctx.fillStyle = '#1B4332';
    ctx.font = `800 96px ${head}`;
    ctx.fillText(fmtBRL(r.margem_conjunta_ha), center, py + 470);
    ctx.fillStyle = '#5B5B57';
    ctx.font = `700 38px ${body}`;
    ctx.fillText('de margem por hectare', center, py + 522);

    // Pílula de faixa (status)
    const pill = tier.label.toUpperCase();
    ctx.font = `800 38px ${head}`;
    const tw = ctx.measureText(pill).width;
    const pillW = tw + 90, pillH = 84, pillX = center - pillW / 2, pillY = py + 610;
    ctx.fillStyle = TIER_COLOR[tier.cls] || '#7AB648';
    roundRectPath(ctx, pillX, pillY, pillW, pillH, pillH / 2); ctx.fill();
    ctx.fillStyle = (tier.cls === 'tier-media') ? '#4A3305' : '#FFFFFF';
    ctx.fillText(pill, center, pillY + 55);

    // Rodapé (CTA)
    ctx.fillStyle = 'rgba(255,255,255,.92)';
    ctx.font = `700 40px ${body}`;
    ctx.fillText('Calcule a sua — é grátis', center, py + ph + 90);
    ctx.fillStyle = 'rgba(255,255,255,.6)';
    ctx.font = `600 34px ${body}`;
    ctx.fillText('fluxorural.com.br/calculadora', center, py + ph + 145);
  }

  const SHARE_TXT = 'Descobri minha margem por hectare na calculadora gratuita da Fluxo Rural. Faça a sua: https://fluxorural.com.br/calculadora';
  function wireShareCard() {
    el.btnShareCard.onclick = () => {
      const canvas = el.shareCanvas;
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'minha-margem-fluxo-rural.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try { await navigator.share({ files: [file], text: SHARE_TXT }); return; } catch (_) { /* cancelou → cai no fallback */ }
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'minha-margem-fluxo-rural.png'; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        window.open(`https://wa.me/?text=${encodeURIComponent(SHARE_TXT)}`, '_blank', 'noopener');
      }, 'image/png');
    };
  }

  function renderTela3() {
    const r = S.resultado;
    const culturasNomes = r.itens.map((i) => CULTURA_LABEL[i.cultura] || i.cultura).join(' + ');
    el.t3Subtitulo.textContent = `${culturasNomes} · ${S.local.cidade ? escapeHtml(S.local.cidade) + ', ' : ''}${r.uf} · safra ${S.safra}`;
    renderResumoExecutivo(r);
    renderBenchmark(r);
    renderCompleteness(r);
    renderCostTable(r);
    renderDivida(r);
    renderDiversificacao();
    renderDiagnostico(r);
    renderRanking(r);
    renderShareCard(r);
    wireShareCard();
    renderCTAs(r);
  }

  // ============================================================
  // Avaliação (estrelas)
  // ============================================================
  function buildRatingStars() {
    el.ratingStars.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const btn = document.createElement('button');
      btn.type = 'button'; btn.setAttribute('role', 'radio'); btn.setAttribute('aria-checked', 'false');
      btn.setAttribute('aria-pressed', 'false'); btn.setAttribute('aria-label', `${i} estrela${i > 1 ? 's' : ''}`);
      btn.dataset.val = i; btn.innerHTML = STAR_SVG;
      btn.addEventListener('click', () => setRatingStars(i));
      el.ratingStars.appendChild(btn);
    }
  }
  function setRatingStars(n) {
    S.avaliacao.estrelas = n;
    el.ratingStars.querySelectorAll('button').forEach((b) => {
      const v = +b.dataset.val;
      b.setAttribute('aria-pressed', v <= n ? 'true' : 'false');
      b.setAttribute('aria-checked', v <= n ? 'true' : 'false');
    });
  }
  buildRatingStars();

  el.btnEnviarAvaliacao.addEventListener('click', async () => {
    if (!S.avaliacao.estrelas) { el.ratingStars.focus(); return; }
    S.avaliacao.comentario = el.ratingComentario.value.trim();
    el.btnEnviarAvaliacao.disabled = true;
    await apiAvaliar(buildAvaliacaoPayload());
    el.ratingThanks.style.display = 'block';
  });

  el.btnPdf.addEventListener('click', () => window.print());

  // ============================================================
  // Cadastro submit — transição Tela 2 → Tela 3
  // ============================================================
  el.formCadastro.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateCadastro()) return;
    S.cadastro = {
      nome: el.regNome.value.trim(), email: el.regEmail.value.trim(),
      whatsapp: el.regWhats.value.trim(), lgpd: el.regLgpd.checked
    };
    el.btnVerDiagnostico.disabled = true;
    const res = await apiCadastrar(buildCadastroPayload());
    if (res && res.id && !S.calcId) S.calcId = res.id;
    fireGenerateLead(S.resultado);
    renderTela3();
    goToScreen(3);
    animateRanking();
  });

  // ============================================================
  // Modo embed + tracking
  // ============================================================
  const qs = new URLSearchParams(location.search);
  if (qs.get('embed') === 'true') document.body.classList.add('is-embed');
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].forEach((k) => {
    const v = qs.get(k);
    if (v) S.tracking[k] = v;
  });
  S.tracking.origem = S.tracking.utm_source ? 'ads-' + S.tracking.utm_source : 'site';

  // ============================================================
  // Benchmark — carga inicial
  // ============================================================
  el.btnComecar.disabled = true;
  el.btnComecar.textContent = 'Carregando…';
  fetch('./benchmark-inicial.json')
    .then((r) => r.json())
    .then((data) => { BENCH = data; benchReady = true; })
    .catch(() => { BENCH = { culturas: {}, nacional: {} }; benchReady = false; })
    .finally(() => {
      el.btnComecar.disabled = false;
      el.btnComecar.textContent = 'Começar →';
    });

  // Início
  showStep('intro');
  goToScreen(1);
})();
