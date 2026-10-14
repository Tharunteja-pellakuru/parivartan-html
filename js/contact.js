const initContactApp = () => {
  /* ==========================================
     1. GLOBAL ANIMATION LAYER (GSAP REVEALS)
     ========================================== */
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      // Reveal every section and footer as it scrolls in
      const revealTargets = gsap.utils.toArray('section, footer');
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

    // Close menu drawer on navigation link clicks (hash navigation)
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


  /* ==========================================
     3. FAQS ACCORDION TOGGLES
     ========================================== */
  const faqsSec = document.getElementById('faqs');
  if (faqsSec && !faqsSec.dataset.faqInitialized) {
    faqsSec.dataset.faqInitialized = 'true';
    const items = faqsSec.querySelectorAll('.faq-item-card');
    const openPath = 'M8.0137 14.6135L14.6134 8.01388M8.0137 8.01388L14.6134 14.6135';
    const closedPath = 'M11.5 7V16M7 11.5H16';

    items.forEach(card => {
      card.addEventListener('click', () => {
        const isOpen = card.classList.contains('is-open');
        
        // Close all other elements
        items.forEach(item => {
          item.classList.remove('is-open');
          const path = item.querySelector('.faq-toggle-btn svg path');
          if (path) path.setAttribute('d', closedPath);
        });

        if (!isOpen) {
          card.classList.add('is-open');
          const path = card.querySelector('.faq-toggle-btn svg path');
          if (path) path.setAttribute('d', openPath);
        }
      });
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
      'Website Development',
      'Custom Web Application',
      'Mobile App Development',
      'E-commerce Development',
      'SEO / AEO / GEO',
      'AMC / Technology Support',
      'Other Technology Requirement',
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
    const isProduction = ['eparivartan.com', 'www.eparivartan.com'].includes(window.location.hostname);
    const RECAPTCHA_SITE_KEY = isProduction
      ? '6LdrhwoUAAAAAEAxk89vkEx3Oy6to5THBRDSfbGx'
      : '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

    const recaptchaContainer = document.getElementById('contact-recaptcha');
    if (recaptchaContainer) {
      recaptchaContainer.setAttribute('data-sitekey', RECAPTCHA_SITE_KEY);
      recaptchaContainer.classList.add('g-recaptcha');
    }

    let recaptchaRendered = false;
    const renderRecaptchaWidget = () => {
      if (recaptchaRendered) return;
      const target = document.getElementById('contact-recaptcha');
      if (!target) return;
      if (target.children.length > 0 && target.querySelector('iframe')) {
        recaptchaRendered = true;
        return;
      }
      if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
        try {
          window.grecaptcha.render(target, { sitekey: RECAPTCHA_SITE_KEY });
          recaptchaRendered = true;
        } catch (e) {
          if (String(e).toLowerCase().includes('already been rendered')) {
            recaptchaRendered = true;
          }
        }
      }
    };

    if (window.grecaptcha && typeof window.grecaptcha.ready === 'function') {
      window.grecaptcha.ready(renderRecaptchaWidget);
    }

    let recaptchaAttempts = 0;
    const recaptchaCheckInterval = setInterval(() => {
      recaptchaAttempts++;
      if (recaptchaRendered || recaptchaAttempts > 25) {
        clearInterval(recaptchaCheckInterval);
        return;
      }
      if (window.grecaptcha) {
        if (typeof window.grecaptcha.ready === 'function') {
          window.grecaptcha.ready(renderRecaptchaWidget);
        } else if (typeof window.grecaptcha.render === 'function') {
          renderRecaptchaWidget();
        }
      }
    }, 400);

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
      
      const isLocalHost = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
      const recaptchaResponse = window.grecaptcha ? window.grecaptcha.getResponse() : '';
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

        const responseText = await response.text();
        let result = null;
        try {
          result = JSON.parse(responseText);
        } catch (parseErr) {
          result = null;
        }

        if (!response.ok || !result || !result.success) {
          const errMsg = (result && result.errors) ? result.errors.join(' ') : 'Server returned an invalid response. Please try again.';
          throw new Error(errMsg);
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
  }
};

if (document.readyState !== 'loading') {
  initContactApp();
} else {
  document.addEventListener('DOMContentLoaded', initContactApp);
}
