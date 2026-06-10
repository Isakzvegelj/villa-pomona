document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initSuites();
    initScrollAnimations();
    initMobileNav();
    initBookingForm();
    initSmoothScroll();
    initParallax();
    initCookieConsent();
    initChatWidget();
    initLightbox();
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

function initSuites() {
    var grid = document.getElementById('suitesGrid');
    if (!grid) return;

    var suites = [
        {
            name: 'Pomona Heritage Suite',
            size: '55 m² • 2 guests',
            desc: 'The signature botanical suite with original parquet floors, hand-painted ceiling details, freestanding bathtub, and a reading nook overlooking the garden.',
            features: ['King-size bed', 'Garden view', 'Freestanding bathtub', 'Heritage details'],
            price: '€280',
            badge: 'Signature',
            icon: '🍎'
        },
        {
            name: 'Garden Suite',
            size: '45 m² • 2 guests',
            desc: 'A calm ground-floor retreat opening directly onto lavender beds and the botanical garden, perfect for morning coffee on your private terrace.',
            features: ['Queen-size bed', 'Private terrace', 'Rain shower', 'Garden access'],
            price: '€230',
            badge: '',
            icon: '🌿'
        },
        {
            name: 'Lakeview Deluxe',
            size: '50 m² • 2 guests',
            desc: 'Panoramic Lake Bled, island, and Julian Alps views through tall windows, with a balcony for sunset wine and mountain air.',
            features: ['King-size bed', 'Lake view', 'Balcony', 'Sitting area'],
            price: '€320',
            badge: 'Lake view',
            icon: '🏞️'
        },
        {
            name: 'Orchard Room',
            size: '35 m² • 2 guests',
            desc: 'A bright, intimate room inspired by Villa Pomona’s heritage apple and pear orchard, ideal for couples seeking quiet simplicity.',
            features: ['Queen-size bed', 'Orchard view', 'Walk-in shower', 'Garden-facing desk'],
            price: '€190',
            badge: '',
            icon: '🍐'
        },
        {
            name: 'Tower Suite',
            size: '60 m² • 2 guests',
            desc: 'Perched in the original tower with 360° Bled views, clawfoot tub, and a romantic atmosphere for anniversaries and special escapes.',
            features: ['King-size bed', '360° views', 'Clawfoot tub', 'Tower lounge'],
            price: '€350',
            badge: 'Most Popular',
            icon: '🗼'
        },
        {
            name: 'Greenhouse Suite',
            size: '42 m² • 2 guests',
            desc: 'A glassy, plant-filled suite beside the greenhouse, designed for guests who want sunrise light, herbs, and garden sounds outside the window.',
            features: ['Queen-size bed', 'Greenhouse access', 'Rain shower', 'Herb garden'],
            price: '€260',
            badge: 'Botanical',
            icon: '🪴'
        },
        {
            name: 'Fig Suite',
            size: '32 m² • 2 guests',
            desc: 'A cozy suite under the old fig tree with warm stone accents, a rainfall shower, and a quiet courtyard-facing reading chair.',
            features: ['Queen-size bed', 'Courtyard view', 'Rainfall shower', 'Reading chair'],
            price: '€180',
            badge: '',
            icon: '🍇'
        },
        {
            name: 'Olive Suite',
            size: '30 m² • 2 guests',
            desc: 'A serene single-level suite with olive-toned textiles, garden access, and a private entrance for low-key arrivals.',
            features: ['Queen-size bed', 'Private entrance', 'Garden access', 'Espresso station'],
            price: '€170',
            badge: 'Best Value',
            icon: '🫒'
        }
    ];

    grid.innerHTML = suites.map(function(suite, index) {
        var badge = suite.badge ? '<div class="suite-badge">' + suite.badge + '</div>' : '';
        return '<div class="suite-card reveal" style="transition-delay:' + (index * 0.08) + 's">' +
            '<div class="suite-image"><div class="placeholder-image suite-placeholder"><span>' + suite.icon + '</span></div>' + badge + '</div>' +
            '<div class="suite-info">' +
                '<h3>' + suite.name + '</h3>' +
                '<p class="suite-size">' + suite.size + '</p>' +
                '<p class="suite-desc">' + suite.desc + '</p>' +
                '<ul class="suite-features">' + suite.features.map(function(feature) { return '<li>' + feature + '</li>'; }).join('') + '</ul>' +
                '<div class="suite-price"><span class="price-from">from</span><span class="price-amount">' + suite.price + '</span><span class="price-night">/ night</span></div>' +
            '</div>' +
        '</div>';
    }).join('');
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
    var selectors = ['.about-text', '.about-image', '.suite-card', '.garden-text', '.garden-image', '.dining-card', '.wellness-text', '.wellness-image', '.exp-card', '.package-card', '.testimonial-card', '.contact-info', '.contact-form-wrapper', '.section-header'];
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

/* ============================================
   COOKIE CONSENT BANNER (GDPR)
   ============================================ */
function initCookieConsent() {
    var banner = document.getElementById('cookieConsent');
    if (!banner) return;
    var accepted = localStorage.getItem('cookie_consent');
    if (!accepted) {
        setTimeout(function() { banner.classList.add('visible'); }, 1500);
    }
    var acceptBtn = document.getElementById('cookieAccept');
    var declineBtn = document.getElementById('cookieDecline');
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            localStorage.setItem('cookie_consent', 'accepted');
            banner.classList.remove('visible');
        });
    }
    if (declineBtn) {
        declineBtn.addEventListener('click', function() {
            localStorage.setItem('cookie_consent', 'declined');
            banner.classList.remove('visible');
        });
    }
}

