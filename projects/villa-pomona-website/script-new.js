/* Villa Pomona — Main JavaScript */
(function() {
  'use strict';
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  // Navbar
  const navbar = $('#navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }, { passive: true });

  // Mobile menu
  const hamburger = $('#hamburger');
  const navMenu = $('#navMenu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    $$('.nav-link').forEach(l => l.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }));
  }

  // Hero slider
  const heroSlides = $$('.hero-slide');
  let curSlide = 0;
  if (heroSlides.length) {
    setInterval(() => {
      heroSlides.forEach(s => s.classList.remove('active'));
      curSlide = (curSlide + 1) % heroSlides.length;
      heroSlides[curSlide].classList.add('active');
    }, 5000);
  }

  // Testimonials
  const testimonials = $$('.testimonial');
  const dots = $$('.testimonial-dots .dot');
  let curTest = 0;
  function showTest(i) {
    testimonials.forEach(t => t.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    if (testimonials[i]) testimonials[i].classList.add('active');
    if (dots[i]) dots[i].classList.add('active');
    curTest = i;
  }
  dots.forEach(d => d.addEventListener('click', () => showTest(parseInt(d.dataset.index))));
  if (testimonials.length) setInterval(() => showTest((curTest + 1) % testimonials.length), 6000);

  // Lightbox
  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightboxImg');
  const galleryImgs = $$('.gallery-item img');
  let curLB = 0;
  galleryImgs.forEach((img, i) => {
    img.parentElement.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      curLB = i;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
  function lbClose() { lightbox.classList.remove('active'); document.body.style.overflow = ''; }
  function lbPrev() { curLB = (curLB - 1 + galleryImgs.length) % galleryImgs.length; lightboxImg.src = galleryImgs[curLB].src; lightboxImg.alt = galleryImgs[curLB].alt; }
  function lbNext() { curLB = (curLB + 1) % galleryImgs.length; lightboxImg.src = galleryImgs[curLB].src; lightboxImg.alt = galleryImgs[curLB].alt; }
  $('#lightboxClose').addEventListener('click', lbClose);
  $('#lightboxPrev').addEventListener('click', lbPrev);
  $('#lightboxNext').addEventListener('click', lbNext);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) lbClose(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') lbClose();
    if (e.key === 'ArrowLeft') lbPrev();
    if (e.key === 'ArrowRight') lbNext();
  });

  // Scroll reveal
  const revealEls = $$('.suite-card, .experience-card, .gallery-item, .about-grid, .booking-grid, .contact-grid, .footer-grid');
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  revealEls.forEach(el => { el.classList.add('reveal'); ro.observe(el); });

  // Language toggle
  const langToggle = $('#langToggle');
  let curLang = 'en';
  function switchLang(lang) {
    curLang = lang;
    if (langToggle) langToggle.textContent = lang === 'en' ? 'SL' : 'EN';
    $$('[data-en][data-sl]').forEach(el => { const t = el.getAttribute('data-' + lang); if (t) el.textContent = t; });
    document.documentElement.lang = lang;
  }
  if (langToggle) langToggle.addEventListener('click', () => switchLang(curLang === 'en' ? 'sl' : 'en'));

  // Booking form
  const checkIn = $('#checkIn');
  const checkOut = $('#checkOut');
  const today = new Date().toISOString().split('T')[0];
  if (checkIn) checkIn.min = today;
  if (checkOut) checkOut.min = today;
  if (checkIn) checkIn.addEventListener('change', () => {
    if (checkOut) {
      checkOut.min = checkIn.value;
      if (checkOut.value && checkOut.value <= checkIn.value) {
        const nd = new Date(checkIn.value); nd.setDate(nd.getDate() + 1);
        checkOut.value = nd.toISOString().split('T')[0];
      }
    }
  });
  const bookingForm = $('#bookingForm');
  if (bookingForm) bookingForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = bookingForm.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = curLang === 'en' ? '✓ Request Sent!' : '✓ Poslano!';
    btn.style.background = '#4a7c28';
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; bookingForm.reset(); }, 3000);
  });

  // Newsletter
  const nlForm = $('#newsletterForm');
  if (nlForm) nlForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = nlForm.querySelector('button');
    const orig = btn.textContent;
    btn.textContent = curLang === 'en' ? '✓ Subscribed!' : '✓ Naročeno!';
    btn.style.background = '#4a7c28';
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; nlForm.reset(); }, 3000);
  });

  // Smooth scroll
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', function(e) {
    const tgt = $(this.getAttribute('href'));
    if (tgt) {
      e.preventDefault();
      const top = tgt.getBoundingClientRect().top + window.scrollY - (navbar ? navbar.offsetHeight : 0) - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }));

  // Parallax
  const heroContent = $('.hero-content');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (sy < window.innerHeight && heroContent) {
      heroContent.style.transform = 'translateY(' + (sy * 0.3) + 'px)';
      heroContent.style.opacity = 1 - (sy / window.innerHeight) * 0.8;
    }
  }, { passive: true });

  console.log('🌿 Villa Pomona initialized');
})();
