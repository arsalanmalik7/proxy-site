import express from 'express';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

const app = express();
const PORT = 3001;

// Enable stealth plugin
puppeteer.use(StealthPlugin());



app.get('/open-page', async (req, res) => {
  const proxyHost = 'proxy-us.proxy-cheap.com';
  const proxyPort = '5959';
  const proxyUsername = 'pcGFxBOiBi-res-any';
  const proxyPassword = 'PC_9gjyVjJZlHzPspRPP';

  const proxyUrl = `http://${proxyHost}:${proxyPort}`;

  const browser = await puppeteer.launch({
    headless: false, // set to true for background
    ignoreHttpsErrors: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      `--proxy-server=${proxyUrl}`,
    ],
  });

  try {
    const page = await browser.newPage();

    // Authenticate with proxy
    await page.authenticate({
      username: proxyUsername,
      password: proxyPassword,
    });

    // Set a legit user-agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0.0.0 Safari/537.36'
    );

    // Navigate to the target site
    await page.goto('https://www.bpexch.com', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('response', res => console.log('RESPONSE:', res.status(), res.url()));
    page.on('requestfailed', request => console.log('REQUEST FAILED:', request.failure()));


    res.send('Website opened successfully in browser with proxy!');
  } catch (err) {
    console.error('Puppeteer Error:', err.message);
    res.status(500).send('Failed to open page');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
