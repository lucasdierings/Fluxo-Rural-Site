/**
 * Google Ads Script — Fluxo Rural
 * 
 * Cria as campanhas:
 * 1. Fluxo Rural - B2C - Calculadora de Margem (Grãos, sem pecuária) - R$ 10,00/dia (Pausada)
 * 2. Fluxo Rural - B2B - Palestras e Eventos (Cidades polo agro) - R$ 10,00/dia (Pausada)
 * 
 * Como usar:
 * 1. Acesse o painel do Google Ads.
 * 2. Vá em Ferramentas > Scripts.
 * 3. Clique em "+" para criar um novo script.
 * 4. Cole este código, clique em "Autorizar" e depois em "Executar".
 * 5. As campanhas serão criadas de forma pausada para sua revisão.
 */

function main() {
  Logger.log("Iniciando a criação da estrutura de campanhas...");

  // 1. Criar ou Obter Orçamento Diário de R$ 10,00
  var budgetName = "Orçamento Diário R$ 10.00";
  var budgetAmount = 10.00;
  var budgetIterator = AdsApp.budgets().withCondition("Name = '" + budgetName + "'").get();
  var budget;
  
  if (budgetIterator.hasNext()) {
    budget = budgetIterator.next();
    Logger.log("Orçamento existente localizado: " + budgetName);
  } else {
    // Cria um orçamento compartilhado
    // Obs: Se preferir orçamento individual por campanha, o Ads cria automaticamente ao criar a campanha.
    Logger.log("Criando novo orçamento diário de R$ 10,00...");
  }

  // 2. Criar a Campanha B2C (Calculadora de Margem)
  var campB2CName = "Fluxo Rural - B2C - Calculadora de Margem";
  var campaignB2CIterator = AdsApp.campaigns().withCondition("Name = '" + campB2CName + "'").get();
  
  if (!campaignB2CIterator.hasNext()) {
    Logger.log("Criando campanha B2C: " + campB2CName);
    
    // Construtor da Campanha (API moderna do Google Ads)
    var campaignOperation = AdsApp.newCampaignBuilder()
      .withName(campB2CName)
      .withAdvertisingChannelType("SEARCH")
      .withAmount(10.00) // Orçamento individual de R$ 10,00/dia
      .withStatus("PAUSED")
      .build();
    
    if (campaignOperation.isSuccessful()) {
      var campaign = campaignOperation.getResult();
      Logger.log("Campanha B2C criada com sucesso!");
      
      // Criar Grupos de Anúncios e Palavras-chave
      criarEstruturaB2C(campaign);
    } else {
      Logger.log("Erro ao criar campanha B2C: " + campaignOperation.getErrors());
    }
  } else {
    Logger.log("Campanha B2C já existente.");
  }

  // 3. Criar a Campanha B2B (Palestras e Eventos)
  var campB2BName = "Fluxo Rural - B2B - Palestras e Eventos";
  var campaignB2BIterator = AdsApp.campaigns().withCondition("Name = '" + campB2BName + "'").get();
  
  if (!campaignB2BIterator.hasNext()) {
    Logger.log("Criando campanha B2B: " + campB2BName);
    
    var campaignOperation = AdsApp.newCampaignBuilder()
      .withName(campB2BName)
      .withAdvertisingChannelType("SEARCH")
      .withAmount(10.00) // Orçamento individual de R$ 10,00/dia
      .withStatus("PAUSED")
      .build();
    
    if (campaignOperation.isSuccessful()) {
      var campaign = campaignOperation.getResult();
      Logger.log("Campanha B2B criada com sucesso!");
      
      // Criar Grupos de Anúncios, Palavras-chave e segmentação geográfica
      criarEstruturaB2B(campaign);
    } else {
      Logger.log("Erro ao criar campanha B2B: " + campaignOperation.getErrors());
    }
  } else {
    Logger.log("Campanha B2B já existente.");
  }

  Logger.log("Processo de criação concluído! Verifique as campanhas criadas na aba 'Pausadas'.");
}

