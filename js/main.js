/* =====================================================
   Jan-Richard Wichmann – Portfolio
   main.js
   ===================================================== */

'use strict';

/* =====================================================
   1. NAVBAR – Scroll effect & active link tracking
   ===================================================== */
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-link');
const sections  = document.querySelectorAll('section[id]');

function updateNavbar() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

function updateActiveLink() {
  let current = '';
  sections.forEach((section) => {
    const top    = section.offsetTop - 120;
    const bottom = top + section.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', () => {
  updateNavbar();
  updateActiveLink();
}, { passive: true });

updateNavbar();

/* =====================================================
   2. MOBILE NAV – Hamburger toggle
   ===================================================== */
const hamburger   = document.getElementById('hamburger');
const navLinksEl  = document.getElementById('navLinks');

// Create overlay element
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
  if (navLinksEl.classList.contains('open')) {
    closeMenu();
  } else {
    openMenu();
  }
});

overlay.addEventListener('click', closeMenu);

// Close on nav link click
navLinksEl.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinksEl.classList.contains('open')) {
    closeMenu();
  }
});

/* =====================================================
   3. TYPING EFFECT – Hero subtitle
   ===================================================== */
const typingEl = document.getElementById('typingText');
const phrases  = [
  'Fachinformatiker',
  'Backend-Entwickler',
  'Java-Enthusiast',
  'Problem-Solver',
  'Full-Stack Developer',
  'DevOps Fan',
];

let phraseIndex = 0;
let charIndex   = 0;
let isDeleting  = false;
let typingTimer = null;

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    charIndex--;
    typingEl.textContent = currentPhrase.substring(0, charIndex);
  } else {
    charIndex++;
    typingEl.textContent = currentPhrase.substring(0, charIndex);
  }

  let delay = isDeleting ? 60 : 110;

  if (!isDeleting && charIndex === currentPhrase.length) {
    delay = 1800; // pause at end
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }

  typingTimer = setTimeout(typeEffect, delay);
}

// Start typing after hero animation
setTimeout(typeEffect, 900);

/* =====================================================
   4. SCROLL REVEAL – Fade-in on scroll
   ===================================================== */
const revealEls = document.querySelectorAll('.reveal, .reveal-up');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = Array.from(
          entry.target.parentElement.querySelectorAll('.reveal-up, .reveal')
        );
        const delay = siblings.indexOf(entry.target) * 80;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);

revealEls.forEach((el) => revealObserver.observe(el));

/* =====================================================
   5. SKILL BARS – Animate on scroll into view
   ===================================================== */
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const width = el.getAttribute('data-width');
        el.style.width = `${width}%`;
        skillObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.3 }
);

skillFills.forEach((fill) => skillObserver.observe(fill));

/* =====================================================
   6. COUNTER ANIMATION – Stats in About section
   ===================================================== */
const statNumbers = document.querySelectorAll('.stat-number[data-target]');

function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1400;
  const start    = performance.now();

  function step(timestamp) {
    const elapsed  = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

statNumbers.forEach((el) => counterObserver.observe(el));

/* =====================================================
   7. CONTACT FORM – mailto fallback
   ===================================================== */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = (document.getElementById('contactName').value    || '').trim();
    const email   = (document.getElementById('contactEmail').value   || '').trim();
    const subject = (document.getElementById('contactSubject').value || '').trim();
    const message = (document.getElementById('contactMessage').value || '').trim();

    if (!name || !email || !subject || !message) {
      return;
    }

    const to      = 'janwichmann12@gmail.com';
    const subEnc  = encodeURIComponent(subject);
    const bodyEnc = encodeURIComponent(
      `Hallo Jan-Richard,\n\nName: ${name}\nE-Mail: ${email}\n\n${message}`
    );

    window.location.href = `mailto:${to}?subject=${subEnc}&body=${bodyEnc}`;
  });
}

/* =====================================================
   8. SMOOTH SCROLL – Offset for fixed navbar
   ===================================================== */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navHeight = navbar.offsetHeight;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});
