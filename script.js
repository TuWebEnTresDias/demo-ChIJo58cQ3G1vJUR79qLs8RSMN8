/**
 * REGIÓN PALERMO — Interactividad
 * Header scroll, menú mobile, animaciones on-scroll, 
 * formulario a WhatsApp
 */

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // HEADER — Scroll Effect
    // ============================================
    const header = document.getElementById('header');
    let lastScroll = 0;

    const handleHeaderScroll = () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    // ============================================
    // MOBILE MENU
    // ============================================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const mobileCta = document.querySelector('.mobile-cta');

    const toggleMobileMenu = () => {
        mobileMenuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    };

    const closeMobileMenu = () => {
        mobileMenuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    };

    mobileMenuToggle.addEventListener('click', toggleMobileMenu);

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    if (mobileCta) {
        mobileCta.addEventListener('click', closeMobileMenu);
    }

    // ============================================
    // SCROLL ANIMATIONS — Intersection Observer
    // ============================================
    const animateElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, parseInt(delay));
                
                observer.unobserve(entry.target);
            }
        });
    };

    const scrollObserver = new IntersectionObserver(animateOnScroll, observerOptions);

    animateElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // ============================================
    // SMOOTH SCROLL for anchor links
    // ============================================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // RESERVATION FORM → WhatsApp
    // ============================================
    const reservationForm = document.getElementById('reservationForm');

    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(reservationForm);
            const name = formData.get('name');
            const phone = formData.get('phone');
            const people = formData.get('people');
            const date = formData.get('date');
            const time = formData.get('time');
            const message = formData.get('message');
            
            // Format date for display
            let dateDisplay = date;
            if (date) {
                const dateObj = new Date(date + 'T12:00:00');
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                dateDisplay = dateObj.toLocaleDateString('es-AR', options);
            }
            
            // Build WhatsApp message
            let whatsappMessage = `Hola! Quiero hacer una reserva en Región\n\n`;
            whatsappMessage += `👤 *Nombre:* ${name}\n`;
            whatsappMessage += `📱 *WhatsApp:* ${phone}\n`;
            whatsappMessage += `👥 *Personas:* ${people}\n`;
            whatsappMessage += `📅 *Fecha:* ${dateDisplay}\n`;
            whatsappMessage += `🕐 *Horario:* ${time}\n`;
            
            if (message) {
                whatsappMessage += `\n💬 *Mensaje:* ${message}\n`;
            }
            
            // Encode message for URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://wa.me/5491135994950?text=${encodedMessage}`;
            
            // Open WhatsApp
            window.open(whatsappUrl, '_blank');
        });
    }

    // ============================================
    // PARALLAX EFFECT — Hero Background
    // ============================================
    const heroBg = document.querySelector('.hero-bg-img');
    
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = document.querySelector('.hero').offsetHeight;
            
            if (scrolled < heroHeight) {
                const parallax = scrolled * 0.3;
                heroBg.style.transform = `scale(1.05) translateY(${parallax}px)`;
            }
        }, { passive: true });
    }

    // ============================================
    // ACTIVE NAV LINK on Scroll
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const updateActiveNav = () => {
        const scrollPosition = window.pageYOffset + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ============================================
    // LAZY LOADING IMAGES (enhanced)
    // ============================================
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ============================================
    // GALLERY HOVER EFFECT
    // ============================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.zIndex = '10';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.zIndex = '';
        });
    });

    // ============================================
    // STATS COUNTER ANIMATION
    // ============================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    const animateStats = () => {
        if (statsAnimated) return;

        const statsSection = document.querySelector('.history-stats');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            statsAnimated = true;
            
            statNumbers.forEach(stat => {
                const finalText = stat.textContent;
                const finalNum = parseFloat(finalText);
                const suffix = finalText.replace(/[0-9.]/g, '');
                const isDecimal = finalText.includes('.');
                const duration = 1500;
                const startTime = performance.now();

                const animate = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function (ease-out)
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    
                    const currentNum = finalNum * easeOut;
                    
                    if (isDecimal) {
                        stat.textContent = currentNum.toFixed(1) + suffix;
                    } else {
                        stat.textContent = Math.floor(currentNum) + suffix;
                    }

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                };

                stat.textContent = '0' + suffix;
                requestAnimationFrame(animate);
            });
        }
    };

    window.addEventListener('scroll', animateStats, { passive: true });
    animateStats();

    // ============================================
    // KEYBOARD ACCESSIBILITY
    // ============================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // ============================================
    // PERFORMANCE: Reduce animations if user prefers
    // ============================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--transition-base', '0.01s');
        document.documentElement.style.setProperty('--transition-slow', '0.01s');
    }

    console.log('🔥 Región Palermo — Landing Page cargada');
});