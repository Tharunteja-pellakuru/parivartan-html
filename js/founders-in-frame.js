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
     3. CONTACT FORM SERVICES DROPDOWN
     ========================================== */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const servicesList = [
      'UI/UX Design',
      'Web Development',
      'App Development',
      'AEO Services',
      'GEO Services',
      'SEO Services',
    ];

    const dropTrigger = contactForm.querySelector('.contact-custom-dropdown-trigger');
    const dropContainer = contactForm.querySelector('.contact-custom-dropdown-container');
    const hiddenInput = contactForm.querySelector('input[name="service"]');

    if (dropTrigger && dropContainer && hiddenInput) {
      const selectedDisplay = dropTrigger.querySelector('.contact-dropdown-selected-value');
      const ul = document.createElement('ul');
      ul.className = 'contact-custom-dropdown-options';
      ul.style.display = 'none';

      servicesList.forEach(service => {
        const li = document.createElement('li');
        li.className = 'contact-custom-dropdown-option';
        li.textContent = service;
        li.addEventListener('click', (e) => {
          e.stopPropagation();
          hiddenInput.value = service;
          if (selectedDisplay) {
            selectedDisplay.textContent = service;
            selectedDisplay.classList.remove('placeholder');
          }
          ul.style.display = 'none';
          dropTrigger.classList.remove('active');
          const chevron = dropTrigger.querySelector('.contact-dropdown-chevron');
          if (chevron) chevron.classList.remove('open');
        });
        ul.appendChild(li);
      });
      dropContainer.appendChild(ul);

      dropTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = ul.style.display === 'block';
        ul.style.display = isOpen ? 'none' : 'block';
        dropTrigger.classList.toggle('active', !isOpen);
        const chevron = dropTrigger.querySelector('.contact-dropdown-chevron');
        if (chevron) chevron.classList.toggle('open', !isOpen);
      });

      document.addEventListener('click', () => {
        ul.style.display = 'none';
        dropTrigger.classList.remove('active');
        const chevron = dropTrigger.querySelector('.contact-dropdown-chevron');
        if (chevron) chevron.classList.remove('open');
      });
    }
  }

  /* ==========================================
     4. VIDEO POPUP MODAL — DIRECT CARD BINDING
     ========================================== */
  const videoOverlay = document.getElementById('fif-video-overlay');
  const videoIframe = document.getElementById('fif-video-player');
  const videoCloseBtn = document.getElementById('fif-video-close');
  const videoTitleEl = document.getElementById('fif-video-title');
  const videoModal = videoOverlay ? videoOverlay.querySelector('.video-preview-modal') : null;

  if (!videoOverlay || !videoIframe) {
    console.warn('[FIF] Video overlay or player iframe not found in DOM.');
    return;
  }

  // Open a video in the modal
  function openVideo(videoId, start, title) {
    videoIframe.src = 'https://www.youtube.com/embed/' + videoId +
      '?autoplay=1&rel=0&start=' + (start || 0);
    if (videoTitleEl) videoTitleEl.textContent = title || '';
    videoOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  // Close the modal and stop playback
  function closeVideo() {
    videoOverlay.style.display = 'none';
    videoIframe.src = '';
    document.body.style.overflow = '';
  }

  // ── Bind every episode card directly ──
  document.querySelectorAll('.fif-episode-card').forEach(function(card) {
    // Get metadata from the card itself
    var videoId = card.getAttribute('data-video-id');
    var start   = card.getAttribute('data-start') || 0;
    var titleEl = card.querySelector('.fif-episode-title');
    var title   = titleEl ? titleEl.textContent.trim() : 'Founders in Frame';

    if (!videoId) return;

    card.addEventListener('click', function(e) {
      // Don't open if the user clicked the "View more podcasts" link or close btn
      if (e.target.closest('.fif-view-more-btn')) return;
      e.preventDefault();
      e.stopPropagation();
      openVideo(videoId, start, title);
    });

    // Also block the inner <a> from navigating away
    var thumbLink = card.querySelector('.fif-thumb-container');
    if (thumbLink) {
      thumbLink.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openVideo(videoId, start, title);
      });
    }
  });

  // Also bind the hero "Watch Latest Episode" button
  var heroBtn = document.querySelector('.fif-hero-btn[data-video-id]');
  if (heroBtn) {
    heroBtn.addEventListener('click', function(e) {
      e.preventDefault();
      var vid   = heroBtn.getAttribute('data-video-id');
      var start = heroBtn.getAttribute('data-start') || 0;
      if (vid) openVideo(vid, start, 'Founders in Frame — Latest Episode');
    });
  }

  // ── Close handlers ──
  if (videoCloseBtn) {
    videoCloseBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      closeVideo();
    });
  }

  // Click backdrop (overlay) to close, but not inner modal
  videoOverlay.addEventListener('click', function(e) {
    // Only close if clicking the dark backdrop, not the modal content
    if (e.target === videoOverlay) {
      closeVideo();
    }
  });

  if (videoModal) {
    videoModal.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }

  // ESC key to close
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && videoOverlay.style.display === 'flex') {
      closeVideo();
    }
  });

});
