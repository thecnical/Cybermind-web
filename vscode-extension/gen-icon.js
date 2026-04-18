const sharp = require('sharp');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <rect width="128" height="128" fill="#1a1a1a" rx="16"/>
  <polygon points="64,8 116,36 116,92 64,120 12,92 12,36" fill="none" stroke="#00ffff" stroke-width="4"/>
  <path d="M70 20 L48 64 H63 L57 108 L80 64 H65 L70 20Z" fill="#00ffff"/>
</svg>`;

sharp(Buffer.from(svg))
  .png()
  .toFile('media/icon.png')
  .then(() => console.log('icon.png created (128x128)'))
  .catch(e => console.error('Failed:', e));
