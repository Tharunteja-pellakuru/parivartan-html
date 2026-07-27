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

    // Staggered Entry for Bento Gallery Cards
    gsap.from('.awards-grid-card', {
      scrollTrigger: {
        trigger: '.awards-grid-container',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      duration: 1,
      y: 50,
      opacity: 0,
      stagger: 0.12,
      ease: 'power3.out'
    });


  }

  /* ==========================================
     2. VIDEO POPUP MODAL LIGHTBOX
     ========================================== */
  const videoModal = document.getElementById('videoPreviewModal');
  const videoPlayerIframe = document.getElementById('videoPlayerIframe');
  const closeModalBtn = document.getElementById('videoModalCloseBtn');
  const openVideoButtons = document.querySelectorAll('.open-video-btn');

  // Open Modal Listener
  openVideoButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const videoId = btn.getAttribute('data-video-id');
      if (videoId) {
        // Construct the YouTube embed URL with autoplay enabled
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0`;
        videoPlayerIframe.src = embedUrl;
        
        // Show modal
        videoModal.classList.add('is-active');
        document.body.style.overflow = 'hidden'; // Stop background scrolling
      }
    });
  });

  // Close Modal Function
  const closeModal = () => {
    videoModal.classList.remove('is-active');
    document.body.style.overflow = ''; // Resume background scrolling
    
    // Stop video playback by clearing source
    setTimeout(() => {
      videoPlayerIframe.src = '';
    }, 300);
  };

  // Close Button Click
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  // Backdrop Click to close
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        closeModal();
      }
    });
  }

  // ESC Key close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('is-active')) {
      closeModal();
    }
  });

  /* ==========================================
     3. GALLERY VIEW MORE ACTION BUTTON
     ========================================== */
  const galleryViewMoreBtn = document.getElementById('galleryViewMoreBtn');
  if (galleryViewMoreBtn) {
    galleryViewMoreBtn.addEventListener('click', () => {
      // Show confirmation alert
      alert("Additional recognition ceremony photos and videos will be loaded.");
    });
  }

});
