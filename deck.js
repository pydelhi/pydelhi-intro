/* PyDelhi intro deck. Plain JavaScript, no libraries.
   It's shown on a screen, so everything runs from the keyboard (or a clicker): nothing on a slide reacts to the mouse.
   Right and left move on and back. Some slides have steps inside them (the formats, the photo pile): the arrows walk
   through those first, then move to the next slide. Each slide's pieces play in as it arrives, and the mascot grows
   along the bottom edge as the progress bar. The slide number lives in the URL (#3). */

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE_OUT = 'cubic-bezier(.16,1,.3,1)';
const BOUNCE = 'cubic-bezier(.34,1.45,.64,1)';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;

const slides = [...document.querySelectorAll('.slide')];
const last = slides.length - 1;
let current = -1;


/* ─── LOGOS: the site's lists, drawn navy through a CSS mask. `r` is the file's width / height ─── */

const SPEAKER_COMPANIES = [
  { name:'Adobe', file:'adobe.svg', r:3.96 },
  { name:'Microsoft', file:'microsoft.svg', r:4.69 },
  { name:'Red Hat', file:'redhat.svg', r:4.23 },
  { name:'EPAM Systems', file:'epam.png', r:2.84 },
  { name:'Thoughtworks', file:'thoughtworks.png', r:6.15 },
  { name:'Accenture', file:'accenture.svg', r:3.80 },
  { name:'SingleStore', file:'singlestore.svg', r:4.83 },
  { name:'Tata 1mg', file:'tata1mg.svg', r:4.50 },
  { name:'NEC', file:'nec.svg', r:3.68 },
  { name:'Nagarro', file:'nagarro.svg', r:4.03 },
  { name:'Cars24', file:'cars24.svg', r:3.57 },
  { name:'L&T Technology Services', file:'ltts.svg', r:6.67 },
  { name:'Unstop', file:'unstop.svg', r:2.51 },
  { name:'Appinventiv', file:'appinventiv.svg', r:4.58 },
  { name:'Essentia.dev', file:'essentia.svg', r:5.40 },
  { name:'GlobalLogic', file:'globallogic.png', r:5.65 },
  { name:'Quansight', file:'quansight.png', r:3.17 },
  { name:'Juniper Square', file:'junipersquare.svg', r:7.72 },
  { name:'FOSSASIA', file:'fossasia.svg', r:2.35 },
];
const SPONSORS = [
  { name:'Microsoft', file:'microsoft.svg', r:4.69 },
  { name:'Zomato', file:'zomato.png', r:4.68 },
  { name:'Adobe', file:'adobe.svg', r:3.96 },
  { name:'Nykaa', file:'nykaa.svg', r:2.99 },
  { name:'Thoughtworks', file:'thoughtworks.png', r:6.15 },
  { name:'Gojek', file:'gojek.svg', r:3.50 },
  { name:'EPAM Systems', file:'epam.png', r:2.84 },
  { name:'Tata 1mg', file:'tata1mg.svg', r:4.50 },
  { name:'Hike', file:'hike.svg', r:2.62 },
  { name:'HT Media', file:'htmedia.svg', r:4.28 },
  { name:'GitHub', file:'github-mark.svg', r:1, text:'GitHub' },
  { name:'SingleStore', file:'singlestore.svg', r:4.83 },
  { name:'WeWork', file:'wework.svg', r:4.70 },
  { name:'91springboard', file:'91springboard.png', r:4.20 },
  { name:'Appinventiv', file:'appinventiv.svg', r:4.58 },
  { name:'Unstop', file:'unstop.svg', r:2.51 },
  { name:'Essentia.dev', file:'essentia.svg', r:5.40 },
  { name:'Innovaccer', file:'innovaccer.svg', r:1.08, text:'Innovaccer' },
  { name:'Grofers', file:'grofers.svg', r:3.23 },
  { name:'Srijan Technologies', file:'srijan.svg', r:2.96 },
  { name:'SocialCops', file:'socialcops.svg', r:4.30 },
  { name:'HealthKart', file:'healthkart.png', r:3.98 },
  { name:'LambdaTest', file:'lambdatest.svg', r:5.65 },
  { name:'Fueled', file:'fueled.png', r:5.33 },
  { name:'Coredge', file:'coredge.png', r:4.22 },
  { name:'Knowlarity', file:'knowlarity.png', r:4.67 },
  { name:'E2E Networks', file:'e2e.png', r:1.47, text:'E2E Networks' },
];

