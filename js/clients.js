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

  /* ==========================================
     5. CLIENT LOGOS CATEGORY FILTERING & TABS
     ========================================== */
  const tabButtons = document.querySelectorAll('.websites-category-tab');
  const marqueeRows = document.querySelectorAll('.marquee-row');
  const emptyState = document.querySelector('.clients-empty-state');
  const emptyTitle = document.querySelector('.clients-empty-title');
  const emptyDesc = document.querySelector('.clients-empty-desc');
  const resetBtn = document.querySelector('.clients-empty-reset-btn');
  const mobileDropdownTrigger = document.querySelector('.websites-dropdown-trigger');
  const mobileDropdownOptions = document.querySelector('.websites-dropdown-options');
  const mobileDropdownLabel = document.querySelector('.websites-dropdown-selected-label');
  const mobileDropdownItems = document.querySelectorAll('.websites-dropdown-option');
  const categoryTabsContainer = document.querySelector('.websites-category-tabs');

  // Update dynamic --header-height for sticky category chips
  const updateHeaderHeight = () => {
    const header = document.querySelector('.header-container');
    if (header) {
      document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
    }
  };
  updateHeaderHeight();
  window.addEventListener('resize', updateHeaderHeight, { passive: true });
  window.addEventListener('scroll', updateHeaderHeight, { passive: true });
  window.addEventListener('load', updateHeaderHeight);

  const filterClients = (selectedCategory) => {
    // 1. Sync Desktop Tabs
    tabButtons.forEach(btn => {
      const isMatch = btn.getAttribute('data-category') === selectedCategory;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    // 2. Sync Mobile Dropdown
    if (mobileDropdownLabel) {
      mobileDropdownLabel.textContent = selectedCategory;
    }
    mobileDropdownItems.forEach(opt => {
      const isMatch = opt.getAttribute('data-category') === selectedCategory;
      opt.classList.toggle('active', isMatch);
    });

    // 3. Filter Marquee Rows (12 rows under "All", 3 multi-rows per category in category view)
    let visibleRowCount = 0;
    marqueeRows.forEach(row => {
      const rowCat = row.getAttribute('data-category');
      const isAllRow = row.getAttribute('data-all') === 'true';

      if (selectedCategory === 'All') {
        if (isAllRow) {
          row.style.display = 'flex';
          visibleRowCount++;
        } else {
          row.style.display = 'none';
        }
      } else {
        if (rowCat === selectedCategory && !isAllRow) {
          row.style.display = 'flex';
          visibleRowCount++;
        } else {
          row.style.display = 'none';
        }
      }
    });

    // 4. Handle Empty State for categories being curated
    if (emptyState) {
      if (visibleRowCount === 0) {
        emptyState.style.display = 'flex';
        if (emptyTitle) emptyTitle.textContent = `${selectedCategory} Clients`;
        if (emptyDesc) emptyDesc.textContent = `Client showcases for ${selectedCategory} are currently being curated. Explore our 500+ client partnerships under "All".`;
      } else {
        emptyState.style.display = 'none';
      }
    }

    // 5. Scroll active tab horizontally into view
    const activeBtn = Array.from(tabButtons).find(btn => btn.getAttribute('data-category') === selectedCategory);
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    // 6. GSAP gentle reveal animation for newly visible rows
    if (typeof gsap !== 'undefined' && visibleRowCount > 0) {
      const visibleRows = Array.from(marqueeRows).filter(r => r.style.display !== 'none');
      gsap.fromTo(visibleRows,
        { opacity: 0.2, y: 14 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out', overwrite: 'auto' }
      );
    }
  };

  // Bind tab click events
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category');
      filterClients(cat);
    });
  });

  // Mobile Dropdown Events
  if (mobileDropdownTrigger && mobileDropdownOptions) {
    mobileDropdownTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileDropdownOptions.classList.toggle('open');
      mobileDropdownTrigger.classList.toggle('active', isOpen);
      mobileDropdownTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mobileDropdownItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const cat = item.getAttribute('data-category');
        filterClients(cat);
        mobileDropdownOptions.classList.remove('open');
        mobileDropdownTrigger.classList.remove('active');
        mobileDropdownTrigger.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.websites-category-mobile-dropdown')) {
        mobileDropdownOptions.classList.remove('open');
        mobileDropdownTrigger.classList.remove('active');
        mobileDropdownTrigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Reset button in empty state
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      filterClients('All');
    });
  }

  // Enable mouse drag-to-scroll on horizontal tabs
  if (categoryTabsContainer) {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let hasDragged = false;

    categoryTabsContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      hasDragged = false;
      categoryTabsContainer.classList.add('is-dragging');
      startX = e.pageX - categoryTabsContainer.offsetLeft;
      scrollLeft = categoryTabsContainer.scrollLeft;
    });

    categoryTabsContainer.addEventListener('mouseleave', () => {
      isDown = false;
      categoryTabsContainer.classList.remove('is-dragging');
    });

    categoryTabsContainer.addEventListener('mouseup', () => {
      isDown = false;
      setTimeout(() => {
        categoryTabsContainer.classList.remove('is-dragging');
        hasDragged = false;
      }, 50);
    });

    categoryTabsContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const x = e.pageX - categoryTabsContainer.offsetLeft;
      const walk = (x - startX) * 1.5;
      if (Math.abs(walk) > 4) {
        hasDragged = true;
      }
      e.preventDefault();
      categoryTabsContainer.scrollLeft = scrollLeft - walk;
    });

    categoryTabsContainer.addEventListener('click', (e) => {
      if (hasDragged) {
        e.stopPropagation();
        e.preventDefault();
      }
    }, true);
  }
};

if (document.readyState !== 'loading') {
  initClientsApp();
} else {
  document.addEventListener('DOMContentLoaded', initClientsApp);
}
