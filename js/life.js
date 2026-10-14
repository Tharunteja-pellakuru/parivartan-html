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
    ? '6LdrhwoUAAAAAEAxk89vkEx3Oy6to5THBRDSfbGx' // Public Google validation key
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

  /* ==========================================
     3. TIMELINE CAROUSEL & THUMBNAIL SWITCHER
     ========================================== */
  const timelineCards = document.querySelectorAll('.timeline-card');
  timelineCards.forEach(card => {
    const mainImg = card.querySelector('.timeline-main-img');
    const thumbs = card.querySelectorAll('.timeline-thumb');
    const prevBtn = card.querySelector('.timeline-nav-prev');
    const nextBtn = card.querySelector('.timeline-nav-next');

    if (!mainImg || thumbs.length === 0) return;

    function setActiveThumb(index) {
      if (index < 0) index = thumbs.length - 1;
      if (index >= thumbs.length) index = 0;

      thumbs.forEach(t => t.classList.remove('is-active'));
      const activeThumb = thumbs[index];
      if (!activeThumb) return;

      activeThumb.classList.add('is-active');
      const newSrc = activeThumb.getAttribute('data-src');

      if (newSrc && mainImg.getAttribute('src') !== newSrc) {
        mainImg.classList.add('fade-out');
        setTimeout(() => {
          mainImg.src = newSrc;
          mainImg.classList.remove('fade-out');
        }, 150);
      }
    }

    thumbs.forEach((thumb, idx) => {
      thumb.addEventListener('click', () => {
        setActiveThumb(idx);
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentActive = card.querySelector('.timeline-thumb.is-active');
        const currentIndex = currentActive ? Array.from(thumbs).indexOf(currentActive) : 0;
        setActiveThumb(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentActive = card.querySelector('.timeline-thumb.is-active');
        const currentIndex = currentActive ? Array.from(thumbs).indexOf(currentActive) : 0;
        setActiveThumb(currentIndex + 1);
      });
    }
  });

  /* ==========================================
     4. TIMELINE CARD VIEW MORE & EXPANDED DRAWER
     ========================================== */
  const viewMoreButtons = document.querySelectorAll('.timeline-view-more-btn');
  viewMoreButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.timeline-card');
      if (!card) return;
      const isExpanded = card.classList.toggle('is-expanded');
      const span = btn.querySelector('span');
      if (span) {
        span.textContent = isExpanded ? 'View less' : 'View more';
      }
    });
  });

  /* ==========================================
     5. DRAWER IMAGE & VIDEO TAB TOGGLE SWITCHER
     ========================================== */
  document.querySelectorAll('.timeline-card-drawer').forEach(drawer => {
    const tabButtons = drawer.querySelectorAll('.timeline-tab-btn');
    const panes = drawer.querySelectorAll('.timeline-tab-pane');

    tabButtons.forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        const target = tabBtn.getAttribute('data-tab');

        tabButtons.forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        tabBtn.classList.add('is-active');
        tabBtn.setAttribute('aria-selected', 'true');

        panes.forEach(pane => {
          if (pane.getAttribute('data-pane') === target) {
            pane.classList.add('is-active');
          } else {
            pane.classList.remove('is-active');
          }
        });
      });
    });
  });

  /* ==========================================
     6. AWARDS IMAGE LIGHTBOX MODAL
     ========================================== */
  const lightboxModal = document.getElementById('awards-lightbox-modal');
  const lightboxImg = document.getElementById('awards-lightbox-img');
  const lightboxCaption = document.getElementById('awards-lightbox-caption');
  const lightboxClose = document.querySelector('.awards-lightbox-close');
  const lightboxOverlay = document.querySelector('.awards-lightbox-overlay');

  if (lightboxModal && lightboxImg) {
    const openLightbox = (src, caption) => {
      lightboxImg.src = src;
      if (lightboxCaption) lightboxCaption.textContent = caption || '';
      lightboxModal.style.display = 'flex';
      lightboxModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightboxModal.style.display = 'none';
      lightboxModal.setAttribute('aria-hidden', 'true');
      lightboxImg.src = '';
      document.body.style.overflow = '';
    };

    document.querySelectorAll('.timeline-image-item').forEach(item => {
      item.addEventListener('click', () => {
        const fullSrc = item.getAttribute('data-full-src') || item.querySelector('img')?.src;
        const cap = item.querySelector('.timeline-image-caption')?.textContent?.trim() || item.querySelector('img')?.alt || '';
        if (fullSrc) openLightbox(fullSrc, cap);
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.style.display === 'flex') {
        closeLightbox();
      }
    });
  }
});
