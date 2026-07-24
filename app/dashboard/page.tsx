import React from "react";
import Metadata from "next";

export const metadata = {
  title: "Dashboard de Inteligência e Tráfego | Fluxo Rural",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#202522] font-sans pb-16">
      {/* Header do Dashboard */}
      <header className="bg-[#1B4F7A] text-white py-8 px-4 sm:px-8 border-b-4 border-[#6AAF3D] shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-[#6AAF3D] text-white text-xs px-2.5 py-1 rounded font-bold uppercase tracking-wider">
                Inteligência Agro & Growth
              </span>
              <span className="text-gray-300 text-sm">Atualizado via MCP</span>
            </div>
            <h1 className="text-3xl font-extrabold mt-1 tracking-tight">
              Painel Integrado de Performance & Tráfego
            </h1>
            <p className="text-gray-200 text-sm mt-1">
              Visão consolidada de Google Ads, Google Search Console, GA4 e Recomendações dos Subagentes IA.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 bg-[#143B5C] border border-[#2B6CB0] px-3.5 py-2 rounded-lg text-xs font-medium text-emerald-300">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6AAF3D] animate-pulse"></span>
              Google API MCP Conectado
            </span>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-8 space-y-8">
        {/* KPI Cards Overview */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Teto Orçamentário Diário</div>
            <div className="text-3xl font-black text-[#1B4F7A] mt-2">R$ 50,00<span className="text-xs font-normal text-gray-500">/dia</span></div>
            <div className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
              <span>✓ Reduzido de R$ 300/dia</span>
            </div>
            <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-5 text-[#1B4F7A] font-black text-6xl">
              R$
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Beweather · Search</div>
            <div className="text-3xl font-black text-[#6AAF3D] mt-2">R$ 25,00<span className="text-xs font-normal text-gray-500">/dia</span></div>
            <div className="text-xs text-gray-600 font-medium mt-2">
              CTR: <strong className="text-gray-900">4.68%</strong> | 1 Lead Fechando (SE)
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">eProdutor · Search</div>
            <div className="text-3xl font-black text-[#1B4F7A] mt-2">R$ 20,00<span className="text-xs font-normal text-gray-500">/dia</span></div>
            <div className="text-xs text-gray-600 font-medium mt-2">
              CTR: <strong className="text-gray-900">3.48%</strong> | Foco Produtor
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Palestras B2B</div>
            <div className="text-3xl font-black text-[#E8B84B] mt-2">R$ 5,00<span className="text-xs font-normal text-gray-500">/dia</span></div>
            <div className="text-xs text-gray-600 font-medium mt-2">
              Estratégia Sniper / Alta Intenção
            </div>
          </div>
        </section>

        {/* Bloco 2: Insights dos Subagentes IA */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-[#1B4F7A] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">🤖</span>
              <h2 className="text-lg font-bold text-white">Inteligência Artificial & Agentes Ativos</h2>
            </div>
            <span className="text-xs bg-[#E8B84B] text-[#202522] px-3 py-1 rounded-full font-bold">
              Skill: agro-growth-intelligence
            </span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Agente 1: Agro Traffic & SEO Expert */}
            <div className="bg-[#F7F5EF] p-5 rounded-lg border-l-4 border-[#6AAF3D] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#1B4F7A] flex items-center gap-2">
                  <span>🌾</span> Agro Traffic & SEO Expert
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">Ativo</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                "Análise dos termos de busca reais do Search Console e Google Ads: 3 leads de universidades confirmam apetite acadêmico/institucional para a Beweather. Para otimizar o teto de R$ 50/dia sem desperdício de cliques curiosos, recomendo:"
              </p>
              <ul className="text-xs text-gray-700 space-y-1.5 list-disc list-inside font-medium">
                <li>Adicionar exclusões negativas: <code className="bg-white px-1 py-0.5 rounded border border-gray-300 text-red-700">-tcc, -artigo, -pdf, -curso, -gratis</code></li>
                <li>Ativar lances diferenciados em termos de correspondência exata <code className="bg-white px-1 py-0.5 rounded border text-blue-800">[estação meteorológica fazenda]</code></li>
              </ul>
            </div>

            {/* Agente 2: Growth Hacking Agent */}
            <div className="bg-[#F7F5EF] p-5 rounded-lg border-l-4 border-[#E8B84B] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#1B4F7A] flex items-center gap-2">
                  <span>🚀</span> Growth Hacking Agent
                </h3>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">Ativo</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                "Otimização da taxa de conversão (CRO) e qualificação rápida de funil:"
              </p>
              <ul className="text-xs text-gray-700 space-y-1.5 list-disc list-inside font-medium">
                <li>Implementar campo "Perfil do Comprador" (Fazendeiro / Universidade / Consultor) no WhatsApp da Beweather para roteamento imediato de vendas.</li>
                <li>Aproveitar a vitória do lead de Sergipe como prova social contextualizada no Nordeste.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Bloco 3: Tabela de Busca Orgânica & Campanhas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Busca Orgânica (Google Search Console) */}
          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="font-bold text-[#1B4F7A] text-base flex items-center gap-2">
                <span>🔎</span> Busca Orgânica (Search Console)
              </h2>
              <span className="text-xs text-gray-500 font-medium">4 Domínios Conectados</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-[#F7F5EF] rounded border border-gray-200 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-[#1B4F7A]">fluxorural.com.br</div>
                  <div className="text-gray-500">Consultoria Rural, Palestras & Gestão</div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-[11px] font-semibold">Proprietário</span>
              </div>

              <div className="p-3 bg-[#F7F5EF] rounded border border-gray-200 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-[#1B4F7A]">beweather.fluxorural.com.br</div>
                  <div className="text-gray-500">Estações Meteorológicas Agrícolas</div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-[11px] font-semibold">Proprietário</span>
              </div>

              <div className="p-3 bg-[#F7F5EF] rounded border border-gray-200 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-[#1B4F7A]">eprodutor.fluxorural.com.br</div>
                  <div className="text-gray-500">Gestão Financeira e Fiscal de Fazendas</div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-[11px] font-semibold">Proprietário</span>
              </div>
            </div>
          </section>

          {/* Tráfego Pago (Google Ads Status) */}
          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="font-bold text-[#1B4F7A] text-base flex items-center gap-2">
                <span>🎯</span> Status das Campanhas Google Ads
              </h2>
              <span className="text-xs text-gray-500 font-medium">Conta: 8239842688</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white border border-gray-200 rounded flex justify-between items-center">
                <div>
                  <span className="font-bold text-gray-900">Beweather · Search</span>
                  <div className="text-gray-500">Captação de Leads Estações</div>
                </div>
                <div className="text-right">
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">ATIVA</span>
                  <div className="text-gray-600 font-medium mt-0.5">R$ 25,00/dia</div>
                </div>
              </div>

              <div className="p-3 bg-white border border-gray-200 rounded flex justify-between items-center">
                <div>
                  <span className="font-bold text-gray-900">eProdutor · Search · Fase 1</span>
                  <div className="text-gray-500">Gestão Agronômica e Fiscal</div>
                </div>
                <div className="text-right">
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">ATIVA</span>
                  <div className="text-gray-600 font-medium mt-0.5">R$ 20,00/dia</div>
                </div>
              </div>

              <div className="p-3 bg-white border border-gray-200 rounded flex justify-between items-center">
                <div>
                  <span className="font-bold text-gray-900">Palestras e Eventos B2B</span>
                  <div className="text-gray-500">Contratação Lucas Dierings</div>
                </div>
                <div className="text-right">
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">ATIVA</span>
                  <div className="text-gray-600 font-medium mt-0.5">R$ 5,00/dia</div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded flex justify-between items-center opacity-75">
                <div>
                  <span className="font-bold text-gray-600 line-through">Calculadora de Margem</span>
                  <div className="text-gray-400">Captura B2C</div>
                </div>
                <div className="text-right">
                  <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-bold">PAUSADA</span>
                  <div className="text-gray-500 font-medium mt-0.5">R$ 0,00/dia</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
