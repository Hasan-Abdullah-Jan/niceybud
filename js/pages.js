/* NiceyBud — page-specific behaviour */
(() => {
  const { $, $$, icons: I } = NB;
  const page = document.body.dataset.page;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const after = fn => { fn(); NB.bindCards(); NB.magnet(); };

  const marquee = (el, words) => { if (!el) return; const s = words.map(w => `<span>${w}</span>`).join(''); el.innerHTML = s + s; };

  /* ================= HOME ================= */
  if (page === 'home') after(() => {
    // rotating word with scramble
    const words = ['Growth', 'Creativity', 'Automation', 'Agents', 'Branding'];
    const rot = $('#rotator'); let wi = 0;
    document.addEventListener('nb:ready', () => setInterval(() => { wi = (wi + 1) % words.length; NB.scramble(rot, words[wi]); }, 2600));

    // orbit chips
    const chipWrap = $('#chips');
    const chipData = NB.services.slice(0, 7);
    chipWrap.innerHTML = chipData.map(s => `<a class="chip" href="services.html#${s.id}">${I[s.icon]}${s.title.replace(' & Identity', '').replace('Web & Product ', '')}</a>`).join('');
    const chips = $$('.chip', chipWrap);
    let ang = 0;
    (function orbit() {
      ang += reduce ? 0 : .0016;
      const core = $('#core'), R = core.offsetWidth / 2;
      chips.forEach((c, i) => {
        const a = ang + i / chips.length * Math.PI * 2, rr = R * (i % 2 ? .78 : .96);
        c.style.left = (R + Math.cos(a) * rr) + 'px'; c.style.top = (R + Math.sin(a) * rr * .92) + 'px';
      });
      requestAnimationFrame(orbit);
    })();
    // parallax tilt core
    const stage = $('#coreStage');
    $('.hero').addEventListener('pointermove', e => {
      if (reduce) return;
      const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      stage.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 18}deg)`;
    });
    // click logo → spin + confetti
    let clicks = 0;
    $('#coreLogo').addEventListener('click', () => {
      const img = $('#coreLogo'); img.animate([{ transform: 'rotate(0) scale(1)' }, { transform: 'rotate(720deg) scale(1.2)' }, { transform: 'rotate(720deg) scale(1)' }], { duration: 1100, easing: 'cubic-bezier(.16,1,.3,1)' });
      if (++clicks % 3 === 0) { NB.confetti(); NB.toast('🌱 You found the secret bud. Stay curious!'); }
    });

    marquee($('#mq1'), ['Agentic AI', 'Automation', 'Marketing', 'Branding & Design', 'Research & Innovation', 'Productivity Solutions', 'Web Experiences']);
    marquee($('#mq2'), ['Think bigger', 'Automate smarter', 'Grow faster', 'Design bolder', 'Ship weekly']);

    // bento services
    const visuals = [
      '<svg class="svc__visual" viewBox="0 0 200 200"><g fill="none" stroke="currentColor" stroke-width=".8" style="color:var(--mint)"><circle cx="100" cy="100" r="30"/><circle cx="100" cy="100" r="60"/><circle cx="100" cy="100" r="90"/><path d="M100 10v180M10 100h180M36 36l128 128M164 36L36 164"/></g></svg>',
      '<svg class="svc__visual" viewBox="0 0 200 200"><g fill="none" stroke="var(--cyan)" stroke-width=".8">' + Array.from({ length: 10 }, (_, i) => `<rect x="${10 + i * 9}" y="${10 + i * 9}" width="${180 - i * 18}" height="${180 - i * 18}" rx="20"/>`).join('') + '</g></svg>'
    ];
    $('#bento').innerHTML = NB.services.map((s, i) => {
      const cls = i === 0 || i === 6 ? 'svc--wide' : '';
      return `<a href="services.html#${s.id}" class="card svc ${cls}" data-tilt data-reveal style="--d:${(i % 3) * .08}s" data-cursor="Explore">
        <span class="svc__num">0${i + 1}</span><div class="svc__icon">${I[s.icon]}</div>
        <h3 class="h3">${s.title}</h3><p>${s.short}</p><div class="svc__tags">${s.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        ${cls ? visuals[i % 2] : ''}</a>`;
    }).join('') + `<a href="contact.html" class="card svc" data-reveal style="grid-column:span 4;background:var(--mint);color:#022;border-color:var(--mint)" data-cursor="Let's go"><span class="svc__num" style="color:#022">✦</span><div class="svc__icon" style="background:#022;color:var(--mint);border-color:#022">${I.spark}</div><h3 class="h3">Something custom?</h3><p style="color:#044">Tell us the wild idea. We love the ones that sound impossible.</p></a>`;
    // process horizontal scroll
    const proc = $('#process'), track = $('#track'), pbar = $('#pbar');
    const setH = () => { proc.style.height = (track.scrollWidth - innerWidth + innerHeight + 200) + 'px'; };
    setH(); addEventListener('resize', setH);
    addEventListener('scroll', () => {
      const r = proc.getBoundingClientRect(), max = proc.offsetHeight - innerHeight, p = Math.min(1, Math.max(0, -r.top / max));
      track.style.transform = `translateX(${-p * (track.scrollWidth - innerWidth + 80)}px)`;
      pbar.style.transform = `scaleX(${p})`;
    }, { passive: true });

    // agent terminal
    const tasks = [
      { q: 'Find 20 qualified leads for my SaaS', steps: [['plan', 'Defining ICP: B2B SaaS, 10–200 staff, US/EU'], ['tool', 'search.web("SaaS companies hiring RevOps")'], ['tool', 'enrich.apollo(batch=48)'], ['think', 'Scoring by intent signals + tech stack…'], ['tool', 'crm.hubspot.create(20 contacts)']], out: '✅ 20 leads added to HubSpot · avg fit score 87/100 · 3 personalized email drafts ready for review.' },
      { q: 'Automate my weekly marketing report', steps: [['plan', 'Sources: GA4, Meta Ads, Google Ads, Stripe'], ['tool', 'ga4.query(last_7_days)'], ['tool', 'ads.meta.insights() · ads.google.report()'], ['think', 'Detecting anomalies vs. 4-week baseline…'], ['tool', 'slack.post("#growth", report.pdf)']], out: '📈 Report scheduled every Monday 9:00. This week: ROAS +23%, CAC −11%, 1 anomaly flagged (Meta CPM spike).' },
      { q: 'Draft a brand name for an eco coffee shop', steps: [['plan', 'Brief: sustainable, warm, Gen‑Z friendly'], ['think', 'Exploring metaphors: roots, sprout, roast, loop…'], ['tool', 'domains.check(12 candidates)'], ['tool', 'trademark.screen(shortlist)']], out: '☕ Top picks: “Sproast”, “Loop & Bean”, “Rootbrew”. sproast.co is available — want a logo moodboard next?' },
      { q: 'Answer customer emails in my inbox', steps: [['tool', 'gmail.fetch(unread=34)'], ['think', 'Classifying: 19 FAQ · 9 orders · 4 refunds · 2 urgent'], ['tool', 'kb.search() → drafting 28 replies'], ['plan', 'Escalating 2 urgent + 4 refunds to humans']], out: '✉️ 28 replies sent in your brand voice · 6 escalated with summaries · est. 3.5 hours saved today.' }
    ];
    const term = $('#term'), pr = $('#prompts');
    pr.innerHTML = tasks.map((t, i) => `<button class="prompt-chip" data-i="${i}">${t.q}</button>`).join('');
    let running = false;
    const line = (html, cls = '') => { const d = document.createElement('div'); d.className = 'ln ' + cls; d.innerHTML = html; term.appendChild(d); term.scrollTop = term.scrollHeight; return d; };
    const wait = ms => new Promise(r => setTimeout(r, reduce ? 0 : ms));
    const typeInto = async (el, txt) => { for (const ch of txt) { el.textContent += ch; await wait(14); term.scrollTop = term.scrollHeight; } };
    const run = async i => {
      if (running) return; running = true;
      $$('.prompt-chip').forEach(b => b.classList.toggle('active', +b.dataset.i === i));
      const t = tasks[i]; term.innerHTML = '';
      await typeInto(line('', 't-user'), t.q); await wait(300);
      line('<span class="t-dim">bud ▸ thinking</span> <span class="t-bar"><i></i></span>'); await wait(1100);
      for (const [k, s] of t.steps) {
        const lab = { plan: '◆ plan', tool: '⚙ tool', think: '◌ think' }[k];
        const el = line(`<b>${lab}</b> `, 't-step'); await typeInto(el, s); el.insertAdjacentHTML('beforeend', ' <span class="t-ok">✓</span>'); await wait(350);
      }
      const o = line('', 't-out'); await typeInto(o, t.out);
      line('<span class="t-dim">// done in ' + (2 + Math.random() * 3).toFixed(1) + 's · tokens ' + (1800 + Math.floor(Math.random() * 3000)) + '</span>');
      line('<span class="caret"></span>');
      running = false;
    };
    pr.addEventListener('click', e => { const b = e.target.closest('.prompt-chip'); if (b) run(+b.dataset.i); });
    let auto = new IntersectionObserver(([e]) => { if (e.isIntersecting) { auto.disconnect(); setTimeout(() => run(0), 600); } }, { threshold: .5 });
    auto.observe(term);

    // products / posts
    $('#homeProducts').innerHTML = NB.products.slice(0, 3).map(NB.productCard).join('');
    $('#homePosts').innerHTML = NB.posts.slice(0, 3).map(NB.postCard).join('');

    // testimonials
    const T = [
      ['NiceyBud built us an AI support agent in 3 weeks. It now resolves 71% of tickets — and customers actually like it.', 'Amara Okafor', 'COO, Lumio', '#2ef2b6'],
      ['The rebrand was stunning, but the automations behind it are what changed our business. 30 hours a week back.', 'Jonas Keller', 'Founder, Verdant Labs', '#22d3ee'],
      ['They feel like an in-house team that happens to be ridiculously good at AI. Weekly demos kept us hooked.', 'Mei Sato', 'Head of Growth, Kairo', '#b6ff5c'],
      ['Our lead pipeline tripled in a quarter. LeadHunter + their outbound playbook is a cheat code.', 'Diego Ramos', 'CEO, Nexa Freight', '#a78bfa'],
      ['Every interaction is thoughtful, creative and fast. Best agency experience we\'ve had, hands down.', 'Fatima Noor', 'CMO, Bloomwell', '#fb923c']
    ];
    const tc = T.map(t => `<figure class="card testi"><div class="stars">★★★★★</div><p>“${t[0]}”</p><footer><span class="av" style="background:${t[3]}">${t[1].split(' ').map(x => x[0]).join('')}</span><div><b>${t[1]}</b><span>${t[2]}</span></div></footer></figure>`).join('');
    $('#testi').innerHTML = tc + tc;

    // CTA blob follows cursor
    const cta = $('#cta'), blob = $('#ctaBlob');
    cta.addEventListener('pointermove', e => { const r = cta.getBoundingClientRect(); blob.style.left = (e.clientX - r.left) + 'px'; blob.style.top = (e.clientY - r.top) + 'px'; });
    cta.addEventListener('pointerleave', () => { blob.style.left = '50%'; blob.style.top = '50%'; });
  });

  /* ================= SERVICES ================= */
  if (page === 'services') after(() => {
    $('#svcList').innerHTML = NB.services.map((s, i) => `
      <div class="svc-row" id="${s.id}" data-reveal>
        <span class="svc-row__n">0${i + 1} /</span>
        <div><div class="svc__icon" style="margin-bottom:18px">${I[s.icon]}</div><h3>${s.title}</h3></div>
        <div><p>${s.long}</p><div class="svc__tags">${s.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div></div>
        <a href="contact.html?service=${s.id}" class="arrow-btn" aria-label="Enquire about ${s.title}">${I.arrow}</a>
      </div>`).join('');
    marquee($('#mq1'), NB.services.map(s => s.title));

    const plans = [
      { n: 'Spark', d: 'For founders testing the AI waters.', m: 990, f: ['1 automation workflow / month', 'AI strategy session', 'Brand & content audit', 'Email support'] },
      { n: 'Growth', d: 'Our most-loved plan for scaling teams.', m: 2490, hot: 1, f: ['1 custom AI agent', '5 automation workflows', 'Monthly marketing sprint', 'Design hours included', 'Priority Slack channel'] },
      { n: 'Autopilot', d: 'A full AI & creative department.', m: 5990, f: ['Unlimited workflows', 'Multiple AI agents', 'Full brand & web studio', 'Dedicated strategist', 'Quarterly R&D sprint'] }
    ];
    const render = yearly => $('#plans').innerHTML = plans.map((p, i) => `
      <div class="card plan ${p.hot ? 'plan--hot' : ''}" data-reveal style="--d:${i * .1}s">
        ${p.hot ? '<span class="ribbon">Most popular</span>' : ''}
        <h3 class="h3">${p.n}</h3><p style="color:var(--text-dim)">${p.d}</p>
        <div class="plan__price"><span class="grad-text">$${(yearly ? Math.round(p.m * .8) : p.m).toLocaleString()}</span><small> /month</small></div>
        <ul>${p.f.map(x => `<li>${I.check}${x}</li>`).join('')}</ul>
        <a href="contact.html?plan=${p.n}" class="btn ${p.hot ? 'btn--primary' : 'btn--ghost'}">Choose ${p.n}</a>
      </div>`).join('');
    render(false);
    const tg = $('.pricing-toggle'), knob = $('.knob', tg), bs = $$('button', tg);
    const place = b => { knob.style.left = b.offsetLeft + 'px'; knob.style.width = b.offsetWidth + 'px'; };
    place(bs[0]);
    bs.forEach((b, i) => b.addEventListener('click', () => { bs.forEach(x => x.classList.remove('on')); b.classList.add('on'); place(b); render(i === 1); NB.observe($('#plans')); NB.bindCards($('#plans')); NB.magnet($('#plans')); }));
    // FAQ: only one open
    $$('.faq details').forEach(d => d.addEventListener('toggle', () => { if (d.open) $$('.faq details').forEach(o => o !== d && (o.open = false)); }));
  });

  /* ================= PRODUCTS ================= */
  if (page === 'products') after(() => {
    const grid = $('#productGrid');
    grid.innerHTML = NB.products.map(NB.productCard).join('') + '<div class="empty is-hidden">No products match. Try another search ✦</div>';
    let cat = 'all', q = '';
    const apply = () => {
      let n = 0;
      $$('.product', grid).forEach(c => {
        const p = NB.products.find(x => x.id === c.dataset.id);
        const ok = (cat === 'all' || p.cat === cat) && (p.name + p.desc + p.cat).toLowerCase().includes(q);
        c.classList.toggle('is-hidden', !ok);
        if (ok) { c.classList.remove('flip-anim'); void c.offsetWidth; c.classList.add('flip-anim'); c.style.animationDelay = (n++ * 50) + 'ms'; c.classList.add('in'); }
      });
      $('.empty', grid).classList.toggle('is-hidden', n > 0);
    };
    $$('.filter').forEach(f => f.addEventListener('click', () => { $$('.filter').forEach(x => x.classList.remove('on')); f.classList.add('on'); cat = f.dataset.cat; apply(); }));
    $('#pSearch').addEventListener('input', e => { q = e.target.value.toLowerCase().trim(); apply(); });
    const id = new URLSearchParams(location.search).get('id'); if (id) setTimeout(() => NB.openProduct(id), 600);
  });

  /* ================= BLOG ================= */
  if (page === 'blog') after(() => {
    const f = NB.posts.find(p => p.featured), rest = NB.posts.filter(p => !p.featured);
    $('#featured').innerHTML = `
      <a href="post.html?p=${f.slug}" class="card post-card featured" data-cursor="Read" data-reveal>
        <div class="post-card__cover">${NB.cover(f, true)}</div>
        <div class="post-card__body"><span class="tag" style="width:max-content;background:var(--mint);color:#022;border-color:var(--mint)">Featured</span>
          <div class="post-card__meta"><b>${f.cat}</b><span>${NB.fmt(f.date)}</span><span>${f.read} min read</span></div>
          <h3>${f.title}</h3><p>${f.excerpt}</p><span class="btn btn--ghost btn--sm" style="width:max-content">Read article →</span></div>
      </a>`;
    const grid = $('#postGrid');
    grid.innerHTML = rest.map(NB.postCard).join('') + '<div class="empty is-hidden">Nothing found. Maybe write it yourself? 😉</div>';
    const cats = ['All', ...new Set(NB.posts.map(p => p.cat))];
    $('#blogFilters').innerHTML = cats.map((c, i) => `<button class="filter ${i ? '' : 'on'}" data-cat="${c}">${c}</button>`).join('');
    let cat = 'All', q = '';
    const apply = () => {
      let n = 0;
      $$('.post-card', grid).forEach(c => {
        const p = NB.posts.find(x => c.getAttribute('href').endsWith(x.slug));
        const ok = (cat === 'All' || p.cat === cat) && (p.title + p.excerpt).toLowerCase().includes(q);
        c.classList.toggle('is-hidden', !ok);
        if (ok) { c.classList.remove('flip-anim'); void c.offsetWidth; c.classList.add('flip-anim', 'in'); c.style.animationDelay = (n++ * 60) + 'ms'; }
      });
      $('.empty', grid).classList.toggle('is-hidden', n > 0);
    };
    $('#blogFilters').addEventListener('click', e => { const b = e.target.closest('.filter'); if (!b) return; $$('#blogFilters .filter').forEach(x => x.classList.remove('on')); b.classList.add('on'); cat = b.dataset.cat; apply(); });
    $('#bSearch').addEventListener('input', e => { q = e.target.value.toLowerCase().trim(); apply(); });
    addEventListener('keydown', e => { if (e.key === '/' && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); $('#bSearch').focus(); } });
  });

  /* ================= POST ================= */
  if (page === 'post') after(() => {
    const slug = new URLSearchParams(location.search).get('p');
    const p = NB.posts.find(x => x.slug === slug) || NB.posts[0];
    document.title = p.title + ' — NiceyBud Blog';
    $('#pCat').textContent = p.cat;
    const h = $('#pTitle'); h.textContent = p.title; NB.split(h);
    $('#pMeta').innerHTML = `<div class="author"><span class="av">${p.author.split(' ').map(x => x[0]).join('')}</span><div><b>${p.author}</b><br><span style="color:var(--text-mute)">NiceyBud Team</span></div></div><span>${I.clock.replace('<svg', '<svg width="16" style="display:inline;vertical-align:-3px"')} ${p.read} min read</span><span>${NB.fmt(p.date)}</span>`;
    $('#pCover').innerHTML = NB.cover(p, true);
    $('#prose').innerHTML = NB.postBody(p);
    $('#toc').innerHTML = '<h5>On this page</h5>' + $$('#prose h2').map(h2 => `<a href="#${h2.id}">${h2.textContent}</a>`).join('');
    const tocLinks = $$('#toc a');
    const sio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) tocLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-30% 0px -60% 0px' });
    $$('#prose h2').forEach(x => sio.observe(x));
    const bar = $('.reading-bar'), art = $('#prose');
    addEventListener('scroll', () => { const r = art.getBoundingClientRect(); bar.style.width = Math.min(100, Math.max(0, -r.top / (r.height - innerHeight) * 100)) + '%'; }, { passive: true });
    $('#copyLink').addEventListener('click', () => { navigator.clipboard && navigator.clipboard.writeText(location.href); NB.toast('🔗 Link copied!'); });
    $('#shareX').href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(p.title) + '&url=' + encodeURIComponent(location.href);
    $('#shareIn').href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(location.href);
    let claps = 0; const cb = $('#clapBtn'), cn = $('#clapN');
    cb.addEventListener('click', () => { claps++; cn.textContent = (128 + claps) + ' claps'; const s = document.createElement('span'); s.className = 'burst'; s.textContent = '+' + claps; cb.appendChild(s); setTimeout(() => s.remove(), 800); if (claps === 10) NB.confetti(); });
    $('#related').innerHTML = NB.posts.filter(x => x.slug !== p.slug).slice(0, 3).map(NB.postCard).join('');
  });

  /* ================= ABOUT ================= */
  if (page === 'about') after(() => {
    // scroll-lit manifesto
    const m = $('#manifesto');
    m.innerHTML = m.textContent.trim().split(/\s+/).map(w => `<span class="wd">${w}</span>`).join(' ');
    const wds = $$('.wd', m);
    const lit = () => { const r = m.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight * .8 - r.top) / (r.height + innerHeight * .3))); const n = Math.floor(p * wds.length); wds.forEach((w, i) => w.classList.toggle('lit', i < n)); };
    addEventListener('scroll', lit, { passive: true }); lit();
    // timeline fill
    const tl = $('.timeline'), fill = $('.timeline__fill');
    addEventListener('scroll', () => { const r = tl.getBoundingClientRect(); fill.style.height = Math.min(r.height, Math.max(0, innerHeight * .6 - r.top)) + 'px'; }, { passive: true });
    marquee($('#mq1'), ['Curious', 'Kind', 'Relentless', 'Playful', 'Honest', 'Future-proof']);
  });

  /* ================= CONTACT ================= */
  if (page === 'contact') after(() => {
    const form = $('#contactForm'), range = $('#budget'), out = $('#budgetOut');
    const upd = () => { const v = +range.value; out.textContent = v >= 50000 ? '$50k+' : '$' + (v / 1000).toFixed(v < 10000 ? 1 : 0) + 'k'; range.style.setProperty('--p', ((v - range.min) / (range.max - range.min) * 100) + '%'); };
    range.addEventListener('input', upd); upd();
    const params = new URLSearchParams(location.search), sv = params.get('service'), pl = params.get('plan');
    if (sv) { const cb = $(`input[name="interest"][value="${sv}"]`); if (cb) cb.checked = true; }
    if (pl) $('#msg').value = `Hi NiceyBud! I'm interested in the ${pl} plan. `;
    form.addEventListener('submit', e => {
      e.preventDefault(); let ok = true;
      $$('[required]', form).forEach(el => { const f = el.closest('.field'); const bad = !el.value.trim() || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value)); f.classList.toggle('err', bad); if (bad) ok = false; });
      if (!ok) { NB.toast('Please fill the highlighted fields ✦'); return; }
      const data = new FormData(form);
      const interests = data.getAll('interest').join(', ');
      const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nCompany: ${data.get('company')}\nInterests: ${interests}\nBudget: ${out.textContent}\n\n${data.get('message')}`;
      $('#mailFallback').href = `mailto:support@niceybud.com?subject=${encodeURIComponent('New project — ' + data.get('name'))}&body=${encodeURIComponent(body)}`;
      form.style.display = 'none'; $('.form-success').classList.add('show'); NB.confetti();
    });
    $$('.field input, .field textarea', form).forEach(el => el.addEventListener('input', () => el.closest('.field').classList.remove('err')));
    $$('[data-copy]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); navigator.clipboard && navigator.clipboard.writeText(b.dataset.copy); NB.toast('📋 Copied ' + b.dataset.copy); }));
  });
})();