function logoEl({ name, file, r, text }) {
  // wide logos get shorter and tall ones taller, so they all read at about the same size
  // sized in screen units (28px on the site is 2.6 units here), so they stay legible on a projector
  const h = (text ? 26 : clamp(28 * Math.pow(4 / r, .45), 18, 38)) / 28 * 2.6;
  const mark = `<span class="logo-img" style="--src:url('assets/logos/${file}');width:calc(var(--u) * ${(h * r).toFixed(2)});height:calc(var(--u) * ${h.toFixed(2)})"></span>`;
  return `<span class="logo" role="img" aria-label="${name}">${mark}${text ? `<span aria-hidden="true">${text}</span>` : ''}</span>`;
}
function fillMarquee(id, list) {
  const track = document.getElementById(id);
  const row = list.map(logoEl).join('');
  // twice over so the loop is seamless; the copy is hidden from screen readers
  track.innerHTML = row + `<span style="display:contents" aria-hidden="true">${row}</span>`;
  track.style.animationDuration = list.length * 3.2 + 's';
}
fillMarquee('speaker-logos', SPEAKER_COMPANIES);
fillMarquee('sponsor-logos', SPONSORS);


/* ─── SINCE 2011: one square per month, filled when we met ───
   Before 2025 these are the site's hand-kept months (approximate); from 2025 they're Commudle's events.
   Keep in step with src/_data/meetupHistory.js on pydelhi.github.io. */

const MONTHS_MET = {
  2011: '.........xxx', 2012: '..xxx.xxxx..', 2013: '.xxx...xxxxx', 2014: 'xx..xxxxx.xx',
  2015: 'xx..xxxxxxxx', 2016: 'x.xxxxxxxxxx', 2017: '.xxxxxxxxxxx', 2018: 'xxxxxxxx.xxx',
  2019: 'x.xxxxxxxxxx', 2020: 'xxx.xx....xx', 2021: 'xxxx..x.x.xx', 2022: '.xxxxx.xxxxx',
  2023: 'xxxxxxxxxx.x', 2024: 'xxxx.xxxxxxx', 2025: '.xxxx.xx.xx.', 2026: 'xxxxx.x.xx..',
};
const graph = document.getElementById('graph');
(function buildGraph() {
  const now = new Date(), thisYear = now.getFullYear(), thisMonth = now.getMonth();
  let html = '';
  for (let y = 2011; y <= thisYear; y++) for (let m = 0; m < 12; m++) {
    const future = y === thisYear && m > thisMonth;
    const met = !future && MONTHS_MET[y]?.[m] === 'x';
    html += `<span class="cell${future ? ' future' : met ? ' met' : ''}"></span>`;
  }
  graph.innerHTML = html;
})();

function sweepGraph() {
  if (reduceMotion) return;
  graph.classList.add('sweep');
  const a = graph.animate([{ '--sweep': '0%' }, { '--sweep': '120%' }], { duration: 1400, delay: 350, easing: 'cubic-bezier(.45,0,.25,1)', fill: 'backwards' });
  a.onfinish = a.oncancel = () => graph.classList.remove('sweep');
}

/* numbers count up each time their slide arrives; the text already holds the final value */
function countUp(el, delay) {
  const m = (el.dataset.final ??= el.textContent).match(/^(\d+)(.*)$/);
  if (!m || reduceMotion) return;
  const end = +m[1], rest = m[2];
  el.textContent = '0' + rest;
  setTimeout(() => {
    const t0 = performance.now();
    (function tick(now) {
      const t = Math.min(1, (now - t0) / 1400);
      el.textContent = Math.round(end * (1 - Math.pow(1 - t, 4))) + rest;
      if (t < 1 && el.closest('.slide.on')) requestAnimationFrame(tick);
      else el.textContent = el.dataset.final;
    })(t0);
  }, delay);
}


/* ─── STEPS: slides that reveal things one arrow press at a time.
   steps(slide) says how many presses it has; show(slide, i, dir) puts it in state i (0 is how it arrives) ─── */

const STEPS = new Map();
let stepAt = 0;


/* FORMATS: each press lights the next row, dimming the rest, and floats its photo just right of its name.
   On phones every row already shows its own photo, so there are no steps */

