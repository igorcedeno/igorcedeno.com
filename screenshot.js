const puppeteer = require('puppeteer');

(async () => {
  try {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Set a standard desktop viewport
    await page.setViewport({ width: 1440, height: 1080 });
    
    console.log("Navigating to local HTML file...");
    await page.goto('file:///Users/user1/.gemini/antigravity/scratch/igor-optimized/index.html', { waitUntil: 'networkidle0' });
    
    console.log("Taking full-page screenshot...");
    await page.screenshot({ 
        path: '/Users/user1/.gemini/antigravity/brain/23ec4c46-3673-423c-be9d-04e69a665b58/previsualization.png', 
        fullPage: true 
    });
    
    await browser.close();
    console.log("Screenshot saved successfully.");
  } catch (err) {
    console.error("Error taking screenshot:", err);
  }
})();
