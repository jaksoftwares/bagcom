import fs from 'fs';
import path from 'path';

const outDir = path.join(process.cwd(), 'brand', 'assets', 'logo');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const COLORS = {
  green: '#16A34A',
  blue: '#3B82F6',
  slate: '#0F172A',
  white: '#FFFFFF',
  light: '#F8FAFC'
};

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@800&amp;display=swap');`;

const getIcon = (colorGreen, colorBlue, colorSlate, colorNode) => `
  <path d="M25 15 H 60 A 17.5 17.5 0 0 1 77.5 32.5 V 32.5 A 17.5 17.5 0 0 1 60 50 H 25" fill="none" stroke="${colorGreen}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M25 50 H 65 A 17.5 17.5 0 0 1 82.5 67.5 V 67.5 A 17.5 17.5 0 0 1 65 85 H 25" fill="none" stroke="${colorBlue}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="25" y1="15" x2="25" y2="85" stroke="${colorSlate}" stroke-width="14" stroke-linecap="round"/>
  <circle cx="50" cy="32.5" r="5" fill="${colorNode}" />
  <circle cx="55" cy="67.5" r="5" fill="${colorNode}" />
`;

const svgs = {
  'primary-logo.svg': `
    <svg width="420" height="100" viewBox="0 0 420 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        ${FONT_IMPORT}
        .text { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 68px; fill: ${COLORS.slate}; letter-spacing: -0.04em; }
      </style>
      <g transform="translate(10, 10) scale(0.8)">
        ${getIcon(COLORS.green, COLORS.blue, COLORS.slate, COLORS.slate)}
      </g>
      <text x="100" y="74" class="text">Bagcom</text>
    </svg>`,

  'secondary-logo.svg': `
    <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        ${FONT_IMPORT}
        .text { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 56px; fill: ${COLORS.slate}; letter-spacing: -0.04em; text-anchor: middle; }
      </style>
      <g transform="translate(70, 30) scale(1)">
        ${getIcon(COLORS.green, COLORS.blue, COLORS.slate, COLORS.slate)}
      </g>
      <text x="120" y="190" class="text">Bagcom</text>
    </svg>`,

  'icon-only.svg': `
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(10, 10) scale(1)">
        ${getIcon(COLORS.green, COLORS.blue, COLORS.slate, COLORS.slate)}
      </g>
    </svg>`,

  'monochrome-logo.svg': `
    <svg width="420" height="100" viewBox="0 0 420 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        ${FONT_IMPORT}
        .text { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 68px; fill: ${COLORS.slate}; letter-spacing: -0.04em; }
      </style>
      <g transform="translate(10, 10) scale(0.8)">
        ${getIcon(COLORS.slate, COLORS.slate, COLORS.slate, COLORS.white)}
      </g>
      <text x="100" y="74" class="text">Bagcom</text>
    </svg>`,

  'logo-dark-bg.svg': `
    <svg width="420" height="100" viewBox="0 0 420 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        ${FONT_IMPORT}
        .text { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 68px; fill: ${COLORS.white}; letter-spacing: -0.04em; }
      </style>
      <rect width="420" height="100" rx="16" fill="${COLORS.slate}"/>
      <g transform="translate(10, 10) scale(0.8)">
        ${getIcon(COLORS.green, COLORS.blue, COLORS.white, COLORS.white)}
      </g>
      <text x="100" y="74" class="text">Bagcom</text>
    </svg>`,

  'logo-light-bg.svg': `
    <svg width="420" height="100" viewBox="0 0 420 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        ${FONT_IMPORT}
        .text { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 68px; fill: ${COLORS.slate}; letter-spacing: -0.04em; }
      </style>
      <rect width="420" height="100" rx="16" fill="${COLORS.light}"/>
      <g transform="translate(10, 10) scale(0.8)">
        ${getIcon(COLORS.green, COLORS.blue, COLORS.slate, COLORS.slate)}
      </g>
      <text x="100" y="74" class="text">Bagcom</text>
    </svg>`,

  'mobile-app-icon.svg': `
    <svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="1024" height="1024" rx="225" fill="${COLORS.slate}"/>
      <g transform="translate(262, 262) scale(5)">
        ${getIcon(COLORS.green, COLORS.blue, COLORS.white, COLORS.white)}
      </g>
    </svg>`,

  'favicon.svg': `
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(7, 7) scale(0.5)">
        ${getIcon(COLORS.green, COLORS.blue, COLORS.slate, COLORS.slate)}
      </g>
    </svg>`,

  'horizontal-layout.svg': `
    <svg width="420" height="100" viewBox="0 0 420 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        ${FONT_IMPORT}
        .text { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 68px; fill: ${COLORS.slate}; letter-spacing: -0.04em; }
      </style>
      <g transform="translate(10, 10) scale(0.8)">
        ${getIcon(COLORS.green, COLORS.blue, COLORS.slate, COLORS.slate)}
      </g>
      <text x="100" y="74" class="text">Bagcom</text>
    </svg>`,

  'vertical-layout.svg': `
    <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        ${FONT_IMPORT}
        .text { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 56px; fill: ${COLORS.slate}; letter-spacing: -0.04em; text-anchor: middle; }
      </style>
      <g transform="translate(70, 30) scale(1)">
        ${getIcon(COLORS.green, COLORS.blue, COLORS.slate, COLORS.slate)}
      </g>
      <text x="120" y="190" class="text">Bagcom</text>
    </svg>`
};

for (const [filename, content] of Object.entries(svgs)) {
  fs.writeFileSync(path.join(outDir, filename), content.trim());
}

console.log('Successfully generated all SVG files.');
