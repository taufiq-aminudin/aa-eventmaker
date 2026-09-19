import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const lightIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="favBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1d4ed8"/>
      <stop offset="50%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <linearGradient id="favOrange" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ea580c"/>
      <stop offset="50%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#fb923c"/>
    </linearGradient>
    <linearGradient id="favSwooshB" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>
    <linearGradient id="favSwooshO" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ea580c"/>
      <stop offset="100%" stop-color="#fdba74"/>
    </linearGradient>
  </defs>

  <rect width="512" height="512" rx="115" fill="#ffffff"/>

  <g transform="translate(45, 45) scale(0.82)">
    <path d="M195 90 L115 315 H175 L192 265 H245 L260 215 H209 L220 180 L238 215 L275 125 Z" fill="url(#favBlue)"/>
    <path d="M285 95 L225 315 H280 L295 265 H365 L382 315 H445 L365 95 H310 Z" fill="url(#favOrange)"/>
    <polygon points="330,150 308,225 352,225" fill="#ffffff"/>

    <path d="M80 280 C 60 320, 110 365, 230 350 C 170 345, 120 325, 105 300 C 95 285, 110 265, 140 245 C 105 255, 85 265, 80 280 Z" fill="url(#favSwooshB)"/>
    <path d="M90 280 C 120 330, 210 355, 310 330 C 230 345, 150 335, 110 295 C 100 285, 95 275, 90 280 Z" fill="url(#favSwooshB)"/>
    <path d="M230 350 C 330 345, 410 300, 460 215 C 430 255, 360 295, 270 315 C 240 322, 230 335, 230 350 Z" fill="url(#favSwooshO)"/>

    <g transform="translate(365, 75)">
      <rect x="0" y="8" width="68" height="64" rx="14" fill="#1d4ed8"/>
      <rect x="0" y="8" width="68" height="18" rx="14" fill="#1e3a8a"/>
      <rect x="0" y="20" width="68" height="6" fill="#1e3a8a"/>
      <rect x="14" y="2" width="7" height="14" rx="3.5" fill="#ffffff"/>
      <rect x="47" y="2" width="7" height="14" rx="3.5" fill="#ffffff"/>
      <circle cx="19" cy="38" r="3.5" fill="#ffffff"/>
      <circle cx="34" cy="38" r="3.5" fill="#ffffff"/>
      <circle cx="49" cy="38" r="3.5" fill="#ffffff"/>
      <circle cx="19" cy="54" r="3.5" fill="#ffffff"/>
      <circle cx="34" cy="54" r="3.5" fill="#ffffff"/>
      <circle cx="49" cy="54" r="3.5" fill="#ffffff"/>
    </g>
  </g>
</svg>
`;

// Maskable icon with dark blue background matching App Icon (Dark) from uploaded image
const darkMaskableSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0f2b5c"/>
      <stop offset="50%" stop-color="#091b3a"/>
      <stop offset="100%" stop-color="#040d1e"/>
    </linearGradient>
    <linearGradient id="dkBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="dkOrange" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fb923c"/>
      <stop offset="50%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#ea580c"/>
    </linearGradient>
    <linearGradient id="swB" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60a5fa"/>
      <stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>
    <linearGradient id="swO" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f97316"/>
      <stop offset="100%" stop-color="#fde047"/>
    </linearGradient>
  </defs>

  <!-- Full-bleed background for maskable compliance -->
  <rect width="512" height="512" fill="url(#bgGrad)"/>

  <!-- Logo centered in safe zone (80% circle with 10% padding) -->
  <g transform="translate(68, 68) scale(0.73)">
    <path d="M195 90 L115 315 H175 L192 265 H245 L260 215 H209 L220 180 L238 215 L275 125 Z" fill="url(#dkBlue)"/>
    <path d="M285 95 L225 315 H280 L295 265 H365 L382 315 H445 L365 95 H310 Z" fill="url(#dkOrange)"/>
    <polygon points="330,150 308,225 352,225" fill="#091b3a"/>

    <path d="M80 280 C 60 320, 110 365, 230 350 C 170 345, 120 325, 105 300 C 95 285, 110 265, 140 245 C 105 255, 85 265, 80 280 Z" fill="url(#swB)"/>
    <path d="M90 280 C 120 330, 210 355, 310 330 C 230 345, 150 335, 110 295 C 100 285, 95 275, 90 280 Z" fill="url(#swB)"/>
    <path d="M230 350 C 330 345, 410 300, 460 215 C 430 255, 360 295, 270 315 C 240 322, 230 335, 230 350 Z" fill="url(#swO)"/>

    <g transform="translate(365, 75)">
      <rect x="0" y="8" width="68" height="64" rx="14" fill="#2563eb"/>
      <rect x="0" y="8" width="68" height="18" rx="14" fill="#1e3a8a"/>
      <rect x="0" y="20" width="68" height="6" fill="#1e3a8a"/>
      <rect x="14" y="2" width="7" height="14" rx="3.5" fill="#ffffff"/>
      <rect x="47" y="2" width="7" height="14" rx="3.5" fill="#ffffff"/>
      <circle cx="19" cy="38" r="3.5" fill="#ffffff"/>
      <circle cx="34" cy="38" r="3.5" fill="#ffffff"/>
      <circle cx="49" cy="38" r="3.5" fill="#ffffff"/>
      <circle cx="19" cy="54" r="3.5" fill="#ffffff"/>
      <circle cx="34" cy="54" r="3.5" fill="#ffffff"/>
      <circle cx="49" cy="54" r="3.5" fill="#ffffff"/>
    </g>
  </g>
</svg>
`;

async function generate() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  console.log('Generating PWA and App icon PNG assets...');

  // 1. pwa-512x512.png
  await sharp(Buffer.from(lightIconSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // 2. pwa-192x192.png
  await sharp(Buffer.from(lightIconSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // 3. apple-touch-icon.png (180x180 for iOS)
  await sharp(Buffer.from(lightIconSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // 4. pwa-maskable-512x512.png
  await sharp(Buffer.from(darkMaskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // 5. favicon.ico (32x32)
  await sharp(Buffer.from(lightIconSvg))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'));

  console.log('All icons generated successfully!');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
