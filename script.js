/**
 * IronPulse Fitness - Main JavaScript
 * Handles: loader, navigation, scroll effects, counters,
 * testimonials, BMI calculator, form validation, gallery lightbox
 */

'use strict';

/* ============================================
   DOM ELEMENTS
   ============================================ */
const loader = document.getElementById('loader');
const header = document.getElementById('header');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTopBtn = document.getElementById('scrollTop');
const revealElements = document.querySelectorAll('.reveal');
const bmiForm = document.getElementById('bmiForm');
const bmiResult = document.getElementById('bmiResult');
const contactForm = document.getElementById('contactForm');
const newsletterForm = document.getElementById('newsletterForm');
const testimonialTrack = document.getElementById('testimonialTrack');
const testimonialPrev = document.getElementById('testimonialPrev');
const testimonialNext = document.getElementById('testimonialNext');
const testimonialDots = document.getElementById('testimonialDots');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const faqItems = document.querySelectorAll('.faq-item');

let currentTestimonial = 0;
let testimonialInterval;
let currentLightboxIndex = 0;
const galleryImages = [];

/* ============================================
   LOADING SCREEN
   ============================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.classList.remove('no-scroll');
    initHeroCounters();
  }, 2200);
});

// Prevent scroll during load
document.body.classList.add('no-scroll');

/* ============================================
   STICKY NAVBAR & SCROLL EFFECTS
   ============================================ */
function handleScroll() {
  const scrollY = window.scrollY;

  // Sticky header background
  if (scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  // Scroll to top button visibility
  if (scrollY > 500) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }

  // Active nav link based on scroll position
  updateActiveNavLink();
}

window.addEventListener('scroll', handleScroll);
handleScroll();

/* ============================================
   SMOOTH SCROLLING
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });

      // Close mobile menu if open
      closeMobileMenu();

      // Update active link
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === href) {
          link.classList.add('active');
        }
      });
    }
  });
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================
   ACTIVE NAV LINK ON SCROLL
   ============================================ */
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 150;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* ============================================
   MOBILE MENU TOGGLE
   ============================================ */
function closeMobileMenu() {
  navToggle.classList.remove('active');
  navMenu.classList.remove('active');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('no-scroll');
}

navToggle.addEventListener('click', () => {
  const isActive = navToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
  navToggle.setAttribute('aria-expanded', isActive);
  document.body.classList.toggle('no-scroll', isActive);
});

navLinks.forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('active')) {
    closeMobileMenu();
  }
});

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
);

revealElements.forEach(el => revealObserver.observe(el));

// Activate hero reveals immediately on load
document.querySelectorAll('.hero .reveal').forEach(el => {
  setTimeout(() => el.classList.add('active'), 100);
});

/* ============================================
   ANIMATED COUNTERS
   ============================================ */
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (target - start) * easeOut);

    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString();
    }
  }

  requestAnimationFrame(update);
}

// Hero stat counters (run on load)
function initHeroCounters() {
  document.querySelectorAll('.hero-stats .stat-number').forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    animateCounter(counter, target, 2500);
  });
}

// Section counters triggered on scroll
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'), 10);
        if (!counter.classList.contains('counted')) {
          counter.classList.add('counted');
          animateCounter(counter, target, 2000);
        }
        counterObserver.unobserve(counter);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.about-counter, .highlight-counter').forEach(counter => {
  counterObserver.observe(counter);
});

/* ============================================
   TESTIMONIAL SLIDER
   ============================================ */
const testimonialCards = document.querySelectorAll('.testimonial-card');

function initTestimonialSlider() {
  // Create dots
  testimonialCards.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('testimonial-dot');
    dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToTestimonial(index));
    testimonialDots.appendChild(dot);
  });

  testimonialPrev.addEventListener('click', () => {
    goToTestimonial(currentTestimonial - 1);
    resetTestimonialAutoplay();
  });

  testimonialNext.addEventListener('click', () => {
    goToTestimonial(currentTestimonial + 1);
    resetTestimonialAutoplay();
  });

  startTestimonialAutoplay();
}

function goToTestimonial(index) {
  testimonialCards[currentTestimonial].classList.remove('active');
  document.querySelectorAll('.testimonial-dot')[currentTestimonial].classList.remove('active');

  currentTestimonial = (index + testimonialCards.length) % testimonialCards.length;

  testimonialCards[currentTestimonial].classList.add('active');
  document.querySelectorAll('.testimonial-dot')[currentTestimonial].classList.add('active');
}

function startTestimonialAutoplay() {
  testimonialInterval = setInterval(() => {
    goToTestimonial(currentTestimonial + 1);
  }, 5000);
}

function resetTestimonialAutoplay() {
  clearInterval(testimonialInterval);
  startTestimonialAutoplay();
}

initTestimonialSlider();

/* ============================================
   BMI CALCULATOR
   ============================================ */
bmiForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const height = parseFloat(document.getElementById('height').value);
  const weight = parseFloat(document.getElementById('weight').value);

  if (!height || !weight || height < 50 || height > 300 || weight < 20 || weight > 500) {
    showBMIResult(null, 'Please enter valid height (50-300 cm) and weight (20-500 kg).');
    return;
  }

  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  const roundedBMI = bmi.toFixed(1);

  let category, suggestion, categoryClass;

  if (bmi < 18.5) {
    category = 'Underweight';
    categoryClass = 'underweight';
    suggestion = 'Focus on strength training and a calorie-surplus nutrition plan. Consult our trainers for a personalized bulking program.';
  } else if (bmi < 25) {
    category = 'Normal Weight';
    categoryClass = 'normal';
    suggestion = 'Great job! Maintain your fitness with balanced cardio and strength training. Explore our group classes to stay motivated.';
  } else if (bmi < 30) {
    category = 'Overweight';
    categoryClass = 'overweight';
    suggestion = 'Consider our HIIT and cardio programs combined with nutrition guidance. Our Pro plan includes personalized coaching to help you reach your goals.';
  } else {
    category = 'Obese';
    categoryClass = 'obese';
    suggestion = 'We recommend starting with low-impact cardio and gradual strength building. Book a consultation with our trainers for a safe, effective weight loss plan.';
  }

  showBMIResult(roundedBMI, null, category, suggestion, categoryClass);
});

function showBMIResult(bmi, error, category, suggestion, categoryClass) {
  if (error) {
    bmiResult.innerHTML = `
      <div class="bmi-output">
        <p class="bmi-suggestion" style="color: #e74c3c;">${error}</p>
      </div>
    `;
    return;
  }

  bmiResult.innerHTML = `
    <div class="bmi-output">
      <p class="bmi-value">${bmi}</p>
      <p class="bmi-category ${categoryClass}">${category}</p>
      <p class="bmi-suggestion">${suggestion}</p>
    </div>
  `;
}

/* ============================================
   FAQ ACCORDION
   ============================================ */
faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');

  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');

    // Close all other items
    faqItems.forEach(other => {
      other.classList.remove('active');
      other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // Toggle current item
    if (!isActive) {
      item.classList.add('active');
      question.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ============================================
   GALLERY LIGHTBOX
   ============================================ */
galleryItems.forEach((item, index) => {
  const img = item.querySelector('img');
  galleryImages.push({ src: img.src, alt: img.alt });

  item.addEventListener('click', () => openLightbox(index));
});

function openLightbox(index) {
  currentLightboxIndex = index;
  lightboxImg.src = galleryImages[index].src;
  lightboxImg.alt = galleryImages[index].alt;
  lightbox.classList.add('active');
  lightbox.removeAttribute('hidden');
  document.body.classList.add('no-scroll');
}

function closeLightbox() {
  lightbox.classList.remove('active');
  lightbox.setAttribute('hidden', '');
  document.body.classList.remove('no-scroll');
}

function navigateLightbox(direction) {
  currentLightboxIndex = (currentLightboxIndex + direction + galleryImages.length) % galleryImages.length;
  lightboxImg.src = galleryImages[currentLightboxIndex].src;
  lightboxImg.alt = galleryImages[currentLightboxIndex].alt;
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
lightboxNext.addEventListener('click', () => navigateLightbox(1));

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;

  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});

/* ============================================
   FORM VALIDATION
   ============================================ */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^[\d\s\-\+\(\)]{7,20}$/.test(phone);
}

function showFieldError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(errorId);
  field.classList.add('error');
  errorEl.textContent = message;
}

function clearFieldError(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(errorId);
  field.classList.remove('error');
  errorEl.textContent = '';
}

// Contact form validation
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let isValid = true;
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const message = document.getElementById('message').value.trim();

  // Clear previous errors
  ['name', 'email', 'phone', 'message'].forEach(id => clearFieldError(id, `${id}Error`));

  if (name.length < 2) {
    showFieldError('name', 'nameError', 'Please enter your full name (min 2 characters).');
    isValid = false;
  }

  if (!validateEmail(email)) {
    showFieldError('email', 'emailError', 'Please enter a valid email address.');
    isValid = false;
  }

  if (!validatePhone(phone)) {
    showFieldError('phone', 'phoneError', 'Please enter a valid phone number.');
    isValid = false;
  }

  if (message.length < 10) {
    showFieldError('message', 'messageError', 'Message must be at least 10 characters.');
    isValid = false;
  }

  if (isValid) {
    contactForm.innerHTML = `
      <div class="form-success">
        <i class="fas fa-check-circle"></i>
        <h3>Message Sent!</h3>
        <p>Thank you, ${name}! We'll get back to you within 24 hours.</p>
      </div>
    `;
  }
});

// Newsletter form validation
newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const emailInput = document.getElementById('newsletterEmail');
  const email = emailInput.value.trim();

  if (!validateEmail(email)) {
    emailInput.style.borderColor = '#e74c3c';
    return;
  }

  newsletterForm.innerHTML = `
    <p style="color: #2ecc71; font-size: 14px;">
      <i class="fas fa-check"></i> Subscribed successfully!
    </p>
  `;
});

// Real-time error clearing on input
['name', 'email', 'phone', 'message'].forEach(fieldId => {
  const field = document.getElementById(fieldId);
  if (field) {
    field.addEventListener('input', () => clearFieldError(fieldId, `${fieldId}Error`));
  }
});
