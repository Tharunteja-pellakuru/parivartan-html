/* ===== BLOG DETAILS PAGE JS ===== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- GSAP Scroll Animations ----
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Fade-in header elements
    gsap.from('.bd-tagline', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
    });

    gsap.from('.bd-title', {
      y: 30,
      opacity: 0,
      duration: 0.7,
      delay: 0.15,
      ease: 'power2.out',
    });

    gsap.from('.bd-subtitle', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.25,
      ease: 'power2.out',
    });

    gsap.from('.bd-meta-row', {
      y: 15,
      opacity: 0,
      duration: 0.5,
      delay: 0.35,
      ease: 'power2.out',
    });

    gsap.from('.bd-hero-image', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      delay: 0.4,
      ease: 'power2.out',
    });

    // Article sections fade-in on scroll
    document.querySelectorAll('.bd-body .bd-section').forEach((section) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      });
    });

    // Split images animate in
    document.querySelectorAll('.bd-split-images').forEach((row) => {
      gsap.from(row.children, {
        scrollTrigger: {
          trigger: row,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
      });
    });

    // CTA section
    gsap.from('.cta-outer-box', {
      scrollTrigger: {
        trigger: '.cta-section',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
    });

    // Related blogs cards
    gsap.from('.blog-card', {
      scrollTrigger: {
        trigger: '.blogs-grid',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power2.out',
    });
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
});
