import React from "react";

export const metadata = {
  title: "Painel Integrado de Inteligência & Tráfego | Fluxo Rural",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#202522] font-sans pb-20">
      {/* Header com Identidade Visual Editorial Rural */}
      <header className="bg-[#1B4F7A] text-white py-8 px-4 sm:px-8 border-b-4 border-[#6AAF3D] shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#6AAF3D] text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Painel Geral em Português
              </span>
              <span className="text-gray-300 text-xs">Dados Conectados via MCP</span>
            </div>
            <h1 className="text-3xl font-black mt-2 tracking-tight">
              Central de Inteligência de Vendas & Tráfego
            </h1>
            <p className="text-gray-200 text-sm mt-1">
              Acompanhamento de Acessos, Leads, Artigos do Blog e Origem dos Visitantes (Fluxo Rural, Beweather e Palestras).
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href="/" 
              className="bg-[#143B5C] hover:bg-[#0E2A43] text-white text-xs font-semibold px-4 py-2.5 rounded-lg border border-[#2B6CB0] transition-colors"
            >
              ← Voltar ao Site Principal
            </a>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-8 space-y-8">
        
        {/* BLOCO 1: KPI Cards - Métricas Principais */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Visualizações Totais do Site</div>
            <div className="text-3xl font-black text-[#1B4F7A] mt-2">1.978 <span className="text-xs font-normal text-gray-500">acessos</span></div>
            <div className="text-xs text-emerald-700 font-semibold mt-2 flex items-center gap-1">
              <span>↑ +18.4% vs mês anterior</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Leads Gerados (WhatsApp / Form)</div>
            <div className="text-3xl font-black text-[#6AAF3D] mt-2">5 <span className="text-xs font-normal text-gray-500">contatos diretos</span></div>
            <div className="text-xs text-emerald-700 font-semibold mt-2">
              1 Venda Beweather Fechando (Sergipe)
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Orçamento Diário Ativo</div>
            <div className="text-3xl font-black text-[#1B4F7A] mt-2">R$ 50,00<span className="text-xs font-normal text-gray-500">/dia</span></div>
            <div className="text-xs text-blue-700 font-semibold mt-2">
              Beweather (25) | eProdutor (20) | Palestras (5)
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Calculadora de Margem</div>
            <div className="text-3xl font-black text-amber-600 mt-2">PAUSADA</div>
            <div className="text-xs text-gray-500 font-medium mt-2">
              Economia de R$ 60/dia em verba
            </div>
          </div>
        </section>

        {/* BLOCO 2: Onde estão nos encontrando (Origem de Tráfego & Estados) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Origem dos Visitantes (Canais) */}
          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 lg:col-span-2">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="font-bold text-[#1B4F7A] text-lg flex items-center gap-2">
                <span>📍</span> De Onde Vêm os Visitantes? (Origem do Tráfego)
              </h2>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded font-bold">Últimos 30 Dias</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-gray-800">1. Busca Orgânica do Google (SEO)</span>
                  <span className="text-[#1B4F7A]">62% dos acessos (1.226 visitas)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className="bg-[#1B4F7A] h-3 rounded-full" style={{ width: '62%' }}></div>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Visitantes que pesquisaram por "Plano Safra 2026/27", "El Niño no Brasil", "Palestrante Agro".</p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-gray-800">2. Anúncios Pagos (Google Ads)</span>
                  <span className="text-[#6AAF3D]">24% dos acessos (475 visitas)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className="bg-[#6AAF3D] h-3 rounded-full" style={{ width: '24%' }}></div>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Campanhas ativas da Beweather, eProdutor e Palestras B2B.</p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-gray-800">3. Redes Sociais & Indicação Direta (Instagram / WhatsApp)</span>
                  <span className="text-[#E8B84B]">14% dos acessos (277 visitas)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className="bg-[#E8B84B] h-3 rounded-full" style={{ width: '14%' }}></div>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Cliques na Bio do Instagram, compartilhamentos de artigos e link direto.</p>
              </div>
            </div>
          </section>

          {/* Regiões / Estados de Maior Acesso */}
          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="font-bold text-[#1B4F7A] text-base flex items-center gap-2">
                <span>🗺️</span> Estados com Mais Acessos
              </h2>
            </div>

            <ul className="space-y-3 text-xs font-medium">
              <li className="flex justify-between items-center p-2.5 bg-[#F7F5EF] rounded border border-gray-200">
                <span className="font-bold text-gray-900">1. Paraná (PR)</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">45% (Base Principal)</span>
              </li>
              <li className="flex justify-between items-center p-2.5 bg-[#F7F5EF] rounded border border-gray-200">
                <span className="font-bold text-gray-900">2. Rio Grande do Sul (RS)</span>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">18% (Foco El Niño)</span>
              </li>
              <li className="flex justify-between items-center p-2.5 bg-[#F7F5EF] rounded border border-gray-200">
                <span className="font-bold text-gray-900">3. Mato Grosso (MT)</span>
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">14% (Grãos & Gestão)</span>
              </li>
              <li className="flex justify-between items-center p-2.5 bg-[#F7F5EF] rounded border border-gray-200">
                <span className="font-bold text-gray-900">4. Santa Catarina (SC)</span>
                <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-bold">12% (Eventos B2B)</span>
              </li>
              <li className="flex justify-between items-center p-2.5 bg-emerald-50 border border-emerald-200 rounded">
                <span className="font-bold text-emerald-900">5. Sergipe (SE)</span>
                <span className="bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">★ Lead Fechando</span>
              </li>
            </ul>
          </section>
        </div>

        {/* BLOCO 3: Performance dos Artigos do Blog & Clicks nos Links Internos */}
        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 gap-2">
            <div>
              <h2 className="font-extrabold text-[#1B4F7A] text-xl flex items-center gap-2">
                <span>📚</span> Artigos do Blog Mais Lidos & Clicks nos Links Internos
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Saiba quais artigos geram mais interesse e se os leitores estão clicando para pedir cotação ou contratar palestras.
              </p>
            </div>
            <span className="text-xs bg-[#6AAF3D] text-white px-3 py-1 rounded-full font-bold">
              8 Artigos Publicados
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F5EF] text-[#1B4F7A] font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Artigo / Título Otimizado</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3 text-center">Impressões Google</th>
                  <th className="p-3 text-center">Acessos Reais</th>
                  <th className="p-3 text-center">Clique em Links Internos</th>
                  <th className="p-3 text-right">Status / Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Artigo 1: Plano Safra */}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-bold text-gray-900">
                    Plano Safra 2026/2027: Taxas de Juros, Mudanças e Como Proteger sua Margem
                    <div className="text-[11px] font-normal text-emerald-700 mt-0.5">✓ Título e Meta Description recém-otimizados</div>
                  </td>
                  <td className="p-3"><span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">Finanças</span></td>
                  <td className="p-3 text-center font-bold text-[#1B4F7A]">1.424</td>
                  <td className="p-3 text-center font-bold">117</td>
                  <td className="p-3 text-center text-emerald-700 font-bold">14 cliques (Link Calculadora/Consultoria)</td>
                  <td className="p-3 text-right">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-bold">Otimizado</span>
                  </td>
                </tr>

                {/* Artigo 2: El Niño */}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-bold text-gray-900">
                    El Niño 2026 no Brasil: o que muda na safra 2026/27 e como se preparar
                    <div className="text-[11px] font-normal text-emerald-700 mt-0.5">✓ Callout Box de Destaque para Beweather Adicionado</div>
                  </td>
                  <td className="p-3"><span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">Clima</span></td>
                  <td className="p-3 text-center font-bold text-[#1B4F7A]">133</td>
                  <td className="p-3 text-center font-bold">49</td>
                  <td className="p-3 text-center text-emerald-700 font-bold">8 cliques (Link Cotação Beweather)</td>
                  <td className="p-3 text-right">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-bold">Otimizado</span>
                  </td>
                </tr>

                {/* Artigo 3: 5 Indicadores Financeiros */}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-bold text-gray-900">
                    5 Indicadores Financeiros Essenciais para o Produtor Rural
                  </td>
                  <td className="p-3"><span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">Gestão</span></td>
                  <td className="p-3 text-center font-bold text-[#1B4F7A]">117</td>
                  <td className="p-3 text-center font-bold">38</td>
                  <td className="p-3 text-center text-gray-600">5 cliques (Contato Consultoria)</td>
                  <td className="p-3 text-right">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded font-medium">Estável</span>
                  </td>
                </tr>

                {/* Artigo 4: Inteligência Artificial no Campo */}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-bold text-gray-900">
                    Inteligência Artificial no Campo: O Que Já É Realidade
                  </td>
                  <td className="p-3"><span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-semibold">Tecnologia</span></td>
                  <td className="p-3 text-center font-bold text-[#1B4F7A]">49</td>
                  <td className="p-3 text-center font-bold">22</td>
                  <td className="p-3 text-center text-purple-700 font-bold">6 cliques (Link Palestras IA)</td>
                  <td className="p-3 text-right">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded font-bold">Foco Palestra</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* BLOCO 4: Páginas Principais Mais Acessadas (Home vs Palestras vs Beweather vs eProdutor) */}
        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="font-bold text-[#1B4F7A] text-lg flex items-center gap-2">
              <span>🖥️</span> Acessos por Página do Site (Home vs. Serviços)
            </h2>
            <span className="text-xs text-gray-500 font-medium">Contagem dos Últimos 30 Dias</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium">
            <div className="p-4 bg-[#F7F5EF] rounded-lg border border-gray-200 space-y-1">
              <div className="text-gray-500 font-bold uppercase">1. Home Principal</div>
              <div className="text-2xl font-black text-[#1B4F7A]">632 <span className="text-xs font-normal text-gray-500">visitas</span></div>
              <div className="text-gray-600">fluxorural.com.br/</div>
            </div>

            <div className="p-4 bg-[#F7F5EF] rounded-lg border border-gray-200 space-y-1">
              <div className="text-gray-500 font-bold uppercase">2. Palestras (Carro-Chefe)</div>
              <div className="text-2xl font-black text-[#E8B84B]">384 <span className="text-xs font-normal text-gray-500">visitas</span></div>
              <div className="text-gray-600">fluxorural.com.br/palestras/</div>
            </div>

            <div className="p-4 bg-[#F7F5EF] rounded-lg border border-gray-200 space-y-1">
              <div className="text-gray-500 font-bold uppercase">3. Beweather (Estações)</div>
              <div className="text-2xl font-black text-[#6AAF3D]">412 <span className="text-xs font-normal text-gray-500">visitas</span></div>
              <div className="text-gray-600">beweather.fluxorural.com.br/</div>
            </div>

            <div className="p-4 bg-[#F7F5EF] rounded-lg border border-gray-200 space-y-1">
              <div className="text-gray-500 font-bold uppercase">4. eProdutor (Gestão)</div>
              <div className="text-2xl font-black text-[#1B4F7A]">210 <span className="text-xs font-normal text-gray-500">visitas</span></div>
              <div className="text-gray-600">eprodutor.fluxorural.com.br/</div>
            </div>
          </div>
        </section>

        {/* BLOCO 5: Recomendações dos Subagentes IA em Português Claro */}
        <section className="bg-[#1B4F7A] text-white rounded-xl shadow-lg p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#2B6CB0] pb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <h2 className="text-xl font-extrabold">Recomendações dos Subagentes Inteligentes</h2>
                <p className="text-xs text-gray-200 mt-0.5">Ações prioritárias sugeridas pelos agentes especialistas em Tráfego, SEO e Growth.</p>
              </div>
            </div>
            <span className="bg-[#6AAF3D] text-white text-xs px-3 py-1 rounded-full font-bold">
              Skill: agro-growth-intelligence
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Recomendação 1 */}
            <div className="bg-[#143B5C] p-5 rounded-lg border border-[#2B6CB0] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="bg-[#E8B84B] text-[#202522] px-2.5 py-0.5 rounded font-black uppercase text-[10px]">
                  Prioridade Alta · SEO & Palestras
                </span>
                <span className="text-emerald-400 font-bold">Agente: agro-traffic-seo-expert</span>
              </div>
              <h3 className="font-bold text-white text-sm">Otimizar Página de Palestras para Busca Orgânica</h3>
              <p className="text-gray-200 leading-relaxed">
                Como as **Palestras são o carro-chefe** de atração, incluir depoimentos e o termo "Palestrante Agronegócio Paraná/Sul" no topo da página de palestras para capturar buscas institucionais diretas de cooperativas e sindicatos.
              </p>
            </div>

            {/* Recomendação 2 */}
            <div className="bg-[#143B5C] p-5 rounded-lg border border-[#2B6CB0] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="bg-[#6AAF3D] text-white px-2.5 py-0.5 rounded font-black uppercase text-[10px]">
                  Prioridade Alta · Beweather
                </span>
                <span className="text-emerald-400 font-bold">Agente: growth-hacker-expert</span>
              </div>
              <h3 className="font-bold text-white text-sm">Usar Case de Sergipe como Prova Social</h3>
              <p className="text-gray-200 leading-relaxed">
                Destacar o fechamento do lead de Sergipe na landing da Beweather como estudo de caso de alcance nacional para produtores e instituições de ensino/pesquisa.
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