function criarEstruturaB2C(campaign) {
  // Criar grupo Soja
  var adGroupSojaOperation = campaign.newAdGroupBuilder()
    .withName("Calculadora Soja")
    .withStatus("ENABLED")
    .build();
  
  if (adGroupSojaOperation.isSuccessful()) {
    var adGroup = adGroupSojaOperation.getResult();
    // Adicionar palavras-chave
    adGroup.newKeywordBuilder().withText('"calculadora de margem soja"').build();
    adGroup.newKeywordBuilder().withText('"calcular margem por hectare soja"').build();
    adGroup.newKeywordBuilder().withText('"custo por hectare soja"').build();
    adGroup.newKeywordBuilder().withText('"lucro por hectare soja"').build();
    adGroup.newKeywordBuilder().withText('"margem por hectare soja"').build();
    Logger.log("Grupo 'Calculadora Soja' estruturado.");
  }

  // Criar grupo Milho/Trigo
  var adGroupMilhoOperation = campaign.newAdGroupBuilder()
    .withName("Calculadora Milho e Trigo")
    .withStatus("ENABLED")
    .build();
  
  if (adGroupMilhoOperation.isSuccessful()) {
    var adGroup = adGroupMilhoOperation.getResult();
    adGroup.newKeywordBuilder().withText('"calcular margem milho"').build();
    adGroup.newKeywordBuilder().withText('"custo por hectare milho"').build();
    adGroup.newKeywordBuilder().withText('"custo por hectare trigo"').build();
    adGroup.newKeywordBuilder().withText('"margem por hectare trigo"').build();
    adGroup.newKeywordBuilder().withText('"calcular custo producao trigo"').build();
    Logger.log("Grupo 'Calculadora Milho e Trigo' estruturado.");
  }

  // Criar grupo Geral
  var adGroupGeralOperation = campaign.newAdGroupBuilder()
    .withName("Calculadora de Margem Geral")
    .withStatus("ENABLED")
    .build();
  
  if (adGroupGeralOperation.isSuccessful()) {
    var adGroup = adGroupGeralOperation.getResult();
    adGroup.newKeywordBuilder().withText('"calcular margem lavoura"').build();
    adGroup.newKeywordBuilder().withText('"como calcular rentabilidade safra"').build();
    adGroup.newKeywordBuilder().withText('"calculadora de lucro fazenda"').build();
    adGroup.newKeywordBuilder().withText('"custo de producao de graos"').build();
    Logger.log("Grupo 'Calculadora de Margem Geral' estruturado.");
  }

  // Adicionar Negativas (Pecuária Excluída) no nível de campanha
  campaign.createNegativeKeyword('"gado"');
  campaign.createNegativeKeyword('"leite"');
  campaign.createNegativeKeyword('"corte"');
  campaign.createNegativeKeyword('"boi"');
  campaign.createNegativeKeyword('"vaca"');
  campaign.createNegativeKeyword('"bezerro"');
  campaign.createNegativeKeyword('"novilho"');
  campaign.createNegativeKeyword('"pasto"');
  campaign.createNegativeKeyword('"pastagem"');
  campaign.createNegativeKeyword('"leitaria"');
  campaign.createNegativeKeyword('"ordenha"');
  campaign.createNegativeKeyword('"aves"');
  campaign.createNegativeKeyword('"frango"');
  campaign.createNegativeKeyword('"suinos"');
  campaign.createNegativeKeyword('"porco"');
  campaign.createNegativeKeyword('"piscicultura"');
  campaign.createNegativeKeyword('"peixe"');
  campaign.createNegativeKeyword('"faculdade"');
  campaign.createNegativeKeyword('"tcc"');
  campaign.createNegativeKeyword('"artigo"');
  campaign.createNegativeKeyword('"trabalho escolar"');
  Logger.log("Palavras-chave negativas de pecuária adicionadas à Campanha B2C.");
}

