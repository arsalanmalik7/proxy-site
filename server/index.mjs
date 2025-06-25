import express from 'express';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import cors from 'cors';
import { fileURLToPath } from 'url';
import pkg from 'uuid';
const { v4: uuidv4 } = pkg;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3001;
const PUBLIC_DIR = path.join(__dirname, 'public');

puppeteer.use(StealthPlugin());
app.use(cors());
app.use('/public', express.static(PUBLIC_DIR));

app.get('/load-page', async (req, res) => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0.0.0 Safari/537.36'
    );

    await page.goto('https://www.bpexch.com/', {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    const content = await page.content();
    console.log(content)
    const fileName = `${uuidv4()}.html`;
    const filePath = path.join(PUBLIC_DIR, fileName);

    fs.writeFileSync(filePath, content);

    const tempUrl = `http://localhost:3001/public/${fileName}`;
    res.json({ tempUrl });
  } catch (err) {
    console.error('Puppeteer Error:', err.message);
    res.status(500).json({ error: 'Failed to load page' });
  } finally {
    await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
