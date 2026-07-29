document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollAnimations();
    initMobileNav();
    initBookingForm();
    initSmoothScroll();
    initParallax();
    initFooterYear();
    initAvailabilityLazyLoad();
    initMapLoad();
});

var FORMSPREE_FORM_ID = 'FORMSPREE_FORM_ID'; // TODO(user): replace with your Formspree form ID
var NIGHTLY_RATES = {
    'Bedroom 101': 170,
    'Bedroom 102': 210,
    'Bedroom 103': 250,
    'Pool House': 390,
    'Entire Villa Pomona': 980
};
var TRANSFER_RATES = { 'lju': 60, 'klu': 90 };

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

function initBookingForm() {
    var form = document.getElementById('bookingForm');
    if (!form) return;
    var today = new Date().toISOString().split('T')[0];
    var checkinInput = document.getElementById('checkin');
    var checkoutInput = document.getElementById('checkout');
    var suiteInput = document.getElementById('suite');
    var transferInput = document.getElementById('transfer');
    var priceEstimate = document.getElementById('priceEstimate');
    if (checkinInput) {
        checkinInput.setAttribute('min', today);
        checkinInput.addEventListener('change', function() {
            if (checkoutInput && checkinInput.value) {
                checkoutInput.setAttribute('min', checkinInput.value);
            }
            updatePriceEstimate();
        });
    }
    if (checkoutInput) {
        checkoutInput.addEventListener('change', updatePriceEstimate);
    }
    if (suiteInput) {
        suiteInput.addEventListener('change', updatePriceEstimate);
    }
    if (transferInput) {
        transferInput.addEventListener('change', updatePriceEstimate);
    }
    function updatePriceEstimate() {
        if (!priceEstimate) return;
        var checkin = checkinInput ? checkinInput.value : '';
        var checkout = checkoutInput ? checkoutInput.value : '';
        var suite = suiteInput ? suiteInput.value : '';
        var transfer = transferInput ? transferInput.value : 'none';
        if (!checkin || !checkout || !suite || !NIGHTLY_RATES[suite]) {
            priceEstimate.style.display = 'none';
            return;
        }
        var nights = Math.max(0, (new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24));
        if (!nights || nights <= 0) {
            priceEstimate.style.display = 'none';
            return;
        }
        var roomTotal = nights * NIGHTLY_RATES[suite];
        var transferCost = TRANSFER_RATES[transfer] || 0;
        var total = roomTotal + transferCost;
        var parts = ['Estimated total: <strong>€' + total + '</strong> (' + nights + ' night' + (nights !== 1 ? 's' : '') + ' × €' + NIGHTLY_RATES[suite] + '/night'];
        if (transferCost > 0) {
            parts.push(' + €' + transferCost + ' transfer');
        }
        parts.push(')');
        priceEstimate.innerHTML = parts.join('');
        priceEstimate.style.display = 'block';
    }
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        var data = new URLSearchParams(new FormData(form));

        var suite = form.suite ? form.suite.value : '';
        var transfer = form.transfer ? form.transfer.value : 'none';
        var priceStr = '';
        var checkinVal = form.checkin ? form.checkin.value : '';
        var checkoutVal = form.checkout ? form.checkout.value : '';
        if (checkinVal && checkoutVal && suite && NIGHTLY_RATES[suite]) {
            var nights = Math.max(0, (new Date(checkoutVal) - new Date(checkinVal)) / (1000 * 60 * 60 * 24));
            if (nights > 0) {
                var roomTotal = nights * NIGHTLY_RATES[suite];
                var transferCost = TRANSFER_RATES[transfer] || 0;
                priceStr = '\nPrice Estimate: €' + (roomTotal + transferCost) + ' (' + nights + ' nights × €' + NIGHTLY_RATES[suite] + '/night';
                if (transferCost > 0) priceStr += ' + €' + transferCost + ' transfer';
                priceStr += ')\n';
            }
        }

        var subject = 'Reservation Request - Villa Pomona - ' + (form.name.value || '');
        var body = 'Reservation Request\n\n' +
            'Name: ' + (form.name.value || '') + '\n' +
            'Email: ' + (form.email.value || '') + '\n' +
            'Check-in: ' + (checkinVal || '') + '\n' +
            'Check-out: ' + (checkoutVal || '') + '\n' +
            'Suite: ' + (suite || 'Not specified') + '\n' +
            'Guests: ' + (form.guests.value || '') + '\n' +
            'Children: ' + (form.children ? form.children.value : '0') + '\n' +
            'Airport Transfer: ' + (transfer || 'none') + '\n' +
            priceStr +
            'Special Requests: ' + (form.message.value || 'None');

        fetch('https://formspree.io/f/' + FORMSPREE_FORM_ID, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: data.toString()
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

function initAvailabilityLazyLoad() {
    var widget = document.getElementById('availabilityWidget');
    if (!widget) return;
    // Unavailable dates (YYYY-MM-DD format) — update these manually or connect to a channel manager
    var unavailableDates = [];
    // Initialize calendar
    var calMonthEl = document.getElementById('calMonth');
    var calGrid = document.getElementById('calGrid');
    var calPrev = document.getElementById('calPrev');
    var calNext = document.getElementById('calNext');
    if (!calMonthEl || !calGrid || !calPrev || !calNext) return;
    var today = new Date();
    today.setHours(0,0,0,0);
    var viewYear = today.getFullYear();
    var viewMonth = today.getMonth();
    var checkIn = null;
    var checkOut = null;
    var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    function render() {
        calMonthEl.textContent = monthNames[viewMonth] + ' ' + viewYear;
        // Remove old day cells but keep headers
        var existing = calGrid.querySelectorAll('.cal-day');
        for (var i = 0; i < existing.length; i++) existing[i].remove();
        var firstDay = new Date(viewYear, viewMonth, 1);
        var lastDay = new Date(viewYear, viewMonth + 1, 0);
        var startDow = (firstDay.getDay() + 6) % 7; // Monday=0
        for (var d = 0; d < startDow; d++) {
            var empty = document.createElement('span');
            empty.className = 'cal-day empty';
            calGrid.appendChild(empty);
        }
        for (var day = 1; day <= lastDay.getDate(); day++) {
            var cell = document.createElement('span');
            cell.className = 'cal-day';
            cell.textContent = day;
            var cellDate = new Date(viewYear, viewMonth, day);
            cellDate.setHours(0,0,0,0);
            var dateStr = viewYear + '-' + String(viewMonth+1).padStart(2,'0') + '-' + String(day).padStart(2,'0');
            if (cellDate < today) {
                cell.classList.add('past');
            } else if (unavailableDates.indexOf(dateStr) !== -1) {
                cell.classList.add('unavailable');
            } else {
                cell.setAttribute('data-date', dateStr);
                cell.addEventListener('click', (function(cd, ds) { return function() { selectDate(ds, cd); }; })(cellDate, dateStr));
            }
            if (cellDate.getTime() === today.getTime()) cell.classList.add('today');
            if (checkIn && cellDate.getTime() === checkIn.getTime()) cell.classList.add('selected');
            if (checkOut && cellDate.getTime() === checkOut.getTime()) cell.classList.add('selected');
            if (checkIn && checkOut && cellDate > checkIn && cellDate < checkOut) cell.classList.add('in-range');
            calGrid.appendChild(cell);
        }
    }
    function selectDate(dateStr, cellDate) {
        if (!checkIn || (checkIn && checkOut)) {
            checkIn = cellDate;
            checkOut = null;
        } else if (cellDate > checkIn) {
            // Check no unavailable dates in range
            var d = new Date(checkIn);
            var blocked = false;
            while (d < cellDate) {
                var ds = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
                if (unavailableDates.indexOf(ds) !== -1) { blocked = true; break; }
                d.setDate(d.getDate() + 1);
            }
            if (blocked) { checkIn = cellDate; checkOut = null; }
            else { checkOut = cellDate; syncFormDates(); }
        } else {
            checkIn = cellDate;
            checkOut = null;
        }
        render();
    }
    function syncFormDates() {
        if (checkIn) {
            var ci = document.getElementById('checkin');
            if (ci) ci.value = checkIn.getFullYear() + '-' + String(checkIn.getMonth()+1).padStart(2,'0') + '-' + String(checkIn.getDate()).padStart(2,'0');
        }
        if (checkOut) {
            var co = document.getElementById('checkout');
            if (co) co.value = checkOut.getFullYear() + '-' + String(checkOut.getMonth()+1).padStart(2,'0') + '-' + String(checkOut.getDate()).padStart(2,'0');
        }
    }
    calPrev.addEventListener('click', function() {
        viewMonth--;
        if (viewMonth < 0) { viewMonth = 11; viewYear--; }
        render();
    });
    calNext.addEventListener('click', function() {
        viewMonth++;
        if (viewMonth > 11) { viewMonth = 0; viewYear++; }
        render();
    });
    render();
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