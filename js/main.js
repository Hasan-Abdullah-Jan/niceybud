/* NiceyBud — shared layout + interaction engine (vanilla JS, no dependencies) */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const I = NB.icons;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const page = document.body.dataset.page || '';
  NB.$ = $; NB.$$ = $$;

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  try { const t = localStorage.getItem('nb-theme'); if (t) root.dataset.theme = t; } catch (e) {}

  /* ---------- Layout injection ---------- */
  const links = [['index.html', 'Home', 'home'], ['services.html', 'Services', 'services'], ['products.html', 'Products', 'products'], ['blog.html', 'Blog', 'blog'], ['about.html', 'About', 'about'], ['contact.html', 'Contact', 'contact']];
  const navHTML = `
  <div class="scroll-progress"></div>
  <nav class="nav" aria-label="Main">
    <a href="index.html" class="brand" data-magnetic><img src="assets/logo.png" alt="NiceyBud logo"><span><b>Nicey</b><em>Bud</em></span></a>
    <ul class="nav__links"><span class="nav__pill"></span>${links.filter(l => l[2] !== 'home').map(l => `<li><a href="${l[0]}" class="${page === l[2] ? 'active' : ''}">${l[1]}</a></li>`).join('')}</ul>
    <div class="nav__actions">
      <button class="theme-toggle" aria-label="Toggle theme">
        <svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
        <svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
      </button>
      <a href="contact.html" class="btn btn--primary btn--sm" data-magnetic>Let's talk ${I.arrow}</a>
      <button class="burger" aria-label="Menu"><span></span><span></span></button>
    </div>
  </nav>
  <div class="mobile-menu">${links.map(l => `<a href="${l[0]}">${l[1]}</a>`).join('')}<small>support@niceybud.com · niceybud@gmail.com</small></div>`;

  const footerHTML = `
  <footer class="footer">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__about">
          <a href="index.html" class="brand"><img src="assets/logo.png" alt=""><span><b>Nicey</b><em>Bud</em></span></a>
          <p>Your AI partner for growth, creativity &amp; automation. We build agents, brands and systems that make businesses feel unstoppable.</p>
          <form class="newsletter" data-newsletter><input type="email" placeholder="Your email for AI insights" required aria-label="Email"><button class="btn btn--primary btn--sm">Join</button></form>
          <div class="socials"><a href="#" aria-label="X">${I.x}</a><a href="#" aria-label="LinkedIn">${I.linkedin}</a><a href="#" aria-label="Instagram">${I.instagram}</a><a href="#" aria-label="GitHub">${I.github}</a></div>
        </div>
        <div><h4>Explore</h4><ul>${links.map(l => `<li><a href="${l[0]}">${l[1]}</a></li>`).join('')}</ul></div>
        <div><h4>Services</h4><ul>${NB.services.slice(0, 6).map(s => `<li><a href="services.html#${s.id}">${s.title}</a></li>`).join('')}</ul></div>
        <div><h4>Contact</h4><ul>
          <li><a href="mailto:support@niceybud.com">support@niceybud.com</a></li>
          <li><a href="mailto:niceybud@gmail.com">niceybud@gmail.com</a></li>
          <li><a href="contact.html">Book a strategy call →</a></li>
        </ul></div>
      </div>
      <div class="footer__mega" aria-hidden="true">NiceyBud</div>
      <div class="footer__bottom"><span>© ${new Date().getFullYear()} NiceyBud. Crafted with AI &amp; a lot of coffee.</span><span class="status">All systems operational</span><span><a href="#">Privacy</a> · <a href="#">Terms</a></span></div>
    </div>
  </footer>
  <button class="to-top" aria-label="Back to top"><svg class="ring" viewBox="0 0 54 54"><circle cx="27" cy="27" r="25.5"/></svg><svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>`;

  const fxHTML = `<div class="aurora" aria-hidden="true"><span></span><span></span><span></span></div><div class="grid-bg" aria-hidden="true"></div><div class="grain" aria-hidden="true"></div>
  <div class="cursor"></div><div class="cursor-ring"></div><div class="page-wipe"><i></i><i></i><i></i><i></i><i></i></div><div class="toast" role="status"></div>`;

  document.body.insertAdjacentHTML('afterbegin', fxHTML + navHTML);
  const footerSlot = $('#footer');
  if (footerSlot) footerSlot.outerHTML = footerHTML;

  /* ---------- Preloader (first visit per session on home) ---------- */
  const pre = $('.preloader');
  const startPage = () => { document.body.classList.remove('is-loading'); document.dispatchEvent(new Event('nb:ready')); };
  let seen = false; try { seen = sessionStorage.getItem('nb-loaded'); } catch (e) {}
  if (pre && !seen && !reduce) {
    document.body.classList.add('is-loading');
    const cnt = $('.preloader__count', pre), bar = $('.preloader__bar i', pre), lbl = $('.preloader__label', pre);
    const msgs = ['Booting neural core', 'Loading creativity', 'Wiring automations', 'Calibrating growth', 'Ready'];
    let n = 0;
    const tick = () => {
      n = Math.min(100, n + Math.random() * 9 + 2);
      cnt.textContent = Math.floor(n).toString().padStart(2, '0');
      bar.style.width = n + '%';
      lbl.textContent = msgs[Math.min(msgs.length - 1, Math.floor(n / 22))];
      if (n < 100) setTimeout(tick, 45);
      else setTimeout(() => { pre.classList.add('done'); try { sessionStorage.setItem('nb-loaded', 1); } catch (e) {} setTimeout(startPage, 300); }, 350);
    };
    tick();
  } else { if (pre) pre.remove(); requestAnimationFrame(startPage); }

  /* ---------- Theme toggle ---------- */
  $('.theme-toggle').addEventListener('click', e => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    const apply = () => { root.dataset.theme = next; try { localStorage.setItem('nb-theme', next); } catch (er) {} };
    if (document.startViewTransition && !reduce) {
      const x = e.clientX, y = e.clientY, r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const t = document.startViewTransition(apply);
      t.ready.then(() => root.animate({ clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] }, { duration: 700, easing: 'cubic-bezier(.16,1,.3,1)', pseudoElement: '::view-transition-new(root)' }));
    } else apply();
  });

  /* ---------- Mobile menu ---------- */
  $('.burger').addEventListener('click', () => document.body.classList.toggle('menu-open'));
  $$('.mobile-menu a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));

  /* ---------- Nav hover pill ---------- */
  const pill = $('.nav__pill'), navList = $('.nav__links');
  $$('.nav__links a').forEach(a => a.addEventListener('mouseenter', () => {
    pill.style.left = a.parentElement.offsetLeft + 'px'; pill.style.width = a.offsetWidth + 'px'; pill.style.opacity = 1;
  }));
  navList.addEventListener('mouseleave', () => pill.style.opacity = 0);

  /* ---------- Scroll: progress, nav hide, to-top ---------- */
  const nav = $('.nav'), prog = $('.scroll-progress'), toTop = $('.to-top'), ring = $('.to-top circle');
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight, p = h > 0 ? y / h : 0;
    prog.style.transform = `scaleX(${p})`;
    nav.classList.toggle('scrolled', y > 30);
    nav.classList.toggle('hidden', y > lastY && y > 400 && !document.body.classList.contains('menu-open'));
    toTop.classList.toggle('show', y > 700);
    ring.style.strokeDashoffset = 160 - 160 * p;
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Custom cursor ---------- */
  if (fine && !reduce) {
    document.body.classList.add('has-cursor');
    const dot = $('.cursor'), cr = $('.cursor-ring');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`; });
    addEventListener('mousedown', () => cr.classList.add('is-down'));
    addEventListener('mouseup', () => cr.classList.remove('is-down'));
    (function loop() { rx += (mx - rx) * .16; ry += (my - ry) * .16; cr.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover', e => {
      const lab = e.target.closest('[data-cursor]');
      const hov = e.target.closest('a, button, input, textarea, select, label, summary, .chip');
      cr.classList.toggle('is-label', !!lab); cr.textContent = lab ? lab.dataset.cursor : '';
      cr.classList.toggle('is-hover', !!hov && !lab);
    });
  } else { $('.cursor').remove(); $('.cursor-ring').remove(); }

  /* ---------- Page transitions ---------- */
  const wipe = $('.page-wipe');
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || reduce || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || /^https?:/.test(href)) return;
    const url = new URL(href, location.href);
    if (url.pathname === location.pathname && url.hash) return;
    e.preventDefault(); wipe.classList.add('active');
    setTimeout(() => location.href = href, 600);
  });
  addEventListener('pageshow', () => wipe.classList.remove('active'));

  /* ---------- Toast ---------- */
  NB.toast = msg => { const t = $('.toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2800); };
  $$('[data-newsletter]').forEach(f => f.addEventListener('submit', e => { e.preventDefault(); f.reset(); NB.toast('🎉 You\'re in! Welcome to the NiceyBud circle.'); NB.confetti && NB.confetti(); }));

  /* ---------- Split text ---------- */
  NB.split = el => {
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(w => {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(' ')); return; }
            const o = document.createElement('span'); o.className = 'w';
            const s = document.createElement('span'); s.textContent = w; s.style.setProperty('--i', i++);
            o.appendChild(s); frag.appendChild(o);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.classList.contains('w') && !n.hasAttribute('data-nosplit')) walk(n);
        else if (n.nodeType === 1) { const o = document.createElement('span'); o.className = 'w'; n.replaceWith(o); const s = document.createElement('span'); s.style.setProperty('--i', i++); s.appendChild(n); o.appendChild(s); }
      });
    };
    walk(el); el.classList.add('split');
  };
  $$('[data-split]').forEach(NB.split);

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15, rootMargin: '0px 0px -8% 0px' });
  NB.observe = (scope = document) => $$('[data-reveal], .split', scope).forEach(el => io.observe(el));
  document.addEventListener('nb:ready', () => NB.observe());

  /* ---------- Counters ---------- */
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, end = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length, suf = el.dataset.suffix || '', t0 = performance.now(), dur = 2000;
    const step = t => { const p = Math.min(1, (t - t0) / dur), v = end * (1 - Math.pow(1 - p, 4)); el.textContent = v.toFixed(dec) + suf; if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .5 });
  $$('[data-count]').forEach(el => cio.observe(el));

  /* ---------- Spotlight + tilt cards ---------- */
  NB.bindCards = (scope = document) => $$('.card', scope).forEach(c => {
    if (c._b) return; c._b = 1;
    c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      c.style.setProperty('--mx', x + 'px'); c.style.setProperty('--my', y + 'px');
      if (c.hasAttribute('data-tilt') && fine && !reduce) {
        const rx = ((y / r.height) - .5) * -8, ry = ((x / r.width) - .5) * 8;
        c.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
      }
    });
    c.addEventListener('pointerleave', () => { if (c.hasAttribute('data-tilt')) c.style.transform = ''; });
  });
  NB.bindCards();

  /* ---------- Magnetic ---------- */
  NB.magnet = (scope = document) => { if (!fine || reduce) return; $$('[data-magnetic], .btn', scope).forEach(el => {
    if (el._m) return; el._m = 1;
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * .25}px, ${y * .35}px)`;
      el.style.setProperty('--bx', ((e.clientX - r.left) / r.width * 100) + '%'); el.style.setProperty('--by', ((e.clientY - r.top) / r.height * 100) + '%');
    });
    el.addEventListener('pointerleave', () => el.style.transform = '');
  }); };
  NB.magnet();

  /* ---------- Text scramble ---------- */
  NB.scramble = (el, text) => new Promise(res => {
    const chars = '!<>-_\\/[]{}—=+*^?#01', old = el.textContent, len = Math.max(old.length, text.length), q = [];
    for (let i = 0; i < len; i++) { const s = Math.floor(Math.random() * 20), e = s + Math.floor(Math.random() * 20); q.push({ from: old[i] || '', to: text[i] || '', s, e }); }
    let f = 0;
    const up = () => {
      let out = '', done = 0;
      q.forEach(c => { if (f >= c.e) { done++; out += c.to; } else if (f >= c.s) { out += `<span style="color:var(--mint);opacity:.6">${chars[Math.floor(Math.random() * chars.length)]}</span>`; } else out += c.from; });
      el.innerHTML = out;
      if (done === q.length) res(); else { f++; requestAnimationFrame(up); }
    };
    up();
  });
  $$('[data-scramble-hover]').forEach(el => { const t = el.textContent; el.addEventListener('mouseenter', () => NB.scramble(el, t)); });

  /* ---------- Confetti ---------- */
  NB.confetti = () => {
    if (reduce) return;
    let cv = $('#confetti'); if (!cv) { cv = document.createElement('canvas'); cv.id = 'confetti'; document.body.appendChild(cv); }
    const ctx = cv.getContext('2d'); cv.width = innerWidth; cv.height = innerHeight;
    const cols = ['#2ef2b6', '#22d3ee', '#b6ff5c', '#3b82f6', '#ffffff'];
    const ps = Array.from({ length: 160 }, () => ({ x: innerWidth / 2, y: innerHeight * .6, vx: (Math.random() - .5) * 18, vy: -Math.random() * 18 - 6, r: Math.random() * 6 + 3, c: cols[Math.floor(Math.random() * cols.length)], a: Math.random() * 6, va: (Math.random() - .5) * .3 }));
    let fr = 0;
    (function draw() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      ps.forEach(p => { p.vy += .45; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); });
      if (++fr < 180) requestAnimationFrame(draw); else ctx.clearRect(0, 0, cv.width, cv.height);
    })();
  };

  /* ---------- Shared renderers ---------- */
  NB.mock = (hue, seed = 1) => {
    const bars = Array.from({ length: 9 }, (_, i) => `<b style="--h:${30 + ((i * 37 + seed * 13) % 65)}%;--dl:${i * .12}s"></b>`).join('');
    return `<div class="mock" style="background:radial-gradient(circle at 80% 0%, ${hue[0]}33, transparent 55%),radial-gradient(circle at 0% 100%, ${hue[1]}33, transparent 55%)"><div class="mock__top"><i></i><i></i><i></i></div><div class="mock__body"><div class="mock__col"><i class="g"></i><i></i><i></i><i style="width:70%"></i><i></i><i style="width:50%"></i></div><div class="mock__chart">${bars}</div></div></div>`;
  };
  NB.cover = (p, big) => `<div class="cover-art" style="--c1:${p.hue[0]};--c2:${p.hue[1]}"><svg viewBox="0 0 400 250" preserveAspectRatio="none"><defs><pattern id="g${p.slug}" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0v24" fill="none" stroke="#fff" stroke-width=".5"/></pattern></defs><rect width="400" height="250" fill="url(#g${p.slug})"/><circle cx="320" cy="60" r="${big ? 70 : 40}" fill="none" stroke="#fff" stroke-width=".8"/><path d="M0 200 Q100 120 200 180 T400 140" fill="none" stroke="#fff" stroke-width="1"/></svg><span>${p.word}</span></div>`;
  const fmt = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  NB.fmt = fmt;
  NB.productCard = (p, i = 0) => `
    <article class="card product" data-tilt data-cursor="View" data-reveal style="--d:${(i % 3) * .1}s" data-id="${p.id}" data-cat="${p.cat}" tabindex="0" role="button" aria-label="${p.name} details">
      <div class="product__media">${p.badge ? `<span class="product__badge">${p.badge}</span>` : ''}${NB.mock(p.hue, i + 1)}</div>
      <div class="product__body">
        <span class="tag" style="justify-self:start;width:max-content">${p.cat}</span>
        <h3 class="h3">${p.name}</h3><p>${p.desc}</p>
        <div class="product__foot"><span class="price">$${p.price}<small>${p.unit}</small></span><span class="arrow-btn">${I.arrow}</span></div>
      </div>
    </article>`;
  NB.postCard = (p, i = 0) => `
    <a href="post.html?p=${p.slug}" class="card post-card" data-tilt data-cursor="Read" data-reveal style="--d:${(i % 3) * .1}s" data-cat="${p.cat}">
      <div class="post-card__cover">${NB.cover(p)}</div>
      <div class="post-card__body">
        <div class="post-card__meta"><b>${p.cat}</b><span>${fmt(p.date)}</span><span>${p.read} min</span></div>
        <h3>${p.title}</h3><p>${p.excerpt}</p>
      </div>
    </a>`;

  /* ---------- Product modal ---------- */
  NB.openProduct = id => {
    const p = NB.products.find(x => x.id === id); if (!p) return;
    let m = $('.modal');
    if (!m) { document.body.insertAdjacentHTML('beforeend', '<div class="modal" role="dialog" aria-modal="true"><div class="modal__bg"></div><div class="modal__box"></div></div>'); m = $('.modal'); m.querySelector('.modal__bg').onclick = NB.closeModal; }
    m.querySelector('.modal__box').innerHTML = `
      <button class="modal__close" aria-label="Close">×</button>
      <div class="modal__media product__media" style="aspect-ratio:auto">${NB.mock(p.hue, 3)}</div>
      <div class="modal__content">
        <span class="tag" style="width:max-content">${p.cat}${p.badge ? ' · ' + p.badge : ''}</span>
        <h3 class="h2" style="font-size:clamp(36px,5vw,56px)">${p.name}</h3><p>${p.desc}</p>
        <ul class="features">${p.features.map(f => `<li>${f}</li>`).join('')}</ul>
        <div class="price" style="font-size:40px">$${p.price}<small>${p.unit}</small></div>
        <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn--primary" data-buy>Get ${p.name} ${I.arrow}</button><a class="btn btn--ghost" href="contact.html">Ask a question</a></div>
      </div>`;
    m.querySelector('.modal__close').onclick = NB.closeModal;
    m.querySelector('[data-buy]').onclick = () => { NB.closeModal(); NB.toast(`✨ ${p.name} added — we'll email setup steps shortly.`); NB.confetti(); };
    m.classList.add('open'); document.body.style.overflow = 'hidden'; NB.magnet(m);
    setTimeout(() => m.querySelector('.modal__close').focus(), 50);
  };
  NB.closeModal = () => { const m = $('.modal'); if (m) m.classList.remove('open'); document.body.style.overflow = ''; };
  addEventListener('keydown', e => { if (e.key === 'Escape') { NB.closeModal(); document.body.classList.remove('menu-open'); } });
  document.addEventListener('click', e => { const c = e.target.closest('.product[data-id]'); if (c) NB.openProduct(c.dataset.id); });
  document.addEventListener('keydown', e => { const c = e.target.closest && e.target.closest('.product[data-id]'); if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); NB.openProduct(c.dataset.id); } });

  /* ---------- Neural network canvas ---------- */
  NB.neural = canvas => {
    const ctx = canvas.getContext('2d'); let w, h, pts = [], dpr = Math.min(2, devicePixelRatio || 1);
    const mouse = { x: -999, y: -999 }, pulses = [];
    const size = () => {
      const r = canvas.getBoundingClientRect(); w = r.width; h = r.height; canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(110, Math.floor(w * h / 13000));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.8 + .8 }));
    };
    size(); addEventListener('resize', size);
    canvas.parentElement.addEventListener('pointermove', e => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    canvas.parentElement.addEventListener('pointerleave', () => { mouse.x = mouse.y = -999; });
    canvas.parentElement.addEventListener('click', e => { const r = canvas.getBoundingClientRect(); pulses.push({ x: e.clientX - r.left, y: e.clientY - r.top, r: 0 }); });
    let visible = true; new IntersectionObserver(([e]) => visible = e.isIntersecting).observe(canvas);
    const light = () => root.dataset.theme === 'light';
    (function frame() {
      requestAnimationFrame(frame); if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      const col = light() ? '11,150,120' : '46,242,182';
      pulses.forEach((p, i) => { p.r += 6; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.strokeStyle = `rgba(${col},${Math.max(0, 1 - p.r / 400)})`; ctx.lineWidth = 2; ctx.stroke(); if (p.r > 400) pulses.splice(i, 1); });
      for (const p of pts) {
        if (!reduce) { p.x += p.vx; p.y += p.vy; }
        if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 140) { p.x += dx / d * 1.6; p.y += dy / d * 1.6; }
        pulses.forEach(q => { const dd = Math.hypot(p.x - q.x, p.y - q.y); if (Math.abs(dd - q.r) < 20) { p.x += (p.x - q.x) / dd * 3; p.y += (p.y - q.y) / dd * 3; } });
      }
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 130) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.strokeStyle = `rgba(${col},${(1 - d / 130) * .28})`; ctx.lineWidth = 1; ctx.stroke(); }
      }
      for (const p of pts) {
        const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (dm < 220) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.strokeStyle = `rgba(34,211,238,${(1 - dm / 220) * .5})`; ctx.stroke(); }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fillStyle = `rgba(${col},.9)`; ctx.fill();
      }
    })();
  };
  $$('canvas[data-neural]').forEach(NB.neural);
})();