const formatList = document.getElementById('formats');
const formatRows = [...formatList.querySelectorAll('.format')];
const preview = document.getElementById('format-preview');
const previewImgs = formatRows.map(li => {
  const img = document.createElement('img');
  img.src = li.dataset.img;
  img.alt = '';
  preview.appendChild(img);
  return img;
});
STEPS.set(formatList.closest('.slide'), {
  count: () => getComputedStyle(preview).display === 'none' ? 0 : formatRows.length,
  show(i) {
    const li = formatRows[i - 1];
    formatRows.forEach((f, k) => { f.classList.toggle('active', f === li); previewImgs[k].classList.toggle('show', f === li); });
    formatList.classList.toggle('has-active', !!li);
    // the print tips the other way with each new photo, like one being laid on another
    preview.style.setProperty('--r', (i % 2 ? 3 : -3) + 'deg');
  },
});


/* SATURDAYS: a pile of prints. Each press tosses the top one off to the right and it slips back in at the bottom;
   going back pulls the bottom one out and lays it on top again */

const pile = document.getElementById('pile');
const prints = [...pile.children];  // in their starting order, bottom to top
let stack = [...prints];
// each place in the pile has its own slight tilt and offset, so the pile shifts as prints come off the top
const RESTS = [[-7, -14, 10], [5, 12, 6], [-3, -6, -4], [8, 16, -8], [-5, 6, 8], [3, -10, 2], [-1.5, 0, 0]];

function layPile() {
  stack.forEach((fig, i) => {
    const [r, dx, dy] = RESTS[RESTS.length - stack.length + i];
    fig.style.zIndex = i;
    fig.style.setProperty('--r', r + 'deg');
    fig.style.setProperty('--dx', dx + 'px');
    fig.style.setProperty('--dy', dy + 'px');
  });
}
const fling = (fig, side) => {
  fig.style.setProperty('--dx', side * pile.offsetWidth * 1.1 + 'px');
  fig.style.setProperty('--dy', -pile.offsetWidth * .15 + 'px');
  fig.style.setProperty('--r', side * 24 + 'deg');
};
let pileTimer;
function tossTop() {
  const top = stack.at(-1);
  fling(top, 1);
  clearTimeout(pileTimer);
  pileTimer = setTimeout(() => { stack = [top, ...stack.slice(0, -1)]; layPile(); }, reduceMotion ? 0 : 320);
}
function bringBack() {
  clearTimeout(pileTimer);
  const fig = stack[0];
  stack = [...stack.slice(1), fig];
  // it waits off to the right, already on top, then slides back onto the pile
  fig.style.transition = 'none';
  fig.style.zIndex = stack.length;
  fling(fig, 1);
  void fig.offsetWidth;
  fig.style.transition = '';
  layPile();
}
STEPS.set(pile.closest('.slide'), {
  count: () => prints.length - 1,
  show(i, dir, jump) {
    if (jump) {
      // arriving (or coming back): set the pile straight to state i, with no flying
      clearTimeout(pileTimer);
      stack = [...prints.slice(prints.length - i), ...prints.slice(0, prints.length - i)];
      prints.forEach(f => (f.style.transition = 'none'));
      layPile();
      void pile.offsetWidth;
      prints.forEach(f => (f.style.transition = ''));
    } else if (dir > 0) tossTop();
    else bringBack();
  },
});
layPile();


/* ─── RULER: the bars grow from zero each time the slide arrives ─── */

const rulerBars = [...document.querySelectorAll('.ruler-bar')];
function growRuler() {
  if (reduceMotion) return;
  rulerBars.forEach(b => { b.style.transition = 'none'; b.style.setProperty('--grow', 0); b.style.setProperty('--label', 0); });
  void rulerBars[0].offsetWidth;
  rulerBars.forEach((b, i) => {
    b.style.transition = `transform 1.1s ${EASE_OUT} ${450 + i * 110}ms`;
    b.style.setProperty('--grow', 1);
    b.style.setProperty('--label', 1);
  });
}


/* ─── MASCOT ───
   One stroked body path drawn to a length, with the head, eye and tongue from the mascot SVG riding its tip.
   The head shapes face left with the body centred on y=199, so they're mirrored to face +x with the neck at 0,0. */

