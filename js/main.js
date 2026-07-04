/* ══════════════════════════════════════════════════════════════════════════
   Kemek Enterprise — site interactions
   Wrapped in an IIFE so nothing leaks to the global scope. Loaded with `defer`.
   ══════════════════════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  const reduce      = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const nav = document.getElementById('site-nav');

  /* ─── Nav shade + scroll progress (single rAF-batched handler) ───────────
     Both effects share one scroll listener, and the page height is cached so
     we never force a synchronous reflow on every scroll frame.               */
  (() => {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    document.body.appendChild(bar);

    let maxScroll = 0;
    let ticking   = false;
    const measure = () => { maxScroll = document.documentElement.scrollHeight - window.innerHeight; };

    const frame = () => {
      const y = window.scrollY;
      if (nav) nav.classList.toggle('scrolled', y > 60);
      bar.style.width = (maxScroll > 0 ? (y / maxScroll) * 100 : 0) + '%';
      ticking = false;
    };
    const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', () => { measure(); request(); }, { passive: true });
    window.addEventListener('load',   () => { measure(); frame(); });
    measure();
    frame();
  })();

  /* ─── Mobile menu ────────────────────────────────────────────────────────── */
  const menuBtn    = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen   = document.getElementById('menu-icon-open');
  const iconClose  = document.getElementById('menu-icon-close');

  if (menuBtn && mobileMenu) {
    const close = () => {
      mobileMenu.classList.remove('open');
      iconOpen.classList.remove('hidden');
      iconClose.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
    };

    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      iconOpen.classList.toggle('hidden', isOpen);
      iconClose.classList.toggle('hidden', !isOpen);
      menuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    document.addEventListener('click', e => { if (nav && !nav.contains(e.target)) close(); });
  }

  /* ─── Active nav link ────────────────────────────────────────────────────── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav-link]').forEach(link => {
    if (link.getAttribute('href') === page) {
      link.style.color = '#F8F6F1';
      link.style.opacity = '1';
    }
  });

  /* ─── Scroll reveal (Intersection Observer) ──────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal, .clip-reveal');
  if (reveals.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  }

  /* ─── Word-stagger heading reveal ────────────────────────────────────────
     Splits eligible plain-text headings inside a .reveal block into word
     spans that rise, unblur and settle in sequence when the block appears.
     Headings with nested markup (e.g. an italic <span>) are left untouched. */
  if (!reduce) {
    document.querySelectorAll('.reveal h2, .reveal h3').forEach(h => {
      if (h.children.length) return;
      const words = h.textContent.trim().split(/\s+/);
      if (words.length < 2) return;

      const frag = document.createDocumentFragment();
      words.forEach((w, i) => {
        const span = document.createElement('span');
        span.className = 'rw';
        span.style.transitionDelay = (i * 55) + 'ms';
        span.textContent = w;
        frag.appendChild(span);
        frag.appendChild(document.createTextNode(' '));
      });
      h.textContent = '';
      h.appendChild(frag);
    });
  }

  /* ─── Hero: gold aurora + soft parallax ──────────────────────────────────
     An aurora layer is injected into every hero. On fine-pointer devices the
     aurora tracks the cursor and the content drifts with a gentle parallax.  */
  document.querySelectorAll('.hero-bg, .page-hero-bg').forEach(hero => {
    const aurora = document.createElement('div');
    aurora.className = 'hero-aurora';
    aurora.setAttribute('aria-hidden', 'true');
    hero.insertBefore(aurora, hero.firstChild);

    if (reduce || !finePointer) return;
    const content = hero.querySelector('.relative.z-10');
    if (content) content.classList.add('hero-parallax');

    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      aurora.style.setProperty('--mx', (x * 100) + '%');
      aurora.style.setProperty('--my', (y * 100) + '%');
      if (content) content.style.transform =
        `translate3d(${(x - 0.5) * -14}px, ${(y - 0.5) * -9}px, 0)`;
    });
    hero.addEventListener('pointerleave', () => { if (content) content.style.transform = ''; });
  });

  /* ─── Magnetic buttons ───────────────────────────────────────────────────── */
  if (!reduce && finePointer) {
    document.querySelectorAll('.btn-primary, .btn-ink, .btn-outline, .btn-outline-dark').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.transform =
          `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.28}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });
  }

  /* ─── Service cards: 3D tilt + cursor glow ───────────────────────────────── */
  if (!reduce && finePointer) {
    document.querySelectorAll('.service-card').forEach(card => {
      const glow = document.createElement('span');
      glow.className = 'card-glow';
      glow.setAttribute('aria-hidden', 'true');
      card.appendChild(glow);

      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.classList.add('is-tilting');
        card.style.transform =
          `perspective(1100px) rotateY(${(x - 0.5) * 6}deg) rotateX(${(0.5 - y) * 6}deg) translateY(-6px)`;
        glow.style.setProperty('--gx', (x * 100) + '%');
        glow.style.setProperty('--gy', (y * 100) + '%');
      });
      card.addEventListener('pointerleave', () => {
        card.classList.remove('is-tilting');
        card.style.transform = '';
      });
    });
  }

  /* ─── Portfolio filter ───────────────────────────────────────────────────── */
  const filterBtns     = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item[data-cat]');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.dataset.filter;
        portfolioItems.forEach(item => {
          const show = cat === 'all' || item.dataset.cat === cat;
          clearTimeout(item._filterTimer);
          item.style.transition = 'opacity 0.35s ease';
          item.style.pointerEvents = show ? '' : 'none';
          if (show) {
            item.style.display = '';
            requestAnimationFrame(() => { item.style.opacity = '1'; });
          } else {
            item.style.opacity = '0';
            item._filterTimer = setTimeout(() => { item.style.display = 'none'; }, 350);
          }
        });
      });
    });
  }

  /* ─── Animated stat counters ─────────────────────────────────────────────── */
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if (counters.length) {
    const run = el => {
      const target = parseInt(el.dataset.count, 10) || 0;
      if (reduce) { el.textContent = target; return; }
      const duration = 1400;
      const start = performance.now();
      const tick = now => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const cio = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { run(entry.target); cio.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(c => cio.observe(c));
  }

  /* ─── Floating quick-contact launcher ────────────────────────────────────── */
  const chatWidget = document.getElementById('chat-widget');
  if (chatWidget) {
    const toggle = document.getElementById('chat-toggle');
    const setOpen = open => {
      chatWidget.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', e => {
      e.stopPropagation();
      setOpen(!chatWidget.classList.contains('open'));
    });
    document.addEventListener('click', e => {
      if (!chatWidget.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  }

  /* ─── Contact form ───────────────────────────────────────────────────────
     Submits to the form's `action` (set up for Formspree). If the endpoint is
     still the placeholder, or the network request fails, it falls back to
     opening the visitor's email client so an enquiry is never silently lost. */
  const form = document.getElementById('contact-form');
  if (form) {
    const status    = document.getElementById('form-status');
    const setStatus = (msg, color) => { if (status) { status.textContent = msg; status.style.color = color || ''; } };

    const flashBtn = (btn, label, ok) => {
      btn.textContent = label;
      btn.style.background  = ok ? '#2E7D52' : '';
      btn.style.borderColor = ok ? '#2E7D52' : '';
      btn.style.color       = ok ? '#fff' : '';
    };

    const mailtoFallback = () => {
      const to   = form.dataset.fallbackEmail || 'hello@kemekenterprise.co.uk';
      const data = new FormData(form);
      const body = [...data.entries()].map(([k, v]) => `${k}: ${v}`).join('\n');
      const subject = `Website enquiry — ${data.get('interest') || 'General'}`;
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!form.reportValidity()) return;

      const btn  = form.querySelector('[type="submit"]');
      const orig = btn.textContent;
      const action = form.getAttribute('action') || '';
      const configured = action && !action.includes('YOUR_FORM_ID');

      btn.disabled = true;
      btn.textContent = 'Sending…';

      if (!configured) {
        flashBtn(btn, 'Opening email…', true);
        setStatus('Opening your email app so you can send the enquiry…');
        mailtoFallback();
        setTimeout(() => { flashBtn(btn, orig, false); btn.disabled = false; }, 3000);
        return;
      }

      try {
        const res = await fetch(action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (!res.ok) throw new Error('Request failed');
        flashBtn(btn, 'Enquiry Sent ✓', true);
        setStatus('Thank you — we’ll be in touch within one working day.', '#2E7D52');
        form.reset();
        setTimeout(() => { flashBtn(btn, orig, false); btn.disabled = false; }, 3500);
      } catch (err) {
        setStatus('Couldn’t send automatically — opening your email app instead…', '#b4541f');
        mailtoFallback();
        flashBtn(btn, orig, false);
        btn.disabled = false;
      }
    });
  }
})();
