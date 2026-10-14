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

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

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

  /* ==========================================
     3. CONTACT FORM SERVICES DROPDOWN
     ========================================== */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm && !contactForm.dataset.formInitialized) {
    contactForm.dataset.formInitialized = 'true';
    const servicesList = [
      'UI/UX Design',
      'Website Development',
      'Custom Web Application',
      'Mobile App Development',
      'E-commerce Development',
      'SEO / AEO / GEO',
      'AMC / Technology Support',
      'Other Technology Requirement',
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
    if (!videoId) return;
    const startSec = parseInt(start, 10) || 0;
    const startParam = startSec > 0 ? '&start=' + startSec : '';
    videoIframe.src = 'https://www.youtube.com/embed/' + videoId +
      '?autoplay=1&rel=0&playsinline=1' + startParam;
    if (videoTitleEl) videoTitleEl.textContent = title || 'Founders in Frame';
    
    videoOverlay.style.display = 'flex';
    void videoOverlay.offsetWidth;
    videoOverlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  // Close the modal and stop playback
  function closeVideo() {
    videoOverlay.classList.remove('is-active');
    setTimeout(function() {
      videoIframe.src = '';
      videoOverlay.style.display = 'none';
      document.body.style.overflow = '';
    }, 350);
  }

  // ── Bind every episode card directly ──
  document.querySelectorAll('.fif-episode-card').forEach(function(card) {
    // Get metadata from the card itself
    var videoId = card.getAttribute('data-video-id');
    var start   = card.getAttribute('data-start') || 0;
    var img     = card.querySelector('.fif-thumb-img');
    var titleEl = card.querySelector('.fif-episode-title');
    var metaEl  = card.querySelector('.fif-episode-meta strong');

    var title = 'Founders in Frame';
    if (img && img.getAttribute('alt')) {
      title = img.getAttribute('alt');
    } else if (titleEl) {
      title = titleEl.textContent.trim() + (metaEl ? ' — ' + metaEl.textContent.trim() : '');
    }

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

  // Also bind the hero "Watch Latest Episode" button if present
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
      e.preventDefault();
      e.stopPropagation();
      closeVideo();
    });
  }

  // Click backdrop (overlay) to close, but not inner modal
  videoOverlay.addEventListener('click', function(e) {
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
    if (e.key === 'Escape' && (videoOverlay.classList.contains('is-active') || videoOverlay.style.display === 'flex')) {
      closeVideo();
    }
  });

    // reCAPTCHA init script configuration
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

    // Form Submissions API Integration
    const submitBtn = contactForm.querySelector('.contact-submit-btn');
    const toast = document.querySelector('.contact-toast-container');
    const toastClose = document.querySelector('.contact-toast-close');

    // Clear statuses
    const clearFormStatus = () => {
      const oldStatus = contactForm.querySelector('.contact-form-status');
      if (oldStatus) oldStatus.remove();
    };

    const displayFormStatus = (msg, isError) => {
      clearFormStatus();
      const p = document.createElement('p');
      p.className = `contact-form-status contact-form-status-${isError ? 'error' : 'success'}`;
      p.textContent = msg;
      submitBtn.parentNode.insertBefore(p, submitBtn);
    };

    // Toast notifications timer logic
    let toastTimer;
    const showToast = () => {
      if (toast) {
        toast.classList.add('is-visible');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          toast.classList.remove('is-visible');
        }, 5000);
      }
    };

    if (toastClose && toast) {
      toastClose.addEventListener('click', () => {
        toast.classList.remove('is-visible');
      });
    }

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const recaptchaResponse = window.grecaptcha ? window.grecaptcha.getResponse() : '';
      const isLocalHost = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
      if (!recaptchaResponse && !isLocalHost) {
        displayFormStatus('Please complete the reCAPTCHA before submitting.', true);
        return;
      }

      submitBtn.disabled = true;
      const btnSpan = submitBtn.querySelector('span');
      const originalBtnText = btnSpan.textContent;
      btnSpan.textContent = 'Sending…';
      clearFormStatus();

      const fullName = document.getElementById('fullName').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();
      let website = document.getElementById('website').value.trim();
      if (website && !/^https?:\/\//i.test(website)) {
        website = 'https://' + website;
      }
      const service = hiddenInput.value;
      const message = document.getElementById('message').value.trim();

      // Submit via backend mailer
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('phone', phone);
      formData.append('email', email);
      formData.append('website', website);
      formData.append('service', service);
      formData.append('message', message);
      formData.append('g-recaptcha-response', recaptchaResponse);

      try {
        const response = await fetch('./contact.php', {
          method: 'POST',
          body: formData
        });

        const isLocalHost = window.location.hostname === 'localhost' || 
                            window.location.hostname === '127.0.0.1' || 
                            window.location.protocol === 'file:';

        const responseText = await response.text();
        let result = null;
        try {
          result = JSON.parse(responseText);
        } catch (parseErr) {
          result = null;
        }

        if (!response.ok || !result || !result.success) {
          if (isLocalHost && (!result || !result.errors)) {
            result = { success: true };
          } else {
            const errMsg = (result && result.errors) ? result.errors.join(' ') : 'Server returned an invalid response. Please try again.';
            throw new Error(errMsg);
          }
        }

        // Reset form inputs
        contactForm.reset();
        hiddenInput.value = '';
        if (selectedDisplay) {
          selectedDisplay.textContent = 'Select service';
          selectedDisplay.classList.add('placeholder');
        }
        if (window.grecaptcha) window.grecaptcha.reset();

        displayFormStatus("Message sent! Thanks for reaching out — we'll be in touch shortly.", false);
        showToast();
      } catch (err) {
        console.error('Submission failed: ', err);
        displayFormStatus(err.message || 'Something went wrong. Please try again or reach us directly.', true);
      } finally {
        submitBtn.disabled = false;
        btnSpan.textContent = originalBtnText;
      }
    });

    
});


