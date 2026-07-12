const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');
const path = require('path');

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                   .on('error', reject)
                   .once('close', () => resolve(filepath));
            } else {
                res.resume();
                resolve();
            }
        });
    });
};

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto('https://igorcedeno.com', { waitUntil: 'networkidle2' });

    // Scroll to bottom to trigger lazy loading
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });

    // Extract all image sources
    const imageUrls = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs.map(img => img.src).filter(src => src && src.startsWith('http'));
    });

    console.log(`Found ${imageUrls.length} images.`);
    
    // Create directory
    const dir = '/Users/user1/.gemini/antigravity/scratch/igor-optimized/assets/real_images';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    let count = 1;
    for (const url of imageUrls) {
        if (!url.match(/\.(jpg|jpeg|png|webp|gif)/i)) continue;
        
        const ext = url.split('.').pop().split('?')[0];
        const filename = `img_${count}.${ext}`;
        const filepath = path.join(dir, filename);
        
        try {
            await downloadImage(url, filepath);
            console.log(`Downloaded ${filename}`);
            count++;
        } catch (e) {
            console.error(`Failed to download ${url}`);
        }
    }

    await browser.close();
})();
