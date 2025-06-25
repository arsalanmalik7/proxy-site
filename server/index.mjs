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

        const response = await axios.get(targetUrl);

        res.send(response.data);
    } catch (error) {
        console.error('Proxy error:', error.message);
        res.status(500).send('Error fetching content via proxy.');
    }

});

app.listen(PORT, () => {
    console.log(`Proxy server listening on port ${PORT}`);
});
