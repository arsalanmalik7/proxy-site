import express from 'express';
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import dns from 'dns';

const app = express();
const PORT = 3001;




app.get('/proxy-iframe-content', async (req, res) => {
    const targetUrl = req.query.url;
    const ipInfo = await axios.get('https://ipinfo.io/json');
    console.log('IP Info:', ipInfo.data);
    if (!targetUrl) {
        return res.status(400).send('Target URL is required.');
    }

    try {
        const urlObj = new URL(targetUrl);

        // Now we can do a proper DNS lookup
        dns.lookup(urlObj.hostname, (err, address) => {
            console.log('DNS lookup:', err || address);
        });

        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://www.google.com/',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Cache-Control': 'no-cache'
            },
            timeout: 10000,
        });


        res.send(response.data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).send('Error fetching content via proxy.');
    }

});

app.listen(PORT, () => {
    console.log(`Proxy server listening on port ${PORT}`);
});
