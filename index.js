<<<<<<< HEAD
const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3000;
=======

const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const puppeteer = require('puppeteer');

const app  = express();
const PORT = process.env.PORT || 3000;
>>>>>>> 416cdeaa3824f7c307310e86a0f96c4cf3f7fc3b

app.use(cors());
app.use(express.json());

<<<<<<< HEAD
app.post('/verificar', async (req, res) => {
  const { codigo } = req.body;

=======
app.use(express.static(path.join(__dirname)));
app.get('/', (_, res) =>
  res.sendFile(path.join(__dirname, 'index.html'))
);

app.post('/verificar', async (req, res) => {
  const { codigo } = req.body;
>>>>>>> 416cdeaa3824f7c307310e86a0f96c4cf3f7fc3b
  if (!codigo) {
    return res.status(400).json({ valido: false, mensagem: 'Código não informado' });
  }

  const url = `https://vyoofotos.com.br/gallery?qrCode=${encodeURIComponent(codigo)}`;
<<<<<<< HEAD

  let browser;
  try {
    console.log(`Iniciando Puppeteer para URL: ${url}`);
=======
  let browser;

  try {
>>>>>>> 416cdeaa3824f7c307310e86a0f96c4cf3f7fc3b
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled'],
    });
    const page = await browser.newPage();
<<<<<<< HEAD

    // Configurar user agent para evitar bloqueios
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setDefaultNavigationTimeout(60000);

    console.log('Navegando até a página...');
    const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    if (!response.ok()) {
      console.error(`Erro HTTP: ${response.status()}`);
=======
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setDefaultNavigationTimeout(60000);

    const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    if (!response.ok()) {
>>>>>>> 416cdeaa3824f7c307310e86a0f96c4cf3f7fc3b
      await browser.close();
      return res.json({ valido: false, mensagem: `Erro ao carregar a página (status ${response.status()})` });
    }

<<<<<<< HEAD
    console.log('Esperando por elementos da página...');
    await page.waitForSelector('body', { timeout: 30000 }).catch(() => {
      console.warn('Timeout ao esperar pelo body, continuando...');
    });

    // Verificar mensagem de erro
    const errorMessage = await page.evaluate(() => {
      return document.body.innerText.toLowerCase().includes('qr code pesquisado é inválido');
    });
    console.log(`Mensagem de erro encontrada: ${errorMessage}`);
=======
    await page.waitForSelector('body', { timeout: 30000 }).catch(() => {});

    const errorMessage = await page.evaluate(() => {
      return document.body.innerText.toLowerCase().includes('qr code pesquisado é inválido');
    });
>>>>>>> 416cdeaa3824f7c307310e86a0f96c4cf3f7fc3b

    if (errorMessage) {
      await browser.close();
      return res.json({ valido: false, mensagem: 'QR Code inválido' });
    }

<<<<<<< HEAD
    // Esperar por imagens ou elementos de galeria
    console.log('Esperando por imagens...');
    await page.waitForSelector('img, .gallery img, picture source', { timeout: 15000 }).catch(() => {
      console.warn('Nenhuma imagem ou galeria encontrada após 15 segundos.');
    });

    // Contar imagens e capturar detalhes
=======
    await page.waitForSelector('img, .gallery img, picture source', { timeout: 15000 }).catch(() => {});

>>>>>>> 416cdeaa3824f7c307310e86a0f96c4cf3f7fc3b
    const imageDetails = await page.evaluate(() => {
      const images = document.querySelectorAll('img, [style*="background-image"], picture source');
      return {
        count: images.length,
        sources: Array.from(images)
          .map(el => el.src || el.getAttribute('srcset') || el.style.backgroundImage)
          .filter(src => src && !src.includes('logo') && !src.includes('icon')),
      };
    });
<<<<<<< HEAD
    console.log(`Imagens encontradas: ${imageDetails.count}`);
    console.log(`URLs das imagens: ${JSON.stringify(imageDetails.sources)}`);

    // Considerar imagens válidas se houver pelo menos uma com URL significativa
    const hasValidImages = imageDetails.count > 0 && imageDetails.sources.length > 0;

    const finalUrl = page.url();
    console.log(`URL final: ${finalUrl}`);
=======

    const hasValidImages = imageDetails.count > 0 && imageDetails.sources.length > 0;
    const finalUrl = page.url();
>>>>>>> 416cdeaa3824f7c307310e86a0f96c4cf3f7fc3b

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
<<<<<<< HEAD
    console.error('Erro:', err.message);
=======
>>>>>>> 416cdeaa3824f7c307310e86a0f96c4cf3f7fc3b
    if (browser) await browser.close();
    return res.status(500).json({ valido: false, mensagem: 'Erro ao verificar o código', erro: err.message });
  }
});

app.listen(PORT, () => {
<<<<<<< HEAD
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
=======
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
>>>>>>> 416cdeaa3824f7c307310e86a0f96c4cf3f7fc3b
