/**
 * ==========================================================================
 * Parivartan Concierge & Project Enquiry Assistant
 * Global Brand Overlay for all eParivartan pages
 * ==========================================================================
 */

(function () {
  'use strict';

  // Chatbot hidden globally across all pages
  const removeChatbot = () => {
    const el = document.getElementById('parivartan-chatbot-root');
    if (el) el.remove();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeChatbot);
  } else {
    removeChatbot();
  }
  return;

  if (window.ParivartanChatbotInitialized) return;
  window.ParivartanChatbotInitialized = true;

  // ── 1. Ensure CSS Link in Document Head ──
  function ensureChatbotStylesheet() {
    if (!document.querySelector('link[href*="chatbot.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = './css/chatbot.css';
      document.head.appendChild(link);
    }
  }

  // ── 2. Service Options & Knowledge Base ──
  const SERVICE_OPTIONS = [
    'Technical Support',
    'Website Development',
    'Custom Applications',
    'SEO / AEO / GEO',
    'Ecommerce Development',
    'Mobile Application',
    'Other Technical Support'
  ];

  const KNOWLEDGE_BASE = [
    {
      keywords: ['hello', 'hi', 'hey', 'buddy', 'good morning', 'good afternoon', 'good evening', 'greetings', 'namaste'],
      response: "Hello! 👋 Great to connect with you. Click **New Enquiry** above to share your project requirements, or ask us anything about our engineering and design capabilities.",
      links: [
        { label: 'Explore Services', url: './web-development.html' },
        { label: 'AI Search Visibility', url: './seo-aeo-geo.html' },
        { label: 'Contact Us Directly', url: './contact.html' }
      ]
    },
    {
      keywords: ['web', 'website', 'web dev', 'web development', 'frontend', 'backend', 'full stack'],
      response: "At **eParivartan**, we build high-scale, modern digital solutions — from enterprise websites to bespoke SaaS platforms and web portals.",
      links: [
        { label: 'Web Development', url: './web-development.html' },
        { label: 'Custom Applications', url: './custom-applications.html' },
        { label: 'View Portfolio', url: './work-websites.html' }
      ]
    },
    {
      keywords: ['ai', 'geo', 'aeo', 'seo', 'search', 'visibility', 'chatgpt', 'perplexity', 'gemini'],
      response: "We pioneered **Search & AI Visibility** (SEO + GEO + AEO) to ensure your brand gets discovered and cited directly within ChatGPT, Google AI Overviews, and Perplexity.",
      links: [
        { label: 'Search & AI Visibility (GEO/AEO)', url: './seo-aeo-geo.html' }
      ]
    },
    {
      keywords: ['mobile', 'app', 'android', 'ios', 'flutter', 'react native'],
      response: "We engineer intuitive, high-performance mobile apps across iOS and Android with scalable architectures and clean UX.",
      links: [
        { label: 'Mobile App Development', url: './mobile-app-development.html' }
      ]
    },
    {
      keywords: ['ecommerce', 'e-commerce', 'shop', 'store', 'shopify', 'woocommerce'],
      response: "Our E-Commerce development delivers high-converting shopping experiences, seamless checkout flows, and headless commerce stacks.",
      links: [
        { label: 'E-commerce Solutions', url: './ecommerce-development.html' }
      ]
    },
    {
      keywords: ['custom application', 'custom app', 'saas', 'crm', 'erp', 'portal'],
      response: "We build bespoke enterprise software, internal workflows, customer portals, and high-security SaaS platforms tailored to your business needs.",
      links: [
        { label: 'Custom Applications', url: './custom-applications.html' }
      ]
    },
    {
      keywords: ['technical support', 'support', 'maintenance', 'hosting', 'bug', 'fix'],
      response: "We provide round-the-clock technical support, server maintenance, cloud monitoring, and security updates for mission-critical applications.",
      links: [
        { label: 'Technology Support', url: './technology-support.html' }
      ]
    },
    {
      keywords: ['contact', 'call', 'phone', 'email', 'touch', 'reach', 'quote', 'hire', 'office'],
      response: "We'd love to partner with you! Here is how you can connect directly with the Parivartan team:\n\n📞 **Phone**: [+91 98491 65443](tel:+919849165443)\n📧 **Email**: [feedback@eparivartan.com](mailto:feedback@eparivartan.com)\n📍 **Office**: Kavuri Hills, Hyderabad - 500033.",
      links: [
        { label: 'Go to Contact Page', url: './contact.html' },
        { label: 'Call Us Now', url: 'tel:+919849165443' }
      ]
    }
  ];

  // ── 3. Build Chatbot DOM ──
  function injectChatbotDOM() {
    if (document.getElementById('parivartan-chatbot-root')) return;

    const root = document.createElement('div');
    root.id = 'parivartan-chatbot-root';
    root.setAttribute('aria-label', 'eParivartan Concierge');

    root.innerHTML = `
      <!-- Launcher Button -->
      <button type="button" class="chatbot-launcher-btn" id="chatbot-launcher-btn" aria-label="Open Parivartan Assistant" aria-expanded="false">
        <img src="./assets/home/parivartan-leaf.webp" alt="Parivartan" class="chatbot-launcher-icon" draggable="false" />
        <span class="chatbot-launcher-close" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </span>
      </button>

      <!-- Welcome Tooltip Pill -->
      <div class="chatbot-greeting-pill" id="chatbot-greeting-pill">
        <span>👋 Hello Buddy! Have a project in mind?</span>
        <button type="button" class="chatbot-greeting-close" id="chatbot-greeting-close" aria-label="Dismiss">×</button>
      </div>

      <!-- Chat Window -->
      <div class="chatbot-window" id="chatbot-window" role="dialog" aria-modal="true" aria-labelledby="chatbot-title">
        <!-- Clean Header (No round circle, no bottom text) -->
        <div class="chatbot-header">
          <div class="chatbot-header-left">
            <img src="./assets/home/parivartan-leaf.webp" alt="eParivartan" class="chatbot-header-leaf" />
            <div class="chatbot-header-text">
              <h3 class="chatbot-header-title" id="chatbot-title">eParivartan</h3>
              <span class="chatbot-header-tagline"><span class="chatbot-status-dot"></span>Online</span>
            </div>
          </div>
          <div class="chatbot-header-actions">
            <button type="button" class="chatbot-header-btn" id="chatbot-reset-btn" title="Reset conversation">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Messages Body -->
        <div class="chatbot-body" id="chatbot-body">
          <!-- Typing Indicator -->
          <div class="chatbot-typing-row" id="chatbot-typing-row">
            <div class="chatbot-mini-avatar">
              <img src="./assets/home/parivartan-leaf.webp" alt="" />
            </div>
            <div class="chatbot-typing-bubble">
              <span class="chatbot-typing-dot"></span>
              <span class="chatbot-typing-dot"></span>
              <span class="chatbot-typing-dot"></span>
            </div>
          </div>
        </div>

        <!-- Input Footer -->
        <div class="chatbot-footer">
          <form class="chatbot-input-row" id="chatbot-chat-form" onsubmit="return false;">
            <input 
              type="text" 
              class="chatbot-input-field" 
              id="chatbot-input" 
              placeholder="Ask a question or type a message..." 
              autocomplete="off" 
              maxlength="300"
            />
            <button type="button" class="chatbot-voice-btn" id="chatbot-voice-btn" aria-label="Voice input" title="Speak your message">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </button>
            <button type="submit" class="chatbot-send-btn" id="chatbot-send-btn" aria-label="Send message">
              <span class="chatbot-send-text">Send</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(root);
  }

  // ── 4. Controller Logic & Conversational Enquiry Flow ──
  function initChatbotLogic() {
    const root = document.getElementById('parivartan-chatbot-root');
    const launcherBtn = document.getElementById('chatbot-launcher-btn');
    const closeBtn = document.getElementById('chatbot-close-btn');
    const resetBtn = document.getElementById('chatbot-reset-btn');
    const greetingPill = document.getElementById('chatbot-greeting-pill');
    const greetingClose = document.getElementById('chatbot-greeting-close');
    const body = document.getElementById('chatbot-body');
    const typingRow = document.getElementById('chatbot-typing-row');
    const chatForm = document.getElementById('chatbot-chat-form');
    const chatInput = document.getElementById('chatbot-input');

    if (!root || !launcherBtn) return;

    // Show initial greeting after typing animation
    showTypingAndExecute(() => {
      appendBotMessage(`Hi, I'm Parivartan 👋`);
      showTypingAndExecute(() => {
        appendBotMessageNoAvatar(`How can I help you?`);
      }, 700);
    }, 900);

    // Multi-Step Enquiry State
    const enquiryState = {
      active: false,
      step: 0,
      data: {
        fullName: '',
        email: '',
        phone: '',
        service: '',
        website: '',
        message: ''
      }
    };

    function toggleChat(openState) {
      const isCurrentlyOpen = root.classList.contains('is-open');
      const shouldOpen = typeof openState === 'boolean' ? openState : !isCurrentlyOpen;

      if (shouldOpen) {
        root.classList.add('is-open');
        launcherBtn.setAttribute('aria-expanded', 'true');
        if (greetingPill) greetingPill.style.display = 'none';
        sessionStorage.setItem('parivartan_chat_open', 'true');
        setTimeout(() => {
          if (chatInput) chatInput.focus();
          scrollBodyBottom();
        }, 120);
      } else {
        root.classList.remove('is-open');
        launcherBtn.setAttribute('aria-expanded', 'false');
        sessionStorage.setItem('parivartan_chat_open', 'false');
      }
    }

    function scrollBodyBottom() {
      if (body) {
        body.scrollTop = body.scrollHeight;
      }
    }

    function escapeHtml(str) {
      if (!str) return '';
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    function appendUserMessage(text) {
      const row = document.createElement('div');
      row.className = 'chatbot-msg-row is-user';
      row.innerHTML = `
        <div class="chatbot-user-avatar">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
        </div>
        <div class="chatbot-bubble">${escapeHtml(text)}</div>
      `;
      if (typingRow) {
        body.insertBefore(row, typingRow);
      } else {
        body.appendChild(row);
      }
      scrollBodyBottom();
    }

    function appendBotMessage(htmlContent, isWarning = false) {
      const row = document.createElement('div');
      row.className = 'chatbot-msg-row is-bot';

      // Demote previous consecutive bot message's avatar → spacer
      const prevSibling = typingRow ? typingRow.previousElementSibling : body.lastElementChild;
      if (prevSibling && prevSibling.classList.contains('is-bot')) {
        const prevAvatar = prevSibling.querySelector('.chatbot-mini-avatar');
        if (prevAvatar) {
          const spacer = document.createElement('div');
          spacer.className = 'chatbot-mini-avatar-spacer';
          prevAvatar.replaceWith(spacer);
          const prevBubble = prevSibling.querySelector('.chatbot-bubble');
          if (prevBubble) prevBubble.style.borderBottomLeftRadius = '14px';
        }
      }

      row.innerHTML = `
        <div class="chatbot-mini-avatar">
          <img src="./assets/home/parivartan-leaf.webp" alt="eParivartan" />
        </div>
        <div class="chatbot-bubble ${isWarning ? 'is-warning' : ''}">
          ${htmlContent}
        </div>
      `;

      if (typingRow) {
        body.insertBefore(row, typingRow);
      } else {
        body.appendChild(row);
      }
      scrollBodyBottom();
      return row;
    }

    function appendBotMessageNoAvatar(htmlContent, isWarning = false) {
      const row = document.createElement('div');
      row.className = 'chatbot-msg-row is-bot';

      // Demote previous consecutive bot message's avatar → spacer
      const prevSibling2 = typingRow ? typingRow.previousElementSibling : body.lastElementChild;
      if (prevSibling2 && prevSibling2.classList.contains('is-bot')) {
        const prevAvatar2 = prevSibling2.querySelector('.chatbot-mini-avatar');
        if (prevAvatar2) {
          const spacer2 = document.createElement('div');
          spacer2.className = 'chatbot-mini-avatar-spacer';
          prevAvatar2.replaceWith(spacer2);
          const prevBubble2 = prevSibling2.querySelector('.chatbot-bubble');
          if (prevBubble2) prevBubble2.style.borderBottomLeftRadius = '14px';
        }
      }

      row.innerHTML = `
        <div class="chatbot-mini-avatar">
          <img src="./assets/home/parivartan-leaf.webp" alt="eParivartan" />
        </div>
        <div class="chatbot-bubble ${isWarning ? 'is-warning' : ''}">
          ${htmlContent}
        </div>
      `;

      if (typingRow) {
        body.insertBefore(row, typingRow);
      } else {
        body.appendChild(row);
      }
      scrollBodyBottom();
      return row;
    }

    function updateInputPlaceholder(text) {
      if (chatInput) {
        chatInput.placeholder = text;
        chatInput.focus();
      }
    }

    function showTypingAndExecute(callback, delay = 350) {
      if (typingRow) {
        typingRow.classList.add('is-active');
        scrollBodyBottom();
      }
      setTimeout(() => {
        if (typingRow) typingRow.classList.remove('is-active');
        callback();
      }, delay);
    }

    // ── Conversational Enquiry Questions (1 to 6) ──

    function startNewEnquiry(withIntro = false) {
      enquiryState.active = true;
      enquiryState.step = 1;
      enquiryState.data = {
        fullName: '',
        email: '',
        phone: '',
        service: '',
        website: '',
        message: ''
      };

      if (withIntro) {
        showTypingAndExecute(() => {
          appendBotMessage(`I will try to help you fill the enquiry form. Just answer a few quick questions so our team can understand your project requirements and get in touch with you! ✨`);
          showTypingAndExecute(() => {
            appendBotMessage(`
              <strong>Please Enter Full Name:</strong>
            `);
            updateInputPlaceholder('Enter your Full Name...');
          }, 600);
        }, 400);
      } else {
        appendBotMessage(`
          <strong>Please Enter Full Name:</strong>
        `);
        updateInputPlaceholder('Enter your Full Name...');
      }
    }

    function promptStepEmail() {
      enquiryState.step = 2;
      appendBotMessage(`
        Nice to meet you, <strong>${escapeHtml(enquiryState.data.fullName)}</strong>!<br><br>
        <strong>Please Enter Email:</strong>
      `);
      updateInputPlaceholder('name@company.com...');
    }

    function promptStepPhone() {
      enquiryState.step = 3;
      appendBotMessage(`
        Got it! 👍<br><br>
        <strong>Phone Number:</strong>
      `);
      updateInputPlaceholder('Enter Phone Number (e.g. 9849165443)...');
    }

    function promptStepService() {
      enquiryState.step = 4;
      const chipsId = 'srv-chips-' + Date.now();
      const chipsHtml = SERVICE_OPTIONS.map(opt => `
        <button type="button" class="chatbot-service-chip" data-service="${escapeHtml(opt)}">
          ${escapeHtml(opt)}
        </button>
      `).join('');

      const botRow = appendBotMessage(`
        <strong>Service Type:</strong><br>
        Please select the service you need:
        <div class="chatbot-service-chips-grid" id="${chipsId}">
          ${chipsHtml}
        </div>
      `);

      updateInputPlaceholder('Select a service chip above...');

      const container = botRow.querySelector(`#${chipsId}`);
      if (container) {
        container.addEventListener('click', (e) => {
          const chip = e.target.closest('.chatbot-service-chip');
          if (!chip || chip.disabled) return;

          const selectedVal = chip.getAttribute('data-service');
          if (!selectedVal) return;

          container.querySelectorAll('.chatbot-service-chip').forEach(c => {
            c.disabled = true;
            if (c === chip) {
              c.classList.add('is-selected');
            } else {
              c.classList.add('is-dimmed');
            }
          });

          enquiryState.data.service = selectedVal;
          appendUserMessage(selectedVal);
          showTypingAndExecute(() => promptStepWebsite());
        });
      }
    }

    function promptStepWebsite() {
      enquiryState.step = 5;
      const cardId = 'web-card-' + Date.now();

      const botRow = appendBotMessage(`
        <strong>Website URL (Optional):</strong><br>
        If you have an existing website or reference URL, please share it below, or click <strong>Skip</strong>:
        <div class="chatbot-skip-card" id="${cardId}">
          <button type="button" class="chatbot-skip-btn">⏭ Skip</button>
        </div>
      `);

      updateInputPlaceholder('https://yourwebsite.com (or click Skip)...');

      const cardEl = botRow.querySelector(`#${cardId}`);
      if (cardEl) {
        const skipBtn = cardEl.querySelector('.chatbot-skip-btn');
        skipBtn.addEventListener('click', () => {
          enquiryState.data.website = 'N/A';
          appendUserMessage('Skipped Website URL');
          skipBtn.style.display = 'none';
          showTypingAndExecute(() => promptStepMessage());
        });
      }
    }

    function promptStepMessage() {
      enquiryState.step = 6;
      const cardId = 'msg-card-' + Date.now();

      const botRow = appendBotMessage(`
        Almost done! ✍️<br><br>
        <strong>Message (Optional):</strong><br>
        Please share brief details or scope for your project, or click <strong>Skip</strong>:
        <div class="chatbot-skip-card" id="${cardId}">
          <button type="button" class="chatbot-skip-btn">⏭ Skip</button>
        </div>
      `);

      updateInputPlaceholder('Describe your project (or click Skip)...');

      const cardEl = botRow.querySelector(`#${cardId}`);
      if (cardEl) {
        const skipBtn = cardEl.querySelector('.chatbot-skip-btn');
        skipBtn.addEventListener('click', () => {
          enquiryState.data.message = 'N/A';
          appendUserMessage('Skipped Message');
          skipBtn.style.display = 'none';
          showTypingAndExecute(() => finalizeEnquiry(), 350);
        });
      }
    }

    function runCelebrationConfetti(targetEl) {
      if (!targetEl) return;
      const canvas = document.createElement('canvas');
      canvas.className = 'chatbot-confetti-canvas';
      targetEl.appendChild(canvas);

      const rect = targetEl.getBoundingClientRect();
      canvas.width = rect.width || 420;
      canvas.height = rect.height || 560;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const colors = ['#75BF46', '#2A7A3B', '#FFD700', '#FF6B6B', '#4ECDC4', '#FFA07A', '#9B59B6', '#3B82F6'];
      const particles = [];
      const count = 75;

      for (let i = 0; i < count; i++) {
        particles.push({
          x: canvas.width / 2 + (Math.random() - 0.5) * 80,
          y: canvas.height / 2 - 20 + (Math.random() - 0.5) * 60,
          vx: (Math.random() - 0.5) * 9,
          vy: (Math.random() - 0.8) * 11 - 2,
          size: Math.random() * 7 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 10,
          tilt: Math.random() * 8 - 4,
          tiltAngle: 0,
          tiltAngleInc: Math.random() * 0.08 + 0.04,
          opacity: 1
        });
      }

      const startTime = Date.now();
      let animId;

      function render() {
        const elapsed = Date.now() - startTime;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.32;
          p.vx *= 0.985;
          p.rotation += p.rotSpeed;
          p.tiltAngle += p.tiltAngleInc;
          p.tilt = Math.sin(p.tiltAngle) * 7;

          if (elapsed > 1800) {
            p.opacity = Math.max(0, 1 - (elapsed - 1800) / 1000);
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2 + p.tilt, p.size, p.size * 0.6);
          ctx.restore();
        });

        if (elapsed < 2900) {
          animId = requestAnimationFrame(render);
        } else {
          cancelAnimationFrame(animId);
          if (canvas.parentNode) canvas.remove();
        }
      }

      render();
    }

    function showCelebrationPopup(fullName, onDismiss) {
      const windowEl = document.getElementById('chatbot-window');
      if (!windowEl) {
        if (onDismiss) onDismiss();
        return;
      }

      runCelebrationConfetti(windowEl);

      const overlay = document.createElement('div');
      overlay.className = 'chatbot-celebration-overlay';
      overlay.innerHTML = `
        <div class="chatbot-celebration-modal">
          <div class="chatbot-celebration-badge">
            <span class="chatbot-celebration-icon">🎉</span>
            <div class="chatbot-celebration-sparkle sparkle-1">✨</div>
            <div class="chatbot-celebration-sparkle sparkle-2">✨</div>
          </div>
          <h3 class="chatbot-celebration-title">Enquiry Submitted!</h3>
          <p class="chatbot-celebration-sub">
            Thank you, <strong>${escapeHtml(fullName || 'there')}</strong>!<br>
            Your project enquiry has been successfully submitted.
          </p>
          <button type="button" class="chatbot-celebration-btn" id="cb-celebration-btn">
            View Enquiry Preview →
          </button>
        </div>
      `;

      windowEl.appendChild(overlay);

      let dismissed = false;
      function dismiss() {
        if (dismissed) return;
        dismissed = true;
        overlay.classList.add('is-closing');
        setTimeout(() => {
          if (overlay.parentNode) overlay.remove();
          if (onDismiss) onDismiss();
        }, 220);
      }

      const btn = overlay.querySelector('#cb-celebration-btn');
      if (btn) btn.addEventListener('click', dismiss);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) dismiss();
      });

      // Auto-dismiss after 2.6 seconds
      setTimeout(dismiss, 2600);
    }

    function finalizeEnquiry() {
      enquiryState.active = false;
      enquiryState.step = 0;
      const userFullName = enquiryState.data.fullName;

      // Submit to PHP mailer in background
      try {
        const formData = new FormData();
        formData.append('fullName', enquiryState.data.fullName);
        formData.append('email', enquiryState.data.email);
        formData.append('phone', enquiryState.data.phone);
        formData.append('service', enquiryState.data.service);
        formData.append('website', enquiryState.data.website || 'N/A');
        formData.append('message', enquiryState.data.message);

        fetch('./contact.php', {
          method: 'POST',
          body: formData
        }).catch(() => {});
      } catch (_) {}

      // Show celebration popup before preview!
      showCelebrationPopup(userFullName, () => {
        // Card 1: Success message card
        const successHtml = `
          <div class="chatbot-success-content">
            <div class="chatbot-success-header">
              <span class="chatbot-success-icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
              <span class="chatbot-success-title">Enquiry Successfully Submitted</span>
            </div>
            <p class="chatbot-success-desc">
              Thank you, <strong>${escapeHtml(enquiryState.data.fullName)}</strong>. Our team has received your project details and will get back to you within 24 hours.
            </p>
          </div>
        `;

        appendBotMessage(successHtml);

        // Card 2: Details card with improved UI
        showTypingAndExecute(() => {
          const detailsHtml = `
            <div class="chatbot-details-card">
              <div class="chatbot-details-header">
                <span class="chatbot-details-badge">📋 Enquiry Summary</span>
              </div>
              <div class="chatbot-details-list">
                <div class="chatbot-details-row">
                  <span class="chatbot-details-key">Name:</span>
                  <span class="chatbot-details-val">${escapeHtml(enquiryState.data.fullName)}</span>
                </div>
                <div class="chatbot-details-row is-stack">
                  <span class="chatbot-details-key">Email:</span>
                  <span class="chatbot-details-val">${escapeHtml(enquiryState.data.email)}</span>
                </div>
                <div class="chatbot-details-row">
                  <span class="chatbot-details-key">Phone:</span>
                  <span class="chatbot-details-val">${escapeHtml(enquiryState.data.phone)}</span>
                </div>
                <div class="chatbot-details-row">
                  <span class="chatbot-details-key">Service:</span>
                  <span class="chatbot-details-val"><span class="chatbot-details-tag">${escapeHtml(enquiryState.data.service)}</span></span>
                </div>
                <div class="chatbot-details-row">
                  <span class="chatbot-details-key">Website:</span>
                  <span class="chatbot-details-val">${escapeHtml(enquiryState.data.website)}</span>
                </div>
                <div class="chatbot-details-row is-stack">
                  <span class="chatbot-details-key">Message:</span>
                  <span class="chatbot-details-val ${enquiryState.data.message !== 'N/A' ? 'is-quote' : ''}">${enquiryState.data.message !== 'N/A' ? `"${escapeHtml(enquiryState.data.message)}"` : 'N/A'}</span>
                </div>
              </div>
              <div class="chatbot-details-actions">
                <button type="button" class="chatbot-restart-btn" id="cb-restart-enquiry-btn">Start Another Enquiry</button>
                <a href="tel:+919849165443" class="chatbot-call-btn">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  Call Directly: +91 98491 65443
                </a>
              </div>
            </div>
          `;

          const detailsRow = appendBotMessage(detailsHtml);
          updateInputPlaceholder('Ask a question or type a message...');
          scrollBodyBottom();

          const againBtn = detailsRow.querySelector('#cb-restart-enquiry-btn');
          if (againBtn) {
            againBtn.addEventListener('click', () => {
              startNewEnquiry();
            });
          }
        }, 450);
      });
    }

    function processEnquiryInput(text) {
      const val = text.trim();

      // Step 1: Full Name
      if (enquiryState.step === 1) {
        if (val.length < 2 || !/^[a-zA-Z\s.,'-]+$/.test(val)) {
          appendUserMessage(val);
          appendBotMessage('⚠️ Please enter a valid full name (at least 2 letters).', true);
          return;
        }
        enquiryState.data.fullName = val;
        appendUserMessage(val);
        showTypingAndExecute(() => promptStepEmail());
        return;
      }

      // Step 2: Email
      if (enquiryState.step === 2) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          appendUserMessage(val);
          appendBotMessage('⚠️ Please enter a valid email address (e.g. name@example.com).', true);
          return;
        }
        enquiryState.data.email = val;
        appendUserMessage(val);
        showTypingAndExecute(() => promptStepPhone());
        return;
      }

      // Step 3: Phone
      if (enquiryState.step === 3) {
        const digits = val.replace(/\D/g, '');
        if (digits.length < 10 || digits.length > 20) {
          appendUserMessage(val);
          appendBotMessage('⚠️ Please enter a valid phone number with at least 10 digits.', true);
          return;
        }
        enquiryState.data.phone = val;
        appendUserMessage(val);
        showTypingAndExecute(() => promptStepService());
        return;
      }

      // Step 4: Service Type
      if (enquiryState.step === 4) {
        const matched = SERVICE_OPTIONS.find(opt => opt.toLowerCase().includes(val.toLowerCase()));
        if (matched) {
          enquiryState.data.service = matched;
          appendUserMessage(matched);
          showTypingAndExecute(() => promptStepWebsite());
        } else {
          appendUserMessage(val);
          appendBotMessage('⚠️ Please select a service from the options above, or type: ' + SERVICE_OPTIONS.join(', '), true);
        }
        return;
      }

      // Step 5: Website URL
      if (enquiryState.step === 5) {
        if (val.toLowerCase() === 'skip' || val.toLowerCase() === 'no' || val.toLowerCase() === 'none') {
          enquiryState.data.website = 'N/A';
          appendUserMessage('Skipped Website URL');
        } else {
          let url = val;
          if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
          enquiryState.data.website = url;
          appendUserMessage(url);
        }
        showTypingAndExecute(() => promptStepMessage());
        return;
      }

      // Step 6: Message
      if (enquiryState.step === 6) {
        if (val.toLowerCase() === 'skip' || val.toLowerCase() === 'no' || val.toLowerCase() === 'none') {
          enquiryState.data.message = 'N/A';
          appendUserMessage('Skipped Message');
          showTypingAndExecute(() => finalizeEnquiry(), 350);
          return;
        }
        enquiryState.data.message = val;
        appendUserMessage(val);
        showTypingAndExecute(() => finalizeEnquiry(), 450);
        return;
      }
    }

    function handleGeneralQuery(query) {
      if (!query || !query.trim()) return;
      appendUserMessage(query.trim());
      if (chatInput) chatInput.value = '';

      if (enquiryState.active) {
        processEnquiryInput(query);
        return;
      }

      startNewEnquiry(true);
    }

    // Reset Chat conversation
    function resetChat() {
      enquiryState.active = false;
      enquiryState.step = 0;
      updateInputPlaceholder('Ask a question or type a message...');

      const allRows = body.querySelectorAll('.chatbot-msg-row');
      allRows.forEach(r => r.remove());

      const subsequentChips = body.querySelectorAll('.chatbot-chips-row');
      subsequentChips.forEach(r => r.remove());

      if (typingRow) typingRow.classList.remove('is-active');

      // Re-show greeting with typing animation
      showTypingAndExecute(() => {
        appendBotMessage(`Hi, I'm Parivartan 👋`);
        showTypingAndExecute(() => {
          appendBotMessageNoAvatar(`How can I help you?`);
        }, 700);
      }, 900);

      scrollBodyBottom();
    }

    // Event Bindings
    launcherBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleChat();
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleChat(false);
      });
    }

    resetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      resetChat();
    });

    if (greetingClose) {
      greetingClose.addEventListener('click', (e) => {
        e.stopPropagation();
        if (greetingPill) greetingPill.style.display = 'none';
      });
    }

    if (greetingPill) {
      greetingPill.addEventListener('click', () => {
        toggleChat(true);
      });
    }

    // Event delegation for "New Enquiry" button and predefined chips
    body.addEventListener('click', (e) => {
      const enquiryBtn = e.target.closest('#chatbot-start-enquiry-btn');
      if (enquiryBtn) {
        startNewEnquiry();
        return;
      }

      const chip = e.target.closest('.chatbot-predefined-chip');
      if (chip) {
        const query = chip.getAttribute('data-query');
        if (query) handleGeneralQuery(query);
      }
    });

    // Quick chips in footer
    const quickChipsEl = document.getElementById('chatbot-quick-chips');
    if (quickChipsEl) {
      quickChipsEl.addEventListener('click', (e) => {
        const chip = e.target.closest('.chatbot-quick-chip');
        if (chip) {
          const query = chip.getAttribute('data-query');
          if (query) handleGeneralQuery(query);
        }
      });
    }

    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value;
        if (text) {
          if (enquiryState.active) {
            processEnquiryInput(text);
            chatInput.value = '';
          } else {
            handleGeneralQuery(text);
          }
        }
      });
    }

    // ── Voice Input (Speech-to-Text) ──
    const voiceBtn = document.getElementById('chatbot-voice-btn');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    let isRecording = false;

    if (SpeechRecognition) {
      try {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          isRecording = true;
          if (voiceBtn) voiceBtn.classList.add('is-listening');
          updateInputPlaceholder('🎙️ Listening... Speak now');
        };

        recognition.onresult = (event) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          if (chatInput && transcript) {
            chatInput.value = transcript;
          }
        };

        recognition.onerror = (event) => {
          isRecording = false;
          if (voiceBtn) voiceBtn.classList.remove('is-listening');
          updateInputPlaceholder('Ask a question or type a message...');
          if (event.error === 'not-allowed') {
            appendBotMessage('⚠️ Microphone access was denied. Please allow microphone permissions in your browser.', true);
          }
        };

        recognition.onend = () => {
          const wasRecording = isRecording;
          isRecording = false;
          if (voiceBtn) voiceBtn.classList.remove('is-listening');
          updateInputPlaceholder('Ask a question or type a message...');

          // Auto-send if voice input captured text
          if (wasRecording && chatInput && chatInput.value.trim().length > 0) {
            setTimeout(() => {
              if (chatForm) {
                chatForm.dispatchEvent(new Event('submit', { cancelable: true }));
              }
            }, 300);
          }
        };
      } catch (_) {}
    }

    if (voiceBtn) {
      voiceBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!SpeechRecognition) {
          appendBotMessage('⚠️ Voice input is supported in Google Chrome, Microsoft Edge, and Safari.', true);
          return;
        }

        if (isRecording) {
          isRecording = false;
          if (voiceBtn) voiceBtn.classList.remove('is-listening');
          if (recognition) recognition.abort();
          updateInputPlaceholder('Ask a question or type a message...');
        } else {
          try {
            recognition.start();
          } catch (_) {
            try {
              recognition.stop();
              setTimeout(() => recognition.start(), 150);
            } catch (_) {}
          }
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && root.classList.contains('is-open')) {
        toggleChat(false);
      }
    });

    if (sessionStorage.getItem('parivartan_chat_open') === 'true') {
      toggleChat(true);
    }
  }

  // ── 5. Auto Init on DOM Ready ──
  function init() {
    ensureChatbotStylesheet();
    injectChatbotDOM();
    initChatbotLogic();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
