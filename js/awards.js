/* JavaScript for awards.html */
document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. GSAP / SCROLLTRIGGER ANIMATIONS
     ========================================== */
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

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

    // Fade in Featured Card Frame
    gsap.from('.awards-featured-frame', {
      scrollTrigger: {
        trigger: '.awards-featured-frame',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      duration: 1.2,
      y: 40,
      opacity: 0,
      ease: 'power3.out'
    });

    // Fade in Contribution Section Content & Images
    gsap.from('.contribution-left', {
      scrollTrigger: {
        trigger: '.contribution-section',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      duration: 1,
      y: 30,
      opacity: 0,
      ease: 'power3.out'
    });

    gsap.from('.contribution-images-grid', {
      scrollTrigger: {
        trigger: '.contribution-section',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      duration: 1.1,
      y: 40,
      opacity: 0,
      ease: 'power3.out',
      delay: 0.1
    });

    // Fade in Timeline Header
    gsap.from('.timeline-header', {
      scrollTrigger: {
        trigger: '.timeline-section',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      duration: 1,
      y: 30,
      opacity: 0,
      ease: 'power3.out'
    });

    // Animate each timeline card sequentially
    const timelineCards = document.querySelectorAll('.timeline-card');
    timelineCards.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        duration: 1,
        y: 35,
        opacity: 0,
        ease: 'power3.out',
        delay: index * 0.08
      });
    });

    // Fade in Behind the Trophy / Gallery section
    gsap.from('.gallery-top-header', {
      scrollTrigger: {
        trigger: '.gallery-showcase-section',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      duration: 1,
      y: 30,
      opacity: 0,
      ease: 'power3.out',
      stagger: 0.15
    });

    gsap.from('.gallery-col-part', {
      scrollTrigger: {
        trigger: '.gallery-columns-grid',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      duration: 1.1,
      y: 35,
      opacity: 0,
      ease: 'power3.out',
      stagger: 0.15
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

});

