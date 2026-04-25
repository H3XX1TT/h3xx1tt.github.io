/* =====================================================
   Jan-Richard Wichmann – Portfolio
   main.js
   ===================================================== */

'use strict';

/* =====================================================
   NAVBAR – Scroll effect & active link tracking
   ===================================================== */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}

function updateActiveLink() {
  let current = '';
  sections.forEach((section) => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top && window.scrollY < top + section.offsetHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', () => {
  updateNavbar();
  updateActiveLink();
}, { passive: true });

updateNavbar();

/* =====================================================
   MOBILE NAV – Hamburger toggle
   ===================================================== */
const hamburger  = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

const overlay = document.createElement('div');
overlay.className = 'nav-overlay';
document.body.appendChild(overlay);

function openMenu() {
  navLinksEl.classList.add('open');
  hamburger.classList.add('active');
  hamburger.setAttribute('aria-expanded', 'true');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  navLinksEl.classList.remove('open');
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  navLinksEl.classList.contains('open') ? closeMenu() : openMenu();
});

overlay.addEventListener('click', closeMenu);

navLinksEl.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinksEl.classList.contains('open')) closeMenu();
});

/* =====================================================
   SCROLL REVEAL – Fade-in on scroll
   ===================================================== */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const siblings = Array.from(
        entry.target.parentElement.querySelectorAll('.reveal')
      );
      const delay = siblings.indexOf(entry.target) * 60;

      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

revealEls.forEach((el) => revealObserver.observe(el));

/* =====================================================
   CONTACT FORM – mailto handler
   ===================================================== */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = (document.getElementById('contactName').value    || '').trim();
    const email   = (document.getElementById('contactEmail').value   || '').trim();
    const subject = (document.getElementById('contactSubject').value || '').trim();
    const message = (document.getElementById('contactMessage').value || '').trim();

    if (!name || !email || !subject || !message) return;

    const to      = 'janwichmann12@gmail.com';
    const subEnc  = encodeURIComponent(subject);
    const bodyEnc = encodeURIComponent(
      `Hallo Jan-Richard,\n\nName: ${name}\nE-Mail: ${email}\n\n${message}`
    );

    window.location.href = `mailto:${to}?subject=${subEnc}&body=${bodyEnc}`;
  });
}

/* =====================================================
   SMOOTH SCROLL – Offset for fixed navbar
   ===================================================== */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navHeight = navbar.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* =====================================================
   SCROLL PROGRESS BAR
   ===================================================== */
const progressBar = document.getElementById('scroll-progress');

if (progressBar) {
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max > 0) progressBar.style.transform = `scaleX(${window.scrollY / max})`;
  }, { passive: true });
}

/* =====================================================
   CURSOR SPOTLIGHT
   ===================================================== */
const spotlight = document.getElementById('cursor-spotlight');

if (spotlight && window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', (e) => {
    requestAnimationFrame(() => {
      spotlight.style.background =
        `radial-gradient(700px at ${e.clientX}px ${e.clientY}px, rgba(200,250,95,0.05), transparent 80%)`;
    });
  }, { passive: true });
}

/* =====================================================
   TYPING ANIMATION – Hero role
   ===================================================== */
const heroRole = document.querySelector('.hero-role');

if (heroRole) {
  const originalText = heroRole.textContent.trim();
  heroRole.textContent = '';

  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  heroRole.appendChild(cursor);

  let charIndex = 0;
  const SPEED = 42;
  const START_DELAY = 500;

  function typeNextChar() {
    if (charIndex < originalText.length) {
      heroRole.insertBefore(document.createTextNode(originalText[charIndex++]), cursor);
      setTimeout(typeNextChar, SPEED);
    } else {
      setTimeout(() => {
        if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
      }, 2800);
    }
  }

  setTimeout(typeNextChar, START_DELAY);
}

/* =====================================================
   COUNTER ANIMATION – Fact values with data-count
   ===================================================== */
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  if (isNaN(target)) return;

  const duration = 1400;
  let startTime = null;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function tick(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    el.textContent = Math.floor(easeOutCubic(progress) * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const counterEls = document.querySelectorAll('[data-count]');

if (counterEls.length) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );
  counterEls.forEach((el) => counterObserver.observe(el));
}

/* =====================================================
   MAGNETIC BUTTON EFFECT
   ===================================================== */
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.btn-arrow').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width  / 2) * 0.18;
      const y = (e.clientY - rect.top  - rect.height / 2) * 0.18;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.45s cubic-bezier(0.16,1,0.3,1)';
      btn.style.transform  = 'translate(0, 0)';
      setTimeout(() => { btn.style.transition = ''; }, 450);
    });
  });
}
