// Builds public/og.png (1200×630) from the profile picture, and public/apple-touch-icon.png
// (180×180, square corners) from public/favicon.svg. Run with `pnpm og` and commit the results; the deploy
// does not run this.

import { readFileSync } from 'node:fs';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const file = (path) => new URL(path, root).pathname;

const size = 400;
const mask = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`,
);
const photo = await sharp(file('src/profile.avif'))
  .resize(size, size, { fit: 'cover' })
  .composite([{ input: mask, blend: 'dest-in' }])
  .png()
  .toBuffer();

const background = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#fbfaf7"/>
  <rect x="0" y="0" width="1200" height="6" fill="#9a4b12"/>
  <text x="560" y="275" font-family="Georgia, 'Times New Roman', serif" font-size="64" font-weight="700" fill="#1a1613">Antonio Rodríguez</text>
  <text x="560" y="350" font-family="Georgia, 'Times New Roman', serif" font-size="64" font-weight="700" fill="#1a1613">Martínez</text>
  <text x="560" y="420" font-family="Georgia, 'Times New Roman', serif" font-size="34" font-style="italic" fill="#776d64">Builder. Father. Boricua.</text>
  <text x="560" y="500" font-family="Helvetica, Arial, sans-serif" font-size="26" fill="#9a4b12">antoniwan.online</text>
</svg>`;

await sharp(Buffer.from(background))
  .composite([{ input: photo, left: 110, top: 115 }])
  .png()
  .toFile(file('public/og.png'));

// iOS rounds the corners itself, so the touch icon fills the square. The density draws the
// 64-unit SVG at 180 pixels instead of enlarging a 64-pixel image.
const touchIcon = readFileSync(file('public/favicon.svg'), 'utf8').replace(/ rx="\d+"/, '');
await sharp(Buffer.from(touchIcon), { density: (72 * 180) / 64 })
  .resize(180, 180)
  .png()
  .toFile(file('public/apple-touch-icon.png'));

console.log('og.png and apple-touch-icon.png written');
