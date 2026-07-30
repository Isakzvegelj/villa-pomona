document.addEventListener('DOMContentLoaded', function() {
    initDarkMode();
    initNavigation();
    initScrollAnimations();
    initMobileNav();
    initSmoothScroll();
    initParallax();
    initFooterYear();
    initMapLoad();
});

function initDarkMode() {
    var toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    var saved = localStorage.getItem('theme');
    if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    toggle.addEventListener('click', function() {
        var current = document.documentElement.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
}

function initFooterYear() {
    var yearEl = document.getElementById('footerYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

function initNavigation() {
    var nav = document.getElementById('nav');
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });
}

function initMobileNav() {
    var toggle = document.getElementById('navToggle');
    var links = document.getElementById('navLinks');
    if (!toggle || !links) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', function() {
        var isActive = toggle.classList.toggle('active');
        links.classList.toggle('active');
        toggle.setAttribute('aria-expanded', isActive);
    });
    var linkAnchors = links.querySelectorAll('a');
    for (var i = 0; i < linkAnchors.length; i++) {
        linkAnchors[i].addEventListener('click', function() {
            toggle.classList.remove('active');
            links.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        });
    }
    document.addEventListener('click', function(e) {
        if (!toggle.contains(e.target) && !links.contains(e.target)) {
            toggle.classList.remove('active');
            links.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
}

function initScrollAnimations() {
    var selectors = ['.about-text', '.about-image', '.suite-card', '.amenity-card', '.testimonial-card', '.contact-info', '.contact-form-wrapper', '.section-header', '.gallery-item'];
    for (var s = 0; s < selectors.length; s++) {
        var elements = document.querySelectorAll(selectors[s]);
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.add('reveal');
            elements[i].style.transitionDelay = (i * 0.1) + 's';
        }
    }
    var observer = new IntersectionObserver(function(entries) {
        for (var e = 0; e < entries.length; e++) {
            if (entries[e].isIntersecting) {
                entries[e].target.classList.add('visible');
            }
        }
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    var reveals = document.querySelectorAll('.reveal');
    for (var r = 0; r < reveals.length; r++) {
        observer.observe(reveals[r]);
    }
}

function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < anchors.length; i++) {
        anchors[i].addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                var navHeight = document.getElementById('nav').offsetHeight;
                var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    }
}

function initParallax() {
    var hero = document.querySelector('.hero-content');
    if (!hero) return;
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    window.addEventListener('scroll', function() {
        var scrolled = window.pageYOffset;
        if (scrolled < window.innerHeight) {
            hero.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
            hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
        }
    }, { passive: true });
}

function initMapLoad() {
    var loadBtn = document.getElementById('loadMapBtn');
    var mapContainer = document.getElementById('mapContainer');
    var mapTrigger = document.getElementById('mapTrigger');
    if (!loadBtn || !mapContainer || !mapTrigger) return;
    loadBtn.addEventListener('click', function() {
        var iframe = document.createElement('iframe');
        iframe.className = 'map-iframe';
        iframe.src = 'https://maps.google.com/maps?q=Crtomirova+ulica+2,+Bled&output=embed';
        iframe.title = 'Map of Villa Pomona location in Bled';
        iframe.allow = 'fullscreen';
        iframe.loading = 'lazy';
        mapContainer.innerHTML = '';
        mapContainer.appendChild(iframe);
    });
}

window.addEventListener('load', function() {
    var reveals = document.querySelectorAll('.reveal');
    for (var i = 0; i < reveals.length; i++) {
        var rect = reveals[i].getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) {
            reveals[i].classList.add('visible');
        }
    }
});

(function(){
    var items = document.querySelectorAll('.gallery-item');
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImage');
    var lightboxCaption = document.getElementById('lightboxCaption');
    var lightboxCounter = document.getElementById('lightboxCounter');
    var currentIndex = 0;
    var totalItems = items.length;
    var images = [];
    var lastFocused = null;
    items.forEach(function(item, i){
        var img = item.querySelector('img');
        var label = item.querySelector('.gallery-label');
        images.push({src: img.src, alt: img.alt, label: label ? label.textContent : ''});
    });
    function openLightbox(index) {
        lastFocused = document.activeElement;
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.getElementById('lightboxClose').focus();
    }
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        if (lastFocused) { lastFocused.focus(); lastFocused = null; }
    }
    function updateLightbox() {
        var img = images[currentIndex];
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = img.label;
        lightboxCounter.textContent = (currentIndex + 1) + ' / ' + totalItems;
    }
    function nextImage() { currentIndex = (currentIndex + 1) % totalItems; updateLightbox(); }
    function prevImage() { currentIndex = (currentIndex - 1 + totalItems) % totalItems; updateLightbox(); }
    items.forEach(function(item, i) {
        item.addEventListener('click', function() { openLightbox(i); });
    });
    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.getElementById('lightboxNext').addEventListener('click', function(e) { e.stopPropagation(); nextImage(); });
    document.getElementById('lightboxPrev').addEventListener('click', function(e) { e.stopPropagation(); prevImage(); });
    lightbox.addEventListener('click', function(e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });
    var touchStartX = 0;
    lightbox.addEventListener('touchstart', function(e) { touchStartX = e.changedTouches[0].screenX; }, {passive: true});
    lightbox.addEventListener('touchend', function(e) {
        var diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextImage();
            else prevImage();
        }
    }, {passive: true});
})();
