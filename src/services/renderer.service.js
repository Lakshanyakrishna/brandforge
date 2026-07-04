// Converts an HTML string into a 1080x1080 PNG buffer via headless Chromium.
// The browser instance is launched once and reused across requests instead
// of per-call, since browser startup is by far the slowest part of this.
const puppeteer = require('puppeteer');

let browserPromise = null;

function getBrowser() {
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
