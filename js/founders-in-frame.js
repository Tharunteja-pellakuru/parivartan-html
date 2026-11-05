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
     2. VIDEO POPUP MODAL — DIRECT CARD BINDING
     ========================================== */
  const videoOverlay = document.getElementById('fif-video-overlay');
  const videoIframe = document.getElementById('fif-video-player');
  const videoCloseBtn = document.getElementById('fif-video-close');
  const videoTitleEl = document.getElementById('fif-video-title');
  const videoModal = videoOverlay ? videoOverlay.querySelector('.video-preview-modal') : null;

  if (videoOverlay && videoIframe) {
    // Open a video in the modal
    function openVideo(videoId, start, title) {
      if (!videoId) return;
      const startSec = parseInt(start, 10) || 0;
      const startParam = startSec > 0 ? '&start=' + startSec : '';
      videoIframe.src = 'https://www.youtube.com/embed/' + videoId +
        '?autoplay=1&rel=0&playsinline=1' + startParam;
      if (videoTitleEl) videoTitleEl.textContent = title || 'Founders in Frame';
      
      videoOverlay.style.display = 'flex';
      void videoOverlay.offsetWidth;
      videoOverlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }

    // Close the modal and stop playback
    function closeVideo() {
      videoOverlay.classList.remove('is-active');
      setTimeout(function() {
        videoIframe.src = '';
        videoOverlay.style.display = 'none';
        document.body.style.overflow = '';
      }, 350);
    }

    // Bind every episode card directly
    document.querySelectorAll('.fif-episode-card').forEach(function(card) {
      var videoId = card.getAttribute('data-video-id');
      var start   = card.getAttribute('data-start') || 0;
      var img     = card.querySelector('.fif-thumb-img');
      var titleEl = card.querySelector('.fif-episode-title');
      var metaEl  = card.querySelector('.fif-episode-meta strong');

      var title = 'Founders in Frame';
      if (img && img.getAttribute('alt')) {
        title = img.getAttribute('alt');
      } else if (titleEl) {
        title = titleEl.textContent.trim() + (metaEl ? ' — ' + metaEl.textContent.trim() : '');
      }

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

    // Also bind the hero "Watch Latest Episode" button if present
    var heroBtn = document.querySelector('.fif-hero-btn[data-video-id]');
    if (heroBtn) {
      heroBtn.addEventListener('click', function(e) {
        e.preventDefault();
        var vid   = heroBtn.getAttribute('data-video-id');
        var start = heroBtn.getAttribute('data-start') || 0;
        if (vid) openVideo(vid, start, 'Founders in Frame — Latest Episode');
      });
    }

    // Close handlers
    if (videoCloseBtn) {
      videoCloseBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeVideo();
      });
    }

    // Click backdrop (overlay) to close, but not inner modal
    videoOverlay.addEventListener('click', function(e) {
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
      if (e.key === 'Escape' && (videoOverlay.classList.contains('is-active') || videoOverlay.style.display === 'flex')) {
        closeVideo();
      }
    });
  }

});


