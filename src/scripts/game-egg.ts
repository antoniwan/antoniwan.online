// Signal: the site's hidden game. GameEgg.astro loads this file on demand, never on page load.
// It draws the header's quasicrystal on a canvas. Faint lines are safe. Bright rings end the run.
// You steer one neuron, collect gold nodes, and keep a chain going for a bigger multiplier.

const WAVES = 5;
const K = 16;
const DIR_X = Array.from({ length: WAVES }, (_, i) => Math.cos(i * 0.62831853));
const DIR_Y = Array.from({ length: WAVES }, (_, i) => Math.sin(i * 0.62831853));
const DRIFT = Array.from({ length: WAVES }, (_, i) => i * 0.1 + 0.3);

const BEST_KEY = 'antoniwan-egg-best';
const CHAIN_WINDOW = 2.4;
const MAX_MULTIPLIER = 5;
const MAX_FIELD_CELLS = 64000;

/** The header's wave sum. The pattern is bright where it equals 0 or plus or minus pi. */
export function waveSum(u: number, v: number, drift: number) {
  let sum = 0;
  for (let i = 0; i < WAVES; i++) sum += Math.cos((u * DIR_X[i]! + v * DIR_Y[i]!) * K + drift * DRIFT[i]!);
  return sum;
}
/** How far a wave value is from the nearest ring contour. */
export const ringDistance = (wave: number) => Math.abs(Math.abs(wave) - Math.PI);
/** World units scrolled per second after `seconds` of play. */
export const speedAt = (seconds: number) => 0.085 + 0.15 * (1 - Math.exp(-seconds / 35));
/** Half-width of the lethal rings, in wave units. They fatten as a run goes on. */
export const ringWidthAt = (seconds: number) => 0.35 + 0.5 * (1 - Math.exp(-seconds / 50));

type Rgb = [number, number, number];
type Colors = { paper: Rgb; strawberry: Rgb; ink: Rgb; head: Rgb; trail: Rgb; accent: Rgb };
type Chip = { u: number; y: number };
type Burst = { x: number; y: number; age: number; hit: boolean };
type State = 'ready' | 'playing' | 'paused' | 'dying' | 'over';

const FALLBACKS = { paper: '#fdfcfa', strawberry: '#ff2f92', ink: '#101216', neuron: '#000000', 'neuron-trail': '#e9ad1c', accent: '#c7006f' };

