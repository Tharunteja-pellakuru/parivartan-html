document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================
     1. GSAP / SCROLLTRIGGER INITIALIZATION
     ========================================== */
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.fif-hero-card', {
      duration: 1.2,
      y: 40,
      opacity: 0,
      ease: 'power3.out'
    });

    gsap.from('.fif-episode-card', {
      scrollTrigger: {
        trigger: '.fif-episodes-grid',
        start: 'top 85%'
      },
      duration: 0.8,
      y: 40,
      opacity: 0,
      stagger: 0.1,
      ease: 'power3.out',
      clearProps: 'transform'
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

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        menuBackdrop.classList.remove('open');
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    const toggleBtn = mobileDrawer.querySelector('.dropdown-toggle-btn');
    const itemGroup = mobileDrawer.querySelector('.drawer-menu-item-group');
    if (toggleBtn && itemGroup) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isExpanded = itemGroup.classList.toggle('expanded');
        toggleBtn.setAttribute('aria-expanded', isExpanded);
      });
    }
  }

  /* ==========================================
     3. VIDEO POPUP MODAL CONTROLLER (Matching home.html)
     ========================================== */
  const videoOverlay = document.getElementById('fif-video-overlay');
  const iframe = document.getElementById('fif-video-player');
  const closeBtn = document.getElementById('fif-video-close');
  const titleText = document.getElementById('fif-video-title');

  const openVideo = (videoId, start = 0, title = '') => {
    if (!videoOverlay || !iframe || !videoId) return;
    if (titleText) titleText.textContent = title;
    iframe.src = `https://www.youtube.com/embed/${videoId}?start=${start}&autoplay=1&rel=0`;
    videoOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  const closeVideo = () => {
    if (!videoOverlay || !iframe) return;
    videoOverlay.style.display = 'none';
    iframe.src = '';
    document.body.style.overflow = '';
  };

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-video-id]');
    if (trigger) {
      e.preventDefault();
      const videoId = trigger.getAttribute('data-video-id');
      const start = trigger.getAttribute('data-start') || 0;
      const titleElem = trigger.querySelector('.fif-episode-title');
      const title = titleElem ? titleElem.textContent : 'Founders in Frame';
      openVideo(videoId, start, title);
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeVideo);
  if (videoOverlay) {
    videoOverlay.addEventListener('click', closeVideo);
    const innerModal = videoOverlay.querySelector('.video-preview-modal');
    if (innerModal) {
      innerModal.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoOverlay && videoOverlay.style.display === 'flex') {
      closeVideo();
    }
  });
});
