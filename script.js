/**
 * Región Palermo — Landing Page Scripts
 * Bar & Grill — Palermo Soho
 * Vanilla JS, zero dependencies
 */

document.addEventListener('DOMContentLoaded', () => {

  // ─── DOM References ───────────────────────────────────────────────
  const header = document.getElementById('header');
  const burgerBtn = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');
  const animatedElements = document.querySelectorAll('[data-animate]');
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const reservationForm = document.getElementById('reservationForm');
  const heroBgImg = document.querySelector('.hero__bg-img');
  const heroSection = document.querySelector('.hero');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__nav-link');
  const statNumbers = document.querySelectorAll('.history__stat-number');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── 0. Console Welcome ──────────────────────────────────────────
  console.log('🔥 Región Palermo — Landing Page cargada');

  // ─── 1. Reduced Motion ───────────────────────────────────────────
  if (prefersReducedMotion) {
    document.documentElement.style.setProperty('--transition-speed', '0.01s');
    document.documentElement.style.setProperty('--animation-duration', '0.01s');
  }

  // ─── 2. Header Scroll Effect ─────────────────────────────────────
  const handleHeaderScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // ─── 3. Mobile Menu Toggle ───────────────────────────────────────
  const toggleMobileMenu = () => {
    const isActive = mobileMenu.classList.contains('active');
    burgerBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = isActive ? '' : 'hidden';
  };

  const closeMobileMenu = () => {
    burgerBtn.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (burgerBtn) {
    burgerBtn.addEventListener('click', toggleMobileMenu);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  // ─── 4. Smooth Scroll ────────────────────────────────────────────
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  });

  // ─── 5. Scroll Reveal Animations ─────────────────────────────────
  if (animatedElements.length > 0 && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.getAttribute('data-delay'), 10) || 0;
          setTimeout(() => {
            entry.target.classList.add('animated');
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    });

    animatedElements.forEach(el => revealObserver.observe(el));
  } else if (prefersReducedMotion) {
    animatedElements.forEach(el => el.classList.add('animated'));
  }

  // ─── 6. Reservation Form → WhatsApp ──────────────────────────────
  const MONTHS_ES = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  const DAYS_ES = [
    'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'
  ];

  const formatDateES = (dateStr) => {
    if (!dateStr) return 'No especificada';
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayName = DAYS_ES[date.getDay()];
    const monthName = MONTHS_ES[date.getMonth()];
    return `${dayName}, ${day} de ${monthName} de ${year}`;
  };

  const buildWhatsAppMessage = (data) => {
    const dateFormatted = formatDateES(data.date);

    let message = `Hola! Quiero hacer una reserva en Región\n\n`;
    message += `👤 *Nombre:* ${data.name}\n`;
    message += `📱 *WhatsApp:* ${data.phone}\n`;
    message += `👥 *Personas:* ${data.people}\n`;
    message += `📅 *Fecha:* ${dateFormatted}\n`;
    message += `🕐 *Horario:* ${data.time}`;

    if (data.message && data.message.trim()) {
      message += `\n💬 *Mensaje:* ${data.message}`;
    }

    return message;
  };

  if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(reservationForm);
      const data = {
        name: formData.get('name') || '',
        phone: formData.get('whatsapp') || '',
        people: formData.get('people') || '',
        date: formData.get('date') || '',
        time: formData.get('time') || '',
        message: formData.get('message') || ''
      };

      if (!data.name.trim() || !data.phone.trim()) {
        alert('Por favor completá tu nombre y número de WhatsApp.');
        return;
      }

      const message = buildWhatsAppMessage(data);
      const encoded = encodeURIComponent(message);
      const whatsappURL = `https://wa.me/5491135994950?text=${encoded}`;

      window.open(whatsappURL, '_blank');
    });
  }

  // ─── 7. Hero Parallax ────────────────────────────────────────────
  if (heroBgImg && heroSection && !prefersReducedMotion) {
    const handleParallax = () => {
      const heroRect = heroSection.getBoundingClientRect();
      if (heroRect.bottom > 0) {
        const scrolled = window.scrollY;
        const translateY = scrolled * 0.3;
        heroBgImg.style.transform = `translateY(${translateY}px)`;
      }
    };

    window.addEventListener('scroll', handleParallax, { passive: true });
  }

  // ─── 8. Active Nav Highlighting ──────────────────────────────────
  const handleActiveNav = () => {
    const scrollPos = window.scrollY + 200;
    let currentSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleActiveNav, { passive: true });
  handleActiveNav();

  // ─── 9. Stats Counter Animation ──────────────────────────────────
  if (statNumbers.length > 0 && !prefersReducedMotion) {
    const parseStatTarget = (text) => {
      const clean = text.trim();
      const suffix = clean.replace(/[\d.]/g, '');
      const number = parseFloat(clean);
      const hasDecimal = clean.includes('.');
      const decimalPlaces = hasDecimal ? (clean.split('.')[1] || '').length : 0;
      return { number: isNaN(number) ? 0 : number, suffix, decimalPlaces };
    };

    const animateCounter = (element, target, suffix, decimalPlaces, duration) => {
      const startTime = performance.now();

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = easedProgress * target;

        if (decimalPlaces > 0) {
          element.textContent = currentValue.toFixed(decimalPlaces) + suffix;
        } else {
          element.textContent = Math.round(currentValue) + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statElements = entry.target.querySelectorAll('.history__stat-number');

          statElements.forEach(el => {
            const targetValue = el.getAttribute('data-count') || el.textContent;
            const { number, suffix, decimalPlaces } = parseStatTarget(targetValue);
            animateCounter(el, number, suffix, decimalPlaces, 1500);
          });

          counterObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3
    });

    const statsSection = statNumbers[0]?.closest('section') || statNumbers[0]?.parentElement;
    if (statsSection) {
      counterObserver.observe(statsSection);
    }
  }

});