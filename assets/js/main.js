/**
 * deartbox Packaging - Main JavaScript
 * Handles interactive features: slideshow, mobile menu, form validation, scroll effects
 */

// ============================================
// SLIDESHOW FUNCTIONALITY
// ============================================
class Slideshow {
  constructor() {
    this.slides = document.querySelectorAll('.hero-slide');
    this.dots = document.querySelectorAll('.slide-dot');
    this.prevBtn = document.querySelector('.slide-nav.prev');
    this.nextBtn = document.querySelector('.slide-nav.next');
    this.currentSlide = 0;
    this.autoPlayInterval = null;

    if (this.slides.length > 0) {
      this.init();
    }
  }

  init() {
    this.prevBtn?.addEventListener('click', () => this.prevSlide());
    this.nextBtn?.addEventListener('click', () => this.nextSlide());
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });
    this.startAutoPlay();
  }

  showSlide(index) {
    this.slides.forEach(slide => slide.classList.remove('active'));
    this.dots.forEach(dot => dot.classList.remove('active'));

    this.slides[index].classList.add('active');
    this.dots[index].classList.add('active');
    this.currentSlide = index;
  }

  nextSlide() {
    const next = (this.currentSlide + 1) % this.slides.length;
    this.showSlide(next);
    this.resetAutoPlay();
  }

  prevSlide() {
    const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.showSlide(prev);
    this.resetAutoPlay();
  }

  goToSlide(index) {
    this.showSlide(index);
    this.resetAutoPlay();
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
  }

  resetAutoPlay() {
    clearInterval(this.autoPlayInterval);
    this.startAutoPlay();
  }
}

// ============================================
// MOBILE MENU FUNCTIONALITY
// ============================================
class MobileMenu {
  constructor() {
    this.toggle = document.getElementById('mobileToggle');
    this.menu = document.getElementById('offcanvasMenu');
    this.closeBtn = document.getElementById('offClose');
    this.overlay = document.getElementById('overlay');
    this.menuLinks = this.menu?.querySelectorAll('a');

    if (this.toggle && this.menu) {
      this.init();
    }
  }

  init() {
    this.toggle.addEventListener('click', () => this.open());
    this.closeBtn?.addEventListener('click', () => this.close());
    this.overlay?.addEventListener('click', () => this.close());

    this.menuLinks?.forEach(link => {
      link.addEventListener('click', () => this.close());
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  }

  open() {
    this.menu.classList.add('open');
    this.overlay.classList.add('show');
    document.body.classList.add('menu-open');
    this.menu.setAttribute('aria-hidden', 'false');
  }

  close() {
    this.menu.classList.remove('open');
    this.overlay.classList.remove('show');
    document.body.classList.remove('menu-open');
    this.menu.setAttribute('aria-hidden', 'true');
  }
}

// ============================================
// FORM VALIDATION
// ============================================
class FormValidator {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    if (this.form) {
      this.init();
    }
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.form.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('blur', () => this.validateField(field));
    });
  }

  validateField(field) {
    const error = field.parentElement.querySelector('.field-error');
    let isValid = true;
    let errorMessage = '';

    if (field.hasAttribute('required') && !field.value.trim()) {
      isValid = false;
      errorMessage = 'Field ini wajib diisi';
    } else if (field.type === 'email' && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        isValid = false;
        errorMessage = 'Email tidak valid';
      }
    }

    if (!isValid) {
      field.classList.add('error');
      if (error) {
        error.textContent = errorMessage;
      } else {
        const errorEl = document.createElement('span');
        errorEl.className = 'field-error';
        errorEl.textContent = errorMessage;
        field.parentElement.appendChild(errorEl);
      }
    } else {
      field.classList.remove('error');
      if (error) error.remove();
    }

    return isValid;
  }

  handleSubmit(e) {
    e.preventDefault();

    let isFormValid = true;
    this.form.querySelectorAll('input, textarea, select').forEach(field => {
      if (!this.validateField(field)) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      this.submitForm();
    }
  }

  submitForm() {
    const formData = new FormData(this.form);
    
    fetch(this.form.action || '/api/form-submit', {
      method: 'POST',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      alert('Terima kasih! Kami akan menghubungi Anda segera.');
      this.form.reset();
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    });
  }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      this.observerOptions
    );
    this.init();
  }

  init() {
    document.querySelectorAll('[data-reveal]').forEach(el => {
      this.observer.observe(el);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        this.observer.unobserve(entry.target);
      }
    });
  }
}

// ============================================
// BACK TO TOP BUTTON
// ============================================
class BackToTop {
  constructor() {
    this.button = document.getElementById('backToTop');
    if (this.button) {
      this.init();
    }
  }

  init() {
    window.addEventListener('scroll', () => this.toggleButton());
    this.button.addEventListener('click', () => this.scrollToTop());
  }

  toggleButton() {
    if (window.scrollY > 300) {
      this.button.classList.add('show');
    } else {
      this.button.classList.remove('show');
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

// ============================================
// STICKY CTA BUTTON
// ============================================
class StickyCTA {
  constructor() {
    this.button = document.querySelector('.sticky-cta');
    if (this.button) {
      this.init();
    }
  }

  init() {
    window.addEventListener('scroll', () => this.toggleButton());
  }

  toggleButton() {
    const rfqSection = document.getElementById('rfq');
    if (!rfqSection) return;

    const rect = rfqSection.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      this.button.classList.remove('show');
    } else {
      this.button.classList.add('show');
    }
  }
}

// ============================================
// LAZY LOADING IMAGES
// ============================================
class LazyLoadImages {
  constructor() {
    if ('IntersectionObserver' in window) {
      this.init();
    } else {
      this.loadAllImages();
    }
  }

  init() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  loadAllImages() {
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

// ============================================
// INITIALIZE ALL FEATURES
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  new Slideshow();
  new MobileMenu();
  new FormValidator('form');
  new ScrollAnimations();
  new BackToTop();
  new StickyCTA();
  new LazyLoadImages();
});
