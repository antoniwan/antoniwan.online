// Builds public/og.png (1200×630) and public/apple-touch-icon.png (180×180, square corners from
// public/favicon.svg). Run with `pnpm og` and commit the results; the deploy does not run this.
// The card is drawn by headless Chrome, because sharp cannot load the site's WOFF2 fonts. Set
// CHROME to the browser binary if it is not at the usual macOS path.

import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const file = (path) => new URL(path, root).pathname;
const dataUri = (path, type) => `data:${type};base64,${readFileSync(file(path)).toString('base64')}`;

const chrome = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// The card repeats the home hero: the wordmark, the name, and the portrait, in the site's colors.
const card = `<!doctype html>
<meta charset="utf-8">
<style>
  @font-face { font-family: Chivo; src: url(${dataUri('public/fonts/Chivo-Latin-Variable.woff2', 'font/woff2')}) format('woff2'); font-weight: 400 900; }
  @font-face { font-family: 'IBM Plex Sans'; src: url(${dataUri('public/fonts/IBMPlexSans-Latin-Variable.woff2', 'font/woff2')}) format('woff2'); font-weight: 400 700; }
  * { margin: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    position: relative; display: grid; grid-template-columns: 1fr 340px; align-items: center; gap: 64px; padding: 40px 96px 0;
    background: radial-gradient(circle at 92% -20%, #ffe8f2 0, #fdfcfa 60%); color: #101216; font-family: 'IBM Plex Sans', sans-serif;
  }
  .domain { position: absolute; top: 56px; left: 96px; font: 600 30px 'IBM Plex Sans', sans-serif; color: #c7006f; }
  .domain span { color: #353a42; }
  h1 { font: 750 132px/1.02 Chivo, sans-serif; letter-spacing: -0.055em; }
  h1 span { display: block; margin-top: 8px; font-size: 0.5em; font-weight: 650; letter-spacing: -0.035em; }
  p { margin-top: 32px; font-size: 32px; color: #353a42; }
  img { width: 340px; height: 340px; border-radius: 50%; object-fit: cover; }
</style>
<div class="domain">antoniwan<span>.online</span></div>
<div><h1>Antonio <span>Rodríguez Martínez</span></h1><p>Builder. Father. Boricua.</p></div>
<img src="${dataUri('src/portrait-2026-10.avif', 'image/avif')}" alt="">`;

// Headless Chrome writes the screenshot but does not always exit on macOS, so stop it as soon as it
// reports the file.
const screenshot = (html, png) =>
  new Promise((resolve, reject) => {
    const browser = spawn(chrome, [
      '--headless',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--window-size=1200,630',
      '--virtual-time-budget=5000',
      `--user-data-dir=${join(dirname(png), 'profile')}`,
      `--screenshot=${png}`,
      `file://${html}`,
    ], { stdio: ['ignore', 'pipe', 'pipe'] });
    const timer = setTimeout(() => {
      browser.kill();
      reject(new Error('Chrome did not write the screenshot within 60 seconds'));
    }, 60_000);
    const done = () => {
      clearTimeout(timer);
      browser.kill();
      resolve();
    };
    const watch = (chunk) => /written to file/i.test(String(chunk)) && done();
    browser.stdout.on('data', watch);
    browser.stderr.on('data', watch);
    browser.on('exit', done);
    browser.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
  });

const dir = mkdtempSync(join(tmpdir(), 'antoniwan-og-'));
try {
  writeFileSync(join(dir, 'card.html'), card);
  await screenshot(join(dir, 'card.html'), join(dir, 'card.png'));
  await sharp(join(dir, 'card.png')).png({ compressionLevel: 9 }).toFile(file('public/og.png'));
} finally {
  rmSync(dir, { recursive: true, force: true });
}

// iOS rounds the corners itself, so the touch icon fills the square. The density draws the
// 64-unit SVG at 180 pixels instead of enlarging a 64-pixel image.
const touchIcon = readFileSync(file('public/favicon.svg'), 'utf8').replace(/ rx="\d+"/, '');
await sharp(Buffer.from(touchIcon), { density: (72 * 180) / 64 })
  .resize(180, 180)
  .png()
  .toFile(file('public/apple-touch-icon.png'));

console.log('og.png and apple-touch-icon.png written');
