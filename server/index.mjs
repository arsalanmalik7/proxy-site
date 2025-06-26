import express from 'express';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

const app = express();
const PORT = 3001;

puppeteer.use(StealthPlugin());

app.get('/open-page', async (req, res) => {
  const proxy = ''; // optional: add your proxy URL here like 'http://123.123.123.123:8080'

  const browser = await puppeteer.launch({
    headless: false, // show browser window
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      ...(proxy ? [`--proxy-server=${proxy}`] : [])
    ],
  });

  try {
    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0.0.0 Safari/537.36'
    );

    await page.goto('https://www.bpexch.com', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    // await page.waitForTimeout(5000); // wait for 5 seconds to ensure the page loads
    // await page.evaluate(() => {
    //   // This will open the link in a new tab
    //   window.open('https://www.bpexch.com', '_blank');
    // });

    res.send('Website opened in new browser tab!');
  } catch (err) {
    console.error('Puppeteer Error:', err.message);
    res.status(500).send('Failed to open page');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
