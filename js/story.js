if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

const initStoryApp = () => {
  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }

  /* ==========================================
     0. ACTIVE NAV ITEM AUTO-HIGHLIGHT
     ========================================== */
  const rawPath = window.location.pathname.split('/').pop();
  const currentPath = (!rawPath || rawPath === '' || rawPath === 'index.html') ? 'index.html' : rawPath;

  // Clear existing active states first
  document.querySelectorAll('.desktop-nav .nav-item').forEach(item => item.classList.remove('active'));
  document.querySelectorAll('.desktop-nav .nav-link').forEach(link => link.classList.remove('active'));
  document.querySelectorAll('.desktop-nav .dropdown-item').forEach(item => item.classList.remove('active'));
  document.querySelectorAll('.mobile-drawer .drawer-menu-item').forEach(item => item.classList.remove('active'));
  document.querySelectorAll('.mobile-drawer .drawer-submenu-item').forEach(item => item.classList.remove('active'));

  if (currentPath === 'index.html') {
    // On Homepage, ONLY highlight Home nav link
    const homeNav = document.querySelector('.desktop-nav > .nav-item:first-child');
    if (homeNav) {
      homeNav.classList.add('active');
      const homeLink = homeNav.querySelector('.nav-link');
      if (homeLink) homeLink.classList.add('active');
    }
    const mobileHome = document.querySelector('.mobile-drawer a[href*="index.html"]');
    if (mobileHome) mobileHome.classList.add('active');
  } else {
    // On subpages, highlight matching page and its parent dropdown
    document.querySelectorAll('.desktop-nav .dropdown-item').forEach(item => {
      const href = item.getAttribute('href');
      if (!href) return;
      const cleanHref = href.replace('./', '').split('/').pop();
      if (cleanHref === currentPath && cleanHref !== 'index.html') {
        item.classList.add('active');
        const parentNav = item.closest('.nav-item');
        if (parentNav) {
          parentNav.classList.add('active');
          const mainLink = parentNav.querySelector('.nav-link');
          if (mainLink) mainLink.classList.add('active');
        }
      }
    });

    document.querySelectorAll('.desktop-nav > .nav-item > .nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const cleanHref = href.replace('./', '').split('/').pop();
      if (cleanHref === currentPath && cleanHref !== '#') {
        link.classList.add('active');
        const parentNav = link.closest('.nav-item');
        if (parentNav) parentNav.classList.add('active');
      }
    });

    document.querySelectorAll('.mobile-drawer .drawer-submenu-item').forEach(item => {
      const href = item.getAttribute('href');
      if (!href) return;
      const cleanHref = href.replace('./', '').split('/').pop();
      if (cleanHref === currentPath && cleanHref !== 'index.html') {
        item.classList.add('active');
        const parentGroup = item.closest('.drawer-menu-item-group');
        if (parentGroup) {
          const toggleBtn = parentGroup.querySelector('.drawer-menu-item');
          if (toggleBtn) toggleBtn.classList.add('active');
        }
      }
    });
  }

  /* ==========================================
     1. GLOBAL ANIMATION LAYER (GSAP REVEALS)
     ========================================== */
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      // Reveal every section and footer as it scrolls in (excluding hero section)
      const revealTargets = gsap.utils.toArray('section, footer').filter(el => !el.classList.contains('about-hero-section'));
      revealTargets.forEach(el => {
        gsap.fromTo(el,
          { autoAlpha: 0, y: 56 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true,
            }
          }
        );
      });


      
      // Timeline SVG Winding Path logic
      const timelineWrapper = document.querySelector('.timeline-wrapper');
      const svgTrack = document.querySelector('.timeline-svg-track');
      const svgProgress = document.querySelector('.timeline-svg-progress');

      const updateTimelineSvgPath = () => {
        if (!timelineWrapper || !svgTrack) return;
        const items = document.querySelectorAll('.timeline-item');
        if (items.length === 0) return;

        const wrapperRect = timelineWrapper.getBoundingClientRect();
        const points = [];

        items.forEach(item => {
          const pin = item.querySelector('.timeline-pin');
          if (pin) {
            const pinRect = pin.getBoundingClientRect();
            const x = pinRect.left + pinRect.width / 2 - wrapperRect.left;
            const y = pinRect.top + pinRect.height / 2 - wrapperRect.top;
            points.push({ x, y });
          }
        });

        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
          d += ` L ${points[i].x} ${points[i].y}`;
        }

        svgTrack.setAttribute('d', d);
        if (svgProgress) {
          svgProgress.setAttribute('d', d);
          const totalLength = svgProgress.getTotalLength();
          if (totalLength) {
            svgProgress.style.strokeDasharray = totalLength;
            svgProgress.style.strokeDashoffset = totalLength;
          }
        }
      };

      updateTimelineSvgPath();
      window.addEventListener('resize', updateTimelineSvgPath);

      if (timelineWrapper && svgProgress) {
        gsap.to(svgProgress, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: timelineWrapper,
            start: 'top 65%',
            end: 'bottom 75%',
            scrub: 0.5
          }
        });
      }

      // Timeline items scroll animation (Directional slide-in & dot pop)
      const timelineItems = gsap.utils.toArray('.timeline-item');
      timelineItems.forEach(item => {
        const isRight = item.classList.contains('right');
        const card = item.querySelector('.timeline-content-card');
        const pin = item.querySelector('.timeline-pin') || item.querySelector('.timeline-dot');

        // Timeline Pin Pop Animation
        if (pin) {
          gsap.fromTo(pin,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.6,
              ease: 'back.out(2.2)',
              scrollTrigger: {
                trigger: item,
                start: 'top 82%',
                once: true
              }
            }
          );
        }

        // Timeline Content Card Directional Reveal Animation
        if (card) {
          gsap.fromTo(card,
            {
              autoAlpha: 0,
              x: isRight ? 70 : -70,
              y: 25,
              scale: 0.95
            },
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              scale: 1,
              duration: 0.85,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 84%',
                once: true,
                onEnter: () => {
                  item.classList.add('active');
                }
              }
            }
          );
        }
      });
    } else {
      // Fallback for reduced motion
      gsap.set('section, footer', { autoAlpha: 1, y: 0 });
    }

    // Refresh ScrollTrigger when images load to ensure correct layouts
    const refreshTrigger = () => ScrollTrigger.refresh();
    window.addEventListener('load', refreshTrigger);
    setTimeout(refreshTrigger, 1000);
  }

  function splitTextIntoRevealLines(element) {
    const text = element.textContent.trim();
    if (!text) return;
    
    // Temporarily save inner HTML structure to preserve styled highlights (e.g. <span class="green">)
    // If heading has inner tags, we handle word wrapping node-by-node.
    const hasHTML = element.innerHTML.trim() !== text;
    
    if (!hasHTML) {
      const words = text.split(/\s+/);
      element.innerHTML = words.map(w => `<span class="temp-word">${w}</span>`).join(' ');
      
      const wordSpans = element.querySelectorAll('.temp-word');
      const lines = [];
      let currentLine = [];
      let currentY = -1;
      
      wordSpans.forEach(span => {
        const y = span.offsetTop;
        if (y !== currentY) {
          if (currentLine.length > 0) lines.push(currentLine);
          currentLine = [span];
          currentY = y;
        } else {
          currentLine.push(span);
        }
      });
      if (currentLine.length > 0) lines.push(currentLine);
      
      element.innerHTML = '';
      lines.forEach(lineWords => {
        const lineText = lineWords.map(span => span.textContent).join(' ');
        
        const maskDiv = document.createElement('div');
        maskDiv.className = 'text-reveal-mask';
        maskDiv.style.overflow = 'hidden';
        maskDiv.style.display = 'block';
        
        const lineDiv = document.createElement('div');
        lineDiv.className = 'text-reveal-line';
        lineDiv.textContent = lineText;
        lineDiv.style.display = 'block';
        
        maskDiv.appendChild(lineDiv);
        element.appendChild(maskDiv);
      });
    } else {
      // Fallback for headings with styled HTML tags: wrap directly to fade up
      const childrenHtml = element.innerHTML;
      element.innerHTML = `<div class="text-reveal-mask" style="overflow:hidden; display:block;"><div class="text-reveal-line" style="display:block;">${childrenHtml}</div></div>`;
    }
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

    // Close menu drawer on navigation link clicks (hash navigation)
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


  /* ==========================================
     3. TESTIMONIALS YOUTUBE OVERLAY PLAYBACK
     ========================================== */
  const testimonialsSec = document.getElementById('testimonials');
  const videoOverlay = document.querySelector('.video-preview-overlay');

  if (testimonialsSec && videoOverlay) {
    const playButtons = testimonialsSec.querySelectorAll('.play-button');
    const closeBtn = videoOverlay.querySelector('.video-preview-close');
    const iframe = videoOverlay.querySelector('.video-preview-player');
    const titleText = videoOverlay.querySelector('.video-preview-caption-title');
    const noteText = videoOverlay.querySelector('.video-preview-caption-note');

    // Video Testimonials Carousel Navigation Controls
    const videoPrevBtn = testimonialsSec.querySelector('.testimonials-header-right .testimonials-prev-btn');
    const videoNextBtn = testimonialsSec.querySelector('.testimonials-header-right .testimonials-next-btn');
    const videoWrapper = testimonialsSec.querySelector('.video-testimonials-wrapper');

    if (videoPrevBtn && videoNextBtn && videoWrapper) {
      videoPrevBtn.addEventListener('click', () => {
        videoWrapper.scrollBy({ left: -312, behavior: 'smooth' });
      });

      videoNextBtn.addEventListener('click', () => {
        videoWrapper.scrollBy({ left: 312, behavior: 'smooth' });
      });
    }

    // Written Testimonials Carousel Navigation Controls
    const writtenPrevBtn = testimonialsSec.querySelector('.written-prev-btn');
    const writtenNextBtn = testimonialsSec.querySelector('.written-next-btn');
    const writtenWrapper = testimonialsSec.querySelector('.written-testimonials-wrapper');

    if (writtenPrevBtn && writtenNextBtn && writtenWrapper) {
      writtenPrevBtn.addEventListener('click', () => {
        writtenWrapper.scrollBy({ left: -424, behavior: 'smooth' });
      });

      writtenNextBtn.addEventListener('click', () => {
        writtenWrapper.scrollBy({ left: 424, behavior: 'smooth' });
      });
    }

    const videoMap = {
      'rithika-suits': {
        title: 'The Journey Behind Rithika Suits with Arun Malve | Founders in Frame',
        youtubeId: 'UCm6J1nXzBk',
        start: 313
      },
      'subramanyam': {
        title: 'Client Testimonial',
        youtubeId: 'ZlFzLXwgvtk',
        start: 466
      },
      'stabaka': {
        title: 'Building the Brand Stabaka',
        youtubeId: 'L30rtzNLQoY',
        start: 0,
        note: 'This interview is not a testimonial. It focuses on the journey of building the Stabaka brand.'
      },
      'accel1': {
        title: 'Accel1 Founder Testimonial',
        youtubeId: 'bt96tscmCw0',
        start: 46
      },
      'decade-journey': {
        title: 'A Decade of Professional Relationship',
        youtubeId: 'QaQAyjqGxSI',
        start: 151
      }
    };

    playButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Find which testimonial video based on markup wrappers
        const cardWrapper = btn.closest('.video-card');
        if (!cardWrapper) return;
        
        // Find card key/id
        const key = cardWrapper.getAttribute('data-id');
        const config = videoMap[key];
        if (!config) return;

        titleText.textContent = config.title;
        noteText.textContent = config.note || '';
        
        iframe.src = `https://www.youtube.com/embed/${config.youtubeId}?start=${config.start}&autoplay=1&rel=0`;
        videoOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });

    const closeVideo = () => {
      videoOverlay.style.display = 'none';
      iframe.src = '';
      document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeVideo);
    videoOverlay.addEventListener('click', closeVideo);
    
    videoOverlay.querySelector('.video-preview-modal').addEventListener('click', (e) => {
      e.stopPropagation();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoOverlay.style.display === 'flex') {
        closeVideo();
      }
    });
  }


  /* ==========================================
     4. CONTACT FORM HANDLER & INTEGRATIONS
     ========================================== */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm && !contactForm.dataset.formInitialized) {
    contactForm.dataset.formInitialized = 'true';
    const servicesList = [
      'UI/UX Design',
      'Web Development',
      'App Development',
      'AEO Services',
      'GEO Services',
      'SEO Services',
    ];

    // Build Custom Dropdown Menu triggers
    const trigger = contactForm.querySelector('.contact-custom-dropdown-trigger');
    const container = contactForm.querySelector('.contact-custom-dropdown-container');
    const hiddenInput = contactForm.querySelector('input[name="service"]');
    let selectedDisplay = null;
    
    if (trigger && container && hiddenInput) {
      selectedDisplay = trigger.querySelector('.contact-dropdown-selected-value');

      // Create dropdown selection block options dynamically
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
          trigger.classList.remove('active');
          const chevron = trigger.querySelector('.contact-dropdown-chevron');
          if (chevron) chevron.classList.remove('open');
        });
        ul.appendChild(li);
      });
      container.appendChild(ul);

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = ul.style.display === 'block';
        ul.style.display = isOpen ? 'none' : 'block';
        trigger.classList.toggle('active', !isOpen);
        const chevron = trigger.querySelector('.contact-dropdown-chevron');
        if (chevron) chevron.classList.toggle('open', !isOpen);
      });

      document.addEventListener('click', () => {
        ul.style.display = 'none';
        trigger.classList.remove('active');
        const chevron = trigger.querySelector('.contact-dropdown-chevron');
        if (chevron) chevron.classList.remove('open');
      });
    }

    // Real-Time URL Previews Collapse/Dropdown handling
    const websiteInput = document.getElementById('website');
    const previewCollapse = contactForm.querySelector('.contact-website-preview-collapse');
    const previewChevron = contactForm.querySelector('.contact-website-field .contact-dropdown-chevron');
    const previewIframe = contactForm.querySelector('.contact-preview-iframe');
    const previewHint = contactForm.querySelector('.contact-preview-hint');
    const previewLoading = contactForm.querySelector('.contact-preview-loading');
    
    let typingTimer;
    let previewOpenToken = 0;

    const normalizeUrl = (input) => {
      const trimmed = input.trim();
      if (!trimmed) return '';
      return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    };

    const DOMAIN_RE = /^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;
    const getPreviewableUrl = (input) => {
      const normalized = normalizeUrl(input);
      if (!normalized) return '';
      try {
        const parsed = new URL(normalized);
        return DOMAIN_RE.test(parsed.hostname) ? parsed.href : '';
      } catch {
        return '';
      }
    };

    const loadWebsitePreview = () => {
      const previewUrl = getPreviewableUrl(websiteInput.value);
      if (!previewUrl) {
        hidePreview();
        return;
      }

      previewLoading.style.display = 'block';
      previewIframe.src = previewUrl;
      previewIframe.style.opacity = '0';
      previewHint.querySelector('a').href = previewUrl;

      // Handle loading events
      previewIframe.onload = () => {
        previewLoading.style.display = 'none';
        previewIframe.style.opacity = '1';
      };

      showPreview();
    };

    const showPreview = () => {
      previewCollapse.classList.remove('is-collapsed');
      if (previewChevron) previewChevron.classList.add('open');
      
      // Auto-collapse after 3 seconds
      previewOpenToken++;
      const currentToken = previewOpenToken;
      setTimeout(() => {
        if (currentToken === previewOpenToken) {
          hidePreview();
        }
      }, 3000);
    };

    const hidePreview = () => {
      previewCollapse.classList.add('is-collapsed');
      if (previewChevron) previewChevron.classList.remove('open');
    };

    websiteInput.addEventListener('input', () => {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(loadWebsitePreview, 600);
    });

    websiteInput.addEventListener('focus', () => {
      if (getPreviewableUrl(websiteInput.value)) {
        showPreview();
      }
    });

    if (previewChevron) {
      previewChevron.addEventListener('click', (e) => {
        e.stopPropagation();
        const isCollapsed = previewCollapse.classList.contains('is-collapsed');
        if (isCollapsed) {
          loadWebsitePreview();
        } else {
          hidePreview();
        }
      });
    }

    // Close preview window when clicking outside
    document.addEventListener('mousedown', (e) => {
      if (!websiteInput.closest('.contact-website-field').contains(e.target)) {
        hidePreview();
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

    const BREVO_API_KEY = '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';
    const CRM_URL = 'https://crmadmin.whysocial.in/api/add-enquiry';

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
      if (!recaptchaResponse) {
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
      const website = document.getElementById('website').value.trim();
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
        const response = await fetch('./contact-mailer.php', {
          method: 'POST',
          body: formData
        });

        const responseText = await response.text();
        let result;
        let isPhpActive = true;
        try {
          result = JSON.parse(responseText);
        } catch (parseErr) {
          isPhpActive = false;
        }

        if (!response.ok || !isPhpActive || !result.success) {
          const IS_LOCAL = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
          if (IS_LOCAL) {
            console.warn('Local testing detected without PHP execution. Falling back to direct client-side APIs...');
            
            const BREVO_API_KEY = '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';
            const CRM_URL = 'https://crmadmin.whysocial.in/api/add-enquiry';
            const payload = { fullName, phone, email, website, service, message };
            
            const [emailSuccess] = await Promise.all([
              // 1. Send admin notification email to admin team
              sendBrevoEmail({
                apiKey: BREVO_API_KEY,
                sender: { name: 'eParivartan', email: 'smo@eparivartan.com' },
                to: [
                  { email: 'feedback@eparivartan.com', name: 'eParivartan Team' },
                  { email: 'chaitanya.eparivartan@gmail.com', name: 'Chaitanya' }
                ],
                replyTo: { email, name: fullName },
                subject: `New Enquiry — ${fullName}`,
                htmlContent: getAdminEmailHtml(payload)
              }),
              // 2. Send client confirmation email
              sendBrevoEmail({
                apiKey: BREVO_API_KEY,
                sender: { name: 'eParivartan', email: 'smo@eparivartan.com' },
                to: [{ email, name: fullName }],
                subject: "We've received your enquiry — eParivartan",
                htmlContent: getClientEmailHtml(payload)
              }),
              // 3. Post lead to CRM
              pushToCrm(CRM_URL, payload)
            ]);

            if (!emailSuccess) {
              throw new Error('Email notification sending failed via direct API');
            }
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

    async function sendBrevoEmail({ apiKey, sender, to, replyTo, subject, htmlContent }) {
      try {
        const body = { sender, to, subject, htmlContent };
        if (replyTo) body.replyTo = replyTo;

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': apiKey,
            'content-type': 'application/json',
            accept: 'application/json'
          },
          body: JSON.stringify(body)
        });
        return response.ok;
      } catch (e) {
        console.error('Brevo API error: ', e);
        return false;
      }
    }

    async function pushToCrm(url, data) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            accept: 'application/json'
          },
          body: JSON.stringify({
            full_name: data.fullName,
            phone_number: data.phone,
            email: data.email,
            website_url: data.website,
            source: 'eParivartan',
            message: data.message,
            status: 'New'
          })
        });
        return response.ok;
      } catch (e) {
        console.error('CRM posting error: ', e);
        return false;
      }
    }

    function getAdminEmailHtml(data) {
      return `
      <div style="background-color: #f8fafc; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);">
          <tr>
            <td style="padding: 40px 40px 24px 40px; text-align: center;">
              <img src="https://eparivartan.com/images/logo.svg" alt="eParivartan Logo" style="height: 38px; display: inline-block; vertical-align: middle;" />
              <div style="height: 1px; background-color: #f1f5f9; margin-top: 24px;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 24px 40px;">
              <span style="display: inline-block; background-color: #f0fdf4; color: #166534; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 6px 12px; border-radius: 20px; margin-bottom: 12px;">New Inquiry</span>
              <h2 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; line-height: 1.2;">Project Requirement Details</h2>
              <p style="color: #475569; font-size: 14px; margin: 8px 0 0 0; line-height: 1.5;">A new request has been submitted through the eParivartan contact form.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #f1f5f9; border-radius: 12px; overflow: hidden; background-color: #fafbfd;">
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9; width: 30%; vertical-align: top;">
                    <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: block;">Client Name</span>
                  </td>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9; vertical-align: top;">
                    <strong style="color: #0f172a; font-size: 15px; font-weight: 600;">${data.fullName}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9; vertical-align: top;">
                    <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: block;">Email</span>
                  </td>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9; vertical-align: top;">
                    <a href="mailto:${data.email}" style="color: #3b82f6; font-size: 15px; text-decoration: none; font-weight: 500;">${data.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9; vertical-align: top;">
                    <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: block;">Phone</span>
                  </td>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9; vertical-align: top;">
                    <span style="color: #0f172a; font-size: 15px; font-weight: 500;">${data.phone}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9; vertical-align: top;">
                    <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: block;">Website</span>
                  </td>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9; vertical-align: top;">
                    <span style="color: #0f172a; font-size: 15px;">${data.website ? `<a href="${data.website}" style="color: #3b82f6; text-decoration: none; font-weight: 500;">${data.website}</a>` : `<span style="color: #94a3b8; font-style: italic;">Not provided</span>`}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9; vertical-align: top;">
                    <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: block;">Service</span>
                  </td>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9; vertical-align: top;">
                    <span style="display: inline-block; background-color: #f1f5f9; color: #334155; font-size: 13px; font-weight: 600; padding: 4px 10px; border-radius: 6px;">${data.service}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; vertical-align: top;">
                    <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: block;">Message</span>
                  </td>
                  <td style="padding: 16px 20px; vertical-align: top;">
                    <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-line;">${data.message ? data.message : `<span style="color: #94a3b8; font-style: italic;">No message provided</span>`}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center;">
              <a href="mailto:${data.email}" style="display: inline-block; background-color: #85bd56; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: 600; letter-spacing: 0.5px; box-shadow: 0 4px 6px rgba(133, 189, 86, 0.15);">
                Reply to ${data.fullName}
              </a>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 40px; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.6;">
                This is an automated notification from <a href="https://eparivartan.com" style="color: #64748b; text-decoration: none; font-weight: 600;">eParivartan</a>.
              </p>
              <p style="margin: 4px 0 0 0; color: #cbd5e1; font-size: 11px;">
                Vasudha Avenue, Kavuri Hills, Hyderabad, India
              </p>
            </td>
          </tr>
        </table>
      </div>`;
    }

    function getClientEmailHtml(data) {
      return `
      <div style="background-color: #f8fafc; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);">
          <tr>
            <td style="padding: 40px 40px 24px 40px; text-align: center;">
              <img src="https://eparivartan.com/images/logo.svg" alt="eParivartan Logo" style="height: 38px; display: inline-block; vertical-align: middle;" />
              <div style="height: 1px; background-color: #f1f5f9; margin-top: 24px;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 24px 40px;">
              <span style="display: inline-block; background-color: #f0fdf4; color: #166534; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 6px 12px; border-radius: 20px; margin-bottom: 12px;">Enquiry Received</span>
              <h2 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; line-height: 1.2;">Thank you for reaching out! 🙏</h2>
              <p style="color: #475569; font-size: 15px; margin: 8px 0 0 0; line-height: 1.6;">
                Hello <strong>${data.fullName}</strong>,<br><br>
                We're glad you visited <a href="https://eparivartan.com" style="color: #85bd56; text-decoration: none; font-weight: 600;">eparivartan.com</a>. We have received your query regarding <strong>${data.service}</strong>, and a member of our team will review it and get in touch with you shortly.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-left: 4px solid #85bd56; border-radius: 0 8px 8px 0;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0; color: #2d6a2d; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">What Happens Next?</p>
                    <p style="margin: 6px 0 0 0; color: #475569; font-size: 14px; line-height: 1.6;">
                      Our consultants will analyze your project description and contact you within 24 business hours to discuss the next steps.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center;">
              <a href="https://eparivartan.com/government.html" style="display: inline-block; background-color: #85bd56; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: 600; letter-spacing: 0.5px; box-shadow: 0 4px 6px rgba(133, 189, 86, 0.15);">
                Explore Our Portfolio
              </a>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 40px; border-top: 1px solid #f1f5f9; text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="text-align: center; padding: 10px;">
                    <p style="margin: 0; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Direct Line</p>
                    <p style="margin: 4px 0 0 0; font-size: 14px; color: #1e293b; font-weight: 700;">+91 98491 65443</p>
                  </td>
                  <td width="50%" style="text-align: center; padding: 10px; border-left: 1px solid #e2e8f0;">
                    <p style="margin: 0; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Email Support</p>
                    <p style="margin: 4px 0 0 0; font-size: 14px; color: #85bd56; font-weight: 700;"><a href="mailto:feedback@eparivartan.com" style="color: #85bd56; text-decoration: none;">feedback@eparivartan.com</a></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #0f172a; padding: 20px 40px; text-align: center;">
              <p style="margin: 0; color: #94a3b8; font-size: 11px; line-height: 1.6;">
                © 2026 eParivartan. Vasudha Avenue, Road No 10, Kavuri Hills, Hyderabad - 500033
              </p>
            </td>
          </tr>
        </table>
      </div>`;
    }
  }
};

/* ==========================================
   Footer Group Accordion Toggles
   ========================================== */
document.addEventListener('click', (e) => {
  const header = e.target.closest('.footer-group-header');
  if (header) {
    e.preventDefault();
    const parentGroup = header.closest('.footer-group');
    if (parentGroup) {
      const isOpen = parentGroup.classList.toggle('open');
      header.classList.toggle('active', isOpen);
    }
  }
});

if (document.readyState !== 'loading') {
  initStoryApp();
} else {
  document.addEventListener('DOMContentLoaded', initStoryApp);
}