function parseColor(value: string, fallback: string): Rgb {
  let hex = value.trim().replace('#', '');
  if (hex.length === 3) hex = [...hex].map(c => c + c).join('');
  if (!/^[0-9a-f]{6}$/i.test(hex)) hex = fallback.slice(1);
  return [0, 2, 4].map(o => parseInt(hex.slice(o, o + 2), 16)) as Rgb;
}
const css = (c: Rgb, alpha = 1) => `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;
const smooth = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

let game: ReturnType<typeof build>;
let gameDialog: HTMLDialogElement | undefined;

/** Opens the game. The first call builds it; later calls reuse it. */
export function openGame(dialog: HTMLDialogElement, opener: HTMLElement | null) {
  if (dialog.open) return;
  if (gameDialog !== dialog) { game = build(dialog); gameDialog = dialog; }
  game?.open(opener);
}

function build(dialog: HTMLDialogElement) {
  const q = <T extends HTMLElement>(selector: string) => dialog.querySelector<T>(selector)!;
  const canvas = q<HTMLCanvasElement>('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return undefined;
  const panel = q('[data-panel]');
  const eyebrow = q('[data-eyebrow]');
  const title = q('[data-title]');
  const lede = q('[data-lede]');
  const result = q('[data-result]');
  const primary = q<HTMLButtonElement>('[data-primary]');
  const pauseButton = q<HTMLButtonElement>('[data-pause]');
  const closeButton = q<HTMLButtonElement>('[data-close]');
  const scoreText = q('[data-score]');
  const bestText = q('[data-best]');
  const status = q('[data-status]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const field = document.createElement('canvas');
  const fieldCtx = field.getContext('2d')!;

  let state: State = 'ready';
  let opener: HTMLElement | null = null;
  let colors: Colors = readColors();
  let W = 0, H = 0, unit = 1, dpr = 1, cell = 5, cols = 0, rows = 0;
  let image: ImageData | undefined;
  let colTerms = new Float32Array(0), rowTerms = new Float32Array(0);
  let scroll = Math.random() * 40, drift = Math.random() * 40, seconds = 0;
  let px = 0, py = 0, vx = 0, vy = 0;
  let chips: Chip[] = [];
  let trail: Chip[] = [];
  let bursts: Burst[] = [];
  let score = 0, chain = 0, chainLeft = 0, nextChip = 0, grace = 0, dying = 0, locked = 0, best = 0;
  let newBest = false;
  let raf = 0, last = 0;
  const held = new Set<string>();
  let mouse: { x: number; y: number } | null = null;
  let drag: { id: number; x: number; y: number } | null = null;

  try { best = Number(localStorage.getItem(BEST_KEY)) || 0; } catch { /* Storage is optional. */ }

  function readColors(): Colors {
    const style = getComputedStyle(document.documentElement);
    const get = (name: keyof typeof FALLBACKS) => parseColor(style.getPropertyValue(`--${name}`), FALLBACKS[name]);
    return {
      paper: get('paper'), strawberry: get('strawberry'), ink: get('ink'),
      head: get('neuron'), trail: get('neuron-trail'), accent: get('accent'),
    };
  }

  const radius = () => Math.max(7, Math.min(12, unit * 0.011));
  const chipRadius = () => radius() * 0.95;
  const maxSpeed = () => unit * 0.6;
  const width = () => ringWidthAt(state === 'ready' ? 0 : seconds);
  const waveAt = (x: number, y: number) => waveSum(scroll + x / unit, (y - H / 2) / unit, drift);
  const lethalAt = (x: number, y: number) => ringDistance(waveAt(x, y)) < width() * 0.7;

  function say(text: string) { status.textContent = text; }

  function fit() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    if (w !== W || h !== H) {
      if (W && H) { px *= w / W; py *= h / H; }
      W = w; H = h;
      unit = Math.max(360, Math.min(820, H * 0.9, W * 1.6));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      cell = Math.max(4, Math.ceil(Math.sqrt((W * H) / MAX_FIELD_CELLS)));
      cols = Math.ceil(W / cell); rows = Math.ceil(H / cell);
      field.width = cols; field.height = rows;
      image = fieldCtx.createImageData(cols, rows);
      colTerms = new Float32Array(cols * WAVES * 2); rowTerms = new Float32Array(rows * WAVES * 2);
      if (!px && !py) placeStart();
    }
  }

  function placeStart() {
    px = W * 0.22;
    let bestY = H / 2, bestGap = -1;
    for (let i = 1; i < 24; i++) {
      const y = (H * i) / 24;
      const gap = ringDistance(waveAt(px, y));
      if (gap > bestGap) { bestGap = gap; bestY = y; }
    }
    py = bestY; vx = vy = 0;
  }

  // The field is five cosines per pixel. Splitting each phase into a column part and a row part
  // lets the inner loop use only multiplies, so a full-screen pattern stays cheap.
  function paintField() {
    if (!image) return;
    for (let i = 0; i < WAVES; i++) {
      for (let c = 0; c < cols; c++) {
        const phase = (scroll + ((c + 0.5) * cell) / unit) * DIR_X[i]! * K + drift * DRIFT[i]!;
        colTerms[(i * cols + c) * 2] = Math.cos(phase); colTerms[(i * cols + c) * 2 + 1] = Math.sin(phase);
      }
      for (let r = 0; r < rows; r++) {
        const phase = (((r + 0.5) * cell - H / 2) / unit) * DIR_Y[i]! * K;
        rowTerms[(i * rows + r) * 2] = Math.cos(phase); rowTerms[(i * rows + r) * 2 + 1] = Math.sin(phase);
      }
    }
    const { paper, strawberry: s, ink } = colors;
    const d = width();
    const data = image.data;
    let o = 0;
    for (let r = 0; r < rows; r++) {
      const c0 = rowTerms[(0 * rows + r) * 2]!, s0 = rowTerms[(0 * rows + r) * 2 + 1]!;
      const c1 = rowTerms[(1 * rows + r) * 2]!, s1 = rowTerms[(1 * rows + r) * 2 + 1]!;
      const c2 = rowTerms[(2 * rows + r) * 2]!, s2 = rowTerms[(2 * rows + r) * 2 + 1]!;
      const c3 = rowTerms[(3 * rows + r) * 2]!, s3 = rowTerms[(3 * rows + r) * 2 + 1]!;
      const c4 = rowTerms[(4 * rows + r) * 2]!, s4 = rowTerms[(4 * rows + r) * 2 + 1]!;
      for (let c = 0; c < cols; c++) {
        const w =
          colTerms[(0 * cols + c) * 2]! * c0 - colTerms[(0 * cols + c) * 2 + 1]! * s0 +
          colTerms[(1 * cols + c) * 2]! * c1 - colTerms[(1 * cols + c) * 2 + 1]! * s1 +
          colTerms[(2 * cols + c) * 2]! * c2 - colTerms[(2 * cols + c) * 2 + 1]! * s2 +
          colTerms[(3 * cols + c) * 2]! * c3 - colTerms[(3 * cols + c) * 2 + 1]! * s3 +
          colTerms[(4 * cols + c) * 2]! * c4 - colTerms[(4 * cols + c) * 2 + 1]! * s4;
        // The safe network (wave near 0) is a faint line. The rings (wave near +/- pi) are the hazard.
        const x = w / 0.2;
        const safe = 0.24 / (1 + x * x * x * x);
        const ring = 1 - smooth(d * 0.65, d * 1.2, Math.abs(Math.abs(w) - Math.PI));
        const core = ring > 0.8 ? (ring - 0.8) * 1.6 : 0;
        const r0 = paper[0] + (s[0] - paper[0]) * safe, g0 = paper[1] + (s[1] - paper[1]) * safe, b0 = paper[2] + (s[2] - paper[2]) * safe;
        const rr = s[0] + (ink[0] - s[0]) * core, gg = s[1] + (ink[1] - s[1]) * core, bb = s[2] + (ink[2] - s[2]) * core;
        data[o++] = r0 + (rr - r0) * ring; data[o++] = g0 + (gg - g0) * ring; data[o++] = b0 + (bb - b0) * ring; data[o++] = 255;
      }
    }
    fieldCtx.putImageData(image, 0, 0);
  }

  function draw(now: number) {
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.imageSmoothingEnabled = true;
    ctx!.imageSmoothingQuality = 'high';
    paintField();
    ctx!.drawImage(field, 0, 0, cols * cell, rows * cell);
    const still = reduced.matches;
    const r = radius();

    for (const chip of chips) {
      const x = (chip.u - scroll) * unit, y = chip.y * H;
      if (x < -30 || x > W + 30) continue;
      const pulse = still ? 0 : Math.sin(now / 320 + chip.u * 9) * 0.5 + 0.5;
      ctx!.fillStyle = css(colors.trail, 0.28);
      ctx!.beginPath(); ctx!.arc(x, y, chipRadius() * (1.9 + pulse * 0.5), 0, Math.PI * 2); ctx!.fill();
      ctx!.fillStyle = css(colors.trail); ctx!.strokeStyle = css(colors.ink); ctx!.lineWidth = 2;
      ctx!.beginPath(); ctx!.arc(x, y, chipRadius(), 0, Math.PI * 2); ctx!.fill(); ctx!.stroke();
    }

    // The tail is stored in the field's coordinates, so it stays on the pattern as the pattern moves.
    ctx!.lineCap = 'round';
    for (let i = 1; i < trail.length; i++) {
      const a = trail[i - 1]!, b = trail[i]!;
      const fade = i / trail.length;
      ctx!.strokeStyle = css(colors.trail, 0.15 + fade * 0.7);
      ctx!.lineWidth = 1 + fade * r * 1.1;
      ctx!.beginPath(); ctx!.moveTo((a.u - scroll) * unit, a.y); ctx!.lineTo((b.u - scroll) * unit, b.y); ctx!.stroke();
    }

    if (state !== 'dying' && state !== 'over') {
      ctx!.fillStyle = css(colors.trail, 0.35);
      ctx!.beginPath(); ctx!.arc(px, py, r * 2.2, 0, Math.PI * 2); ctx!.fill();
      ctx!.fillStyle = css(colors.head); ctx!.strokeStyle = css(colors.paper); ctx!.lineWidth = 2.5;
      ctx!.beginPath(); ctx!.arc(px, py, r, 0, Math.PI * 2); ctx!.fill(); ctx!.stroke();
      if (grace > 0 && state === 'playing') {
        ctx!.strokeStyle = css(colors.accent, 0.8); ctx!.lineWidth = 1.5; ctx!.setLineDash([3, 4]);
        ctx!.beginPath(); ctx!.arc(px, py, r + 8, 0, Math.PI * 2); ctx!.stroke(); ctx!.setLineDash([]);
      }
      if (chain > 0 && state === 'playing') {
        ctx!.strokeStyle = css(colors.accent); ctx!.lineWidth = 2.5;
        ctx!.beginPath(); ctx!.arc(px, py, r + 6, -Math.PI / 2, -Math.PI / 2 + (chainLeft / CHAIN_WINDOW) * Math.PI * 2); ctx!.stroke();
      }
    }

    for (const burst of bursts) {
      const t = burst.age / (burst.hit ? 0.7 : 0.35);
      ctx!.strokeStyle = css(burst.hit ? colors.ink : colors.trail, 1 - t);
      ctx!.lineWidth = 3 * (1 - t) + 1;
      ctx!.beginPath(); ctx!.arc(burst.x, burst.y, r + t * (burst.hit ? 70 : 34), 0, Math.PI * 2); ctx!.stroke();
    }
    if (state === 'dying' || state === 'over') {
      ctx!.fillStyle = css(colors.ink); ctx!.strokeStyle = css(colors.paper); ctx!.lineWidth = 2.5;
      ctx!.beginPath(); ctx!.arc(px, py, r * 0.6, 0, Math.PI * 2); ctx!.fill(); ctx!.stroke();
    }
  }

  function spawnChip() {
    let pick: Chip | undefined, pickGap = -1;
    for (let attempt = 0; attempt < 16; attempt++) {
      const y = 0.1 + Math.random() * 0.8;
      const u = scroll + (W + 40) / unit;
      const x = (u - scroll) * unit, yy = y * H;
      let gap = ringDistance(waveAt(x, yy));
      for (let k = 0; k < 4; k++) {
        const a = (k / 4) * Math.PI * 2;
        gap = Math.min(gap, ringDistance(waveAt(x + Math.cos(a) * 26, yy + Math.sin(a) * 26)));
      }
      // Keep nodes out of the rings, but not always: a node beside a ring is the risky one.
      const wanted = width() + 0.3;
      if (gap > wanted) { pick = { u, y }; break; }
      if (gap > pickGap) { pickGap = gap; pick = { u, y }; }
    }
    if (pick) chips.push(pick);
  }

  function setPanel(kind: 'ready' | 'paused' | 'over') {
    panel.hidden = false;
    result.hidden = kind !== 'over';
    if (kind === 'ready') {
      eyebrow.textContent = 'Hidden game'; title.textContent = 'Signal';
      lede.textContent = 'Steer the neuron and collect the gold nodes. Bright rings end the run. The faint lines are safe.';
      primary.textContent = 'Start';
    } else if (kind === 'paused') {
      eyebrow.textContent = 'Paused'; title.textContent = 'Signal';
      lede.textContent = 'Take your time. The pattern waits.';
      primary.textContent = 'Resume';
    } else {
      eyebrow.textContent = newBest ? 'New best' : 'Run over';
      title.textContent = `Score ${score}`;
      lede.textContent = newBest ? 'That is your best run so far.' : best ? `Your best is ${best}.` : '';
      result.textContent = `Best ${best}`;
      primary.textContent = 'Play again';
    }
    lede.hidden = !lede.textContent;
    primary.focus({ preventScroll: true });
  }

  function hud() {
    scoreText.textContent = `Score ${score}${chain > 1 ? ` ×${Math.min(chain, MAX_MULTIPLIER)}` : ''}`;
    bestText.textContent = `Best ${Math.max(best, score)}`;
  }

  function begin() {
    if (performance.now() < locked) return;
    state = 'playing';
    seconds = 0; score = 0; chain = 0; chainLeft = 0; grace = 1.6; dying = 0; newBest = false;
    chips = []; trail = []; bursts = []; nextChip = 0.5;
    held.clear(); mouse = null; drag = null;
    px = W * 0.22; py = H / 2; placeStart();
    panel.hidden = true; pauseButton.disabled = false; pauseButton.textContent = 'Pause';
    hud(); say('Go.');
    dialog.focus({ preventScroll: true });
  }

  function pause() {
    if (state !== 'playing') return;
    state = 'paused'; held.clear(); vx = vy = 0;
    pauseButton.textContent = 'Resume'; setPanel('paused'); say('Paused.');
  }
  function resume() {
    if (state !== 'paused') return;
    state = 'playing'; panel.hidden = true; pauseButton.textContent = 'Pause'; say('Resumed.');
    dialog.focus({ preventScroll: true });
  }

  function die() {
    state = 'dying'; dying = reduced.matches ? 0.7 : 0; held.clear(); mouse = null; drag = null;
    if (!reduced.matches) bursts.push({ x: px, y: py, age: 0, hit: true });
    pauseButton.disabled = true;
    newBest = score > best;
    if (newBest) {
      best = score;
      try { localStorage.setItem(BEST_KEY, String(best)); } catch { /* Storage is optional. */ }
    }
  }
  function finish() {
    state = 'over'; locked = performance.now() + 700;
    hud(); setPanel('over');
    say(`Run over. Score ${score}. Best ${best}. Press Space to play again.`);
  }

  function step(dt: number) {
    const slow = reduced.matches ? 0.5 : 1;
    if (state === 'playing') {
      seconds += dt; grace = Math.max(0, grace - dt);
      scroll += speedAt(seconds) * slow * dt;
    } else if (state === 'ready' || state === 'paused') {
      if (state === 'ready') scroll += 0.04 * slow * dt;
    }
    if (state === 'playing' || state === 'ready') drift += dt * (state === 'playing' ? 1.1 : 0.35) * (reduced.matches ? 0.15 : 1);

    if (state === 'playing' || state === 'ready') {
      const x = (held.has('R') ? 1 : 0) - (held.has('L') ? 1 : 0);
      const y = (held.has('D') ? 1 : 0) - (held.has('U') ? 1 : 0);
      let tx = 0, ty = 0;
      if (x || y) {
        const n = Math.hypot(x, y);
        tx = (x / n) * maxSpeed(); ty = (y / n) * maxSpeed();
      } else if (mouse) {
        const dx = mouse.x - px, dy = mouse.y - py, dist = Math.hypot(dx, dy);
        if (dist > 2) { const s = Math.min(maxSpeed(), dist * 9); tx = (dx / dist) * s; ty = (dy / dist) * s; }
      }
      const ease = 1 - Math.exp(-14 * dt);
      vx += (tx - vx) * ease; vy += (ty - vy) * ease;
      px = Math.max(radius(), Math.min(W - radius(), px + vx * dt));
      py = Math.max(radius(), Math.min(H - radius(), py + vy * dt));
    }

    if (state === 'playing') {
      const tip = trail[trail.length - 1];
      const here = scroll + px / unit;
      if (!tip || Math.hypot((tip.u - here) * unit, tip.y - py) > 3) trail.push({ u: here, y: py });
      if (trail.length > 22) trail.shift();

      nextChip -= dt;
      if (nextChip <= 0) { spawnChip(); nextChip = 1.1 + Math.random() * 0.8; }
      chips = chips.filter(chip => {
        const x = (chip.u - scroll) * unit, y = chip.y * H;
        if (Math.hypot(x - px, y - py) < radius() + chipRadius() + 4) {
          chain = chainLeft > 0 ? chain + 1 : 1; chainLeft = CHAIN_WINDOW;
          score += Math.min(chain, MAX_MULTIPLIER);
          if (!reduced.matches) bursts.push({ x, y, age: 0, hit: false });
          hud();
          return false;
        }
        return x > -40;
      });
      if (chainLeft > 0) { chainLeft -= dt; if (chainLeft <= 0) { chain = 0; chainLeft = 0; hud(); } }
      if (grace <= 0 && lethalAt(px, py)) die();
    }

    if (state === 'dying') {
      dying += dt;
      if (dying > 0.7) finish();
    }
    for (const burst of bursts) burst.age += dt;
    bursts = bursts.filter(burst => burst.age < (burst.hit ? 0.7 : 0.35));
  }

  function frame(now: number) {
    raf = 0;
    if (!dialog.open) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    fit();
    if (W) {
      // Long frames run as two steps so a fast neuron cannot skip across a ring.
      if (dt > 0.025) { step(dt / 2); step(dt / 2); } else step(dt);
      draw(now);
    }
    schedule();
  }
  function schedule() {
    if (!raf && dialog.open && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); }
  }

  const keyDirection = (ev: KeyboardEvent) => {
    switch (ev.key.startsWith('Arrow') ? ev.key : ev.code) {
      case 'ArrowLeft': case 'KeyA': return 'L';
      case 'ArrowRight': case 'KeyD': return 'R';
      case 'ArrowUp': case 'KeyW': return 'U';
      case 'ArrowDown': case 'KeyS': return 'D';
    }
    return '';
  };
  function onKeyDown(ev: KeyboardEvent) {
    if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
    const direction = keyDirection(ev);
    if (direction) {
      ev.preventDefault();
      if (state === 'playing' || state === 'ready') { held.add(direction); mouse = null; }
      return;
    }
    const target = ev.target instanceof HTMLElement ? ev.target : null;
    if (ev.key === ' ' || ev.key === 'Enter') {
      // A focused button handles its own activation.
      if (target?.tagName === 'BUTTON') return;
      ev.preventDefault();
      if (!ev.repeat) primaryAction();
    } else if (ev.key === 'p' || ev.key === 'P') {
      if (!ev.repeat) { if (state === 'playing') pause(); else resume(); }
    }
  }
  function onKeyUp(ev: KeyboardEvent) { const direction = keyDirection(ev); if (direction) held.delete(direction); }
  function primaryAction() {
    if (state === 'ready' || state === 'over') begin();
    else if (state === 'paused') resume();
  }

  function onPointerDown(ev: PointerEvent) {
    if (ev.pointerType === 'mouse') return;
    drag = { id: ev.pointerId, x: ev.clientX, y: ev.clientY };
    try { canvas.setPointerCapture(ev.pointerId); } catch { /* Capture is a convenience. */ }
  }
  function onPointerMove(ev: PointerEvent) {
    if (ev.pointerType === 'mouse' || ev.pointerType === 'pen') {
      if (state === 'playing') { const box = canvas.getBoundingClientRect(); mouse = { x: ev.clientX - box.left, y: ev.clientY - box.top }; held.clear(); }
      return;
    }
    if (!drag || drag.id !== ev.pointerId || (state !== 'playing' && state !== 'ready')) return;
    // Touch moves the neuron by how far the finger moves, so a thumb never hides it.
    px = Math.max(radius(), Math.min(W - radius(), px + (ev.clientX - drag.x) * 1.35));
    py = Math.max(radius(), Math.min(H - radius(), py + (ev.clientY - drag.y) * 1.35));
    drag.x = ev.clientX; drag.y = ev.clientY; vx = vy = 0;
  }
  function onPointerUp(ev: PointerEvent) { if (drag?.id === ev.pointerId) drag = null; }

  function onVisibility() {
    if (document.hidden) pause();
    else schedule();
  }
  function onClose() {
    cancelAnimationFrame(raf); raf = 0;
    document.removeEventListener('keydown', onKeyDown); document.removeEventListener('keyup', onKeyUp);
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('blur', onBlur); themeWatch.disconnect();
    state = 'ready'; held.clear(); mouse = null; drag = null;
    const target = opener && opener.isConnected ? opener : null;
    // The trigger can be plain text. Give it a focus stop so keyboard focus has somewhere to return.
    if (target && !target.matches('a[href], button, input, select, textarea, [tabindex]')) target.setAttribute('tabindex', '-1');
    target?.focus({ preventScroll: true });
    opener = null;
  }
  function onBlur() { held.clear(); }
  const themeWatch = new MutationObserver(() => { colors = readColors(); });
  const scheme = matchMedia('(prefers-color-scheme: dark)');
  scheme.addEventListener('change', () => { colors = readColors(); });

  primary.addEventListener('click', () => primaryAction());
  pauseButton.addEventListener('click', () => { if (state === 'playing') pause(); else resume(); });
  closeButton.addEventListener('click', () => dialog.close());
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  dialog.addEventListener('close', onClose);
  new ResizeObserver(() => { if (dialog.open) fit(); }).observe(canvas);

  return {
    dialog,
    open(from: HTMLElement | null) {
      opener = from ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
      colors = readColors();
      state = 'ready'; score = 0; chain = 0; chips = []; trail = []; bursts = []; newBest = false;
      dialog.showModal();
      W = H = 0; px = py = 0;
      fit();
      pauseButton.disabled = true; pauseButton.textContent = 'Pause';
      hud(); setPanel('ready');
      say('Signal, a hidden game. Press Space to start. Arrow keys or WASD move. P pauses. Escape closes.');
      document.addEventListener('keydown', onKeyDown); document.addEventListener('keyup', onKeyUp);
      document.addEventListener('visibilitychange', onVisibility);
      window.addEventListener('blur', onBlur);
      themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      schedule();
    },
  };
}
