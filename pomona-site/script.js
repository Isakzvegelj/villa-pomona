document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollAnimations();
    initMobileNav();
    initBookingForm();
    initSmoothScroll();
    initParallax();
});

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
    toggle.addEventListener('click', function() {
        toggle.classList.toggle('active');
        links.classList.toggle('active');
    });
    var linkAnchors = links.querySelectorAll('a');
    for (var i = 0; i < linkAnchors.length; i++) {
        linkAnchors[i].addEventListener('click', function() {
            toggle.classList.remove('active');
            links.classList.remove('active');
        });
    }
    document.addEventListener('click', function(e) {
        if (!toggle.contains(e.target) && !links.contains(e.target)) {
            toggle.classList.remove('active');
            links.classList.remove('active');
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

function initBookingForm() {
    var form = document.getElementById('bookingForm');
    if (!form) return;
    var today = new Date().toISOString().split('T')[0];
    var checkinInput = document.getElementById('checkin');
    var checkoutInput = document.getElementById('checkout');
    if (checkinInput) {
        checkinInput.setAttribute('min', today);
        checkinInput.addEventListener('change', function() {
            if (checkoutInput && checkinInput.value) {
                checkoutInput.setAttribute('min', checkinInput.value);
            }
        });
    }
    var FORM_ENDPOINT = 'https://formspree.io/f/your-form-id-here';

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        var formData = {
            name: form.name.value,
            email: form.email.value,
            checkin: form.checkin.value,
            checkout: form.checkout.value,
            suite: form.suite.value || 'Not specified',
            guests: form.guests.value,
            children: form.children ? form.children.value : '0',
            transfer: form.transfer ? form.transfer.value : 'none',
            message: form.message.value || 'None'
        };

        var subject = 'Reservation Request - Villa Pomona - ' + formData.name;
        var body = 'Reservation Request\n\n' +
            'Name: ' + formData.name + '\n' +
            'Email: ' + formData.email + '\n' +
            'Check-in: ' + formData.checkin + '\n' +
            'Check-out: ' + formData.checkout + '\n' +
            'Suite: ' + formData.suite + '\n' +
            'Guests: ' + formData.guests + '\n' +
            'Children: ' + formData.children + '\n' +
            'Airport Transfer: ' + formData.transfer + '\n' +
            'Special Requests: ' + formData.message;

        fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(function(response) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Reservation Request';
            if (response.ok) {
                showFormConfirmation(form);
            } else {
                mailtoFallback(subject, body, form);
            }
        })
        .catch(function() {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Reservation Request';
            mailtoFallback(subject, body, form);
        });
    });

    function mailtoFallback(subject, body, form) {
        window.location.href = 'mailto:evita.vilebled@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        showFormConfirmation(form);
    }
}

function showFormConfirmation(form) {
    var originalHTML = form.innerHTML;
    form.innerHTML = '<div style="text-align:center;padding:40px 20px;">' +
        '<div style="font-size:3rem;margin-bottom:16px;">&#127800;</div>' +
        '<h3 style="font-family:var(--font-serif);font-size:1.5rem;color:var(--green-900);margin-bottom:12px;">Thank You!</h3>' +
        '<p style="color:var(--neutral-600);line-height:1.6;">Your reservation request has been sent. We\'ll respond within 24 hours.</p>' +
        '</div>';
    form.setAttribute('data-original-html', originalHTML);
}

function initParallax() {
    var hero = document.querySelector('.hero-content');
    if (!hero) return;
    window.addEventListener('scroll', function() {
        var scrolled = window.pageYOffset;
        if (scrolled < window.innerHeight) {
            hero.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
            hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
        }
    }, { passive: true });
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
    items.forEach(function(item, i){
        var img = item.querySelector('img');
        var label = item.querySelector('.gallery-label');
        images.push({src: img.src, alt: img.alt, label: label ? label.textContent : ''});
    });
    function openLightbox(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
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