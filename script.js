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
    var selectors = ['.about-text', '.about-image', '.suite-card', '.garden-text', '.garden-image', '.dining-card', '.wellness-text', '.wellness-image', '.exp-card', '.testimonial-card', '.contact-info', '.contact-form-wrapper', '.section-header'];
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
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var subject = encodeURIComponent('Reservation Request - Villa Pomona - ' + form.name.value);
        var body = encodeURIComponent(
            'Reservation Request\n\n' +
            'Name: ' + form.name.value + '\n' +
            'Email: ' + form.email.value + '\n' +
            'Check-in: ' + form.checkin.value + '\n' +
            'Check-out: ' + form.checkout.value + '\n' +
            'Suite: ' + (form.suite.value || 'Not specified') + '\n' +
            'Guests: ' + form.guests.value + '\n' +
            'Special Requests: ' + (form.message.value || 'None')
        );
        window.location.href = 'mailto:info@villapomona.si?subject=' + subject + '&body=' + body;
        showFormConfirmation(form);
    });
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
