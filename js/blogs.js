const initBlogsApp = () => {

  // Ensure page starts at the top upon navigation
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

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
    
    // Config - show at least 25 blog cards per page
    const cardsPerPage = 25;
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

    function updatePagination(page, isInitialLoad = false) {
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

      // 5. Scroll to top of blogs section ONLY when user manually changes page (not on initial page load)
      if (!isMobile && !isInitialLoad) {
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
      updatePagination(currentPage, true);
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
    updatePagination(1, true);
  }

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