function criarEstruturaB2B(campaign) {
  // Criar grupo Palestras
  var adGroupPalestrasOperation = campaign.newAdGroupBuilder()
    .withName("Palestras Agronegocio")
    .withStatus("ENABLED")
    .build();
  
  if (adGroupPalestrasOperation.isSuccessful()) {
    var adGroup = adGroupPalestrasOperation.getResult();
    adGroup.newKeywordBuilder().withText('"palestrante agronegocio"').build();
    adGroup.newKeywordBuilder().withText('"palestra para eventos agro"').build();
    adGroup.newKeywordBuilder().withText('"palestrante para cooperativas"').build();
    adGroup.newKeywordBuilder().withText('"palestra motivacional agro"').build();
    adGroup.newKeywordBuilder().withText('"palestrante agricultura"').build();
    Logger.log("Grupo 'Palestras Agronegocio' estruturado.");
  }

  // Criar grupo Workshop
  var adGroupWorkshopOperation = campaign.newAdGroupBuilder()
    .withName("Workshop Lideranca Agro")
    .withStatus("ENABLED")
    .build();
  
  if (adGroupWorkshopOperation.isSuccessful()) {
    var adGroup = adGroupWorkshopOperation.getResult();
    adGroup.newKeywordBuilder().withText('"palestra sucessao familiar agro"').build();
    adGroup.newKeywordBuilder().withText('"workshop lideranca agronegocio"').build();
    adGroup.newKeywordBuilder().withText('"palestra gestao financeira rural"').build();
    adGroup.newKeywordBuilder().withText('"palestra inteligencia artificial agro"').build();
    adGroup.newKeywordBuilder().withText('"treinamento lideranca de fazenda"').build();
    Logger.log("Grupo 'Workshop Lideranca Agro' estruturado.");
  }

  // Negativas B2B
  campaign.createNegativeKeyword('"como dar palestra"');
  campaign.createNegativeKeyword('"escola"');
  campaign.createNegativeKeyword('"faculdade"');
  campaign.createNegativeKeyword('"tcc"');
  campaign.createNegativeKeyword('"artigo"');
  campaign.createNegativeKeyword('"pdf gratis"');
  campaign.createNegativeKeyword('"cursos gratis"');
  campaign.createNegativeKeyword('"emprego"');
  campaign.createNegativeKeyword('"vaga"');
  campaign.createNegativeKeyword('"salario"');
  Logger.log("Palavras-chave negativas adicionadas à Campanha B2B.");

  // NOTA SOBRE SEGMENTAÇÃO GEOGRÁFICA:
  // A segmentação por cidades no Google Ads Scripts é feita usando segmentação por local (Targeting).
  // Abaixo estão listados os IDs ou nomes de localização das cidades mapeadas para a campanha B2B.
  // Recomendamos importar essa segmentação via Google Ads Editor (arquivo CSV fornecido),
  // pois é mais seguro e direto para evitar conflito de nomes de cidades homônimas.
  var localizacoes = [
    "Brasilia, Distrito Federal, Brazil",
    "Campo Mourao, Parana, Brazil",
    "Maringa, Parana, Brazil",
    "Londrina, Parana, Brazil",
    "Palotina, Parana, Brazil",
    "Medianeira, Parana, Brazil",
    "Cafelandia, Parana, Brazil",
    "Guarapuava, Parana, Brazil",
    "Cascavel, Parana, Brazil",
    "Castro, Parana, Brazil",
    "Carambei, Parana, Brazil",
    "Arapoti, Parana, Brazil",
    "Curitiba, Parana, Brazil", // Recomenda-se ajustar para raio de 3km na sede da FAEP no painel
    "Rio Verde, Goias, Brazil",
    "Goiania, Goias, Brazil",
    "Ribeirao Preto, Sao Paulo, Brazil",
    "Bebedouro, Sao Paulo, Brazil",
    "Piracicaba, Sao Paulo, Brazil",
    "Cuiaba, Mato Grosso, Brazil",
    "Sinop, Mato Grosso, Brazil",
    "Lucas do Rio Verde, Mato Grosso, Brazil",
    "Sorriso, Mato Grosso, Brazil",
    "Nao-Me-Toque, Rio Grande do Sul, Brazil",
    "Chapeco, Santa Catarina, Brazil",
    "Passo Fundo, Rio Grande do Sul, Brazil",
    "Luis Eduardo Magalhaes, Bahia, Brazil",
    "Belo Horizonte, Minas Gerais, Brazil",
    "Salvador, Bahia, Brazil",
    "Florianopolis, Santa Catarina, Brazil",
    "Palmas, Tocantins, Brazil",
    "Sao Luis, Maranhao, Brazil",
    "Belem, Para, Brazil"
  ];
  
  Logger.log("Cidades mapeadas para segmentação B2B: " + localizacoes.length + " polos do agronegócio.");
  Logger.log("Adicione estas cidades manualmente ou via importação de CSV do Ads Editor para maior precisão.");
}
