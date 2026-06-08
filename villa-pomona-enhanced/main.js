/* ============================================
   Villa Pomona — Enhanced JavaScript
   ============================================ */

(function() {
    'use strict';

    // ===== State =====
    let currentLang = 'en';
    let currentSlide = 0;
    let currentTestimonial = 0;
    let currentLightboxIndex = 0;
    let isChatOpen = false;

    const galleryImages = [
        'assets/images/gallery-1.jpg',
        'assets/images/gallery-2.jpg',
        'assets/images/gallery-3.jpg',
        'assets/images/gallery-4.jpg',
        'assets/images/gallery-5.jpg',
        'assets/images/gallery-6.jpg',
    ];

    // ===== Villa Pomona Bot API Configuration =====
    const BOT_API = 'https://villa-pomona-bot.onrender.com/api/chat';
    const BOT_ENABLED = true; // Set to false to use offline keyword responses
    let sessionId = 'web-' + Math.random().toString(36).substr(2, 9);
    let conversationHistory = [];
    let isBotOnline = null;

    // Offline fallback responses (used when bot API is unavailable)
    const chatResponses = {
        en: {
            booking: "To make a reservation, please fill out the reservation form below or call us at +386 51 603 858. You can also email evita.vilebled@gmail.com.",
            rooms: "We offer 7 elegant rooms across three categories: Standard (€120/night), Deluxe (€180/night), and Family (€220/night). Each room features unique historic charm with modern amenities.",
            wellness: "Our wellness area includes a Finnish sauna, massage services, and a relaxation room with garden views. Wellness access is included for all guests.",
            location: "We're located at Črtomirova ulica 2, 4260 Bled, Slovenia — just a 5-minute walk from Lake Bled and the town center.",
            breakfast: "A gourmet breakfast is included with every stay. We serve local, seasonal ingredients including homemade bread, fresh dairy, and organic produce.",
            parking: "Free private parking is available on-site for all guests.",
            wifi: "Free high-speed WiFi is available throughout the villa.",
            cancellation: "Free cancellation is available up to 48 hours before check-in. Late check-out is available upon request.",
            default: "Thank you for your message! For immediate assistance, please call +386 51 603 858 or email evita.vilebled@gmail.com. Is there anything specific I can help you with?"
        },
        sl: {
            booking: "Za rezervacijo izpolnite obrazec za rezervacijo spodaj ali nas pokličite na +386 51 603 858. Pišite tudi na evita.vilebled@gmail.com.",
            rooms: "Ponujamo 7 elegantnih sob v treh kategorijah: Standard (€120/noč), Deluxe (€180/noč) in Družinska (€220/noč). Vsaka soba ima edinstven zgodovinski šarm s sodobnim udobjem.",
            wellness: "Naš wellness center vključuje finsko savno, masažne storitve in sprostitveni prostor z razgledom na vrt. Dostop do wellnessa je vključen za vse goste.",
            location: "Nahajamo se na Črtomirovavi ulici 2, 4260 Bled — le 5 min hoje od Blejskega jega in centra mesta.",
            breakfast: "Gurmanski zajtrk je vključen pri vsakem bivanju. Serviramo lokalne, sezenske sestavine, vključno s domačim kruhom, svežo mlečno produkcijo in organskimi pridelki.",
            parking: "Brezplačno parkirišče je na voljo na lokaciji za vse goste.",
            wifi: "Brezplačen hitri WiFi je na voljo po celotni vili.",
            cancellation: "Brezplačna odpoved je možna do 48 ur pred prihodom. Pozen odhod je na voljo na zahtevo.",
            default: "Hvala za vaše sporočilo! Za takojšnjo pomoč pokličite +386 51 603 858 ali pišite na evita.vilebled@gmail.com. Vam lahko pomagam s čim?"
        }
    };

    // ===== Document Ready =====
    document.addEventListener('DOMContentLoaded', function() {
        initHeader();
        initHeroSlider();
        initTestimonials();
        initGallery();
        initScrollReveal();
        initDateInputs();
        initPlaceholders();
    });

    // ===== Header Scroll Effect =====
    function initHeader() {
        const header = document.getElementById('header');
        if (!header) return;
        
        let lastScroll = 0;
        
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScroll = scrollY;
        }, { passive: true });
    }

    // ===== Mobile Menu =====
    window.toggleMobileMenu = function() {
        const menu = document.getElementById('navMenu');
        const btn = document.querySelector('.mobile-menu-btn');
        if (!menu || !btn) return;
        
        menu.classList.toggle('open');
        btn.classList.toggle('active');
        btn.setAttribute('aria-expanded', btn.classList.contains('active'));
    };

    // ===== Hero Slider =====
    function initHeroSlider() {
        const slides = document.querySelectorAll('.hero-slide');
        if (slides.length === 0) return;
        
        // Create dots
        const dotsContainer = document.getElementById('sliderDots');
        if (dotsContainer) {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
                dot.addEventListener('click', function() { goToSlide(i); });
                dotsContainer.appendChild(dot);
            });
        }
        
        // Auto-advance
        setInterval(function() {
            changeSlide(1);
        }, 6000);
    }

    window.changeSlide = function(dir) {
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.slider-dot');
        if (slides.length === 0) return;
        
        slides[currentSlide].classList.remove('active');
        if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
        
        currentSlide = (currentSlide + dir + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    };

    function goToSlide(index) {
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.slider-dot');
        if (slides.length === 0 || index === currentSlide) return;
        
        slides[currentSlide].classList.remove('active');
        if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
        
        currentSlide = index;
        
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    // ===== Testimonials =====
    function initTestimonials() {
        const cards = document.querySelectorAll('.testimonial-card');
        if (cards.length === 0) return;
        
        const dotsContainer = document.getElementById('testimonialDots');
        if (dotsContainer) {
            cards.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.className = 't-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', 'Testimonial ' + (i + 1));
                dot.addEventListener('click', function() { goToTestimonial(i); });
                dotsContainer.appendChild(dot);
            });
        }
        
        setInterval(function() {
            goToTestimonial((currentTestimonial + 1) % cards.length);
        }, 5000);
    }

    function goToTestimonial(index) {
        const cards = document.querySelectorAll('.testimonial-card');
        const dots = document.querySelectorAll('.t-dot');
        if (cards.length === 0 || index === currentTestimonial) return;
        
        cards[currentTestimonial].classList.remove('active');
        if (dots[currentTestimonial]) dots[currentTestimonial].classList.remove('active');
        
        currentTestimonial = index;
        
        cards[currentTestimonial].classList.add('active');
        if (dots[currentTestimonial]) dots[currentTestimonial].classList.add('active');
    }

    // ===== Gallery & Lightbox =====
    function initGallery() {
        // Keyboard navigation for lightbox
        document.addEventListener('keydown', function(e) {
            const lightbox = document.getElementById('lightbox');
            if (!lightbox || !lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') changeLightbox(-1);
            if (e.key === 'ArrowRight') changeLightbox(1);
        });
    }

    window.openLightbox = function(index) {
        currentLightboxIndex = index;
        const lightbox = document.getElementById('lightbox');
        const img = document.getElementById('lightboxImg');
        if (!lightbox || !img) return;
        
        img.src = galleryImages[index];
        img.alt = 'Gallery image ' + (index + 1);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeLightbox = function() {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox) return;
        
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    window.changeLightbox = function(dir) {
        currentLightboxIndex = (currentLightboxIndex + dir + galleryImages.length) % galleryImages.length;
        const img = document.getElementById('lightboxImg');
        if (img) {
            img.src = galleryImages[currentLightboxIndex];
            img.alt = 'Gallery image ' + (currentLightboxIndex + 1);
        }
    };

    // ===== Scroll Reveal =====
    function initScrollReveal() {
        const elements = document.querySelectorAll('.room-card, .contact-card, .feature-item, .wellness-item, .reservation-form, .room-card');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry, i) {
                    if (entry.isIntersecting) {
                        setTimeout(function() {
                            entry.target.classList.add('visible');
                        }, (i % 3) * 150);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            elements.forEach(function(el) {
                el.classList.add('reveal');
                observer.observe(el);
            });
        } else {
            elements.forEach(function(el) {
                el.classList.add('visible');
            });
        }
    }

    // ===== Date Inputs =====
    function initDateInputs() {
        const checkIn = document.getElementById('checkIn');
        const checkOut = document.getElementById('checkOut');
        if (!checkIn || !checkOut) return;
        
        const today = new Date().toISOString().split('T')[0];
        checkIn.min = today;
        
        checkIn.addEventListener('change', function() {
            if (this.value) {
                const nextDay = new Date(this.value);
                nextDay.setDate(nextDay.getDate() + 1);
                checkOut.min = nextDay.toISOString().split('T')[0];
                
                if (checkOut.value && checkOut.value <= this.value) {
                    checkOut.value = checkOut.min;
                }
            }
        });
    }

    // ===== Placeholders =====
    function initPlaceholders() {
        applyPlaceholders(currentLang);
    }

    function applyPlaceholders(lang) {
        document.querySelectorAll('[data-placeholder-' + lang + ']').forEach(function(el) {
            el.placeholder = el.getAttribute('data-placeholder-' + lang);
        });
    }

    // ===== Language Switching =====
    window.switchLanguage = function(lang) {
        currentLang = lang;
        
        // Update buttons
        document.querySelectorAll('.lang-btn').forEach(function(btn) {
            btn.classList.remove('active');
        });
        
        var langBtns = document.querySelectorAll('.lang-btn');
        langBtns.forEach(function(btn) {
            if (btn.getAttribute('onclick').indexOf("'" + lang + "'") !== -1) {
                btn.classList.add('active');
            }
        });
        
        // Update text content
        document.querySelectorAll('[data-lang-' + lang + ']').forEach(function(el) {
            if (el.children.length === 0) {
                el.textContent = el.getAttribute('data-lang-' + lang);
            }
        });
        
        // Update placeholders
        applyPlaceholders(lang);
        
        // Update chat messages
        const chatMessages = document.querySelectorAll('.chat-message.bot p');
        if (chatMessages.length > 0) {
            var welcomeMsg = chatResponses[lang].default.split('.')[0];
            // Only update the first bot message
            if (chatMessages[0].getAttribute('data-lang-' + lang)) {
                chatMessages[0].textContent = chatMessages[0].getAttribute('data-lang-' + lang);
            }
        }
    };

    // ===== Reservation Form =====
    window.handleReservationSubmit = function(e) {
        e.preventDefault();
        
        const form = document.getElementById('reservationForm');
        const btn = document.getElementById('submitBtn');
        if (!form || !btn) return;
        
        // Validate
        const checkIn = document.getElementById('checkIn').value;
        const checkOut = document.getElementById('checkOut').value;
        
        if (checkIn && checkOut && checkIn >= checkOut) {
            alert(currentLang === 'sl' ? 'Datum odhoda mora biti po datumu prihoda.' : 'Check-out must be after check-in.');
            return;
        }
        
        // Show loading
        const originalText = btn.textContent;
        btn.textContent = currentLang === 'sl' ? 'Pošiljanje...' : 'Sending...';
        btn.disabled = true;
        btn.style.opacity = '0.7';
        
        // Simulate submission
        setTimeout(function() {
            btn.textContent = currentLang === 'sl' ? '✓ Poslano!' : '✓ Sent!';
            btn.style.background = '#2d8a4e';
            btn.style.borderColor = '#2d8a4e';
            
            setTimeout(function() {
                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.background = '';
                btn.style.borderColor = '';
                form.reset();
            }, 3000);
        }, 1500);
    };

    // ===== Chat Widget =====
    window.toggleChat = function() {
        const widget = document.getElementById('chatWidget');
        if (!widget) return;
        
        isChatOpen = !isChatOpen;
        
        if (isChatOpen) {
            widget.classList.add('open');
            setTimeout(function() {
                var input = document.getElementById('chatInput');
                if (input) input.focus();
            }, 300);
        } else {
            widget.classList.remove('open');
        }
    };

    window.sendChatMessage = function() {
        var input = document.getElementById('chatInput');
        var messages = document.getElementById('chatMessages');
        if (!input || !messages || !input.value.trim()) return;
        
        var userMsg = input.value.trim();
        input.value = '';
        
        // Add user message
        var userDiv = document.createElement('div');
        userDiv.className = 'chat-message user';
        userDiv.innerHTML = '<p>' + escapeHtml(userMsg) + '</p>';
        messages.appendChild(userDiv);
        messages.scrollTop = messages.scrollHeight;
        
        // Show typing indicator
        var typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot typing';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = '<p><span class="typing-dot">.</span><span class="typing-dot">.</span><span class="typing-dot">.</span></p>';
        messages.appendChild(typingDiv);
        messages.scrollTop = messages.scrollHeight;
        
        // Try bot API first, fall back to offline responses
        if (BOT_ENABLED) {
            fetchBotResponse(userMsg, messages, typingDiv);
        } else {
            setTimeout(function() {
                messages.removeChild(typingDiv);
                var response = getBotResponse(userMsg.toLowerCase());
                addBotMessage(messages, response);
            }, 800);
        }
    };

    function fetchBotResponse(userMsg, messages, typingDiv) {
        var controller = new AbortController();
        var timeoutId = setTimeout(function() { controller.abort(); }, 15000);
        
        fetch(BOT_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                session_id: sessionId,
                message: userMsg,
                messages: conversationHistory
            }),
            signal: controller.signal
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
            clearTimeout(timeoutId);
            if (messages.contains(typingDiv)) messages.removeChild(typingDiv);
            
            if (data.replies && data.replies.length > 0) {
                data.replies.forEach(function(reply) {
                    if (reply.type === 'text' && reply.content) {
                        addBotMessage(messages, reply.content);
                    }
                });
                // Update conversation history
                conversationHistory.push({ role: 'user', content: userMsg });
                conversationHistory.push({ role: 'assistant', content: data.replies.map(function(r) { return r.content; }).join(' ') });
                // Keep history manageable
                if (conversationHistory.length > 20) {
                    conversationHistory = conversationHistory.slice(-20);
                }
            } else if (data.message) {
                addBotMessage(messages, data.message);
            } else {
                // Fallback to offline
                var fallback = getBotResponse(userMsg.toLowerCase());
                addBotMessage(messages, fallback);
            }
        })
        .catch(function(err) {
            clearTimeout(timeoutId);
            console.log('Bot API unavailable, using offline responses:', err.message);
            if (messages.contains(typingDiv)) messages.removeChild(typingDiv);
            var fallback = getBotResponse(userMsg.toLowerCase());
            addBotMessage(messages, fallback);
        });
    }

    function addBotMessage(messages, text) {
        var botDiv = document.createElement('div');
        botDiv.className = 'chat-message bot';
        botDiv.innerHTML = '<p>' + escapeHtml(text) + '</p>';
        messages.appendChild(botDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    window.handleChatKeypress = function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    };

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(text));
        return div.innerHTML;
    }

    function getBotResponse(message) {
        var responses = chatResponses[currentLang] || chatResponses.en;
        var msg = message.toLowerCase();
        
        if (msg.indexOf('book') !== -1 || msg.indexOf('reserve') !== -1 || msg.indexOf('rezerv') !== -1 || msg.indexOf('cena') !== -1 || msg.indexOf('price') !== -1 || msg.indexOf('cost') !== -1) {
            return responses.booking;
        }
        if (msg.indexOf('room') !== -1 || msg.indexOf('sob') !== -1 || msg.indexOf('suite') !== -1 || msg.indexOf('apart') !== -1) {
            return responses.rooms;
        }
        if (msg.indexOf('wellness') !== -1 || msg.indexOf('sauna') !== -1 || msg.indexOf('spa') !== -1 || msg.indexOf('savn') !== -1 || msg.indexOf('masa') !== -1 || msg.indexOf('massage') !== -1) {
            return responses.wellness;
        }
        if (msg.indexOf('where') !== -1 || msg.indexOf('location') !== -1 || msg.indexOf('address') !== -1 || msg.indexOf('kje') !== -1 || msg.indexOf('naslov') !== -1 || msg.indexOf('lokac') !== -1) {
            return responses.location;
        }
        if (msg.indexOf('breakfast') !== -1 || msg.indexOf('food') !== -1 || msg.indexOf('zajtrk') !== -1 || msg.indexOf('hrana') !== -1 || msg.indexOf('jed') !== -1) {
            return responses.breakfast;
        }
        if (msg.indexOf('parking') !== -1 || msg.indexOf('park') !== -1 || msg.indexOf('parkir') !== -1 || msg.indexOf('car') !== -1 || msg.indexOf('auto') !== -1) {
            return responses.parking;
        }
        if (msg.indexOf('wifi') !== -1 || msg.indexOf('internet') !== -1) {
            return responses.wifi;
        }
        if (msg.indexOf('cancel') !== -1 || msg.indexOf('odpov') !== -1 || msg.indexOf('refund') !== -1) {
            return responses.cancellation;
        }
        
        return responses.default;
    }

    // ===== Smooth Scroll for Anchor Links =====
    document.addEventListener('click', function(e) {
        var anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        
        var targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        
        var target = document.querySelector(targetId);
        if (target) {
            // Don't prevent default for reservation - let the form work
            // But do smooth scroll
            
            var headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 70;
            var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });

})();
