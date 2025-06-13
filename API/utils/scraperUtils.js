const axios = require('axios');
const cheerio = require('cheerio');

//MANUAL CHEERIO SCRAPER
async function scrapePrice(url) {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': url,
            },
        });
        // console.log(data)

        const $ = cheerio.load(data);

        // Get price
        const priceText = $('h4.fw-bold.d-inline-block').first().text().trim();
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));

        // Get stock quantity
        const stockText = $('#cart_sell_zaiko_pc').text();
        const stockMatch = stockText.match(/在庫\s*:\s*(\d+)\s*点/);
        const stock = stockMatch ? parseInt(stockMatch[1], 10) : 0;

        return {
            price: isNaN(price) ? null : price,
            stock: isNaN(stock) ? 0 : stock
        };

    } catch (error) {
        console.error('Error scraping:', error.message);
        return { price: null, stock: 0 };
    }
};

//ScraperAPI
async function scrapePriceScraperAPI(url) {
    const apiKey = process.env.SCRAPER_API_KEY;

    if (!url) return res.status(400).json({ error: 'URL is required' });

    try {
        const proxyUrl = `http://api.scraperapi.com?api_key=${apiKey}&url=${encodeURIComponent(url)}`;
        const { data } = await axios.get(proxyUrl);

        const $ = cheerio.load(data);
        const priceText = $('h4.fw-bold.d-inline-block').first().text().trim();
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));

        const stockText = $('label[for="flexRadioDefault5"]').text().trim();
        const stock = parseInt(stockText.replace(/\D/g, '')) || 0;

        const priceConverted = (price || 0);
        return ({ price: priceConverted, stock });

    } catch (error) {
        // console.log({ error: 'Failed to scrape price and stock' });
        return console.error('Scrape error:', error.message);
    }
};

module.exports = { scrapePrice, scrapePriceScraperAPI };