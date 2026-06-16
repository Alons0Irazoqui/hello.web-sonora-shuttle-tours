/**
 * ============================================================
 * SONORA SHUTTLE & TOURS — Enterprise Animations Engine
 * Native JavaScript Only · No External Libraries
 * Senior UI/UX Motion Design · Big Tech Level
 * ============================================================
 */

'use strict';

/* ── Utility: requestAnimationFrame loop helper ── */
const raf = (fn) => requestAnimationFrame(fn);

/* ── Utility: run function once DOM is ready ── */
function onDOMReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

/* ============================================================
   MODULE 1 — PAGE LOADER
   Premium spinner that dismisses with elegant transition
   ============================================================ */

function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  // Allow page to fully render before dismissing
  const minLoadTime = 1800; // ms — ensures logo + spinner are seen
  const startTime = Date.now();

  function hideLoader() {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, minLoadTime - elapsed);

    setTimeout(() => {
      loader.classList.add('loader-hidden');

      // After fade-out, run hero entrance animations
      setTimeout(() => {
        loader.style.display = 'none';
        initHeroEntrance();
      }, 650);
    }, remaining);
  }

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
    // Fallback: never block UX more than 4s
    setTimeout(hideLoader, 4000);
  }
}

/* ============================================================
   MODULE 2 — HERO ENTRANCE ANIMATIONS
   Sequential, staggered entrance with professional easing
   ============================================================ */

function initHeroEntrance() {
  const targets = [
    '.hero-badge',
    '.hero-title',
    '.hero-text',
    '.hero-ctas',
    '.hero-trust',
    '.hero-visual',
    '.floating-card-1',
    '.floating-card-2',
    '.floating-card-3',
  ];

  targets.forEach(selector => {
    const el = document.querySelector(selector);
    if (el) el.classList.add('anim-in');
  });

  // Start continuous animations after entrance delay
  setTimeout(initContinuousAnimations, 1400);
}

/* ============================================================
   MODULE 3 — CONTINUOUS FLOATING ANIMATION (Native JS)
   Replaces anime.js loop — pure requestAnimationFrame
   ============================================================ */

function initContinuousAnimations() {
  const cards = [
    { selector: '.floating-card-1', amp: 12, period: 4200, phase: 0 },
    { selector: '.floating-card-2', amp: -10, period: 4800, phase: 1.0 },
    { selector: '.floating-card-3', amp: 8,  period: 3700, phase: 0.5 },
  ];

  const startTime = performance.now();

  function loop(now) {
    const t = (now - startTime) / 1000; // seconds

    cards.forEach(({ selector, amp, period, phase }) => {
      const el = document.querySelector(selector);
      if (!el) return;

      // Sinusoidal float
      const y = amp * Math.sin((2 * Math.PI * t / (period / 1000)) + phase);
      // Use the float CSS class base transform + offset
      el.style.transform = `translateY(${y}px)`;
    });

    raf(loop);
  }

  raf(loop);

  // Also start gradient orb animation
  animateOrbParallax();
}

/* ============================================================
   MODULE 4 — PARTICLE SYSTEM
   Subtle floating particles using Canvas
   ============================================================ */

