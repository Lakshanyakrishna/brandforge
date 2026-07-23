let puppeteer;
let browserPromise = null;

function getBrowser() {
    if (!puppeteer) {
        puppeteer = require('puppeteer');
    }
    if (!browserPromise) {
        browserPromise = puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }
    return browserPromise;
}

async function renderHtmlToPng(html, { width = 1080, height = 1080 } = {}) {
    const browser = await getBrowser();
    const page = await browser.newPage();
    try {
        await page.setViewport({ width, height });
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const screenshot = await page.screenshot({ type: 'png' });
        // Puppeteer returns a Uint8Array, not a real Node Buffer — ImageKit's
        // upload client checks Buffer.isBuffer() internally and mishandles
        // anything else, so this must be converted before it goes anywhere.
        return Buffer.from(screenshot);
    } finally {
        await page.close();
    }
}

module.exports = { renderHtmlToPng };
