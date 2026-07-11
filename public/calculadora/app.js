// Fluxo Rural — Calculadora de Margem por Hectare.
// Fase 1 (Round 2): wizard guiado + culturas individuais (array). Cálculo 100% no navegador (benchmark-inicial.json).
// Fase 2 (futura): apiCalcular/apiCadastrar/apiAvaliar passam a chamar POST /api/calculadora de verdade.

(function () {
  'use strict';

  // ============================================================
  // Constantes
  // ============================================================
  const WHATSAPP_URL = 'https://wa.me/5545991447004'; // número usado no site (Footer.tsx) — ajustar se a Fluxo Rural tiver linha dedicada
  const AGENDAR_URL = 'https://wa.me/5545991447004';   // Fase 1: sem agenda dedicada, direciona pro WhatsApp

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
    intro: 0.03, fazenda: 0.14, cultura_escolha: 0.30, cultura_producao: 0.45,
    cultura_custos: 0.60, cultura_add: 0.70, arrendamento: 0.82, divida: 0.90, atividades: 0.97
  };
  const STEP_LABEL = {
    intro: 'Bem-vindo', fazenda: 'Sua fazenda', cultura_escolha: 'Sua lavoura',
    cultura_producao: 'Produção', cultura_custos: 'Custos', cultura_add: 'Suas culturas',
    arrendamento: 'Arrendamento', divida: 'Dívida', atividades: 'Outras atividades'
  };

  // ============================================================
  // Estado global (Round 2 — culturas individuais em array)
  // ============================================================
  function novaCultura() {
    return {
      cultura: '', area: null, prod: null, preco: null,
      custo_mode: 'ha',
      custos: { sementes: null, defensivos: null, fertilizantes: null, diesel: null, mao_obra: null, manutencao: null, admin: null }
    };
  }

  const S = {
    screen: 1,
    tracking: {},
    safra: '2025/2026',
    local: { uf: '', cidade: '' },
    culturas: [],       // [{ cultura, area, prod, preco, custo_mode, custos:{...} }]
    editIndex: -1,      // índice da cultura sendo editada no loop
    arrendamento: { unidade: 'rs_ha', valor: 0 },
    divida: { tem: false, total: 0, parcela: 0, taxa: null },
    atividades: [],
    cadastro: { nome: '', email: '', whatsapp: '', lgpd: false },
    interesse_gestao: false,
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
    if (s.includes(',') && s.includes('.')) {
      s = s.replace(/\./g, '').replace(',', '.');
    } else if (s.includes(',')) {
      s = s.replace(',', '.');
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

    // Arrendamento: aplica a toda a área. Conversão sc/ha usa o preço da 1ª cultura.
    const precoPrimeira = culturas.length ? culturas[0].preco : 0;
    const arrendValor = S.arrendamento.valor || 0;
    const arrendRsHa = S.arrendamento.unidade === 'sc_ha' ? arrendValor * precoPrimeira : arrendValor;

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
          // custo_mode 'total' → dividir pela área DESTA cultura; 'ha' → usar direto
          valor_ha = c.custo_mode === 'total' ? (c.area > 0 ? digitado / c.area : 0) : digitado;
          origem = 'usuario';
        } else if (bench && bench[cat] !== undefined) {
          valor_ha = bench[cat]; origem = 'benchmark';
        } else {
          valor_ha = 0; origem = 'zero';
        }
        custosUsados[cat] = { valor: valor_ha, origem, valorDigitado, mode: c.custo_mode };
        custo_ha += valor_ha;
      });
      const margem_bruta_ha = receita_ha - custo_ha - arrendRsHa;
      const resultado = margem_bruta_ha * c.area;

      // Benchmark POR CULTURA
      const ref = margemRefEstado(c.cultura, uf);
      const pct_vs_estado = ref !== 0 ? ((margem_bruta_ha - ref) / ref) * 100 : null;
      let semaforo = 'verde';
      if (margem_bruta_ha < 0.8 * ref) semaforo = 'vermelho';
      else if (margem_bruta_ha < ref) semaforo = 'amarelo';

      // Percentil por cultura (vs distribuição do seed)
      const sd = 0.4 * Math.abs(ref) || 1;
      const z = (margem_bruta_ha - ref) / sd;
      const percentil = clamp(Math.round(100 * normalCDF(z)), 1, 99);

      return {
        cultura: c.cultura, area: c.area, prod: c.prod, preco: c.preco, custo_mode: c.custo_mode,
        receita_ha, custo_ha, custosUsados, arrend_rs_ha: arrendRsHa, margem_bruta_ha, resultado,
        ref, pct_vs_estado, semaforo, percentil, temBenchmarkEstado: !!bench,
        P25: ref * 0.75, mediana: ref, P75: ref * 1.3
      };
    });

    const area_total = itens.reduce((s, i) => s + i.area, 0);
    const resultado_graos = itens.reduce((s, i) => s + i.resultado, 0);
    const margem_conjunta_ha = area_total > 0 ? resultado_graos / area_total : 0;
    const receita_total = itens.reduce((s, i) => s + i.receita_ha * i.area, 0);
    const custo_total = itens.reduce((s, i) => s + (i.custo_ha + i.arrend_rs_ha) * i.area, 0);

    // Benchmark PONDERADO por área (para a headline / diagnóstico)
    const ref_ponderado = area_total > 0 ? itens.reduce((s, i) => s + i.ref * i.area, 0) / area_total : 0;
    const pct_vs_estado_ponderado = ref_ponderado !== 0 ? ((margem_conjunta_ha - ref_ponderado) / ref_ponderado) * 100 : null;
    let semaforo_headline = 'verde';
    if (margem_conjunta_ha < 0.8 * ref_ponderado) semaforo_headline = 'vermelho';
    else if (margem_conjunta_ha < ref_ponderado) semaforo_headline = 'amarelo';

    // Cultura headline = a de MAIOR área (para ranking/percentil no topo)
    const headline = itens.reduce((best, i) => (!best || i.area > best.area ? i : best), null) || itens[0];

    // Dívida
    let divida = null;
    if (S.divida.tem) {
      const custo_divida_ha = area_total > 0 ? S.divida.parcela / area_total : 0;
      const pct_margem_comprometida = resultado_graos > 0 ? (S.divida.parcela / resultado_graos) * 100 : null;
      const alavancagem_anos = resultado_graos > 0 ? S.divida.total / resultado_graos : null;
      divida = { custo_divida_ha, pct_margem_comprometida, alavancagem_anos };
    }

    // Diagnóstico (margem conjunta vs benchmark ponderado)
    const p_margem = margem_conjunta_ha < 0.8 * ref_ponderado;
    const p_caixa = S.divida.tem && (divida.pct_margem_comprometida === null || divida.pct_margem_comprometida > 30);
    const p_end = S.divida.tem && (resultado_graos <= 0 || S.divida.total > 2 * resultado_graos);
    const nFlags = [p_margem, p_caixa, p_end].filter(Boolean).length;

    // Classe = primeiro problema detectado; se nenhuma das 3 flags disparou, é saudável.
    let classe;
    if (nFlags >= 2) classe = 'multiplos';
    else if (p_margem) classe = 'margem';
    else if (p_end) classe = 'endividamento';
    else if (p_caixa) classe = 'caixa';
    else classe = 'saudavel';

    return {
      uf, itens, headline, multi: itens.length >= 2,
      area_total, resultado_graos, margem_conjunta_ha, receita_total, custo_total,
      ref_ponderado, pct_vs_estado_ponderado, semaforo_headline,
      divida, classe, flags: { p_margem, p_caixa, p_end }, arrendRsHa
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
    'lUf', 'lCidade', 'pSafra',
    'wzEscolhaTitle', 'culturaChips', 'escolhaError',
    'wzProdCultura', 'pArea', 'pProd', 'pPreco', 'btnMediaProd', 'btnMediaPreco', 'wzReceitaLive',
    'wzCustosCultura', 'custoModeToggle', 'btnMediaCustos', 'wzCustoLive',
    'cSementes', 'cDefensivos', 'cFertilizantes', 'cDiesel', 'cMaoObra', 'cManutencao', 'cAdmin',
    'culturasResumo', 'btnAddOutra',
    'arrendUnidade', 'arrendValor', 'arrendValorLabel',
    'dividaToggle', 'dividaCampos', 'dTotal', 'dParcela', 'dTaxa',
    'atividadesList', 'btnAddAtividade', 'btnVerMargem',
    't2Margem', 't2Compare', 't2Semaforo',
    'formCadastro', 'regNome', 'regEmail', 'regWhats', 'regLgpd', 'btnVerDiagnostico',
    't3Subtitulo', 't3ResumoGrid', 't3CulturasBlocks', 't3Benchmark', 't3CostTable',
    't3DividaCard', 't3DividaGrid', 't3Alavancagem',
    't3DiversifCard', 't3DiversifNote', 't3DiagCard',
    't3RankingTexto', 't3RankStats', 't3PercentileMarker',
    'interesseGestao', 'ctaWhatsapp', 'ctaAgendar', 'btnPdf', 'btnShare',
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
  function apiInteresse() {
    if (!S.calcId) return;
    postAPI('interesse', { calcId: S.calcId, interesse_gestao: S.interesse_gestao });
  }

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
  // WIZARD — controlador
  // ============================================================
  const STEP_EL = {
    intro: 'wz-intro', fazenda: 'wz-fazenda', cultura_escolha: 'wz-cultura_escolha',
    cultura_producao: 'wz-cultura_producao', cultura_custos: 'wz-cultura_custos',
    cultura_add: 'wz-cultura_add', arrendamento: 'wz-arrendamento', divida: 'wz-divida', atividades: 'wz-atividades'
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
      const ok = el.lUf.value !== '';
      markInvalid(el.lUf, !ok);
      if (!ok) el.lUf.focus();
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
      S.local.cidade = el.lCidade.value.trim();
      S.safra = el.pSafra.value;
    } else if (step === 'cultura_producao') {
      const c = cur(); if (!c) return;
      c.area = numOrZero(el.pArea.value);
      c.prod = numOrZero(el.pProd.value);
      c.preco = numOrZero(el.pPreco.value);
    } else if (step === 'cultura_custos') {
      const c = cur(); if (!c) return;
      c.custo_mode = el.custoModeToggle.querySelector('[aria-pressed="true"]').dataset.val;
      CATEGORIAS.forEach((cat) => { c.custos[cat] = numOrNull(document.getElementById(CATEGORIA_INPUT_ID[cat]).value); });
    } else if (step === 'arrendamento') {
      S.arrendamento.unidade = el.arrendUnidade.querySelector('[aria-pressed="true"]').dataset.val;
      S.arrendamento.valor = numOrZero(el.arrendValor.value);
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
      el.lUf.value = S.local.uf; el.lCidade.value = S.local.cidade; el.pSafra.value = S.safra;
    } else if (step === 'cultura_escolha') {
      renderChips();
    } else if (step === 'cultura_producao') {
      const c = cur(); if (!c) return;
      el.wzProdCultura.textContent = CULTURA_LABEL[c.cultura] || '';
      el.pArea.value = c.area != null ? String(c.area).replace('.', ',') : '';
      el.pProd.value = c.prod != null ? String(c.prod).replace('.', ',') : '';
      el.pPreco.value = c.preco != null ? String(c.preco).replace('.', ',') : '';
      [el.pArea, el.pProd, el.pPreco].forEach((i) => markInvalid(i, false));
      updateMediaProducao();
      updateReceitaLive();
    } else if (step === 'cultura_custos') {
      const c = cur(); if (!c) return;
      el.wzCustosCultura.textContent = CULTURA_LABEL[c.cultura] || '';
      setSegmented(el.custoModeToggle, c.custo_mode);
      CATEGORIAS.forEach((cat) => {
        const inp = document.getElementById(CATEGORIA_INPUT_ID[cat]);
        inp.value = c.custos[cat] != null ? String(c.custos[cat]).replace('.', ',') : '';
      });
      updateCustoLabels();
      updateMediaCustos();
      updateCustoLive();
    } else if (step === 'cultura_add') {
      renderResumoCulturas();
    } else if (step === 'arrendamento') {
      setSegmented(el.arrendUnidade, S.arrendamento.unidade);
      el.arrendValor.value = S.arrendamento.valor ? String(S.arrendamento.valor).replace('.', ',') : '';
      updateArrendLabel();
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
        S.culturas.push(novaCultura()); S.editIndex = S.culturas.length - 1;
        showStep('cultura_escolha'); break;
      case 'cultura_escolha':
        showStep('cultura_producao'); break;
      case 'cultura_producao':
        showStep('cultura_custos'); break;
      case 'cultura_custos':
        showStep('cultura_add'); break;
      case 'arrendamento':
        showStep('divida'); break;
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
      case 'cultura_escolha':
        // descarta a cultura em edição (ainda incompleta)
        S.culturas.splice(S.editIndex, 1); S.editIndex = -1;
        if (S.culturas.length) { S.editIndex = S.culturas.length - 1; showStep('cultura_add'); }
        else showStep('fazenda');
        break;
      case 'cultura_producao':
        showStep('cultura_escolha'); break;
      case 'cultura_custos':
        showStep('cultura_producao'); break;
      case 'cultura_add':
        S.editIndex = S.culturas.length - 1; showStep('cultura_custos'); break;
      case 'arrendamento':
        showStep('cultura_add'); break;
      case 'divida':
        showStep('arrendamento'); break;
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
    else if (action === 'continue') { showStep('arrendamento'); }
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

  // ---------- Botões "usar média" (produção) ----------
  function updateMediaProducao() {
    const c = cur(); if (!c) return;
    const eb = estadoBenchmark(c.cultura, S.local.uf);
    if (benchReady && eb) {
      el.btnMediaProd.hidden = false;
      el.btnMediaProd.innerHTML = `${ICON_MAGIC} usar média ${S.local.uf}: ${fmtNum(eb.prod)} sc/ha`;
      el.btnMediaPreco.hidden = false;
      el.btnMediaPreco.innerHTML = `${ICON_MAGIC} usar média ${S.local.uf}: ${fmtBRL(eb.preco)}/sc`;
    } else {
      el.btnMediaProd.hidden = true;
      el.btnMediaPreco.hidden = true;
    }
  }
  el.btnMediaProd.addEventListener('click', () => {
    const eb = estadoBenchmark(cur().cultura, S.local.uf); if (!eb) return;
    el.pProd.value = String(eb.prod).replace('.', ','); markInvalid(el.pProd, false); updateReceitaLive();
  });
  el.btnMediaPreco.addEventListener('click', () => {
    const eb = estadoBenchmark(cur().cultura, S.local.uf); if (!eb) return;
    el.pPreco.value = String(eb.preco).replace('.', ','); markInvalid(el.pPreco, false); updateReceitaLive();
  });

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

  // ---------- Custos: modo, média, labels, live ----------
  wireSegmented(el.custoModeToggle, (val) => {
    if (cur()) cur().custo_mode = val;
    updateCustoLabels();
    updateCustoLive();
  });

  function updateCustoLabels() {
    const c = cur();
    const modo = c ? c.custo_mode : 'ha';
    const eb = estadoBenchmark(c ? c.cultura : '', S.local.uf);
    CATEGORIAS.forEach((cat) => {
      const inp = document.getElementById(CATEGORIA_INPUT_ID[cat]);
      if (modo === 'ha' && benchReady && eb && eb.custos && eb.custos[cat] !== undefined) {
        inp.placeholder = `média: ${fmtBRL(eb.custos[cat])}`;
      } else if (modo === 'total') {
        inp.placeholder = 'R$ total';
      } else {
        inp.placeholder = 'opcional';
      }
    });
  }
  function updateMediaCustos() {
    const c = cur();
    const eb = estadoBenchmark(c ? c.cultura : '', S.local.uf);
    const ok = benchReady && eb && eb.custos;
    el.btnMediaCustos.disabled = !ok;
    el.btnMediaCustos.textContent = ok ? `Usar a média de ${S.local.uf}` : 'Média do estado indisponível';
  }
  el.btnMediaCustos.addEventListener('click', () => {
    const c = cur(); if (!c) return;
    const eb = estadoBenchmark(c.cultura, S.local.uf); if (!eb || !eb.custos) return;
    // Preencher em modo "por hectare" (o benchmark é sempre R$/ha)
    setSegmented(el.custoModeToggle, 'ha'); c.custo_mode = 'ha';
    CATEGORIAS.forEach((cat) => {
      const inp = document.getElementById(CATEGORIA_INPUT_ID[cat]);
      inp.value = String(eb.custos[cat]).replace('.', ',');
    });
    updateCustoLabels();
    updateCustoLive();
  });

  function updateCustoLive() {
    const c = cur(); if (!c) return;
    const area = numOrZero(el.pArea.value) || c.area || 0;
    const modo = el.custoModeToggle.querySelector('[aria-pressed="true"]').dataset.val;
    const eb = estadoBenchmark(c.cultura, S.local.uf);
    const bench = eb ? eb.custos : null;
    let custo_ha = 0;
    CATEGORIAS.forEach((cat) => {
      const raw = document.getElementById(CATEGORIA_INPUT_ID[cat]).value;
      const dig = numOrNull(raw);
      if (dig !== null) custo_ha += (modo === 'total' ? (area > 0 ? dig / area : 0) : dig);
      else if (bench && bench[cat] !== undefined) custo_ha += bench[cat];
    });
    const receita_ha = (numOrZero(el.pProd.value) || c.prod || 0) * (numOrZero(el.pPreco.value) || c.preco || 0);
    const margem_prev = receita_ha - custo_ha; // sem arrendamento (ainda não informado)
    el.wzCustoLive.classList.remove('empty');
    el.wzCustoLive.innerHTML =
      `<span class="lf-item">Custo estimado: <b>${fmtBRL(custo_ha)}</b>/ha</span>` +
      `<span class="lf-sep">·</span>` +
      `<span class="lf-item">Margem bruta: <b class="${margem_prev < 0 ? 'negativo' : ''}">${fmtBRL(margem_prev)}</b>/ha</span>`;
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

  // ---------- Arrendamento ----------
  wireSegmented(el.arrendUnidade, (val) => { S.arrendamento.unidade = val; updateArrendLabel(); });
  function updateArrendLabel() {
    const sc = S.arrendamento.unidade === 'sc_ha';
    el.arrendValorLabel.textContent = sc ? 'Valor do arrendamento (sc/ha)' : 'Valor do arrendamento (R$/ha)';
    el.arrendValor.placeholder = sc ? 'Ex: 5' : 'Ex: 0';
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
      safra: S.safra, local: S.local,
      culturas: S.culturas, arrendamento: S.arrendamento, divida: S.divida, atividades: S.atividades,
      tracking: S.tracking, resultado: S.resultado
    };
  }
  function buildCadastroPayload() {
    return {
      calcId: S.calcId, cadastro: S.cadastro, interesse_gestao: S.interesse_gestao,
      safra: S.safra, local: S.local, culturas: S.culturas,
      arrendamento: S.arrendamento, divida: S.divida, atividades: S.atividades,
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
    el.t2Margem.innerHTML = `${fmtBRL(r.margem_conjunta_ha)}<small>/ha</small>`;
    el.t2Margem.classList.toggle('negativo', r.margem_conjunta_ha < 0);

    if (r.pct_vs_estado_ponderado === null) {
      el.t2Compare.textContent = `Ainda não temos referência suficiente de mercado para comparar com ${r.uf}.`;
    } else {
      const abs = Math.abs(r.pct_vs_estado_ponderado).toFixed(0);
      const dir = r.pct_vs_estado_ponderado >= 0 ? 'acima' : 'abaixo';
      el.t2Compare.innerHTML = `Você está <strong>${abs}% ${dir}</strong> da média de ${r.uf}.`;
    }
    const meta = SEMAFORO_META[r.semaforo_headline];
    el.t2Semaforo.innerHTML = `<span class="badge ${meta.cls}">${meta.icon}${meta.label}</span>`;
  }

  // ============================================================
  // Render — Tela 3
  // ============================================================
  function renderResumoExecutivo(r) {
    const margemLabel = r.multi ? 'Margem bruta conjunta (R$/ha)' : 'Margem bruta (R$/ha)';
    const margemVal = r.multi ? r.margem_conjunta_ha : r.itens[0].margem_bruta_ha;
    el.t3ResumoGrid.innerHTML = `
      <div class="summary-item"><div class="k">${margemLabel}</div><div class="v ${margemVal < 0 ? 'negativo' : ''}">${fmtBRL(margemVal)}</div></div>
      <div class="summary-item"><div class="k">Receita total</div><div class="v">${fmtBRL(r.receita_total)}</div></div>
      <div class="summary-item"><div class="k">Custo total</div><div class="v">${fmtBRL(r.custo_total)}</div></div>
      <div class="summary-item"><div class="k">Resultado dos grãos</div><div class="v ${r.resultado_graos < 0 ? 'negativo' : ''}">${fmtBRL(r.resultado_graos)}</div></div>
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

  // Gráfico horizontal com marcadores de média (estado + nacional) sobre a barra.
  function markerChart(nome, isCurrency, you, state, national, usaNacionalComoEstado) {
    const fmt = isCurrency ? ((v) => fmtBRL(v)) : ((v) => fmtNum(v) + ' sc');
    const vals = [you, state, national].filter((v) => typeof v === 'number' && isFinite(v));
    let dmin = Math.min(0, ...vals);
    let dmax = Math.max(...vals);
    if (dmax <= dmin) dmax = dmin + 1;
    const range = dmax - dmin;
    dmax += range * 0.14;                 // headroom p/ o marcador não colar na borda
    if (dmin < 0) dmin -= range * 0.06;
    const span = dmax - dmin || 1;
    const pos = (v) => clamp(((v - dmin) / span) * 100, 0, 100);
    const zeroPos = pos(0);
    const youPos = pos(you);
    const barLeft = Math.min(zeroPos, youPos);
    const barW = Math.max(Math.abs(youPos - zeroPos), 1.2);
    const stateLbl = usaNacionalComoEstado ? 'média BR' : 'média ' + S.resultado.uf;
    return `
      <div class="mkchart">
        <div class="mkchart-top"><span class="mk-name">${nome} — você</span><span class="mk-you">${fmt(you)}${isCurrency ? '/ha' : '/ha'}</span></div>
        <div class="mkchart-plot">
          ${dmin < 0 ? `<div class="mkchart-zero" style="left:${zeroPos}%"></div>` : ''}
          <div class="mkchart-fill ${you < 0 ? 'negativo' : ''}" style="left:${barLeft}%;width:${barW}%"></div>
          <div class="mk-mark mk-state" style="left:${pos(state)}%"><span class="mk-label">${stateLbl}: ${fmt(state)}</span></div>
          ${!usaNacionalComoEstado ? `<div class="mk-mark mk-nac" style="left:${pos(national)}%"><span class="mk-label">média BR: ${fmt(national)}</span></div>` : ''}
        </div>
      </div>`;
  }

  function renderBenchmark(r) {
    el.t3Benchmark.innerHTML = r.itens.map((it) => {
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
        ? `<p class="mkchart-note">Sem amostra própria de ${CULTURA_LABEL[it.cultura] || it.cultura} em ${uf} — usamos a referência nacional como média.</p>`
        : '';
      return `<div class="cult-bench-block">
        ${head}
        ${markerChart('Margem bruta', true, it.margem_bruta_ha, margemEstado, margemNacional, usaNacional)}
        ${markerChart('Produtividade', false, it.prod, prodEstado, prodNacional, usaNacional)}
        ${note}
      </div>`;
    }).join('');
  }

  function renderCostTable(r) {
    el.t3CostTable.innerHTML = r.itens.map((it) => {
      const uf = r.uf;
      const bench = custoBenchmark(it.cultura, uf);
      const head = r.multi
        ? `<h3 style="font-size:var(--fs-sm);color:var(--navy);margin:.25rem 0 .6rem">${CULTURA_EMOJI[it.cultura] || ''} ${CULTURA_LABEL[it.cultura] || it.cultura}</h3>`
        : '';
      const rows = CATEGORIAS.map((cat) => {
        const used = it.custosUsados[cat];
        const benchVal = bench ? bench[cat] : null;
        let dirHtml, benchTag = '';
        if (benchVal !== null && benchVal !== undefined) {
          const diff = used.valor - benchVal;
          const eps = Math.max(1, Math.abs(benchVal) * 0.02);
          const dirCls = diff > eps ? 'dir-up' : (diff < -eps ? 'dir-down' : 'dir-eq');
          const dirSym = diff > eps ? '↑' : (diff < -eps ? '↓' : '≈');
          dirHtml = `<span class="dir ${dirCls}" title="${diff > eps ? 'acima da média' : diff < -eps ? 'abaixo da média' : 'na média'}">${dirSym}</span>`;
        } else {
          dirHtml = `<span class="dir dir-eq" title="sem referência">—</span>`;
        }
        if (used.origem === 'benchmark') benchTag = '<div class="bench-tag">usou média do estado</div>';
        else if (used.origem === 'zero') benchTag = '<div class="bench-tag">sem referência para este estado — considerado R$ 0</div>';
        else if (used.origem === 'usuario' && used.mode === 'total') benchTag = `<div class="bench-tag">de ${fmtBRL(used.valorDigitado)} total ÷ ${fmtNum(it.area)} ha</div>`;
        return `
          <div class="cost-row">
            <span class="cat">${CATEGORIA_LABEL[cat]}</span>
            <span class="num">${fmtBRL(used.valor)}</span>
            <span class="num">${benchVal !== null && benchVal !== undefined ? fmtBRL(benchVal) : '—'}</span>
            ${dirHtml}
            ${benchTag}
          </div>`;
      }).join('');
      return `${head}<div class="cost-table" style="margin-bottom:${r.multi ? '1.25rem' : '0'}">${rows}</div>`;
    }).join('');
  }

  function renderDivida(r) {
    if (!S.divida.tem) { el.t3DividaCard.hidden = true; return; }
    el.t3DividaCard.hidden = false;
    const d = r.divida;
    el.t3DividaGrid.innerHTML = `
      <div class="debt-item"><div class="k">Custo da dívida</div><div class="v">${fmtBRL(d.custo_divida_ha)}/ha</div></div>
      <div class="debt-item"><div class="k">Margem comprometida</div><div class="v">${d.pct_margem_comprometida === null ? '—' : d.pct_margem_comprometida.toFixed(0) + '%'}</div></div>
    `;
    el.t3Alavancagem.innerHTML = d.alavancagem_anos === null
      ? 'Não foi possível calcular a alavancagem: o resultado dos grãos está zerado ou negativo.'
      : `Sua dívida equivale a <strong>${d.alavancagem_anos.toFixed(1)} anos</strong> da sua margem bruta atual.`;
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

  function renderRanking(r) {
    const h = r.headline;
    const cultura = CULTURA_LABEL[h.cultura] || h.cultura;
    el.t3RankingTexto.innerHTML = `Você está no percentil <strong>${h.percentil}</strong> entre produtores de ${cultura} em ${r.uf}${r.multi ? ' <span class="hint" style="display:inline">(sua cultura de maior área)</span>' : ''}.`;
    el.t3RankStats.innerHTML = `
      <div class="rank-stat"><div class="v">${fmtBRL(h.P25)}</div><div class="k">Bottom 25% (abaixo de)</div></div>
      <div class="rank-stat"><div class="v">${fmtBRL(h.mediana)}</div><div class="k">Mediana</div></div>
      <div class="rank-stat"><div class="v">${fmtBRL(h.P75)}</div><div class="k">Top 25% (acima de)</div></div>
    `;
    el.t3PercentileMarker.style.left = `calc(${h.percentil}% - 1.5px)`;
    el.t3PercentileMarker.dataset.label = `Você: ${h.percentil}º`;
  }

  function buildResumoTexto() {
    const r = S.resultado;
    const cultura = CULTURA_LABEL[r.headline.cultura] || r.headline.cultura;
    return `Calculei minha margem bruta na Calculadora Fluxo Rural: ${fmtBRL(r.margem_conjunta_ha)}/ha na fazenda (${r.uf}). Cultura principal: ${cultura}, percentil ${r.headline.percentil}º. Confira: https://fluxorural.com.br/calculadora`;
  }
  function renderCTAs() {
    el.ctaWhatsapp.href = `${WHATSAPP_URL}?text=${encodeURIComponent('Olá! Acabei de calcular minha margem por hectare na calculadora da Fluxo Rural e quero entender melhor os resultados.')}`;
    el.ctaAgendar.href = `${AGENDAR_URL}?text=${encodeURIComponent('Olá! Gostaria de agendar uma apresentação com a Fluxo Rural.')}`;
    el.btnShare.onclick = () => window.open(`https://wa.me/?text=${encodeURIComponent(buildResumoTexto())}`, '_blank', 'noopener');
  }

  function renderTela3() {
    const r = S.resultado;
    const culturasNomes = r.itens.map((i) => CULTURA_LABEL[i.cultura] || i.cultura).join(' + ');
    el.t3Subtitulo.textContent = `${culturasNomes} · ${S.local.cidade ? escapeHtml(S.local.cidade) + ', ' : ''}${r.uf} · safra ${S.safra}`;
    renderResumoExecutivo(r);
    renderBenchmark(r);
    renderCostTable(r);
    renderDivida(r);
    renderDiversificacao();
    renderDiagnostico(r);
    renderRanking(r);
    renderCTAs();
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

  el.interesseGestao.addEventListener('change', () => {
    S.interesse_gestao = el.interesseGestao.checked;
    apiInteresse();
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