function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const heroSection = canvas.parentElement;

  function resize() {
    canvas.width  = heroSection.offsetWidth;
    canvas.height = heroSection.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Particle config — subtle, premium
  const PARTICLES = 38;
  const particles = [];

  for (let i = 0; i < PARTICLES; i++) {
    particles.push({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 1.5 + 0.3,
      vx:    (Math.random() - 0.5) * 0.18,
      vy:    (Math.random() - 0.5) * 0.18,
      alpha: Math.random() * 0.45 + 0.08,
      // color: brand orange or soft white
      hue:   Math.random() > 0.7 ? 'rgba(240,90,66,' : 'rgba(255,255,255,',
    });
  }

  // Mouse tracking for interactive particles
  let mx = -9999, my = -9999;
  const heroEl = document.querySelector('.hero-wrapper');
  if (heroEl) {
    heroEl.addEventListener('mousemove', e => {
      const rect = heroEl.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    }, { passive: true });
    heroEl.addEventListener('mouseleave', () => { mx = -9999; my = -9999; });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      // Subtle mouse repulsion
      const dx = mx - p.x;
      const dy = my - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120 * 0.4;
        p.vx -= (dx / dist) * force;
        p.vy -= (dy / dist) * force;
      }

      // Dampen velocity
      p.vx *= 0.98;
      p.vy *= 0.98;

      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.hue + p.alpha + ')';
      ctx.fill();
    });

    // Draw subtle connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          const alpha = (1 - d / 110) * 0.08;
          ctx.strokeStyle = `rgba(240,90,66,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function particleLoop() {
    drawParticles();
    raf(particleLoop);
  }

  // Only show after loader is gone
  canvas.style.opacity = '0';
  canvas.style.transition = 'opacity 1s ease';
  setTimeout(() => {
    canvas.style.opacity = '1';
    raf(particleLoop);
  }, 1000);
}

/* ============================================================
   MODULE 5 — 3D TILT / PARALLAX ON HERO VISUAL
   Native mouse tracking — no Anime.js required
   ============================================================ */

function initHeroParallax() {
  const wrapper = document.querySelector('.hero-wrapper');
  const orbs    = document.querySelectorAll('.hero-orb');
  const bgImage = document.querySelector('.hero-bg-image img');
  if (!wrapper) return;

  // Only on desktop
  if (window.innerWidth <= 768) return;

  wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2)  / (rect.width / 2);  // -1 to 1
    const y = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2); // -1 to 1

    // Parallax the background image very subtly (depth illusion)
    if (bgImage) {
      bgImage.style.transform = `scale(1.06) translate(${x * -6}px, ${y * -4}px)`;
    }

    // Move orbs
    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 9;
      orb.style.transform = `translate(${x * factor}px, ${y * factor * 0.6}px)`;
    });
  }, { passive: true });

  wrapper.addEventListener('mouseleave', () => {
    if (bgImage) {
      bgImage.style.transition = 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)';
      bgImage.style.transform  = 'scale(1.06) translate(0,0)';
      setTimeout(() => { bgImage.style.transition = ''; }, 1050);
    }
    orbs.forEach(orb => {
      orb.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      orb.style.transform  = '';
      setTimeout(() => { orb.style.transition = ''; }, 900);
    });
  });
}

/* ============================================================
   MODULE 6 — ORB SUBTLE MOUSE PARALLAX (for non-visual section)
   ============================================================ */

function animateOrbParallax() {
  // Orbs are CSS-animated via keyframes, no extra JS needed
  // This function is a hook for future extensions
}

/* ============================================================
   MODULE 7 — SCROLL-REVEAL (Intersection Observer)
   ============================================================ */

function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-fade');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      // Stagger siblings in same parent
      const siblings = entry.target.parentElement
        ? [...entry.target.parentElement.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-fade')]
        : [entry.target];

      const ownIndex = siblings.indexOf(entry.target);
      const delay = ownIndex * 80; // 80ms stagger

      setTimeout(() => {
        entry.target.classList.add('is-revealed');
      }, delay);

      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  elements.forEach(el => observer.observe(el));
}

/* ============================================================
   MODULE 8 — NAVBAR SCROLL EFFECT
   ============================================================ */

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;
  let ticking = false;

  function updateNavbar() {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      raf(updateNavbar);
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================================
   MODULE 9 — COUNTER ANIMATION
   Animates stat numbers when they enter viewport
   ============================================================ */

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const duration = 2000;
      const start = performance.now();

      function update(now) {
        const elapsed  = Math.min(now - start, duration);
        const progress = 1 - Math.pow(1 - elapsed / duration, 4); // easeOutQuart
        const value    = Math.round(progress * target);

        el.textContent = prefix + value.toLocaleString() + suffix;

        if (elapsed < duration) raf(update);
      }

      raf(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ============================================================
   MODULE 10 — MOUSE-REACTIVE GRADIENT BACKGROUND
   Subtle brand gradient that follows cursor in hero
   ============================================================ */

function initMouseGradient() {
  const hero = document.querySelector('.hero-wrapper');
  if (!hero || window.innerWidth <= 768) return;

  let mx = 50, my = 50; // percentage
  let cx = 50, cy = 50; // current (lerped)
  const SPEED = 0.04;

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    mx = ((e.clientX - rect.left) / rect.width)  * 100;
    my = ((e.clientY - rect.top)  / rect.height) * 100;
  }, { passive: true });

  function loop() {
    cx += (mx - cx) * SPEED;
    cy += (my - cy) * SPEED;

    hero.style.setProperty('--cursor-x', `${cx}%`);
    hero.style.setProperty('--cursor-y', `${cy}%`);

    raf(loop);
  }

  raf(loop);
}

/* ============================================================
   MODULE 11 — BUTTON MAGNETIC EFFECT (subtle)
   Premium micro-interaction: buttons follow cursor slightly
   ============================================================ */

function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');

  buttons.forEach(btn => {
    let animId;

    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });

    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx   = rect.left + rect.width / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) * 0.25;
      const dy   = (e.clientY - cy) * 0.25;

      btn.style.transform = `translate(${dx}px, ${dy}px) scale(1.04)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      btn.style.transform  = '';
    });
  });
}

