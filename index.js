const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/verificar', async (req, res) => {
  const { codigo } = req.body;

  if (!codigo) {
    return res.status(400).json({ valido: false, mensagem: 'Código não informado' });
  }

  const url = `https://vyoofotos.com.br/gallery?qrCode=${encodeURIComponent(codigo)}`;

  let browser;
  try {
    console.log(`Iniciando Puppeteer para URL: ${url}`);
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled'],
    });
    const page = await browser.newPage();

    // Configurar user agent para evitar bloqueios
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setDefaultNavigationTimeout(60000);

    console.log('Navegando até a página...');
    const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    if (!response.ok()) {
      console.error(`Erro HTTP: ${response.status()}`);
      await browser.close();
      return res.json({ valido: false, mensagem: `Erro ao carregar a página (status ${response.status()})` });
    }

    console.log('Esperando por elementos da página...');
    await page.waitForSelector('body', { timeout: 30000 }).catch(() => {
      console.warn('Timeout ao esperar pelo body, continuando...');
    });

    // Verificar mensagem de erro
    const errorMessage = await page.evaluate(() => {
      return document.body.innerText.toLowerCase().includes('qr code pesquisado é inválido');
    });
    console.log(`Mensagem de erro encontrada: ${errorMessage}`);

    if (errorMessage) {
      await browser.close();
      return res.json({ valido: false, mensagem: 'QR Code inválido' });
    }

    // Esperar por imagens ou elementos de galeria
    console.log('Esperando por imagens...');
    await page.waitForSelector('img, .gallery img, picture source', { timeout: 15000 }).catch(() => {
      console.warn('Nenhuma imagem ou galeria encontrada após 15 segundos.');
    });

    // Contar imagens e capturar detalhes
    const imageDetails = await page.evaluate(() => {
      const images = document.querySelectorAll('img, [style*="background-image"], picture source');
      return {
        count: images.length,
        sources: Array.from(images)
          .map(el => el.src || el.getAttribute('srcset') || el.style.backgroundImage)
          .filter(src => src && !src.includes('logo') && !src.includes('icon')),
      };
    });
    console.log(`Imagens encontradas: ${imageDetails.count}`);
    console.log(`URLs das imagens: ${JSON.stringify(imageDetails.sources)}`);

    // Considerar imagens válidas se houver pelo menos uma com URL significativa
    const hasValidImages = imageDetails.count > 0 && imageDetails.sources.length > 0;

    const finalUrl = page.url();
    console.log(`URL final: ${finalUrl}`);

    await browser.close();

    if (finalUrl === 'https://vyoofotos.com.br/') {
      return res.json({ valido: false, mensagem: 'Redirecionado para a página inicial' });
    }

    if (!hasValidImages) {
      return res.json({
        valido: true,
        temFotos: false,
        mensagem: 'QR Code válido, mas nenhuma foto válida encontrada',
        url: finalUrl,
        debug: imageDetails,
      });
    }

    return res.json({
      valido: true,
      temFotos: true,
      mensagem: 'QR Code válido com fotos',
      url: finalUrl,
      debug: imageDetails,
    });

  } catch (err) {
    console.error('Erro:', err.message);
    if (browser) await browser.close();
    return res.status(500).json({ valido: false, mensagem: 'Erro ao verificar o código', erro: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});