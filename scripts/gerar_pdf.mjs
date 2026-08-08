import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Substitua pela porta correta se diferente (o next.js precisa estar rodando localmente)
  await page.goto('http://localhost:3005/pdf-generator/index.html', {
    waitUntil: 'networkidle0',
  });

  await page.pdf({
    path: 'public/portfolio-treinamentos-palestras-lucas-dierings.pdf',
    format: 'A4',
    printBackground: true,
  });

  await browser.close();
  console.log('PDF gerado com sucesso em public/portfolio-treinamentos-palestras-lucas-dierings.pdf');
})();