/* ============================================================
   MODULE 12 — SERVICE CARD GLOW FOLLOW
   Radial gradient follows mouse inside each card
   ============================================================ */

function initCardGlow() {
  const cards = document.querySelectorAll('.service-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;

      card.style.setProperty('--gx', `${x}%`);
      card.style.setProperty('--gy', `${y}%`);
      card.style.backgroundImage = `
        radial-gradient(circle at ${x}% ${y}%, rgba(240,90,66,0.06) 0%, transparent 60%),
        linear-gradient(var(--c-dark-900), var(--c-dark-900))
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.backgroundImage = '';
    });
  });
}

/* ============================================================
   MODULE 13 — HERO BADGE LIVE PULSE TEXT
   Cycles through status messages
   ============================================================ */

function initBadgePulse() {
  const badge = document.querySelector('.hero-badge-text');
  if (!badge) return;

  const messages = [
    'Unidades Nuevas 2024',
    'Disponibilidad 24/7',
    'Viajes MX & USA',
    'Facturamos'
  ];

  let i = 0;

  setInterval(() => {
    badge.style.opacity = '0';
    badge.style.transform = 'translateY(6px)';
    badge.style.transition = 'opacity 0.3s, transform 0.3s';

    setTimeout(() => {
      i = (i + 1) % messages.length;
      badge.textContent = messages[i];
      badge.style.opacity = '1';
      badge.style.transform = 'translateY(0)';
    }, 320);
  }, 3500);
}

/* ============================================================
   MODULE 14 — SCROLL PROGRESS INDICATOR
   Thin brand-color bar at very top
   ============================================================ */

function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const progress   = (scrollTop / docHeight) * 100;
    bar.style.width  = `${progress}%`;
  }, { passive: true });
}

/* ============================================================
   MODULE 14 — WORD CYCLING ANIMATION
   Vertical slide-in / slide-out for one word in the hero title
   Inspired by Stripe / Linear / Vercel hero animations
   ============================================================ */

function initWordCycle() {
  const slot    = document.getElementById('word-cycle');
  const wrapper = document.querySelector('.word-cycle-wrapper');
  if (!slot || !wrapper) return;

  // Words that cycle — all make sense in "Tu [word] / nuestra pasión."
  const words = [
    'viaje,',
    'traslado,',
    'ruta,',
    'destino,',
    'aventura,',
    'confort,',
  ];

  let currentIndex = 0;
  let isAnimating  = false;

  // Pre-measure the widest word so the slot never resizes (avoids layout shift)
  function measureMaxWidth() {
    const h1 = slot.closest('h1');
    if (!h1) return 0;

    const tempEl = document.createElement('span');
    const h1Style = getComputedStyle(h1);
    tempEl.style.cssText = `
      position: absolute; visibility: hidden; white-space: nowrap;
      font-size: ${h1Style.fontSize};
      font-weight: ${h1Style.fontWeight};
      letter-spacing: ${h1Style.letterSpacing};
      font-family: ${h1Style.fontFamily};
    `;
    document.body.appendChild(tempEl);

    let maxWidth = 0;
    words.forEach(w => {
      tempEl.textContent = w;
      maxWidth = Math.max(maxWidth, tempEl.offsetWidth);
    });

    document.body.removeChild(tempEl);
    return maxWidth;
  }

  // Set the slot's fixed dimensions so it never reflows
  function initSlot() {
    const h1 = slot.closest('h1');
    if (!h1) return;

    const lineH = parseFloat(getComputedStyle(h1).lineHeight);
    if (lineH) {
      slot.style.height     = `${lineH}px`;
      slot.style.lineHeight = `${lineH}px`;
    }

    const w = measureMaxWidth();
    slot.style.minWidth    = `${w + 8}px`;
    wrapper.style.minWidth = `${w + 8}px`;
  }

  function cycleWord() {
    if (isAnimating) return;
    isAnimating = true;

    const currentEl = slot.querySelector('.word-current');
    if (!currentEl) { isAnimating = false; return; }

    // Advance to next word
    currentIndex = (currentIndex + 1) % words.length;

    // Create incoming element
    const nextEl = document.createElement('span');
    nextEl.className   = 'word-item word-entering';
    nextEl.textContent = words[currentIndex];
    slot.appendChild(nextEl);

    // Trigger exit on current word
    currentEl.classList.remove('word-current');
    currentEl.classList.add('word-leaving');

    // Clean up exiting word after animation
    currentEl.addEventListener('animationend', () => {
      currentEl.remove();
    }, { once: true });

    // Mark incoming word as current after its animation
    nextEl.addEventListener('animationend', () => {
      nextEl.classList.remove('word-entering');
      nextEl.classList.add('word-current');
      isAnimating = false;
    }, { once: true });
  }

  // Start after hero entrance completes
  setTimeout(() => {
    initSlot();
    window.addEventListener('resize', initSlot, { passive: true });
    // Cycle every 2.5 seconds
    setInterval(cycleWord, 2500);
  }, 2000);
}

/* ============================================================
   BOOT — Initialize All Modules
   ============================================================ */

onDOMReady(() => {
  // 1. Show premium loader immediately
  initLoader();

  // 2. Initialize particle canvas (starts drawing after loader hides)
  initParticles();

  // 3. 3D parallax on hero visual (orbs only now — no visual-inner panel)
  initHeroParallax();

  // 4. Mouse gradient follow
  initMouseGradient();

  // 5. Scroll-triggered reveals
  initScrollReveal();

  // 6. Navbar scroll behavior
  initNavbar();

  // 7. Counter animations
  initCounters();

  // 8. Magnetic button effect
  initMagneticButtons();

  // 9. Card glow on hover
  initCardGlow();

  // 10. Badge cycling text
  initBadgePulse();

  // 11. Scroll progress bar
  initScrollProgress();

  // 12. Word cycling in hero title
  initWordCycle();

  // 13. Log
  console.log('%cSonora Shuttle & Tours — Enterprise UI Loaded',
    'color: #F05A42; font-weight: 800; font-size: 14px; font-family: Inter, sans-serif;');
});