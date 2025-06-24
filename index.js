
const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const puppeteer = require('puppeteer');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname)));
app.get('/', (_, res) =>
  res.sendFile(path.join(__dirname, 'index.html'))
);

app.post('/verificar', async (req, res) => {
  const { codigo } = req.body;
  if (!codigo) {
    return res.status(400).json({ valido: false, mensagem: 'Código não informado' });
  }

  const url = `https://vyoofotos.com.br/gallery?qrCode=${encodeURIComponent(codigo)}`;
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled'],
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setDefaultNavigationTimeout(60000);

    const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    if (!response.ok()) {
      await browser.close();
      return res.json({ valido: false, mensagem: `Erro ao carregar a página (status ${response.status()})` });
    }

    await page.waitForSelector('body', { timeout: 30000 }).catch(() => {});

    const errorMessage = await page.evaluate(() => {
      return document.body.innerText.toLowerCase().includes('qr code pesquisado é inválido');
    });

    if (errorMessage) {
      await browser.close();
      return res.json({ valido: false, mensagem: 'QR Code inválido' });
    }

    await page.waitForSelector('img, .gallery img, picture source', { timeout: 15000 }).catch(() => {});

    const imageDetails = await page.evaluate(() => {
      const images = document.querySelectorAll('img, [style*="background-image"], picture source');
      return {
        count: images.length,
        sources: Array.from(images)
          .map(el => el.src || el.getAttribute('srcset') || el.style.backgroundImage)
          .filter(src => src && !src.includes('logo') && !src.includes('icon')),
      };
    });

    const hasValidImages = imageDetails.count > 0 && imageDetails.sources.length > 0;
    const finalUrl = page.url();

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
    if (browser) await browser.close();
    return res.status(500).json({ valido: false, mensagem: 'Erro ao verificar o código', erro: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
