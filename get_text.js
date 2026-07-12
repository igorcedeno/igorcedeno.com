const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto('https://igorcedeno.com', { waitUntil: 'networkidle2' });

    const content = await page.evaluate(() => {
        // Remove scripts and styles
        document.querySelectorAll('script, style').forEach(el => el.remove());
        return document.body.innerText;
    });

    console.log(content);
    await browser.close();
})();
