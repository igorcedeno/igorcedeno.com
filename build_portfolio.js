const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const srcDir = path.join(__dirname, 'assets/real_images');
const destDir = path.join(__dirname, 'assets/images/portfolio');
const htmlFile = path.join(__dirname, 'index.html');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);
const validImages = [];

files.forEach(file => {
    const fullPath = path.join(srcDir, file);
    const stats = fs.statSync(fullPath);
    // Filter out very small files (icons) and duplicates (like the 83kb ones)
    if (stats.size > 100000) { // Greater than 100KB
        validImages.push(file);
    }
});

let portfolioHtml = '<div class="portfolio-grid">\n';
let delay = 0;

validImages.forEach((file, index) => {
    const ext = path.extname(file);
    const base = path.basename(file, ext);
    const destName = `port_${base}.webp`;
    const destPath = path.join(destDir, destName);
    
    // Convert to webp
    console.log(`Converting ${file} to ${destName}...`);
    try {
        execSync(`npx -y cwebp-bin "${path.join(srcDir, file)}" -o "${destPath}" -quiet`);
    } catch (e) {
        console.error(`Failed to convert ${file}`);
    }

    // Don't include the hero image in the portfolio grid if it's already the hero
    // Actually, hero was img_10.png
    if (file === 'img_10.png') return;

    portfolioHtml += `
                    <div class="portfolio-item fade-up delay-${delay}">
                        <img src="assets/images/portfolio/${destName}" alt="Cinematic shot ${index + 1}" loading="lazy" decoding="async">
                        <div class="item-overlay">
                            <h3>Director of Photography</h3>
                        </div>
                    </div>`;
    
    delay = (delay + 1) % 4; // Cycle delays for staggered animation
});

portfolioHtml += '\n                </div>';

console.log("Updating index.html...");
let htmlContent = fs.readFileSync(htmlFile, 'utf8');

// Replace the existing portfolio grid
const gridRegex = /<div class="portfolio-grid">[\s\S]*?<\/div>\s*(?=<\/section>)/;
htmlContent = htmlContent.replace(gridRegex, portfolioHtml + '\n');

fs.writeFileSync(htmlFile, htmlContent);
console.log("Done!");
