// A small slide deck: arrows, space, swipe, dots, #n in the URL. No libraries.
const slides = [...document.querySelectorAll('.slide')];
const count = document.getElementById('count');
const dots = document.getElementById('dots');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const bar = document.getElementById('progress');
const last = slides.length - 1;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let current = -1;

slides.forEach((s, i) => {
  const b = document.createElement('button');
  b.setAttribute('role', 'tab');
  b.setAttribute('aria-label', 'Slide ' + (i + 1) + ': ' + s.getAttribute('aria-label'));
  b.addEventListener('click', () => go(i));
  dots.appendChild(b);
});

// numbers on the stats slide count up each time it comes on
function countUp(slide) {
  slide.querySelectorAll('[data-count]').forEach(el => {
    const to = +el.dataset.count, suffix = el.dataset.suffix || '';
    if (reduced) { el.textContent = to + suffix; return; }
    const start = performance.now(), dur = 1400;
    const tick = now => {
      const t = Math.min((now - start) / dur, 1), e = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(to * e) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    el.textContent = '0' + suffix;
    requestAnimationFrame(tick);
  });
}

function go(n, replace) {
  n = Math.max(0, Math.min(last, n));
  if (n === current) return;
  slides.forEach((s, i) => {
    s.classList.toggle('on', i === n);
    s.classList.toggle('before', i < n);
    s.classList.toggle('after', i > n);
    s.inert = i !== n;
    if (i === n) s.scrollTop = 0;
  });
  [...dots.children].forEach((d, i) => d.setAttribute('aria-selected', i === n));
  count.textContent = (n + 1) + ' / ' + slides.length;
  prev.disabled = n === 0;
  next.disabled = n === last;
  bar.style.transform = 'scaleX(' + (n / last) + ')';
  document.title = n === 0 ? 'PyDelhi: an introduction' : slides[n].getAttribute('aria-label') + ' | PyDelhi';
  history[replace ? 'replaceState' : 'pushState'](null, '', '#' + (n + 1));
  current = n;
  countUp(slides[n]);
}

prev.addEventListener('click', () => go(current - 1));
next.addEventListener('click', () => go(current + 1));

addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key;
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k) && !(e.target.closest('a,button') && k !== 'ArrowRight' && k !== 'ArrowDown')) { e.preventDefault(); go(current + (e.shiftKey && k === ' ' ? -1 : 1)); }
  else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); go(current - 1); }
  else if (k === 'Home') go(0);
  else if (k === 'End') go(last);
  else if (k === 'f') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
});

// swipe, mostly horizontal
let sx = 0, sy = 0;
addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(current + (dx < 0 ? 1 : -1));
}, { passive: true });

// the slide number lives in the URL, so the back button and shared links work
const fromHash = () => (parseInt(location.hash.slice(1), 10) || 1) - 1;
addEventListener('popstate', () => go(fromHash(), true));
go(fromHash(), true);
