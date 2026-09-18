#!/usr/bin/env node
/* Simple CI check: every internal href/src in web/*.html must point to a file
   that actually exists. Catches broken links and dead references early. */
const fs = require('fs');
const path = require('path');

const webDir = path.join(__dirname, '..', 'web');
const htmlFiles = fs.readdirSync(webDir).filter(f => f.endsWith('.html'));

const linkRe = /(?:href|src)="([^"]+)"/g;
let errors = 0;

for (const file of htmlFiles) {
  const content = fs.readFileSync(path.join(webDir, file), 'utf8');
  let m;
  while ((m = linkRe.exec(content))) {
    const link = m[1];
    if (/^(https?:|mailto:|tel:|#|javascript:|data:)/.test(link)) continue;
    if (link.includes('${')) continue; // JS template literal caught by the regex, not a real link
    const clean = link.split('?')[0].split('#')[0];
    if (!clean || clean === './') continue;
    const target = path.join(webDir, clean);
    if (!fs.existsSync(target)) {
      console.error(`Broken link in ${file}: "${link}"`);
      errors++;
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} broken link(s) found.`);
  process.exit(1);
}
console.log(`OK — checked ${htmlFiles.length} HTML files in web/, no broken internal links.`);
