document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================
     1. GSAP / SCROLLTRIGGER INITIALIZATION
     ========================================== */
  // Check if GSAP is loaded
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Subtle animations for the page elements
    gsap.from('.life-hero-content', {
      duration: 1.2,
      y: 40,
      opacity: 0,
      ease: 'power3.out'
    });

    gsap.from('.life-gallery-card', {
      scrollTrigger: {
        trigger: '.life-gallery-card',
        start: 'top 85%'
      },
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power3.out'
    });

    gsap.from('.value-card-wrapper', {
      scrollTrigger: {
        trigger: '.values-grid',
        start: 'top 80%'
      },
      duration: 0.8,
      y: 40,
      opacity: 0,
      stagger: 0.15,
      ease: 'power3.out'
    });
  }

  /* ==========================================
     2. MOBILE DRAWER NAVIGATION MENU
     ========================================== */
  const menuBtn = document.querySelector('.menu-btn');
  const menuBackdrop = document.querySelector('.menu-backdrop');
  const mobileDrawer = document.querySelector('.mobile-drawer');

  if (menuBtn && menuBackdrop && mobileDrawer && !menuBtn.dataset.menuInitialized) {
    menuBtn.dataset.menuInitialized = 'true';
    const toggleMenu = () => {
      const isOpen = menuBtn.classList.toggle('active');
      menuBackdrop.classList.toggle('open', isOpen);
      mobileDrawer.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuBtn.addEventListener('click', toggleMenu);
    menuBackdrop.addEventListener('click', toggleMenu);

    // Close menu drawer on navigation link clicks
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        menuBackdrop.classList.remove('open');
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Accordion group Inside mobile drawer (Our Work submenus)
    const toggleBtns = mobileDrawer.querySelectorAll('.dropdown-toggle-btn');
    toggleBtns.forEach(toggleBtn => {
      const itemGroup = toggleBtn.closest('.drawer-menu-item-group');
      if (toggleBtn && itemGroup) {
        toggleBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const isExpanded = itemGroup.classList.toggle('expanded');
          toggleBtn.setAttribute('aria-expanded', isExpanded);
        });
      }
    });
  }

  /* ===== reCAPTCHA Initialization ===== */
  const IS_LOCAL = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
  const RECAPTCHA_SITE_KEY = IS_LOCAL
    ? '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' // Public Google validation key
    : '6LdrhwoUAAAAAEAxk89vkEx3Oy6to5THBRDSfbGx'; // Production key

  let recaptchaCheckInterval = setInterval(() => {
    if (window.grecaptcha && window.grecaptcha.render) {
      try {
        const container = document.getElementById('contact-recaptcha');
        if (container && container.innerHTML === '') {
          window.grecaptcha.render('contact-recaptcha', {
            sitekey: RECAPTCHA_SITE_KEY,
          });
          clearInterval(recaptchaCheckInterval);
        }
      } catch (e) {
        console.error('reCAPTCHA init error: ', e);
      }
    }
  }, 500);
});
