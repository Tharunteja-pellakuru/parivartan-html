document.addEventListener('DOMContentLoaded', () => {
  const previewButtons = document.querySelectorAll('.preview-btn');
  const modal = document.getElementById('ecommerce-preview-modal');
  const previewDomain = document.getElementById('preview-domain');
  const previewOpenLink = document.getElementById('preview-open-link');
  const previewContent = document.getElementById('preview-content');
  const closeBtn = document.getElementById('preview-close-btn');

  function openModal(button) {
    const domain = button.getAttribute('data-domain');
    const url = button.getAttribute('data-url');
    const screenshot = button.getAttribute('data-screenshot');

    previewDomain.textContent = domain;
    previewOpenLink.href = url;

    // Clear previous content
    if (previewContent) previewContent.innerHTML = '';

    // If screenshot is a URL (http/https), attempt an iframe live preview with a fallback
    if (screenshot && (screenshot.startsWith('http://') || screenshot.startsWith('https://'))) {
      const iframe = document.createElement('iframe');
      iframe.src = screenshot;
      iframe.setAttribute('aria-label', domain + ' live preview');
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = '0';
      iframe.style.minHeight = '400px';
      previewContent.appendChild(iframe);

      // Add a hidden fallback image (local screenshot) that we can show if the iframe is blocked.
      const fallbackImg = document.createElement('img');
      fallbackImg.src = './assets/our-work/ecommerce/maagaani-screenshot.png';
      fallbackImg.alt = domain + ' screenshot fallback';
      fallbackImg.className = 'ecommerce-live-preview-screenshot';
      fallbackImg.style.display = 'none';
      previewContent.appendChild(fallbackImg);

      // Show a small warning near the controls in case embedding is blocked by the remote site
      const previewWarning = document.getElementById('preview-warning');

      // After a short timeout, check whether the iframe was blocked (appears empty/about:blank)
      const checkTimeout = setTimeout(() => {
        let blocked = false;
        try {
          const doc = iframe.contentDocument;
          // If document is accessible and empty, the frame was blocked
          if (doc && doc.body && doc.body.innerHTML.trim() === '') {
            blocked = true;
          }
        } catch (err) {
          // Cross-origin access will throw; this usually means iframe loaded cross-origin content successfully.
          blocked = false;
        }

        if (blocked) {
          // Hide iframe and show fallback image + warning
          iframe.style.display = 'none';
          fallbackImg.style.display = 'block';
          if (previewWarning) {
            previewWarning.style.display = 'inline';
          }
        } else {
          // Still show hint to open in a new tab if user can't see content
          if (previewWarning) {
            previewWarning.style.display = 'inline';
            previewWarning.textContent = 'If preview appears blank, click Open Website.';
          }
        }
      }, 2500);

      // When iframe loads successfully, clear the timeout
      iframe.addEventListener('load', () => {
        clearTimeout(checkTimeout);
        if (previewWarning) previewWarning.style.display = 'inline';
      });

    } else {
      const img = document.createElement('img');
      img.src = screenshot || '';
      img.alt = domain + ' preview';
      img.className = 'ecommerce-live-preview-screenshot';
      previewContent.appendChild(img);
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  previewButtons.forEach(btn => {
    btn.addEventListener('click', () => openModal(btn));
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Close on clicking outside the modal window
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
      closeModal();
    }
  });

  // Initialize GSAP scroll animations if ScrollTrigger is available
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate cards on scroll
    gsap.utils.toArray('.ecommerce-project-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });
    });
  }

  // Footer group toggle behavior (for mobile dropdowns)
  const footerGroupToggles = document.querySelectorAll('.footer-group-toggle');
  footerGroupToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const li = btn.closest('li');
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if (li) {
        li.classList.toggle('open', !expanded);
      }
    });
  });
});
