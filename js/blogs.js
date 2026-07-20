document.addEventListener('DOMContentLoaded', () => {

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

      // 1. Show/hide cards based on current page
      const startIndex = (page - 1) * cardsPerPage;
      const endIndex = startIndex + cardsPerPage;

      allCards.forEach((card, index) => {
        if (index >= startIndex && index < endIndex) {
          card.style.display = 'flex'; // show
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

      // 4. Scroll to top of grid
      const header = document.querySelector('.blogs-insights-header');
      if (header) {
        header.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // Re-trigger scroll animations for newly shown cards
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }

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
});
