/* ─── Nav scroll effect ─────────────────────────────────────────────────── */
const nav = document.getElementById('site-nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ─── Scroll progress bar ───────────────────────────────────────────────── */
(() => {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.appendChild(bar);
  const update = () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  update();
})();

/* ─── Mobile menu ───────────────────────────────────────────────────────── */
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

  // Close on outside click
  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) close();
  });
}

/* ─── Active nav link ───────────────────────────────────────────────────── */
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('[data-nav-link]').forEach(link => {
  if (link.getAttribute('href') === page) {
    link.style.color = '#F8F6F1';
    link.style.opacity = '1';
  }
});

/* ─── Scroll reveal (Intersection Observer) ─────────────────────────────── */
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

/* ─── Portfolio filter ──────────────────────────────────────────────────── */
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

/* ─── Animated stat counters ────────────────────────────────────────────── */
const counters = document.querySelectorAll('.stat-num[data-count]');
if (counters.length) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

/* ─── Floating quick-contact launcher ───────────────────────────────────── */
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

/* ─── Contact form ──────────────────────────────────────────────────────────
   Submits to the form's `action` (set up for Formspree). If the endpoint is
   still the placeholder, or the network request fails, it falls back to opening
   the visitor's email client so an enquiry is never silently lost.            */
const form = document.getElementById('contact-form');
if (form) {
  const status   = document.getElementById('form-status');
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

    // No live endpoint yet — hand off to the visitor's email app.
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