/* ============================================
   ARIA CONCIERGE CHAT WIDGET
   ============================================ */
function initChatWidget() {
    var chatBtn = document.getElementById('chatWidgetBtn');
    var chatPanel = document.getElementById('chatWidget');
    if (!chatBtn || !chatPanel) return;
    var chatMinimize = document.getElementById('chatWidgetMinimize');
    var chatMessages = document.getElementById('chatWidgetMessages');
    var chatInput = document.getElementById('chatWidgetInput');
    var chatSend = document.getElementById('chatWidgetSend');
    var convId = 'web_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    var isOpen = false;
    var isTyping = false;

    // Bot API endpoint — change this to the deployed Render URL
    var BOT_API = 'https://villa-pomona-bot.onrender.com/api/chat';

    function toggleChat() {
        isOpen = !isOpen;
        chatBtn.classList.toggle('open', isOpen);
        chatPanel.classList.toggle('open', isOpen);
        if (isOpen) {
            chatInput.focus();
        }
    }

    chatBtn.addEventListener('click', toggleChat);
    if (chatMinimize) {
        chatMinimize.addEventListener('click', function() {
            isOpen = false;
            chatBtn.classList.remove('open');
            chatPanel.classList.remove('open');
        });
    }

    function addMsg(text, role) {
        var div = document.createElement('div');
        div.className = 'chat-message ' + role;
        var avatar = document.createElement('span');
        avatar.className = 'chat-msg-avatar';
        avatar.textContent = role === 'bot' ? '\uD83C\uDF3F' : 'You';
        var content = document.createElement('div');
        content.className = 'chat-msg-content';
        content.textContent = text;
        div.appendChild(avatar);
        div.appendChild(content);
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTyping() {
        if (isTyping) return;
        isTyping = true;
        var div = document.createElement('div');
        div.className = 'chat-message bot';
        div.id = 'chatTyping';
        var avatar = document.createElement('span');
        avatar.className = 'chat-msg-avatar';
        avatar.textContent = '\uD83C\uDF3F';
        var dots = document.createElement('div');
        dots.className = 'chat-msg-typing';
        dots.innerHTML = '<span></span><span></span><span></span>';
        div.appendChild(avatar);
        div.appendChild(dots);
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function hideTyping() {
        isTyping = false;
        var el = document.getElementById('chatTyping');
        if (el) el.remove();
    }

    function sendMessage() {
        var text = chatInput.value.trim();
        if (!text || isTyping) return;
        addMsg(text, 'user');
        chatInput.value = '';
        chatSend.disabled = true;
        showTyping();

        var xhr = new XMLHttpRequest();
        xhr.open('POST', BOT_API, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.timeout = 15000;
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                hideTyping();
                chatSend.disabled = false;
                if (xhr.status === 200) {
                    try {
                        var data = JSON.parse(xhr.responseText);
                        if (data.replies) {
                            data.replies.forEach(function(reply) { addMsg(reply.content, 'bot'); });
                        } else if (data.response) {
                            addMsg(data.response, 'bot');
                        } else {
                            addMsg(getLocalResponse(text), 'bot');
                        }
                    } catch(e) {
                        addMsg(getLocalResponse(text), 'bot');
                    }
                } else {
                    addMsg(getLocalResponse(text), 'bot');
                }
                chatInput.focus();
            }
        };
        xhr.ontimeout = function() {
            hideTyping(); chatSend.disabled = false;
            addMsg(getLocalResponse(text), 'bot'); chatInput.focus();
        };
        xhr.onerror = function() {
            hideTyping(); chatSend.disabled = false;
            addMsg(getLocalResponse(text), 'bot'); chatInput.focus();
        };
        xhr.send(JSON.stringify({session_id: convId, conversation_id: convId, message: text}));
    }

    function getLocalResponse(q) {
        var ql = q.toLowerCase();
        if (/suite|room|stay|sleep|bed/i.test(ql)) {
            return "Villa Pomona has 8 distinctive botanical suites: Pomona Heritage Suite, Garden Suite, Lakeview Deluxe, Orchard Room, Tower Suite, Greenhouse Suite, Fig Suite, and Olive Suite. All include breakfast, WiFi, and free parking. Which one feels right for your stay?";
        }
        if (/book|reserve|reservation/i.test(ql)) {
            return "I'd love to help you book! You can reach us at info@villapomona.si or call +386 4 572 7880. You can also fill out the booking form on this page. What dates are you considering?";
        }
        if (/activ|do|see|visit|explore|thing/i.test(ql)) {
            return "Bled has so much to offer! Popular activities include: Bled Island & church, Bled Castle, Vintgar Gorge, lake cycling (6km loop), kayaking, paragliding, and day trips to Bohinj & Ljubljana. What sounds appealing?";
        }
        if (/restaur|food|eat|dine|dinner|lunch/i.test(ql)) {
            return "Great restaurants near Villa Pomona include: Restavracija 1906 (fine dining), Rožata (traditional Slovenian), Pizzeria Rustika, Sova Bled (wine bar), and Grand Hotel Toplice. All within 5 minutes!";
        }
        if (/spa|massage|wellness|relax|yoga/i.test(ql)) {
            return "Villa Pomona offers in-villa spa services: Classic Massage (€85), Deep Tissue (€95), Aromatherapy (€105), Hot Stone Therapy (€110), and Couples Massage (€180). We also have a traditional sauna and yoga sessions in the garden.";
        }
        if (/breakfast/i.test(ql)) {
            return "Breakfast is included! Served 7:30–10:30 in the dining room or on the terrace with garden views. Fresh pastries, local products, and options for dietary requirements.";
        }
        if (/parking|car|drive|transport/i.test(ql)) {
            return "Free private parking is available on-site. We're located at Cesta svobode 22, 4260 Bled. Airport transfer from Ljubljana (LJU) is available for €60 one way.";
        }
        if (/price|cost|how much|rate/i.test(ql)) {
            return "Our suites range from €170–€350/night depending on the suite and season. All include breakfast, WiFi, and parking. The Olive Suite starts at €170/night and the Tower Suite at €350/night.";
        }
        if (/cancel|refund|deposit|payment/i.test(ql)) {
            return "Free cancellation up to 7 days before arrival. A 30% deposit secures your booking. We accept Visa, Mastercard, Amex, bank transfer, and cash.";
        }
        if (/pet|dog|cat|animal/i.test(ql)) {
            return "Small pets are welcome upon prior arrangement. A cleaning fee of €30/night applies. Please let us know at the time of booking!";
        }
        if (/family|child|kid|baby/i.test(ql)) {
            return "Children of all ages are welcome! The Orchard Room, Greenhouse Suite, and Tower Suite work well for families. Extra beds are €40/night and baby cribs are complimentary.";
        }
        if (/contact|phone|email|call|address/i.test(ql)) {
            return "Reach us at: info@villapomona.si | +386 4 572 7880 | Cesta svobode 22, 4260 Bled, Slovenia.";
        }
        if (/hello|hi|hey|good|dobro jutro|guten|ciao|bonjour/i.test(ql)) {
            return "Hello! \uD83C\uDF3F Welcome to Villa Pomona. I'm Aria, your digital concierge. How can I help you today? Ask me about suites, booking, activities, dining, spa, or anything else!";
        }
        return "Thanks for your message! I can help with suites, booking, activities, dining, spa, transport, and more. What would you like to know about Villa Pomona?";
    }

    window.sendChatMessage = sendMessage;
    window.sendChatQuick = function(text) {
        chatInput.value = text;
        sendMessage();
    };

    var hintShown = false;
    setTimeout(function() {
        if (!isOpen && !hintShown && chatBtn) {
            hintShown = true;
            chatBtn.classList.add('chat-hint');
        }
    }, 8000);
}

/* ============================================
   IMAGE LIGHTBOX GALLERY
   ============================================ */
function initLightbox() {
    var items = document.querySelectorAll('.gallery-item');
    var lightbox = document.getElementById('lightbox');
    if (!items.length || !lightbox) return;
    var lightboxImg = document.getElementById('lightboxImage');
    var lightboxCaption = document.getElementById('lightboxCaption');
    var lightboxCounter = document.getElementById('lightboxCounter');
    var currentIndex = 0;
    var totalItems = items.length;
    var images = [];
    items.forEach(function(item, i) {
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
    items.forEach(function(item, i) { item.addEventListener('click', function() { openLightbox(i); }); });
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
        var diff = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(diff) > 50) { diff > 0 ? prevImage() : nextImage(); }
    }, {passive: true});
}
