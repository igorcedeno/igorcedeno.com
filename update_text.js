const fs = require('fs');
const path = require('path');

const htmlFile = path.join(__dirname, 'index.html');
let htmlContent = fs.readFileSync(htmlFile, 'utf8');

const projects = [
    { title: '"WHITING SWAMPS"', role: '16MM DOCUMENTARY - DIRECTOR/DP' },
    { title: '"AMABLE & FEROZ"', role: 'MUSIC VIDEO - MILO PACHECO - DIRECTOR/DP' },
    { title: '"LIFE BELOW ZERO: NEXT GENERATION"', role: 'NATURE TV SHOW NATIONAL GEOGRAPHIC - CAM OP' },
    { title: 'SEARCHING FOR SOULFOOD', role: 'FOOD DOCUMENTARY TV SHOW HULU ORIGINALS - CAM OP' },
    { title: '"TXT AT LOLLAPALOOZA"', role: 'MUSIC DOCUMENTARY VOGUE MAGAZINE - DP' },
    { title: '"TAMARELO"', role: 'COMMERCIAL SPOT TASTE OF FIESTA - DIRECTOR/DP' },
    { title: '"GLITCH"', role: 'MUSIC VIDEO JULIAN 832 - DIRECTOR/DP' },
    { title: '"TRYING CAN BE TRYING"', role: 'COMMERCIAL SPOT FRIDA FERTILITY - DP' },
    { title: '"FLAMBO"', role: 'COMMERCIAL SPOT CELEBRATING 25 YEARS - DIRECTOR/DP' },
    { title: 'WE THE PEOPLE RIDE', role: 'DOCUMENTARY - DP' }
];

// Extract the valid images that were injected earlier
const destDir = path.join(__dirname, 'assets/images/portfolio');
const files = fs.readdirSync(destDir).filter(f => f.endsWith('.webp'));

let portfolioHtml = '<div class="portfolio-grid">\n';
let delay = 0;

files.forEach((file, index) => {
    const project = projects[index % projects.length];
    
    portfolioHtml += `
                    <div class="portfolio-item fade-up delay-${delay}">
                        <img src="assets/images/portfolio/${file}" alt="${project.title}" loading="lazy" decoding="async">
                        <div class="item-overlay">
                            <h3>${project.title}</h3>
                            <p>${project.role}</p>
                        </div>
                    </div>`;
    
    delay = (delay + 1) % 4;
});

portfolioHtml += '\n                </div>';

// Replace grid
const gridRegex = /<div class="portfolio-grid">[\s\S]*?<\/div>\s*(?=<\/section>)/;
htmlContent = htmlContent.replace(gridRegex, portfolioHtml + '\n');

// Update contact section
const contactRegex = /<section id="contact"[\s\S]*?<\/section>/;
const newContact = `<section id="contact" class="contact-section">
            <h2 class="section-title fade-up">Contact</h2>
            <div class="contact-content fade-up delay-1">
                <p>Available for freelance opportunities worldwide.</p>
                <div class="contact-links">
                    <a href="mailto:igor.cedeno@gmail.com" class="contact-link">igor.cedeno@gmail.com</a><br>
                    <a href="tel:+15127855859" class="contact-link">+1 512-785-5859</a><br>
                    <a href="tel:+17733065667" class="contact-link">+1 773-306-5667</a>
                </div>
            </div>
        </section>`;
htmlContent = htmlContent.replace(contactRegex, newContact);

// Remove About section entirely
const aboutRegex = /<!-- About Section -->[\s\S]*?<section id="about" class="about-section">[\s\S]*?<\/section>/;
htmlContent = htmlContent.replace(aboutRegex, '');

fs.writeFileSync(htmlFile, htmlContent);
console.log("Updated text content successfully.");
