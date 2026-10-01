const initClientsApp = () => {

    /* ==========================================
     0. ACTIVE NAV ITEM AUTO-HIGHLIGHT (SINGLE ITEM GUARANTEED)
     ========================================== */
  const highlightActiveNav = () => {
    let rawPath = window.location.pathname.split('/').pop().split('#')[0];
    const currentPath = (!rawPath || rawPath === '' || rawPath === '/') ? 'index.html' : rawPath;

    // Clear ALL active states first across all desktop and mobile nav items
    document.querySelectorAll('.desktop-nav .nav-item, .desktop-nav .nav-link, .desktop-nav .dropdown-item, .mobile-drawer .drawer-menu-item, .mobile-drawer .drawer-submenu-item').forEach(el => {
      el.classList.remove('active');
    });

    if (currentPath === 'index.html') {
      const homeNav = document.querySelector('.desktop-nav > .nav-item:first-child');
      if (homeNav) {
        homeNav.classList.add('active');
        const homeLink = homeNav.querySelector('.nav-link');
        if (homeLink) homeLink.classList.add('active');
      }
      const mobileHome = document.querySelector('.mobile-drawer a[href*="index.html"]');
      if (mobileHome) mobileHome.classList.add('active');
      return;
    }

    let desktopMatched = false;
    let mobileMatched = false;

    // 1. Highlight Desktop Dropdown (ONLY FIRST EXACT MATCH)
    document.querySelectorAll('.desktop-nav .dropdown-item').forEach(item => {
      if (desktopMatched) return;
      const href = item.getAttribute('href');
      if (!href) return;
      const linkPath = href.replace('./', '').split('/').pop().split('#')[0];
      if (linkPath === currentPath && linkPath !== 'index.html' && linkPath !== '#') {
        item.classList.add('active');
        desktopMatched = true;
        const parentNav = item.closest('.nav-item');
        if (parentNav) {
          parentNav.classList.add('active');
          const mainLink = parentNav.querySelector('.nav-link');
          if (mainLink) mainLink.classList.add('active');
        }
      }
    });

    // 2. Highlight Top-level Nav Link if no dropdown matched
    if (!desktopMatched) {
      document.querySelectorAll('.desktop-nav > .nav-item > .nav-link').forEach(link => {
        if (desktopMatched) return;
        const href = link.getAttribute('href');
        if (!href) return;
        const linkPath = href.replace('./', '').split('/').pop().split('#')[0];
        if (linkPath === currentPath && linkPath !== '#') {
          link.classList.add('active');
          desktopMatched = true;
          const parentNav = link.closest('.nav-item');
          if (parentNav) parentNav.classList.add('active');
        }
      });
    }

    // 3. Highlight Mobile Drawer Item (ONLY FIRST EXACT MATCH)
    document.querySelectorAll('.mobile-drawer .drawer-submenu-item').forEach(item => {
      if (mobileMatched) return;
      const href = item.getAttribute('href');
      if (!href) return;
      const linkPath = href.replace('./', '').split('/').pop().split('#')[0];
      if (linkPath === currentPath && linkPath !== 'index.html' && linkPath !== '#') {
        item.classList.add('active');
        mobileMatched = true;
        const parentGroup = item.closest('.drawer-menu-item-group');
        if (parentGroup) {
          const toggleBtn = parentGroup.querySelector('.drawer-menu-item');
          if (toggleBtn) toggleBtn.classList.add('active');
        }
      }
    });

    if (!mobileMatched) {
      document.querySelectorAll('.mobile-drawer > .drawer-menu-list > a.drawer-menu-item').forEach(link => {
        if (mobileMatched) return;
        const href = link.getAttribute('href');
        if (!href) return;
        const linkPath = href.replace('./', '').split('/').pop().split('#')[0];
        if (linkPath === currentPath && linkPath !== '#') {
          link.classList.add('active');
          mobileMatched = true;
        }
      });
    }
  };

  highlightActiveNav();

  /* ==========================================
     1. GLOBAL ANIMATION LAYER (GSAP REVEALS)
     ========================================== */
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      // Reveal section and footer as it scrolls in (exclude top hero section to avoid refresh jump)
      const revealTargets = gsap.utils.toArray('section, footer').filter(el => !el.classList.contains('clients-hero-section') && !el.classList.contains('hero-section'));
      revealTargets.forEach(el => {
        gsap.fromTo(el,
          { autoAlpha: 0, y: 56 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true,
            }
          }
        );
      });


    } else {
      // Fallback for reduced motion
      gsap.set('section, footer', { autoAlpha: 1, y: 0 });
    }

    // Refresh ScrollTrigger when images load to ensure correct layouts
    const refreshTrigger = () => ScrollTrigger.refresh();
    window.addEventListener('load', refreshTrigger);
    setTimeout(refreshTrigger, 1000);
  }

  function splitTextIntoRevealLines(element) {
    const text = element.textContent.trim();
    if (!text) return;
    
    // Temporarily save inner HTML structure to preserve styled highlights (e.g. <span class="green">)
    // If heading has inner tags, we handle word wrapping node-by-node.
    const hasHTML = element.innerHTML.trim() !== text;
    
    if (!hasHTML) {
      const words = text.split(/\s+/);
      element.innerHTML = words.map(w => `<span class="temp-word">${w}</span>`).join(' ');
      
      const wordSpans = element.querySelectorAll('.temp-word');
      const lines = [];
      let currentLine = [];
      let currentY = -1;
      
      wordSpans.forEach(span => {
        const y = span.offsetTop;
        if (y !== currentY) {
          if (currentLine.length > 0) lines.push(currentLine);
          currentLine = [span];
          currentY = y;
        } else {
          currentLine.push(span);
        }
      });
      if (currentLine.length > 0) lines.push(currentLine);
      
      element.innerHTML = '';
      lines.forEach(lineWords => {
        const lineText = lineWords.map(span => span.textContent).join(' ');
        
        const maskDiv = document.createElement('div');
        maskDiv.className = 'text-reveal-mask';
        maskDiv.style.overflow = 'hidden';
        maskDiv.style.display = 'block';
        
        const lineDiv = document.createElement('div');
        lineDiv.className = 'text-reveal-line';
        lineDiv.textContent = lineText;
        lineDiv.style.display = 'block';
        
        maskDiv.appendChild(lineDiv);
        element.appendChild(maskDiv);
      });
    } else {
      // Fallback for headings with styled HTML tags: wrap directly to fade up
      const childrenHtml = element.innerHTML;
      element.innerHTML = `<div class="text-reveal-mask" style="overflow:hidden; display:block;"><div class="text-reveal-line" style="display:block;">${childrenHtml}</div></div>`;
    }
  }


  /* ==========================================
     2. MOBILE DRAWER NAVIGATION MENU
     ========================================== */
  const menuBtn = document.querySelector('.menu-btn');
  const menuBackdrop = document.querySelector('.menu-backdrop');
  const mobileDrawer = document.querySelector('.mobile-drawer');

  if (menuBtn && menuBackdrop && mobileDrawer && !menuBtn.dataset.menuInitialized) {
    menuBtn.dataset.menuInitialized = 'true';
    let savedScrollY = 0;

    const openMenu = () => {
      savedScrollY = window.scrollY || window.pageYOffset;
      mobileDrawer.querySelectorAll('.drawer-menu-item-group').forEach(group => {
        group.classList.remove('expanded');
        const toggleBtn = group.querySelector('.dropdown-toggle-btn');
        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
      });
      menuBtn.classList.add('active');
      menuBackdrop.classList.add('open');
      mobileDrawer.classList.add('open');
      document.documentElement.classList.add('menu-open');
      document.body.classList.add('menu-open');
      document.body.style.overflow = 'hidden';
      document.body.style.top = `-${savedScrollY}px`;
    };

    const closeMenu = () => {
      menuBtn.classList.remove('active');
      menuBackdrop.classList.remove('open');
      mobileDrawer.classList.remove('open');
      document.documentElement.classList.remove('menu-open');
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
      document.body.style.top = '';
      if (savedScrollY !== undefined && savedScrollY !== null) {
        window.scrollTo(0, savedScrollY);
      }
    };

    const toggleMenu = () => {
      const isOpen = !mobileDrawer.classList.contains('open');
      if (isOpen) {
        openMenu();
      } else {
        closeMenu();
      }
    };

    menuBtn.addEventListener('click', toggleMenu);
    menuBackdrop.addEventListener('click', closeMenu);

    menuBackdrop.addEventListener('touchmove', (e) => {
      if (e.cancelable) e.preventDefault();
    }, { passive: false });

    // Close menu drawer on navigation link clicks (hash navigation)
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Accordion group Inside mobile drawer (Our Work submenus)
    const toggleBtns = mobileDrawer.querySelectorAll('.dropdown-toggle-btn');
    toggleBtns.forEach(toggleBtn => {
      const itemGroup = toggleBtn.closest('.drawer-menu-item-group');
      if (toggleBtn && itemGroup) {
        toggleBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const isExpanded = itemGroup.classList.toggle('expanded');
          toggleBtn.setAttribute('aria-expanded', isExpanded);
        });
      }
    });
  }


  /* ==========================================
     3. TESTIMONIALS STEP-BASED CAROUSEL & PLAYBACK
     ========================================== */
  const testimonialsSec = document.getElementById('testimonials');
  const videoOverlay = document.querySelector('.video-preview-overlay');

  if (testimonialsSec && !testimonialsSec.dataset.stepCarouselInitialized) {
    testimonialsSec.dataset.stepCarouselInitialized = 'true';
    const playButtons = testimonialsSec.querySelectorAll('.play-button');
    const closeBtn = videoOverlay ? videoOverlay.querySelector('.video-preview-close') : null;
    const iframe = videoOverlay ? videoOverlay.querySelector('.video-preview-player') : null;
    const titleText = videoOverlay ? videoOverlay.querySelector('.video-preview-caption-title') : null;
    const noteText = videoOverlay ? videoOverlay.querySelector('.video-preview-caption-note') : null;

    // Infinite Step-based Carousel Navigation (3 cards at a step on desktop)
    const setupStepCarousel = (wrapper, row, prevBtn, nextBtn, cardSelector, onCardInit) => {
      if (!wrapper || !row || !prevBtn || !nextBtn) return () => {};

      const TRANSITION_STYLE = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
      let numOriginal = 0;
      let currentIndex = 0;
      let isAnimating = false;
      let autoScrollTimer = null;
      let isPaused = false;

      const getCardsPerView = () => {
        if (window.innerWidth <= 600) return 1;
        if (window.innerWidth <= 960) return 2;
        return 3;
      };

      const initClones = () => {
        // Clean up any existing clones
        row.querySelectorAll('.is-clone').forEach(el => el.remove());

        const originalCards = Array.from(row.querySelectorAll(cardSelector)).filter(c => !c.classList.contains('is-clone'));
        numOriginal = originalCards.length;
        if (numOriginal === 0) return;

        // Prefix clones
        const prefixFragment = document.createDocumentFragment();
        originalCards.forEach(c => {
          const clone = c.cloneNode(true);
          clone.classList.add('is-clone');
          delete clone.dataset.cardEventsAttached;
          if (typeof onCardInit === 'function') onCardInit(clone);
          prefixFragment.appendChild(clone);
        });
        row.insertBefore(prefixFragment, originalCards[0]);

        // Suffix clones
        const suffixFragment = document.createDocumentFragment();
        originalCards.forEach(c => {
          const clone = c.cloneNode(true);
          clone.classList.add('is-clone');
          delete clone.dataset.cardEventsAttached;
          if (typeof onCardInit === 'function') onCardInit(clone);
          suffixFragment.appendChild(clone);
        });
        row.appendChild(suffixFragment);

        currentIndex = numOriginal;
        updatePosition(false);
      };

      const updatePosition = (animate = true) => {
        const allCards = Array.from(row.querySelectorAll(cardSelector));
        if (!allCards.length) return;

        const firstCard = allCards[0];
        const cardWidth = firstCard.offsetWidth;
        const gap = parseInt(window.getComputedStyle(row).gap) || 24;
        const offset = currentIndex * (cardWidth + gap);

        row.style.transition = animate ? TRANSITION_STYLE : 'none';
        row.style.transform = `translateX(-${offset}px)`;

        // Stop any playing video if moving away from visible cards
        const cpv = getCardsPerView();
        const playingVideos = row.querySelectorAll('video.inline-video-player, iframe.inline-video-iframe');
        playingVideos.forEach(media => {
          const parent = media.closest(cardSelector);
          if (parent) {
            const cardIdx = allCards.indexOf(parent);
            if (cardIdx < currentIndex || cardIdx >= currentIndex + cpv) {
              media.remove();
              const overlay = parent.querySelector('.video-card-overlay');
              if (overlay) overlay.style.display = 'block';
            }
          }
        });
      };

      const checkBoundary = () => {
        if (numOriginal <= 0) return;
        if (currentIndex >= 2 * numOriginal) {
          row.style.transition = 'none';
          currentIndex -= numOriginal;
          updatePosition(false);
          void row.offsetWidth; // force reflow
        } else if (currentIndex < numOriginal) {
          row.style.transition = 'none';
          currentIndex += numOriginal;
          updatePosition(false);
          void row.offsetWidth; // force reflow
        }
      };

      row.addEventListener('transitionend', (e) => {
        if (e.target !== row || e.propertyName !== 'transform') return;
        checkBoundary();
        isAnimating = false;
      });

      const moveNext = () => {
        if (isAnimating || numOriginal <= 0) return;
        isAnimating = true;
        const cpv = getCardsPerView();
        currentIndex += cpv;
        updatePosition(true);

        setTimeout(() => {
          if (isAnimating) {
            checkBoundary();
            isAnimating = false;
          }
        }, 700);
      };

      const movePrev = () => {
        if (isAnimating || numOriginal <= 0) return;
        isAnimating = true;
        const cpv = getCardsPerView();
        currentIndex -= cpv;
        updatePosition(true);

        setTimeout(() => {
          if (isAnimating) {
            checkBoundary();
            isAnimating = false;
          }
        }, 700);
      };

      // Auto-scroll every 3 seconds
      const startAutoScroll = () => {
        stopAutoScroll();
        autoScrollTimer = setInterval(() => {
          if (isPaused) return;
          // Don't auto-scroll if a video or iframe is currently playing inside this carousel
          const activeMedia = row.querySelector('video.inline-video-player, iframe.inline-video-iframe');
          if (activeMedia) return;

          moveNext();
        }, 3000);
      };

      const stopAutoScroll = () => {
        if (autoScrollTimer) {
          clearInterval(autoScrollTimer);
          autoScrollTimer = null;
        }
      };

      const restartAutoScroll = () => {
        stopAutoScroll();
        startAutoScroll();
      };

      // Pause on hover
      wrapper.addEventListener('mouseenter', () => { isPaused = true; });
      wrapper.addEventListener('mouseleave', () => { isPaused = false; });

      // Pause when page is hidden
      document.addEventListener('visibilitychange', () => {
        isPaused = document.visibilityState === 'hidden';
      });

      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        movePrev();
        restartAutoScroll();
      });

      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        moveNext();
        restartAutoScroll();
      });

      // Swipe support for touch devices
      let startX = 0;
      let isSwiping = false;

      wrapper.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length === 1) {
          startX = e.touches[0].clientX;
          isSwiping = true;
          isPaused = true;
        }
      }, { passive: true });

      wrapper.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        isSwiping = false;
        isPaused = false;
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (diff > 45) {
          moveNext();
        } else if (diff < -45) {
          movePrev();
        }
        restartAutoScroll();
      }, { passive: true });

      window.addEventListener('resize', () => {
        updatePosition(false);
      });

      initClones();
      setTimeout(() => updatePosition(false), 50);
      setTimeout(() => updatePosition(false), 300);
      startAutoScroll();

      return () => {
        initClones();
      };
    };

    const videoMap = {
      'sudha-analyticals': {
        title: 'Client Testimonial - Sudha Analyticals (Mr. Srinivas Gullala)',
        vimeoId: '1231599790',
        vimeoHash: 'de09610d36'
      },
      'anuj-gurwara': {
        title: 'Client Testimonial - Sherwood Public School (Mr. Anuj Gurwara)',
        vimeoId: '1231599622',
        vimeoHash: 'd653ecbe44'
      },
      'andhra-canteen': {
        title: 'Founders in Frame - Andhra Canteen (Ms. Hyma Kesineni)',
        vimeoId: '1231599623',
        vimeoHash: 'cd36d71c15'
      },
      'clapkartel': {
        title: 'Founders in Frame - Clap Kartel (Mr. Raghu Tirumala)',
        vimeoId: '1231599624',
        vimeoHash: 'ee8ea61051'
      },
      'ritebooks': {
        title: 'Client Testimonial - RiteBook Technologies (Mr. Raghavender Srirampur)',
        vimeoId: '1231599695',
        vimeoHash: '188fbede0c'
      },
      'rithika-suits': {
        title: 'Founders in Frame - Rithika Suits (Ms. Natasha Malve)',
        vimeoId: '1231599781',
        vimeoHash: '840d538418'
      },
      'viyash': {
        title: 'Client Testimonial - Viyash Scientific Limited (Mr. Kiran Varma)',
        vimeoId: '1231599791',
        vimeoHash: 'f604f80835'
      },
      'b5-corp': {
        title: 'Client Testimonial - B5 Corporation (Mr. KVS Subramanyam)',
        vimeoId: '1231599625',
        vimeoHash: 'baf1c47af4'
      },

    };

    const handlePlayVideo = (cardWrapper) => {
      if (!cardWrapper) return;
      const key = cardWrapper.getAttribute('data-id');
      const config = videoMap[key];
      if (!config) return;

      // Stop & clean up any other inline video or iframe currently playing
      document.querySelectorAll('.video-card iframe.inline-video-iframe, .video-card video.inline-video-player').forEach(existingMedia => {
        const parentCard = existingMedia.closest('.video-card');
        if (parentCard && parentCard !== cardWrapper) {
          if (existingMedia.tagName.toLowerCase() === 'video') {
            existingMedia.pause();
          }
          existingMedia.remove();
          const overlay = parentCard.querySelector('.video-card-overlay');
          if (overlay) overlay.style.display = 'block';
        }
      });

      // Hide card overlay and inject video/iframe inside card
      const overlay = cardWrapper.querySelector('.video-card-overlay');

      if (config.videoSrc) {
        let videoEl = cardWrapper.querySelector('video.inline-video-player');
        if (!videoEl) {
          videoEl = document.createElement('video');
          videoEl.className = 'inline-video-player';
          videoEl.src = config.videoSrc;
          videoEl.controls = true;
          videoEl.autoplay = true;
          videoEl.playsInline = true;
          videoEl.style.cssText = 'width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; border: none; border-radius: 12px; z-index: 10; background: transparent;';
          
          videoEl.addEventListener('ended', () => {
            videoEl.remove();
            if (overlay) overlay.style.display = 'block';
          });

          cardWrapper.appendChild(videoEl);
        } else {
          videoEl.src = config.videoSrc;
          videoEl.style.display = 'block';
          videoEl.currentTime = 0;
          videoEl.play().catch(() => {});
        }
      } else {
        let embedSrc = '';
        if (config.vimeoId) {
          const hashParam = config.vimeoHash ? `h=${config.vimeoHash}&` : '';
          embedSrc = `https://player.vimeo.com/video/${config.vimeoId}?${hashParam}autoplay=1&autopause=0&badge=0&title=0&byline=0&portrait=0`;
        } else if (config.youtubeId) {
          embedSrc = `https://www.youtube.com/embed/${config.youtubeId}?start=${config.start || 0}&autoplay=1&rel=0`;
        }

        let iframeEl = cardWrapper.querySelector('iframe.inline-video-iframe');
        if (!iframeEl) {
          iframeEl = document.createElement('iframe');
          iframeEl.className = 'inline-video-iframe';
          iframeEl.src = embedSrc;
          iframeEl.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
          iframeEl.setAttribute('allowfullscreen', 'true');
          iframeEl.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
          iframeEl.setAttribute('title', config.title || 'Video Testimonial');
          iframeEl.style.cssText = 'width: 100%; height: 100%; position: absolute; top: 0; left: 0; border: none; border-radius: 12px; z-index: 10; background: transparent;';
          cardWrapper.appendChild(iframeEl);
        } else {
          iframeEl.src = embedSrc;
          iframeEl.style.display = 'block';
        }
      }

      if (overlay) {
        overlay.style.display = 'none';
      }
    };

    const attachCardEvents = (cardWrapper) => {
      if (!cardWrapper || cardWrapper.dataset.cardEventsAttached) return;
      cardWrapper.dataset.cardEventsAttached = 'true';

      const playBtn = cardWrapper.querySelector('.play-button');
      if (playBtn) {
        playBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          handlePlayVideo(cardWrapper);
        });
      }

      const overlay = cardWrapper.querySelector('.video-card-overlay');
      if (overlay) {
        overlay.style.cursor = 'pointer';
        overlay.addEventListener('click', (e) => {
          if (playBtn && (e.target === playBtn || playBtn.contains(e.target))) {
            return;
          }
          handlePlayVideo(cardWrapper);
        });
      }
    };

    // Attach to existing cards
    testimonialsSec.querySelectorAll('.video-card').forEach(attachCardEvents);

    // Vimeo Dynamic Folder Sync
    const VIMEO_FOLDER_CONFIG = {
      token: '30cdb5a307c04b87889ef4a76c592dd6',
      userId: '254778851',
      folderId: '30724917',
      cacheKey: 'eparivartan_vimeo_testimonials_cache',
      cacheDurationMs: 10 * 60 * 1000 // 10 minutes cache
    };

    const customThumbMap = {
      '1231599790': { key: 'sudha-analyticals', thumb: 'assets/testimonials/sudha-analyticals-thumb.webp', title: 'Sudha Analyticals - Mr. Srinivas Gullala' },
      '1231599622': { key: 'anuj-gurwara', thumb: 'assets/testimonials/anuj-gurwara-thumb.webp', title: 'Sherwood Public School - Mr. Anuj Gurwara' },
      '1231599623': { key: 'andhra-canteen', thumb: 'assets/testimonials/andhra-canteen-thumb.webp', title: 'Andhra Canteen - Ms. Hyma Kesineni' },
      '1231599624': { key: 'clapkartel', thumb: 'assets/testimonials/clapkartel-thumb.webp', title: 'Clap Kartel - Mr. Raghu Tirumala' },
      '1231599695': { key: 'ritebooks', thumb: 'assets/testimonials/ritebooks-thumb.webp', title: 'RiteBook Technologies - Mr. Raghavender Srirampur' },
      '1231599781': { key: 'rithika-suits', thumb: 'assets/testimonials/rithika-suits-thumb.webp', title: 'Rithika Suits - Ms. Natasha Malve' },
      '1231599791': { key: 'viyash', thumb: 'assets/testimonials/viyash-thumb.webp', title: 'Viyash Scientific Limited - Mr. Kiran Varma' },
      '1231599625': { key: 'b5-corp', thumb: 'assets/testimonials/b5-corp-thumb.webp', title: 'B5 Corporation - Mr. KVS Subramanyam' }
    };

    const syncVimeoFolderTestimonials = async (row, onNewCardsAdded) => {
      if (!row) return;
      try {
        let vimeoVideos = null;
        const cached = sessionStorage.getItem(VIMEO_FOLDER_CONFIG.cacheKey);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Date.now() - parsed.timestamp < VIMEO_FOLDER_CONFIG.cacheDurationMs && Array.isArray(parsed.videos)) {
              vimeoVideos = parsed.videos;
            }
          } catch (_) {}
        }

        if (!vimeoVideos) {
          const res = await fetch(`https://api.vimeo.com/users/${VIMEO_FOLDER_CONFIG.userId}/projects/${VIMEO_FOLDER_CONFIG.folderId}/videos?per_page=100&fields=name,uri,player_embed_url,embed.html,pictures`, {
            headers: {
              'Authorization': `bearer ${VIMEO_FOLDER_CONFIG.token}`
            }
          });
          if (res.ok) {
            const json = await res.json();
            vimeoVideos = json.data || [];
            sessionStorage.setItem(VIMEO_FOLDER_CONFIG.cacheKey, JSON.stringify({
              timestamp: Date.now(),
              videos: vimeoVideos
            }));
          }
        }

        if (!Array.isArray(vimeoVideos) || !vimeoVideos.length) return;

        let hasNewCards = false;

        vimeoVideos.forEach(v => {
          const id = v.uri ? v.uri.split('/').pop() : null;
          if (!id) return;

          let hash = '';
          if (v.player_embed_url) {
            const match = v.player_embed_url.match(/h=([a-zA-Z0-9]+)/);
            if (match) hash = match[1];
          }

          const preset = customThumbMap[id];
          const key = preset ? preset.key : `vimeo-${id}`;
          const title = v.name || (preset ? preset.title : 'Client Testimonial');

          videoMap[key] = {
            title: title,
            vimeoId: id,
            vimeoHash: hash
          };

          const existingCard = row.querySelector(`.video-card[data-id="${key}"]`);
          if (!existingCard) {
            let thumbUrl = '';
            if (preset && preset.thumb) {
              thumbUrl = preset.thumb;
            } else if (v.pictures && Array.isArray(v.pictures.sizes) && v.pictures.sizes.length > 0) {
              const sizes = v.pictures.sizes;
              const preferred = sizes.find(s => s.width >= 640 && s.width <= 1280) || sizes[sizes.length - 1];
              thumbUrl = preferred ? preferred.link : '';
            }

            const card = document.createElement('div');
            card.className = 'video-card video-card--custom-graphic';
            card.setAttribute('data-id', key);
            card.innerHTML = `
              <div class="video-card-overlay">
                ${thumbUrl ? `<img src="${thumbUrl}" alt="${title}" class="video-card-bg-img" loading="lazy" />` : ''}
                <div class="play-button-wrapper">
                  <button type="button" class="play-button" aria-label="Play testimonial from ${title}">
                    <svg width="14" height="16" viewBox="0 0 14 16" fill="white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 8L1 15V1L13 8Z" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            `;
            row.appendChild(card);
            attachCardEvents(card);
            hasNewCards = true;
          }
        });

        if (hasNewCards && typeof onNewCardsAdded === 'function') {
          onNewCardsAdded();
        }
      } catch (err) {
        console.warn('Vimeo dynamic testimonials sync:', err);
      }
    };

    // Video Testimonials Carousel Navigation Controls
    const videoPrevBtn = testimonialsSec.querySelector('.testimonials-header-right .testimonials-prev-btn');
    const videoNextBtn = testimonialsSec.querySelector('.testimonials-header-right .testimonials-next-btn');
    const videoWrapper = testimonialsSec.querySelector('.video-testimonials-wrapper');
    const videoRow = testimonialsSec.querySelector('.video-testimonials-row');

    if (videoPrevBtn && videoNextBtn && videoWrapper && videoRow) {
      const updateVideoCarousel = setupStepCarousel(videoWrapper, videoRow, videoPrevBtn, videoNextBtn, '.video-card', attachCardEvents);
      syncVimeoFolderTestimonials(videoRow, updateVideoCarousel);
    }

    // Written Testimonials Carousel Navigation Controls
    const writtenPrevBtn = testimonialsSec.querySelector('.written-prev-btn');
    const writtenNextBtn = testimonialsSec.querySelector('.written-next-btn');
    const writtenWrapper = testimonialsSec.querySelector('.written-testimonials-wrapper');
    const writtenRow = testimonialsSec.querySelector('.written-testimonials-row');

    if (writtenPrevBtn && writtenNextBtn && writtenWrapper && writtenRow) {
      setupStepCarousel(writtenWrapper, writtenRow, writtenPrevBtn, writtenNextBtn, '.written-card');
    }

    if (closeBtn && videoOverlay && iframe) {
      const closeVideo = () => {
        videoOverlay.style.display = 'none';
        iframe.src = '';
        document.body.style.overflow = '';
      };

      closeBtn.addEventListener('click', closeVideo);
      videoOverlay.addEventListener('click', closeVideo);
      
      const modal = videoOverlay.querySelector('.video-preview-modal');
      if (modal) {
        modal.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoOverlay.style.display === 'flex') {
          closeVideo();
        }
      });
    }
  }


  /* ==========================================
     4. CONTACT FORM HANDLER & INTEGRATIONS
     ========================================== */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm && !contactForm.dataset.formInitialized) {
    contactForm.dataset.formInitialized = 'true';
    const servicesList = [
      'UI/UX Design',
      'Website Development',
      'Custom Web Application',
      'Mobile App Development',
      'E-commerce Development',
      'SEO / AEO / GEO',
      'AMC / Technology Support',
      'Other Technology Requirement',
    ];

    // Build Custom Dropdown Menu triggers
    const trigger = contactForm.querySelector('.contact-custom-dropdown-trigger');
    const container = contactForm.querySelector('.contact-custom-dropdown-container');
    const hiddenInput = contactForm.querySelector('input[name="service"]');
    let selectedDisplay = null;
    
    if (trigger && container && hiddenInput) {
      selectedDisplay = trigger.querySelector('.contact-dropdown-selected-value');

      // Create dropdown selection block options dynamically
      const ul = document.createElement('ul');
      ul.className = 'contact-custom-dropdown-options';
      ul.style.display = 'none';

      servicesList.forEach(service => {
        const li = document.createElement('li');
        li.className = 'contact-custom-dropdown-option';
        li.textContent = service;
        li.addEventListener('click', (e) => {
          e.stopPropagation();
          hiddenInput.value = service;
          if (selectedDisplay) {
            selectedDisplay.textContent = service;
            selectedDisplay.classList.remove('placeholder');
          }
          ul.style.display = 'none';
          trigger.classList.remove('active');
          const chevron = trigger.querySelector('.contact-dropdown-chevron');
          if (chevron) chevron.classList.remove('open');
        });
        ul.appendChild(li);
      });
      container.appendChild(ul);

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = ul.style.display === 'block';
        ul.style.display = isOpen ? 'none' : 'block';
        trigger.classList.toggle('active', !isOpen);
        const chevron = trigger.querySelector('.contact-dropdown-chevron');
        if (chevron) chevron.classList.toggle('open', !isOpen);
      });

      document.addEventListener('click', () => {
        ul.style.display = 'none';
        trigger.classList.remove('active');
        const chevron = trigger.querySelector('.contact-dropdown-chevron');
        if (chevron) chevron.classList.remove('open');
      });
    }

    // Real-Time URL Previews Collapse/Dropdown handling
    const websiteInput = document.getElementById('website');
    const previewCollapse = contactForm.querySelector('.contact-website-preview-collapse');
    const previewChevron = contactForm.querySelector('.contact-website-field .contact-dropdown-chevron');
    const previewIframe = contactForm.querySelector('.contact-preview-iframe');
    const previewHint = contactForm.querySelector('.contact-preview-hint');
    const previewLoading = contactForm.querySelector('.contact-preview-loading');
    
    let typingTimer;
    let previewOpenToken = 0;

    const normalizeUrl = (input) => {
      const trimmed = input.trim();
      if (!trimmed) return '';
      return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    };

    const DOMAIN_RE = /^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;
    const getPreviewableUrl = (input) => {
      const normalized = normalizeUrl(input);
      if (!normalized) return '';
      try {
        const parsed = new URL(normalized);
        return DOMAIN_RE.test(parsed.hostname) ? parsed.href : '';
      } catch {
        return '';
      }
    };

    const loadWebsitePreview = () => {
      const previewUrl = getPreviewableUrl(websiteInput.value);
      if (!previewUrl) {
        hidePreview();
        return;
      }

      previewLoading.style.display = 'block';
      previewIframe.src = previewUrl;
      previewIframe.style.opacity = '0';
      previewHint.querySelector('a').href = previewUrl;

      // Handle loading events
      previewIframe.onload = () => {
        previewLoading.style.display = 'none';
        previewIframe.style.opacity = '1';
      };

      showPreview();
    };

    const showPreview = () => {
      previewCollapse.classList.remove('is-collapsed');
      if (previewChevron) previewChevron.classList.add('open');
      
      // Auto-collapse after 3 seconds
      previewOpenToken++;
      const currentToken = previewOpenToken;
      setTimeout(() => {
        if (currentToken === previewOpenToken) {
          hidePreview();
        }
      }, 3000);
    };

    const hidePreview = () => {
      previewCollapse.classList.add('is-collapsed');
      if (previewChevron) previewChevron.classList.remove('open');
    };

    websiteInput.addEventListener('input', () => {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(loadWebsitePreview, 600);
    });

    websiteInput.addEventListener('focus', () => {
      if (getPreviewableUrl(websiteInput.value)) {
        showPreview();
      }
    });

    if (previewChevron) {
      previewChevron.addEventListener('click', (e) => {
        e.stopPropagation();
        const isCollapsed = previewCollapse.classList.contains('is-collapsed');
        if (isCollapsed) {
          loadWebsitePreview();
        } else {
          hidePreview();
        }
      });
    }

    // Close preview window when clicking outside
    document.addEventListener('mousedown', (e) => {
      if (!websiteInput.closest('.contact-website-field').contains(e.target)) {
        hidePreview();
      }
    });

    // reCAPTCHA init script configuration
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
    }, 500);

    // Form Submissions API Integration
    const submitBtn = contactForm.querySelector('.contact-submit-btn');
    const toast = document.querySelector('.contact-toast-container');
    const toastClose = document.querySelector('.contact-toast-close');

    const BREVO_API_KEY = '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';
    const CRM_URL = 'https://crmadmin.whysocial.in/api/add-enquiry';

    // Clear statuses
    const clearFormStatus = () => {
      const oldStatus = contactForm.querySelector('.contact-form-status');
      if (oldStatus) oldStatus.remove();
    };

    const displayFormStatus = (msg, isError) => {
      clearFormStatus();
      const p = document.createElement('p');
      p.className = `contact-form-status contact-form-status-${isError ? 'error' : 'success'}`;
      p.textContent = msg;
      submitBtn.parentNode.insertBefore(p, submitBtn);
    };

    // Toast notifications timer logic
    let toastTimer;
    const showToast = () => {
      if (toast) {
        toast.classList.add('is-visible');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          toast.classList.remove('is-visible');
        }, 5000);
      }
    };

    if (toastClose && toast) {
      toastClose.addEventListener('click', () => {
        toast.classList.remove('is-visible');
      });
    }

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const recaptchaResponse = window.grecaptcha ? window.grecaptcha.getResponse() : '';
      if (!recaptchaResponse) {
        displayFormStatus('Please complete the reCAPTCHA before submitting.', true);
        return;
      }

      submitBtn.disabled = true;
      const btnSpan = submitBtn.querySelector('span');
      const originalBtnText = btnSpan.textContent;
      btnSpan.textContent = 'Sending…';
      clearFormStatus();

      const fullName = document.getElementById('fullName').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();
      let website = document.getElementById('website').value.trim();
      if (website && !/^https?:\/\//i.test(website)) {
        website = 'https://' + website;
      }
      const service = hiddenInput.value;
      const message = document.getElementById('message').value.trim();

      // Submit via backend mailer
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('phone', phone);
      formData.append('email', email);
      formData.append('website', website);
      formData.append('service', service);
      formData.append('message', message);
      formData.append('g-recaptcha-response', recaptchaResponse);

      try {
        const response = await fetch('./contact-mailer.php', {
          method: 'POST',
          body: formData
        });

        const responseText = await response.text();
        let result;
        let isPhpActive = true;
        try {
          result = JSON.parse(responseText);
        } catch (parseErr) {
          isPhpActive = false;
        }

        if (!response.ok || !isPhpActive || !result.success) {
          const IS_LOCAL = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
          if (IS_LOCAL) {
            console.warn('Local testing detected without PHP execution. Falling back to direct client-side APIs...');
            
            const BREVO_API_KEY = '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';
            const CRM_URL = 'https://crmadmin.whysocial.in/api/add-enquiry';
            const payload = { fullName, phone, email, website, service, message };
            
            const [emailSuccess] = await Promise.all([
              // 1. Send admin notification email to admin team
              sendBrevoEmail({
                apiKey: BREVO_API_KEY,
                sender: { name: 'eParivartan', email: 'smo@eparivartan.com' },
                to: [
                  { email: 'feedback@eparivartan.com', name: 'eParivartan Team' },
                  { email: 'chaitanya.eparivartan@gmail.com', name: 'Chaitanya' }
                ],
                replyTo: { email, name: fullName },
                subject: `New Enquiry — ${fullName}`,
                htmlContent: getAdminEmailHtml(payload)
              }),
              // 2. Send client confirmation email
              sendBrevoEmail({
                apiKey: BREVO_API_KEY,
                sender: { name: 'eParivartan', email: 'smo@eparivartan.com' },
                to: [{ email, name: fullName }],
                subject: "We've received your enquiry — eParivartan",
                htmlContent: getClientEmailHtml(payload)
              }),
              // 3. Post lead to CRM
              pushToCrm(CRM_URL, payload)
            ]);

            if (!emailSuccess) {
              throw new Error('Email notification sending failed via direct API');
            }
          } else {
            const errMsg = (result && result.errors) ? result.errors.join(' ') : 'Server returned an invalid response. Please try again.';
            throw new Error(errMsg);
          }
        }

        // Reset form inputs
        contactForm.reset();
        hiddenInput.value = '';
        if (selectedDisplay) {
          selectedDisplay.textContent = 'Select service';
          selectedDisplay.classList.add('placeholder');
        }
        if (window.grecaptcha) window.grecaptcha.reset();

        displayFormStatus("Message sent! Thanks for reaching out — we'll be in touch shortly.", false);
        showToast();
      } catch (err) {
        console.error('Submission failed: ', err);
        displayFormStatus(err.message || 'Something went wrong. Please try again or reach us directly.', true);
      } finally {
        submitBtn.disabled = false;
        btnSpan.textContent = originalBtnText;
      }
    });

    async function sendBrevoEmail({ apiKey, sender, to, replyTo, subject, htmlContent }) {
      try {
        const body = { sender, to, subject, htmlContent };
        if (replyTo) body.replyTo = replyTo;

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': apiKey,
            'content-type': 'application/json',
            accept: 'application/json'
          },
          body: JSON.stringify(body)
        });
        return response.ok;
      } catch (e) {
        console.error('Brevo API error: ', e);
        return false;
      }
    }

    async function pushToCrm(url, data) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            accept: 'application/json'
          },
          body: JSON.stringify({
            full_name: data.fullName,
            phone_number: data.phone,
            email: data.email,
            website_url: data.website,
            source: 'eParivartan',
            message: data.message,
            status: 'New'
          })
        });
        return response.ok;
      } catch (e) {
        console.error('CRM posting error: ', e);
        return false;
      }
    }

    function getAdminEmailHtml(data) {
      return `
      <div style="background-color: #f8fafc; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);">
          <tr>
            <td style="padding: 40px 40px 24px 40px; text-align: center;">
              <img src="https://eparivartan.com/images/logo.svg" alt="eParivartan Logo" style="height: 38px; display: inline-block; vertical-align: middle;" />
              <div style="height: 1px; background-color: #f1f5f9; margin-top: 24px;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 24px 40px;">
              <span style="display: inline-block; background-color: #f0fdf4; color: #166534; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 6px 12px; border-radius: 20px; margin-bottom: 12px;">New Inquiry</span>
              <h2 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; line-height: 1.2;">Project Requirement Details</h2>
              <p style="color: #475569; font-size: 14px; margin: 8px 0 0 0; line-height: 1.5;">A new request has been submitted through the eParivartan contact form.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #f1f5f9; border-radius: 12px; overflow: hidden; background-color: #fafbfd;">
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9; width: 30%; vertical-align: top;">
                    <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: block;">Client Name</span>
                  </td>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9; vertical-align: top;">
                    <strong style="color: #0f172a; font-size: 15px; font-weight: 600;">${data.fullName}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9; vertical-align: top;">
                    <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: block;">Email</span>
                  </td>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9; vertical-align: top;">
                    <a href="mailto:${data.email}" style="color: #3b82f6; font-size: 15px; text-decoration: none; font-weight: 500;">${data.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9; vertical-align: top;">
                    <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: block;">Phone</span>
                  </td>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9; vertical-align: top;">
                    <span style="color: #0f172a; font-size: 15px; font-weight: 500;">${data.phone}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9; vertical-align: top;">
                    <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: block;">Website</span>
                  </td>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9; vertical-align: top;">
                    <span style="color: #0f172a; font-size: 15px;">${data.website ? `<a href="${data.website}" style="color: #3b82f6; text-decoration: none; font-weight: 500;">${data.website}</a>` : `<span style="color: #94a3b8; font-style: italic;">Not provided</span>`}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9; vertical-align: top;">
                    <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: block;">Service</span>
                  </td>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9; vertical-align: top;">
                    <span style="display: inline-block; background-color: #f1f5f9; color: #334155; font-size: 13px; font-weight: 600; padding: 4px 10px; border-radius: 6px;">${data.service}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; vertical-align: top;">
                    <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; display: block;">Message</span>
                  </td>
                  <td style="padding: 16px 20px; vertical-align: top;">
                    <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-line;">${data.message ? data.message : `<span style="color: #94a3b8; font-style: italic;">No message provided</span>`}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center;">
              <a href="mailto:${data.email}" style="display: inline-block; background-color: #85bd56; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: 600; letter-spacing: 0.5px; box-shadow: 0 4px 6px rgba(133, 189, 86, 0.15);">
                Reply to ${data.fullName}
              </a>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 40px; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.6;">
                This is an automated notification from <a href="https://eparivartan.com" style="color: #64748b; text-decoration: none; font-weight: 600;">eParivartan</a>.
              </p>
              <p style="margin: 4px 0 0 0; color: #cbd5e1; font-size: 11px;">
                Vasudha Avenue, Kavuri Hills, Hyderabad, India
              </p>
            </td>
          </tr>
        </table>
      </div>`;
    }

    function getClientEmailHtml(data) {
      return `
      <div style="background-color: #f8fafc; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);">
          <tr>
            <td style="padding: 40px 40px 24px 40px; text-align: center;">
              <img src="https://eparivartan.com/images/logo.svg" alt="eParivartan Logo" style="height: 38px; display: inline-block; vertical-align: middle;" />
              <div style="height: 1px; background-color: #f1f5f9; margin-top: 24px;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 24px 40px;">
              <span style="display: inline-block; background-color: #f0fdf4; color: #166534; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 6px 12px; border-radius: 20px; margin-bottom: 12px;">Enquiry Received</span>
              <h2 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; line-height: 1.2;">Thank you for reaching out! 🙏</h2>
              <p style="color: #475569; font-size: 15px; margin: 8px 0 0 0; line-height: 1.6;">
                Hello <strong>${data.fullName}</strong>,<br><br>
                We're glad you visited <a href="https://eparivartan.com" style="color: #85bd56; text-decoration: none; font-weight: 600;">eparivartan.com</a>. We have received your query regarding <strong>${data.service}</strong>, and a member of our team will review it and get in touch with you shortly.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-left: 4px solid #85bd56; border-radius: 0 8px 8px 0;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0; color: #2d6a2d; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">What Happens Next?</p>
                    <p style="margin: 6px 0 0 0; color: #475569; font-size: 14px; line-height: 1.6;">
                      Our consultants will analyze your project description and contact you within 24 business hours to discuss the next steps.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center;">
              <a href="https://eparivartan.com/government.html" style="display: inline-block; background-color: #85bd56; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: 600; letter-spacing: 0.5px; box-shadow: 0 4px 6px rgba(133, 189, 86, 0.15);">
                Explore Our Portfolio
              </a>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 40px; border-top: 1px solid #f1f5f9; text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="text-align: center; padding: 10px;">
                    <p style="margin: 0; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Direct Line</p>
                    <p style="margin: 4px 0 0 0; font-size: 14px; color: #1e293b; font-weight: 700;">+91 98491 65443</p>
                  </td>
                  <td width="50%" style="text-align: center; padding: 10px; border-left: 1px solid #e2e8f0;">
                    <p style="margin: 0; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Email Support</p>
                    <p style="margin: 4px 0 0 0; font-size: 14px; color: #85bd56; font-weight: 700;"><a href="mailto:feedback@eparivartan.com" style="color: #85bd56; text-decoration: none;">feedback@eparivartan.com</a></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #0f172a; padding: 20px 40px; text-align: center;">
              <p style="margin: 0; color: #94a3b8; font-size: 11px; line-height: 1.6;">
                © 2026 eParivartan. Vasudha Avenue, Road No 10, Kavuri Hills, Hyderabad - 500033
              </p>
            </td>
          </tr>
        </table>
      </div>`;
    }
  }
};

if (document.readyState !== 'loading') {
  initClientsApp();
} else {
  document.addEventListener('DOMContentLoaded', initClientsApp);
}