const SNAKE_GREEN = '#9BB693';
const SNAKE_UNITS = 30.8;
const SNAKE_HEAD = 'M105.5 183.6C103 183.6 100.7 183 98.6 181.7C86.7 173.9 74.5 169.4 60.1 169.8C54.6 170 50.5 169.9 44.9 171.4C36.7 173.6 29.7 178.1 25.4 185.6C24.7 186.8 24 188.1 23.3 189.4L22.2 194.3C23.8 196.2 24.7 199.6 26.3 202C38.9 219.8 63.6 214 82.2 215C84.1 215.1 86 214.9 87.9 215L105.5 214.4Z';
const SNAKE_TONGUE = 'M23.3 189.4C20 189.5 17.8 188.8 14.5 189C11.6 186.4 6.8 182.9 2.6 183.6L2.2 184.1C2.6 185.8 7.1 189.2 8.6 190.2C5 191.6 3.1 192.7 0 194.9C1.6 194.9 7.1 195.3 8.1 195C13.3 193.7 16.4 191.4 22.2 194.3Z';
const SNOUT = 82.5;
const headMarkup = `<g transform="translate(105.5 -199) scale(-1 1)" fill="${SNAKE_GREEN}"><path class="snake-tongue" d="${SNAKE_TONGUE}"/><path d="${SNAKE_HEAD}"/><circle cx="46.3" cy="190.6" r="4.4" fill="#1b1b1b"/></g>`;

function rideHead(path, head, len, total, scale) {
  const a = path.getPointAtLength(Math.max(0, len - 1)), b = path.getPointAtLength(Math.min(total, len + 1));
  const tip = path.getPointAtLength(len);
  head.setAttribute('transform', `translate(${tip.x} ${tip.y}) rotate(${Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI}) scale(${scale})`);
}

/* The progress snake lies along the bottom edge. While it moves it slithers (a low wave travels down its
   body); once it stops, the wave settles flat. Its length eases to each slide's stretch. */
const snakeSvg = document.getElementById('snake');
snakeSvg.innerHTML = `<path fill="none" stroke="${SNAKE_GREEN}" stroke-linecap="round" stroke-linejoin="round"/><g>${headMarkup}</g>`;
const snakeBody = snakeSvg.firstElementChild, snakeHead = snakeSvg.lastElementChild;
const S = { W: 0, t: 12, y: 0, shown: 0, target: 0, from: 0, t0: 0, dur: 1, wave: 0, phase: 0, busy: false };

function snakeSize() {
  S.W = innerWidth;
  // thicker on bigger screens, so it still reads from the back of the room
  S.t = S.W < 700 ? 10 : clamp(Math.min(innerWidth / 100, innerHeight * .0178) * 1.05, 14, 24);
  S.s = S.t / SNAKE_UNITS;
  // room above the body for the head, which bulges ~30 mascot units over it, and for the wave
  S.y = Math.ceil(30 * S.s + S.t / 2) + 9;
  // and room below it for the jaw, which hangs ~18 mascot units under the body's centre and tips a little lower
  // as the head turns with the wave; without it the jaw and belly were clipped by the screen's edge
  const h = Math.ceil(S.y + Math.max(S.t / 2, 18 * S.s) + 4);
  snakeSvg.setAttribute('viewBox', `0 0 ${S.W} ${h}`);
  snakeSvg.setAttribute('height', h);
  snakeBody.setAttribute('stroke-width', S.t);
}
// how much body shows on slide n: just the head peeking in on the first, nose at the right edge on the last
const stretch = n => lerp(SNOUT * S.s + S.t + 28, S.W - 16, n / last);
function drawSnake() {
  const x0 = -SNOUT * S.s - S.t, x1 = S.W - SNOUT * S.s - 16;
  // the wave: a few gentle bumps that travel toward the head, sized by S.wave. They only ever rise from the
  // resting line, never dip below it, so the belly stays on the bottom edge and nothing slips off the screen
  const A = S.wave * (S.W < 700 ? 4 : 7), k = Math.PI * 2 / 220;
  let d = `M${x0} ${S.y}`;
  for (let x = x0 + 12; x <= x1; x += 12) d += `L${x.toFixed(1)} ${(S.y - A * (.5 + .5 * Math.sin(x * k - S.phase))).toFixed(2)}`;
  d += `L${x1} ${S.y}`;
  snakeBody.setAttribute('d', d);
  const total = snakeBody.getTotalLength();
  // the shown stretch is measured along x; convert to a length along the (slightly wavy) path
  const len = clamp(S.shown - x0 + (total - (x1 - x0)) * ((S.shown - x0) / (x1 - x0)), 0, total);
  snakeBody.setAttribute('stroke-dasharray', `${len} ${total + 1}`);
  rideHead(snakeBody, snakeHead, len, total, S.s);
  snakeSvg.classList.toggle('arrived', current === last && !S.busy);
}
function moveSnake(n, instant) {
  S.from = S.shown;
  S.target = stretch(n) - SNOUT * S.s;
  if (instant || reduceMotion) { S.shown = S.target; S.wave = 0; drawSnake(); return; }
  S.t0 = performance.now();
  S.dur = clamp(Math.abs(S.target - S.from) * 3.2, 700, 1500);
  if (!S.busy) { S.busy = true; requestAnimationFrame(slither); }
}
function slither(now) {
  const t = clamp((now - S.t0) / S.dur, 0, 1);
  const e = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  S.shown = lerp(S.from, S.target, e);
  // the wave swells while it travels and dies down as it settles
  S.wave = Math.sin(Math.PI * t);
  S.phase += (S.target > S.from ? 1 : -1) * .22;
  drawSnake();
  if (t < 1) requestAnimationFrame(slither);
  else { S.busy = false; S.wave = 0; drawSnake(); }
}
snakeSize();

