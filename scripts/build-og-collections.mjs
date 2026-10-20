// Builds the three collection share cards: public/og/books.png, movies.png and games.png (1200×630).
// Run with `pnpm og:collections` and commit the results; the deploy does not run this.
// Same family as scripts/build-og.mjs: headless Chrome draws HTML with the site's WOFF2 fonts, sharp
// post-processes. The stat lines come from src/data/*.json, so rerun this after the data changes.
// Set CHROME to the browser binary if it is not found (Chrome or Edge on Windows, Chrome on macOS/Linux).

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const file = (path) => fileURLToPath(new URL(path, root));
const dataUri = (path, type) => `data:${type};base64,${readFileSync(file(path)).toString('base64')}`;
const json = (path) => JSON.parse(readFileSync(file(path), 'utf8'));

const findChrome = () => {
  if (process.env.CHROME) return process.env.CHROME;
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ];
  const found = candidates.find((path) => existsSync(path));
  if (!found) throw new Error('No Chrome or Edge found. Set CHROME to the browser binary.');
  return found;
};
const chrome = findChrome();

// Stat lines, computed from the data the pages render.
const number = (value) => value.toLocaleString('en-US');
const books = json('src/data/books.json');
const movies = json('src/data/movies.json').movies;
const games = json('src/data/games.json');
const newestWatch = movies.flatMap((movie) => movie.watches.map((watch) => watch.watchedOn)).sort().at(-1);
const watchedOn = new Date(`${newestWatch}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

// `time` and `strength` choose which stretch of the site's moving pattern is frozen and how bold it
// is. Games is the showpiece, so it gets the boldest pattern.
const cards = [
  {
    name: 'books',
    title: 'Books on my mind',
    stat: `${number(books.length)} books · ${number(books.filter((book) => book.readingStatus === 'read').length)} read`,
    time: 41, strength: 0.3,
  },
  {
    name: 'movies',
    title: 'Things I’ve watched',
    stat: `${number(movies.length)} films · latest ${watchedOn}`,
    time: 83, strength: 0.34,
  },
  {
    name: 'games',
    title: 'Things I’ve played',
    stat: `~${number(games.lifetime.low)}–${number(games.lifetime.high)} hours · ${number(games.games.length)} games`,
    time: 9, strength: 0.62,
  },
];

const html = ({ title, stat, time, strength }) => `<!doctype html>
<meta charset="utf-8">
<style>
  @font-face { font-family: Chivo; src: url(${dataUri('public/fonts/Chivo-Latin-Variable.woff2', 'font/woff2')}) format('woff2'); font-weight: 400 900; }
  @font-face { font-family: 'IBM Plex Sans'; src: url(${dataUri('public/fonts/IBMPlexSans-Latin-Variable.woff2', 'font/woff2')}) format('woff2'); font-weight: 400 700; }
  * { margin: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    position: relative; display: flex; flex-direction: column; justify-content: center; padding: 40px 96px 0;
    background: radial-gradient(circle at 92% -20%, #ffe8f2 0, #fdfcfa 60%); color: #101216; font-family: 'IBM Plex Sans', sans-serif;
  }
  canvas { position: absolute; inset: 0; }
  .domain { position: absolute; top: 56px; left: 96px; font: 600 30px 'IBM Plex Sans', sans-serif; color: #c7006f; }
  .domain span { color: #353a42; }
  .domain em { font-style: normal; color: #5a606a; font-weight: 500; }
  h1 { position: relative; font: 750 108px/1.02 Chivo, sans-serif; letter-spacing: -0.055em; white-space: nowrap; }
  p { position: relative; margin-top: 32px; font: 500 42px 'IBM Plex Sans', sans-serif; color: #353a42; }
</style>
<canvas id="pattern" width="1200" height="630"></canvas>
<div class="domain">antoniwan<span>.online</span> <em>/ Collections</em></div>
<h1>${title}</h1><p>${stat}</p>
<script>
  // The site's quasicrystal (ShaderBackdrop.astro), frozen at one moment: five plane waves, bright
  // where their sum is near a multiple of pi, tinted from paper to strawberry.
  const time = ${time}, strength = ${strength}, unit = 250;
  const paper = [0xfd, 0xfc, 0xfa], berry = [0xff, 0x2f, 0x92];
  const canvas = document.getElementById('pattern');
  const context = canvas.getContext('2d');
  const image = context.createImageData(1200, 630);
  const t = time * 0.14;
  const smooth = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
  const dx = [], dy = [];
  for (let i = 0; i < 5; i++) { const angle = i * 0.62831853 + t * 0.07; dx.push(Math.cos(angle)); dy.push(Math.sin(angle)); }
  for (let y = 0; y < 630; y++) {
    for (let x = 0; x < 1200; x++) {
      const px = (x - 600) / unit, py = (y - 315) / unit;
      let wave = 0;
      for (let i = 0; i < 5; i++) wave += Math.cos((px * dx[i] + py * dy[i]) * 16 + t * (i * 0.1 + 0.3));
      const pattern = 0.08 + 0.8 * Math.pow(0.5 + 0.5 * Math.cos(wave * 2), 8);
      // Strongest at the top right, fading toward the text at the lower left.
      const fade = 0.12 + 0.88 * smooth(0.25, 1.05, (x / 1200) * 0.85 + (1 - y / 630) * 0.45);
      const k = pattern * strength * fade;
      const o = (y * 1200 + x) * 4;
      image.data[o] = paper[0] + (berry[0] - paper[0]) * k;
      image.data[o + 1] = paper[1] + (berry[1] - paper[1]) * k;
      image.data[o + 2] = paper[2] + (berry[2] - paper[2]) * k;
      image.data[o + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
</script>`;

// Headless Chrome writes the screenshot but does not always exit, so stop it as soon as it reports
// the file.
const screenshot = (page, png) =>
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
      `--user-data-dir=${join(png, '..', 'profile')}`,
      `--screenshot=${png}`,
      pathToFileURL(page).href,
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

const dir = mkdtempSync(join(tmpdir(), 'antoniwan-og-collections-'));
mkdirSync(file('public/og/'), { recursive: true });
try {
  for (const card of cards) {
    writeFileSync(join(dir, `${card.name}.html`), html(card));
    await screenshot(join(dir, `${card.name}.html`), join(dir, `${card.name}.png`));
    // The pattern is a smooth gradient, so a palette PNG keeps the file small without visible banding.
    await sharp(join(dir, `${card.name}.png`))
      .png({ compressionLevel: 9, palette: true, quality: 90, dither: 0.6, effort: 10 })
      .toFile(file(`public/og/${card.name}.png`));
    console.log(`public/og/${card.name}.png  ${card.title}  |  ${card.stat}`);
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
