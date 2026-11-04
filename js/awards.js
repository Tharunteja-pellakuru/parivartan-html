/* JavaScript for awards.html */
document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     0. BUTTERY SMOOTH SCROLL (LENIS ENGINE)
     ========================================== */
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      infinite: false
    });
    window.lenis = lenis;

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  /* ==========================================
     1. GSAP / SCROLLTRIGGER ANIMATIONS
     ========================================== */
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ limitCallbacks: true });

    // Fade in Title and Tagline
    gsap.from('.awards-hero-tagline', {
      duration: 1,
      y: 20,
      opacity: 0,
      ease: 'power3.out'
    });

    gsap.from('.awards-title', {
      duration: 1.2,
      y: 30,
      opacity: 0,
      ease: 'power3.out',
      delay: 0.15
    });

    // Fade in Featured Card Frame directly without scroll overhead
    gsap.from('.awards-featured-frame', {
      duration: 1.1,
      y: 30,
      opacity: 0,
      ease: 'power3.out',
      delay: 0.25
    });

    // Fade in Contribution Section Content & Video
    gsap.from('.contribution-header', {
      scrollTrigger: {
        trigger: '.contribution-section',
        start: 'top 85%',
        once: true
      },
      duration: 0.9,
      y: 25,
      opacity: 0,
      ease: 'power3.out'
    });

    gsap.from('.contribution-paragraphs, .contribution-video-wrapper', {
      scrollTrigger: {
        trigger: '.contribution-section',
        start: 'top 85%',
        once: true
      },
      duration: 1,
      y: 30,
      opacity: 0,
      ease: 'power3.out',
      delay: 0.1
    });

    // Fade in Timeline Header
    gsap.from('.timeline-header', {
      scrollTrigger: {
        trigger: '.timeline-section',
        start: 'top 85%',
        once: true
      },
      duration: 0.9,
      y: 25,
      opacity: 0,
      ease: 'power3.out'
    });

    // Animate each timeline card sequentially
    const timelineCards = document.querySelectorAll('.timeline-card');
    timelineCards.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          once: true
        },
        duration: 0.9,
        y: 30,
        opacity: 0,
        ease: 'power3.out',
        delay: index * 0.08
      });
    });

    // Fade in Behind the Trophy / Gallery section
    gsap.from('.gallery-top-header', {
      scrollTrigger: {
        trigger: '.gallery-showcase-section',
        start: 'top 85%',
        once: true
      },
      duration: 0.9,
      y: 25,
      opacity: 0,
      ease: 'power3.out'
    });

    gsap.from('.gallery-col-part', {
      scrollTrigger: {
        trigger: '.gallery-columns-grid',
        start: 'top 88%',
        once: true
      },
      duration: 1,
      y: 30,
      opacity: 0,
      ease: 'power3.out',
      stagger: 0.12
    });
  }

  /* ==========================================
     2. TIMELINE CAROUSEL & THUMBNAIL SWITCHER
     ========================================== */
  const timelineCards = document.querySelectorAll('.timeline-card');
  timelineCards.forEach(card => {
    const mainImg = card.querySelector('.timeline-main-img');
    const thumbs = card.querySelectorAll('.timeline-thumb');
    const prevBtn = card.querySelector('.timeline-nav-prev');
    const nextBtn = card.querySelector('.timeline-nav-next');

    if (!mainImg || thumbs.length === 0) return;

    function setActiveThumb(index) {
      if (index < 0) index = thumbs.length - 1;
      if (index >= thumbs.length) index = 0;

      thumbs.forEach(t => t.classList.remove('is-active'));
      const activeThumb = thumbs[index];
      if (!activeThumb) return;

      activeThumb.classList.add('is-active');
      const newSrc = activeThumb.getAttribute('data-src');

      if (newSrc && mainImg.getAttribute('src') !== newSrc) {
        mainImg.classList.add('fade-out');
        setTimeout(() => {
          mainImg.src = newSrc;
          mainImg.classList.remove('fade-out');
        }, 150);
      }
    }

    thumbs.forEach((thumb, idx) => {
      thumb.addEventListener('click', () => {
        setActiveThumb(idx);
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentActive = card.querySelector('.timeline-thumb.is-active');
        const currentIndex = currentActive ? Array.from(thumbs).indexOf(currentActive) : 0;
        setActiveThumb(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentActive = card.querySelector('.timeline-thumb.is-active');
        const currentIndex = currentActive ? Array.from(thumbs).indexOf(currentActive) : 0;
        setActiveThumb(currentIndex + 1);
      });
    }
  });

  /* ==========================================
     LAZY LOADER ENGINE
     ========================================== */
  const triggerLazyImagesIn = (container) => {
    if (!container) return;
    const lazyImgs = container.querySelectorAll('img[data-src]');
    lazyImgs.forEach(img => {
      const src = img.getAttribute('data-src');
      if (src) {
        img.src = src;
        img.onload = () => img.classList.add('is-loaded');
        if (img.complete) img.classList.add('is-loaded');
        img.removeAttribute('data-src');
      }
    });
  };

  /* ==========================================
     3. TIMELINE CARD VIEW MORE & EXPANDED DRAWER
     ========================================== */
  const viewMoreButtons = document.querySelectorAll('.timeline-view-more-btn');
  viewMoreButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.timeline-card');
      if (!card) return;
      const isExpanded = card.classList.toggle('is-expanded');
      const span = btn.querySelector('span');
      if (span) {
        span.textContent = isExpanded ? 'View less' : 'View more';
      }

      // If opening, eagerly observe and load drawer images on demand
      if (isExpanded) {
        triggerLazyImagesIn(card);
      }
      if (window.lenis) {
        setTimeout(() => window.lenis.resize(), 350);
      }
      if (typeof ScrollTrigger !== 'undefined') {
        setTimeout(() => ScrollTrigger.refresh(), 350);
      }
    });
  });

  /* ==========================================
     4. DRAWER IMAGE & VIDEO TAB TOGGLE SWITCHER
     ========================================== */
  document.querySelectorAll('.timeline-card-drawer').forEach(drawer => {
    const tabButtons = drawer.querySelectorAll('.timeline-tab-btn');
    const panes = drawer.querySelectorAll('.timeline-tab-pane');

    tabButtons.forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        const target = tabBtn.getAttribute('data-tab');
        
        tabButtons.forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        tabBtn.classList.add('is-active');
        tabBtn.setAttribute('aria-selected', 'true');

        panes.forEach(pane => {
          if (pane.getAttribute('data-pane') === target) {
            pane.classList.add('is-active');
          } else {
            pane.classList.remove('is-active');
          }
        });

        if (target === 'images') {
          triggerLazyImagesIn(drawer);
        }

        if (window.lenis) {
          setTimeout(() => window.lenis.resize(), 300);
        }
        if (typeof ScrollTrigger !== 'undefined') {
          setTimeout(() => ScrollTrigger.refresh(), 300);
        }
      });
    });
  });

  /* ==========================================
     4b. BEHIND THE TROPHY GALLERY VIEW MORE TOGGLE
     ========================================== */
  document.addEventListener('click', (e) => {
    const galleryBtn = e.target.closest('#gallery-view-more-btn, .gallery-btn');
    if (!galleryBtn) return;
    e.preventDefault();
    const galleryDrawer = document.getElementById('gallery-extended-drawer');
    if (!galleryDrawer) return;
    
    const isExpanded = galleryDrawer.classList.toggle('is-expanded');
    galleryBtn.classList.toggle('is-active', isExpanded);
    const span = galleryBtn.querySelector('span');
    if (span) {
      span.textContent = isExpanded ? 'View less' : 'View more';
    }
    if (isExpanded) {
      triggerLazyImagesIn(galleryDrawer);
    }
    if (window.lenis) {
      setTimeout(() => window.lenis.resize(), 400);
    }
    if (typeof ScrollTrigger !== 'undefined') {
      setTimeout(() => ScrollTrigger.refresh(), 400);
    }
  });

  /* ==========================================
     5. AWARDS IMAGE LIGHTBOX MODAL
     ========================================== */
  const lightboxModal = document.getElementById('awards-lightbox-modal');
  const lightboxImg = document.getElementById('awards-lightbox-img');
  const lightboxCaption = document.getElementById('awards-lightbox-caption');
  const lightboxClose = document.querySelector('.awards-lightbox-close');
  const lightboxOverlay = document.querySelector('.awards-lightbox-overlay');

  if (lightboxModal && lightboxImg) {
    const openLightbox = (src, caption) => {
      if (window.lenis) window.lenis.stop();
      lightboxImg.src = src;
      if (lightboxCaption) lightboxCaption.textContent = caption || '';
      lightboxModal.style.display = 'flex';
      lightboxModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightboxModal.style.display = 'none';
      lightboxModal.setAttribute('aria-hidden', 'true');
      lightboxImg.src = '';
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    };

    document.querySelectorAll('.timeline-image-item, .gallery-media-card').forEach(item => {
      item.addEventListener('click', () => {
        const fullSrc = item.getAttribute('data-full-src') || item.querySelector('img')?.getAttribute('data-src') || item.querySelector('img')?.src;
        const cap = item.querySelector('.timeline-image-caption, .gallery-card-caption')?.textContent?.trim() || item.querySelector('img')?.alt || '';
        if (fullSrc) openLightbox(fullSrc, cap);
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.style.display === 'flex') {
        closeLightbox();
      }
    });
  }

});

