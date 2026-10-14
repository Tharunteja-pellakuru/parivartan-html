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
     (Handled uniformly across all pages by js/index.js)
     ========================================== */

  /* ==========================================
     4. CONTACT FORM HANDLER & INTEGRATIONS
     (Handled uniformly across all pages by js/index.js)
     ========================================== */
};

if (document.readyState !== 'loading') {
  initClientsApp();
} else {
  document.addEventListener('DOMContentLoaded', initClientsApp);
}