/* The Code of Conduct coil: the same mascot curled up, growing in each time its slide arrives */
const coil = document.getElementById('coil');
const coilT = 13, coilTotal = coil.getTotalLength();
coil.setAttribute('fill', 'none');
coil.setAttribute('stroke', SNAKE_GREEN);
coil.setAttribute('stroke-width', coilT);
coil.setAttribute('stroke-linecap', 'round');
coil.setAttribute('stroke-linejoin', 'round');
const coilHead = document.createElementNS('http://www.w3.org/2000/svg', 'g');
coilHead.innerHTML = headMarkup;
coil.after(coilHead);
const drawCoil = p => {
  const len = p * coilTotal;
  coil.setAttribute('stroke-dasharray', `${len} ${coilTotal + 1}`);
  rideHead(coil, coilHead, len, coilTotal, coilT / SNAKE_UNITS);
};
drawCoil(1);
function growCoil() {
  if (reduceMotion) return;
  drawCoil(0);
  setTimeout(() => {
    const t0 = performance.now();
    (function tick(now) {
      const t = Math.min(1, (now - t0) / 1800);
      drawCoil(Math.max(.001, 1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(tick);
    })(t0);
  }, 300);
}


/* ─── ENTRANCES: each slide's [data-m] pieces play in, in order, as it arrives ─── */

const MOTIONS = {
  rise:  { k: [{ opacity: 0, transform: 'translateY(26px)' }, { opacity: 1, transform: 'none' }], d: 900, gap: 85 },
  fade:  { k: [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], d: 1000, gap: 70 },
  pop:   { k: [{ opacity: 0, transform: 'translateY(10px) scale(.9)' }, { opacity: 1, transform: 'none' }], d: 600, gap: 45, ease: BOUNCE },
  // notes and codes drop onto the table, a little more tilted than they settle
  drop:  { k: [{ opacity: 0, transform: 'translateY(-40px) rotate(-6deg) scale(1.04)' }, { opacity: 1, transform: 'none' }], d: 800, gap: 110, ease: BOUNCE },
  // the photo opens out from a slightly smaller rounded window and settles from a gentle zoom
  photo: { k: el => { const r = getComputedStyle(el).borderTopLeftRadius; return [{ clipPath: `inset(7% round ${r})`, transform: 'scale(1.06)' }, { clipPath: `inset(0 round ${r})`, transform: 'none' }]; }, d: 1300, gap: 120 },
  underline: { k: [{ backgroundSize: '0% .12em' }, { backgroundSize: '100% .12em' }], d: 900, gap: 0, at: 700 },
};

// prints fly in from off to their side and land with a little swing
function flyPrints(els, base) {
  els.forEach((el, i) => {
    const fromLeft = el.getBoundingClientRect().left < innerWidth / 2;
    el.animate([
      { opacity: 0, transform: `translate(${fromLeft ? -140 : 140}px, ${i % 2 ? 60 : -40}px) rotate(${fromLeft ? -18 : 18}deg) scale(.82)` },
      { opacity: 1, transform: 'none' }
    ], { duration: 1100, delay: base + i * 110, easing: BOUNCE, fill: 'backwards' });
  });
}

function enter(slide) {
  if (reduceMotion) return;
  // starts once the slide before has mostly faded, so two titles never sit on top of each other
  let at = 300;
  slide.querySelectorAll('[data-m]').forEach(el => {
    const m = MOTIONS[el.dataset.m];
    el.classList.remove('pre');
    el.getAnimations().forEach(a => a.cancel());
    el.animate(typeof m.k === 'function' ? m.k(el) : m.k, { duration: m.d, delay: m.at ?? at, easing: m.ease || EASE_OUT, fill: 'backwards' });
    if (m.at === undefined) at += m.gap;
  });
  flyPrints([...slide.querySelectorAll('.hp, .jp')], 350);
  // the CoC's own underline draws after its rule appears
  slide.querySelectorAll('.coc-rule em').forEach(em => em.animate([{ backgroundSize: '0% .1em' }, { backgroundSize: '100% .1em' }], { duration: 800, delay: 900, easing: EASE_OUT, fill: 'backwards' }));
  slide.querySelectorAll('[data-count]').forEach((el, i) => countUp(el, 350 + i * 150));
  if (slide.contains(graph)) sweepGraph();
  if (slide.querySelector('.ruler')) growRuler();
  if (slide.contains(coil)) growCoil();
}

function leave(slide, dir) {
  slide.classList.remove('on');
  if (reduceMotion) return;
  slide.classList.add('leaving');
  slide.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${-dir * 48}px)` }], { duration: 300, easing: 'cubic-bezier(.4,0,.6,1)' })
    .onfinish = () => slide.classList.remove('leaving');
}


/* ─── NAVIGATION ─── */

function go(n, { replace = false, instant = false, back = false } = {}) {
  n = clamp(n, 0, last);
  if (n === current) return;
  const dir = n > current ? 1 : -1;
  if (current >= 0) leave(slides[current], dir);
  const slide = slides[n];
  // everything held back until its entrance plays
  if (!reduceMotion) slide.querySelectorAll('[data-m]').forEach(el => el.classList.add('pre'));
  slide.classList.remove('leaving');
  slide.getAnimations().forEach(a => a.cancel());
  slide.classList.add('on');
  slide.scrollTop = 0;
  slides.forEach((s, i) => { s.inert = i !== n; s.setAttribute('aria-hidden', i !== n); });
  current = n;
  document.body.dataset.slide = n + 1;
  document.title = n === 0 ? `PyDelhi | ${slide.getAttribute('aria-label')}` : `${slide.getAttribute('aria-label')} | PyDelhi`;
  history[replace ? 'replaceState' : 'pushState'](null, '', '#' + (n + 1));
  // stepping back into a slide with steps lands on its last step, as you left it; any jump starts it fresh
  const steps = STEPS.get(slide);
  stepAt = steps && back ? steps.count() : 0;
  steps?.show(stepAt, dir, true);
  moveSnake(n, instant);
  enter(slide);
}

// one press: the next step inside this slide if it has one left, otherwise the next slide
function step(d) {
  const slide = slides[current], steps = STEPS.get(slide);
  const next = stepAt + d;
  if (steps && next >= 0 && next <= steps.count()) { stepAt = next; steps.show(stepAt, d, false); }
  else go(current + d, { back: d < 0 });
}

addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  switch (e.key) {
    // clickers send PageDown / PageUp; keyboards the arrows and space
    case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ': case 'Enter': e.preventDefault(); step(e.shiftKey && e.key === ' ' ? -1 : 1); break;
    case 'ArrowLeft': case 'ArrowUp': case 'PageUp': case 'Backspace': e.preventDefault(); step(-1); break;
    case 'Home': e.preventDefault(); go(0); break;
    case 'End': e.preventDefault(); go(last); break;
    case 'f': case 'F': document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.(); break;
  }
});

// anyone opening the link on a phone can swipe through it; vertical swipes scroll the slide
let touch = null;
addEventListener('touchstart', e => { touch = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }, { passive: true });
addEventListener('touchend', e => {
  if (!touch) return;
  const dx = e.changedTouches[0].clientX - touch.x, dy = e.changedTouches[0].clientY - touch.y;
  touch = null;
  if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? 1 : -1);
}, { passive: true });

const fromHash = () => clamp((parseInt(location.hash.slice(1), 10) || 1) - 1, 0, last);
addEventListener('popstate', () => go(fromHash(), { replace: true }));

let lastW = innerWidth;
addEventListener('resize', () => {
  if (innerWidth === lastW) return;
  lastW = innerWidth;
  snakeSize();
  moveSnake(current, true);
  STEPS.get(slides[current])?.show(stepAt, 1, true);
});

// the cursor hides itself when it rests, so it never sits on a slide
let idleTimer;
addEventListener('mousemove', () => {
  document.body.classList.remove('idle');
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => document.body.classList.add('idle'), 1500);
}, { passive: true });

// start where the address says, with the snake already in place
go(fromHash(), { replace: true, instant: true });
