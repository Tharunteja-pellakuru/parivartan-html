document.addEventListener('DOMContentLoaded', () => {
  // Navigation active highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const desktopNavItems = document.querySelectorAll('.desktop-nav .nav-item');

  desktopNavItems.forEach(item => {
    const dropdownLinks = item.querySelectorAll('.dropdown-menu a');
    let hasActiveChild = false;

    dropdownLinks.forEach(link => {
      const linkPath = link.getAttribute('href') ? link.getAttribute('href').split('/').pop() : '';
      if (linkPath && linkPath === currentPath) {
        link.classList.add('active');
        hasActiveChild = true;
      } else {
        link.classList.remove('active');
      }
    });

    const parentLink = item.querySelector('.nav-link');
    if (hasActiveChild) {
      item.classList.add('active');
      if (parentLink) parentLink.classList.add('active');
    }
  });




  /* ==========================================
     2. MOBILE DRAWER NAVIGATION MENU
     ========================================== */
  const menuBtn = document.querySelector('.menu-btn');
  const menuBackdrop = document.querySelector('.menu-backdrop');
  const mobileDrawer = document.querySelector('.mobile-drawer');

  if (menuBtn && menuBackdrop && mobileDrawer && !menuBtn.dataset.menuInitialized) {
    menuBtn.dataset.menuInitialized = 'true';
    let savedScrollY = 0;

    const openMenu = () => {
      savedScrollY = window.scrollY || window.pageYOffset;
      mobileDrawer.querySelectorAll('.drawer-menu-item-group').forEach(group => {
        group.classList.remove('expanded');
        const toggleBtn = group.querySelector('.dropdown-toggle-btn');
        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
      });
      menuBtn.classList.add('active');
      menuBackdrop.classList.add('open');
      mobileDrawer.classList.add('open');
      document.documentElement.classList.add('menu-open');
      document.body.classList.add('menu-open');
      document.body.style.overflow = 'hidden';
      document.body.style.top = `-${savedScrollY}px`;
    };

    const closeMenu = () => {
      menuBtn.classList.remove('active');
      menuBackdrop.classList.remove('open');
      mobileDrawer.classList.remove('open');
      document.documentElement.classList.remove('menu-open');
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
      document.body.style.top = '';
      if (savedScrollY !== undefined && savedScrollY !== null) {
        window.scrollTo(0, savedScrollY);
      }
    };

    const toggleMenu = () => {
      const isOpen = !mobileDrawer.classList.contains('open');
      if (isOpen) {
        openMenu();
      } else {
        closeMenu();
      }
    };

    menuBtn.addEventListener('click', toggleMenu);
    menuBackdrop.addEventListener('click', closeMenu);

    menuBackdrop.addEventListener('touchmove', (e) => {
      if (e.cancelable) e.preventDefault();
    }, { passive: false });

    // Close menu drawer on navigation link clicks
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
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
