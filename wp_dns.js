const puppeteer = require('puppeteer');

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1440, height: 900 });
  
  console.log("Navigating to WordPress.com log in...");
  await page.goto('https://wordpress.com/log-in', { waitUntil: 'networkidle2' });
  
  console.log("Taking screenshot of login page...");
  await page.screenshot({ path: '/Users/user1/.gemini/antigravity/scratch/igor-optimized/wp_login_test.png' });
  
  await browser.close();
  console.log("Done.");
})();
