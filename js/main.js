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
