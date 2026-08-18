const initBlogsApp = () => {

  /* ===== GSAP Scroll Animations ===== */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Featured card entrance
    gsap.from('.blogs-featured-card-frame', {
      scrollTrigger: { trigger: '.blogs-featured-card-frame', start: 'top 85%' },
      y: 50, opacity: 0, duration: 0.9, ease: 'power3.out'
    });

    // Section header entrance
    gsap.from('.blogs-insights-header', {
      scrollTrigger: { trigger: '.blogs-insights-header', start: 'top 85%' },
      y: 40, opacity: 0, duration: 0.8, ease: 'power3.out'
    });

    // Blog cards stagger animation
    gsap.utils.toArray('.blog-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 88%' },
        y: 50,
        opacity: 0,
        duration: 0.7,
        delay: (i % 3) * 0.12,
        ease: 'power3.out'
      });
    });
  }

  /* ===== Dynamic Pagination Logic ===== */
  const gridContainer = document.getElementById('blogs-grid');
  const paginationContainer = document.getElementById('blogs-pagination');
  
  if (gridContainer && paginationContainer) {
    const allCards = Array.from(gridContainer.querySelectorAll('.blog-card'));
    const prevBtn = document.getElementById('pagination-prev');
    const nextBtn = document.getElementById('pagination-next');
    
    // Config
    const cardsPerPage = 6;
    const totalPages = Math.ceil(allCards.length / cardsPerPage) || 1;
    let currentPage = 1;

    // Helper to format page numbers (e.g., 1 -> 01)
    const formatPageStr = (num) => num < 10 ? '0' + num : num;

    // Rebuild pagination buttons dynamically based on total pages
    function renderPaginationButtons() {
      // Remove old numbered buttons
      const existingBtns = paginationContainer.querySelectorAll('.blogs-pagination-btn[data-page]');
      existingBtns.forEach(btn => btn.remove());

      // Insert new buttons before the Next button
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = 'blogs-pagination-btn';
        if (i === currentPage) btn.classList.add('active');
        btn.dataset.page = i;
        btn.textContent = formatPageStr(i);
        
        btn.addEventListener('click', () => {
          updatePagination(i);
        });
        
        paginationContainer.insertBefore(btn, nextBtn);
      }
    }

    function updatePagination(page) {
      currentPage = page;

      const isMobile = window.innerWidth <= 768;

      // 1. Show/hide cards based on current page (show all on mobile for carousel)
      const startIndex = (page - 1) * cardsPerPage;
      const endIndex = startIndex + cardsPerPage;

      allCards.forEach((card, index) => {
        if (isMobile || (index >= startIndex && index < endIndex)) {
          card.style.display = ''; // show
        } else {
          card.style.display = 'none'; // hide
        }
      });

      // 2. Update button active states
      const pageBtns = paginationContainer.querySelectorAll('.blogs-pagination-btn[data-page]');
      pageBtns.forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.page) === page);
      });

      // 3. Update prev/next disabled states
      if (prevBtn) prevBtn.classList.toggle('disabled', page === 1);
      if (nextBtn) nextBtn.classList.toggle('disabled', page === totalPages);

      // 4. Re-trigger scroll animations for newly shown cards
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }

      // 5. Scroll to top of blogs section (after repaint so ScrollTrigger doesn't override)
      if (!isMobile) {
        requestAnimationFrame(() => {
          const target = document.querySelector('.blogs-insights-header');
          if (target) {
            const navHeight = document.querySelector('.header-container')?.offsetHeight || 88;
            const absoluteTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 24;
            window.scrollTo({ top: absoluteTop, behavior: 'smooth' });
          }
        });
      }
    }


    window.addEventListener('resize', () => {
      updatePagination(currentPage);
      if (typeof initBlogsCarousel === 'function') initBlogsCarousel();
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) updatePagination(currentPage - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) updatePagination(currentPage + 1);
      });
    }

    // Initialize
    renderPaginationButtons();
    updatePagination(1);
  }

  /* ===== INSIGHTS Mobile Carousel Logic ===== */
  function initBlogsCarousel() {
    const grid = document.querySelector('.blogs-grid');
    const controls = document.querySelector('.blogs-carousel-controls');
    if (!grid || !controls) return;

    const dotsContainer = controls.querySelector('.blogs-carousel-dots');
    const prevBtn = controls.querySelector('.blogs-carousel-prev');
    const nextBtn = controls.querySelector('.blogs-carousel-next');

    function getVisibleCards() {
      return Array.from(grid.querySelectorAll('.blog-card')).filter(card => {
        return window.getComputedStyle(card).display !== 'none';
      });
    }

    function renderDots() {
      if (!dotsContainer) return;
      const cards = getVisibleCards();
      dotsContainer.innerHTML = '';
      cards.forEach((card, idx) => {
        const dot = document.createElement('span');
        dot.className = `blogs-carousel-dot ${idx === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => {
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
        dotsContainer.appendChild(dot);
      });
    }

    function updateActiveState() {
      const cards = getVisibleCards();
      if (cards.length === 0) return;
      const gridRect = grid.getBoundingClientRect();
      const gridCenter = gridRect.left + gridRect.width / 2;

      let closestIdx = 0;
      let minDiff = Infinity;

      cards.forEach((card, idx) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const diff = Math.abs(gridCenter - cardCenter);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });

      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.blogs-carousel-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === closestIdx);
        });
      }

      if (prevBtn) prevBtn.disabled = grid.scrollLeft <= 5;
      if (nextBtn) nextBtn.disabled = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 5;
    }

    renderDots();
    updateActiveState();

    grid.addEventListener('scroll', () => {
      window.requestAnimationFrame(updateActiveState);
    });

    window.addEventListener('resize', () => {
      renderDots();
      updateActiveState();
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        grid.scrollBy({ left: -grid.clientWidth * 0.8, behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        grid.scrollBy({ left: grid.clientWidth * 0.8, behavior: 'smooth' });
      });
    }
  }

  initBlogsCarousel();

  /* ===== reCAPTCHA Initialization ===== */
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
});
};

if (document.readyState !== 'loading') {
  initBlogsApp();
} else {
  document.addEventListener('DOMContentLoaded', initBlogsApp);
}
