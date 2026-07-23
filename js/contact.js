document.addEventListener('DOMContentLoaded', () => {
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

  if (menuBtn && menuBackdrop && mobileDrawer) {
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
     3. FAQS ACCORDION TOGGLES
     ========================================== */
  const faqsSec = document.getElementById('faqs');
  if (faqsSec) {
    const items = faqsSec.querySelectorAll('.faq-item-card');

    items.forEach(card => {
      card.addEventListener('click', () => {
        const isOpen = card.classList.contains('is-open');
        
        // Close all other elements
        items.forEach(item => {
          item.classList.remove('is-open');
          const path = item.querySelector('.faq-toggle-btn svg path');
          if (path) path.setAttribute('d', 'M11.5 7V16M7 11.5H16');
        });

        if (!isOpen) {
          card.classList.add('is-open');
          const path = card.querySelector('.faq-toggle-btn svg path');
          if (path) path.setAttribute('d', 'M7 11.5H16');
        }
      });
    });
  }

  /* ==========================================
     4. CONTACT FORM HANDLER & INTEGRATIONS
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

    // Build Custom Dropdown Menu triggers
    const trigger = contactForm.querySelector('.contact-custom-dropdown-trigger');
    const container = contactForm.querySelector('.contact-custom-dropdown-container');
    const hiddenInput = contactForm.querySelector('input[name="service"]');
    const selectedDisplay = trigger.querySelector('.contact-dropdown-selected-value');

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
        selectedDisplay.textContent = service;
        selectedDisplay.classList.remove('placeholder');
        ul.style.display = 'none';
        trigger.classList.remove('active');
        trigger.querySelector('.contact-dropdown-chevron').classList.remove('open');
      });
      ul.appendChild(li);
    });
    container.appendChild(ul);

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = ul.style.display === 'block';
      ul.style.display = isOpen ? 'none' : 'block';
      trigger.classList.toggle('active', !isOpen);
      trigger.querySelector('.contact-dropdown-chevron').classList.toggle('open', !isOpen);
    });

    document.addEventListener('click', () => {
      ul.style.display = 'none';
      trigger.classList.remove('active');
      trigger.querySelector('.contact-dropdown-chevron').classList.remove('open');
    });

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
      toast.classList.add('is-visible');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('is-visible');
      }, 5000);
    };

    if (toastClose) {
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

      // Form payload
      const payload = {
        fullName,
        phone,
        email,
        website,
        service,
        message
      };

      try {
        const [emailSuccess] = await Promise.all([
          // 1. Send admin notification email
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
          throw new Error('Email notification sending failed');
        }

        // Reset form inputs
        contactForm.reset();
        hiddenInput.value = '';
        selectedDisplay.textContent = 'Select service';
        selectedDisplay.classList.add('placeholder');
        if (window.grecaptcha) window.grecaptcha.reset();

        showToast();
      } catch (err) {
        console.error('Submission failed: ', err);
        displayFormStatus('Something went wrong. Please try again or reach us directly.', true);
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
      <div style="background-color: #f5f6f8; padding: 40px 20px; font-family: 'Outfit', sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e1e1e3; border-radius: 12px;">
          <tr>
            <td style="background-color: #1e4620; padding: 30px; text-align: center; border-radius: 11px 11px 0 0;">
              <img src="https://www.eparivartan.com/images/logo.svg" alt="parivartan" style="height: 40px;" />
              <div style="color: #f2be22; font-size: 18px; font-weight: 700; margin-top: 15px; text-transform: uppercase;">New Sales Enquiry</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 35px;">
              <p style="color: #4a4a4a; font-size: 15px; line-height: 1.6;">New inquiry submitted via the contact form on eparivartan.com.</p>
              <table border="0" cellpadding="10" cellspacing="0" width="100%" style="border: 1px solid #e1e1e3; border-radius: 8px;">
                <tr><td width="30%"><strong>Name</strong></td><td>${data.fullName}</td></tr>
                <tr><td><strong>Email</strong></td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
                <tr><td><strong>Phone</strong></td><td>${data.phone}</td></tr>
                <tr><td><strong>Service</strong></td><td>${data.service}</td></tr>
                <tr><td><strong>Website</strong></td><td>${data.website || '—'}</td></tr>
                <tr><td><strong>Message</strong></td><td>${data.message.replace(/\n/g, '<br/>')}</td></tr>
              </table>
              <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:${data.email}" style="background-color: #4C9A2A; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reply to ${data.fullName} &rarr;</a>
              </div>
            </td>
          </tr>
        </table>
      </div>`;
    }

    function getClientEmailHtml(data) {
      return `
      <div style="background-color: #f5f6f8; padding: 40px 20px; font-family: 'Outfit', sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e1e1e3; border-radius: 12px;">
          <tr>
            <td style="background-color: #1e4620; padding: 30px; text-align: center; border-radius: 11px 11px 0 0;">
              <img src="https://www.eparivartan.com/images/logo.svg" alt="parivartan" style="height: 40px;" />
              <div style="color: #f2be22; font-size: 18px; font-weight: 700; margin-top: 15px; text-transform: uppercase;">Enquiry Received</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 35px;">
              <h2 style="color: #1e4620; font-size: 20px;">Thanks for reaching out, ${data.fullName}!</h2>
              <p style="color: #4a4a4a; font-size: 15px; line-height: 1.6;">We have received your enquiry about <strong>${data.service}</strong>. A member of our team will get back to you shortly.</p>
              <table border="0" cellpadding="10" cellspacing="0" width="100%" style="border: 1px solid #e1e1e3; border-radius: 8px;">
                <tr><td width="30%"><strong>Name</strong></td><td>${data.fullName}</td></tr>
                <tr><td><strong>Service</strong></td><td>${data.service}</td></tr>
                <tr><td><strong>Message</strong></td><td>${data.message.replace(/\n/g, '<br/>')}</td></tr>
              </table>
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://eparivartan.com" style="background-color: #4C9A2A; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Visit eParivartan &rarr;</a>
              </div>
            </td>
          </tr>
        </table>
      </div>`;
    }
  }
});
