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

if (document.readyState !== 'loading') {
  initContactApp();
} else {
  document.addEventListener('DOMContentLoaded', initContactApp);
}
