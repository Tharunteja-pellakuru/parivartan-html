/* ==========================================================================
   Parivartan AI Chatbot Auto-Loader (Global Overlay)
   ========================================================================== */
(function loadParivartanChatbot() {
  try {
    if (window.ParivartanChatbotInitialized) return;
    if (!document.querySelector('script[src*="chatbot.js"]')) {
      const s = document.createElement('script');
      s.src = './js/chatbot.js';
      s.defer = true;
      (document.head || document.documentElement).appendChild(s);
    }
  } catch (e) {
    console.error('Chatbot loader error:', e);
  }
})();

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

const initIndexApp = () => {
  window.scrollTo(0, 0);
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
      // Reveal every section as it scrolls in (excluding heroes, services, cta, contact form, and footer to prevent slow pop-in)
      const revealTargets = gsap.utils.toArray('section, footer').filter(el => 
        !el.classList.contains('hero-section-container') && 
        !el.classList.contains('websites-hero-section') && 
        !el.classList.contains('cta-section') && 
        !el.classList.contains('contact-section') && 
        el.tagName.toLowerCase() !== 'footer' && 
        !el.classList.contains('services-section') && 
        el.id !== 'services' && 
        !el.querySelector('.services-row')
      );
      revealTargets.forEach(el => {
        // Slide-up + fade for remaining sections as they scroll into view.
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              once: true,
            }
          }
        );
      });

      // Keep CTA, contact form, and footer immediately visible without lag
      gsap.set('.cta-section, .contact-section, footer', { opacity: 1, autoAlpha: 1, y: 0, clearProps: 'transform' });


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
    };

    const closeMenu = () => {
      menuBtn.classList.remove('active');
      menuBackdrop.classList.remove('open');
      mobileDrawer.classList.remove('open');
      document.documentElement.classList.remove('menu-open');
      document.body.classList.remove('menu-open');
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
    window.openMobileDrawerWithGroup = (targetTitle) => {
      openMenu();
      if (targetTitle) {
        mobileDrawer.querySelectorAll('.drawer-menu-item-group').forEach(group => {
          const titleEl = group.querySelector('.drawer-menu-title');
          if (titleEl && titleEl.textContent.trim().toLowerCase().includes(targetTitle.toLowerCase())) {
            group.classList.add('expanded');
            const toggleBtn = group.querySelector('.dropdown-toggle-btn');
            if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
            setTimeout(() => {
              group.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 150);
          }
        });
      }
    };
  }

  /* ==========================================
     3. TECH ECOSYSTEM PARTICLES CONSTELLATION
     ========================================== */
  const ecoContainer = document.getElementById('techEcosystem');
  if (ecoContainer) {
    const canvas = ecoContainer.querySelector('.ecosystem-canvas');
    const hubNode = document.getElementById('node-center');

    const techNodesData = [
      // Large Nodes (4)
      { id: 'react', name: 'React', size: 'large', ring: 'inner', depth: 1.0, logo: './assets/home/tech/react.svg' },
      { id: 'nodejs', name: 'Node.js', size: 'large', ring: 'inner', depth: 1.0, logo: './assets/home/tech/nodejs.svg' },
      { id: 'python', name: 'Python', size: 'large', ring: 'inner', depth: 0.9, logo: './assets/home/tech/python.svg' },
      { id: 'wordpress', name: 'WordPress', size: 'large', ring: 'inner', depth: 0.9, logo: './assets/home/tech/wordpress.svg' },
      // Medium Nodes (8)
      { id: 'django', name: 'Django', size: 'medium', ring: 'inner', depth: 0.8, logo: './assets/home/tech/django.svg' },
      { id: 'mongodb', name: 'MongoDB', size: 'medium', ring: 'inner', depth: 0.8, logo: './assets/home/tech/mongodb.svg' },
      { id: 'mysql', name: 'MySQL', size: 'medium', ring: 'inner', depth: 0.7, logo: './assets/home/tech/mysql-wordmark-light.svg' },
      { id: 'shopify', name: 'Shopify', size: 'medium', ring: 'outer', depth: 0.8, logo: './assets/home/tech/shopify.svg' },
      { id: 'php', name: 'PHP', size: 'medium', ring: 'inner', depth: 0.8, logo: './assets/home/tech/php-mono.svg' },
      { id: 'postgresql', name: 'PostgreSQL', size: 'medium', ring: 'outer', depth: 0.8, logo: './assets/home/tech/postgresql.svg' },
      { id: 'flutter', name: 'Flutter', size: 'medium', ring: 'outer', depth: 0.8, logo: './assets/home/tech/flutter.svg' },
      { id: 'figma', name: 'Figma', size: 'medium', ring: 'inner', depth: 0.8, logo: './assets/home/tech/figma.svg' },
      // Small Nodes (17)
      { id: 'html', name: 'HTML5', size: 'small', ring: 'outer', depth: 0.6, logo: './assets/home/tech/html5.svg' },
      { id: 'css', name: 'CSS3', size: 'small', ring: 'outer', depth: 0.6, logo: './assets/home/tech/css.svg' },
      { id: 'javascript', name: 'JavaScript', size: 'small', ring: 'outer', depth: 0.5, logo: './assets/home/tech/javascript.svg' },
      { id: 'typescript', name: 'TypeScript', size: 'small', ring: 'outer', depth: 0.5, logo: './assets/home/tech/typescript.svg' },
      { id: 'express', name: 'Express', size: 'small', ring: 'outer', depth: 0.6, logo: './assets/home/tech/expressdotjs-light.svg' },
      { id: 'github', name: 'GitHub', size: 'small', ring: 'outer', depth: 0.5, logo: './assets/home/tech/github-light.svg' },
      { id: 'sqlite', name: 'SQLite', size: 'small', ring: 'outer', depth: 0.6, logo: './assets/home/tech/sqlite.svg' },
      { id: 'kotlin', name: 'Kotlin', size: 'small', ring: 'outer', depth: 0.5, logo: './assets/home/tech/kotlin.svg' },
      { id: 'tailwind', name: 'Tailwind CSS', size: 'small', ring: 'outer', depth: 0.6, logo: './assets/home/tech/tailwind-css.svg' },
      { id: 'xcode', name: 'Xcode', size: 'small', ring: 'outer', depth: 0.5, logo: './assets/home/tech/xcode.svg' },
      { id: 'bootstrap', name: 'Bootstrap', size: 'small', ring: 'outer', depth: 0.6, logo: './assets/home/tech/bootstrap.svg' },
      { id: 'vscode', name: 'VS Code', size: 'small', ring: 'outer', depth: 0.6, logo: './assets/home/tech/visual-studio-code.svg' },
      { id: 'xampp', name: 'XAMPP', size: 'small', ring: 'outer', depth: 0.6, logo: './assets/home/tech/xampp.svg' },
      { id: 'firebase', name: 'Firebase', size: 'small', ring: 'outer', depth: 0.6, logo: './assets/home/tech/firebase.svg' },
      { id: 'goland', name: 'GoLand', size: 'small', ring: 'outer', depth: 0.6, logo: './assets/home/tech/goland.svg' },
      { id: 'redux', name: 'Redux', size: 'small', ring: 'outer', depth: 0.5, logo: './assets/home/tech/redux.svg' },
      { id: 'woocommerce', name: 'WooCommerce', size: 'small', ring: 'outer', depth: 0.6, logo: './assets/home/tech/woocommerce.svg' }
    ];
const techConnectionsData = [
  // Center → major Tech Stacks
  { from: 'center', to: 'react' },
  { from: 'center', to: 'nodejs' },
  { from: 'center', to: 'python' },
  { from: 'center', to: 'wordpress' },
  { from: 'center', to: 'flutter' },
  { from: 'center', to: 'shopify' },

  // React ecosystem
  { from: 'react', to: 'javascript' },
  { from: 'react', to: 'typescript' },
  { from: 'react', to: 'css' },
  { from: 'react', to: 'html' },
  { from: 'react', to: 'tailwind' },
  { from: 'react', to: 'bootstrap' },
  { from: 'react', to: 'redux' },
  { from: 'react', to: 'firebase' },

  // Core web languages
  { from: 'javascript', to: 'html' },
  { from: 'javascript', to: 'css' },
  { from: 'javascript', to: 'typescript' },
  { from: 'css', to: 'html' },
  { from: 'css', to: 'tailwind' },
  { from: 'css', to: 'bootstrap' },

  // Node.js backend
  { from: 'nodejs', to: 'express' },
  { from: 'nodejs', to: 'javascript' },
  { from: 'nodejs', to: 'typescript' },
  { from: 'express', to: 'mongodb' },
  { from: 'express', to: 'mysql' },
  { from: 'express', to: 'postgresql' },

  // Python backend
  { from: 'python', to: 'django' },
  { from: 'django', to: 'postgresql' },
  { from: 'django', to: 'mysql' },
  { from: 'django', to: 'sqlite' },
  { from: 'django', to: 'firebase' },

  // WordPress / PHP / WooCommerce
  { from: 'wordpress', to: 'php' },
  { from: 'wordpress', to: 'mysql' },
  { from: 'wordpress', to: 'woocommerce' },
  { from: 'php', to: 'mysql' },
  { from: 'php', to: 'xampp' },
  { from: 'mysql', to: 'xampp' },
  { from: 'woocommerce', to: 'mysql' },

  // Shopify (own ecosystem — Liquid-based, not sharing WP's Tech Stack)
  { from: 'shopify', to: 'javascript' },
  { from: 'shopify', to: 'css' },

  // Mobile (Flutter)
  { from: 'flutter', to: 'firebase' },
  { from: 'flutter', to: 'xcode' },
  { from: 'flutter', to: 'kotlin' },

  // Design → code handoff
  { from: 'figma', to: 'react' },
  { from: 'figma', to: 'html' },
  { from: 'figma', to: 'css' },

  // Tooling (editor/version control support these languages)
  { from: 'github', to: 'react' },
  { from: 'github', to: 'nodejs' },
  { from: 'github', to: 'python' },
  { from: 'github', to: 'flutter' },
  { from: 'github', to: 'wordpress' },
  { from: 'vscode', to: 'javascript' },
  { from: 'vscode', to: 'typescript' },
  { from: 'vscode', to: 'python' },
  { from: 'vscode', to: 'php' },
];

    const innerNodes = techNodesData.filter(n => n.ring === 'inner');
    const outerNodes = techNodesData.filter(n => n.ring === 'outer');

    // State elements
    let hoveredId = null;
    const mouseParallax = { targetX: 0, targetY: 0, currentX: 0, currentY: 0 };

    // Set parallax triggers
    ecoContainer.addEventListener('mousemove', (e) => {
      const rect = ecoContainer.getBoundingClientRect();
      mouseParallax.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseParallax.targetY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    });

    ecoContainer.addEventListener('mouseleave', () => {
      mouseParallax.targetX = 0;
      mouseParallax.targetY = 0;
      hoveredId = null;
      updateHighlights();
    });

    // Node state parameters for floating
    const nodeParams = techNodesData.map(node => ({
      id: node.id,
      depth: node.depth,
      floatOffset: Math.random() * 100,
      floatSpeed: 0.4 + Math.random() * 0.4,
    }));

    // Setup visual DOM links & SVGs
    const nodeElements = {};
    nodeElements['center'] = hubNode;

    // Render node icons in DOM dynamically
    techNodesData.forEach(node => {
      const div = document.createElement('div');
      div.className = `eco-node size-${node.size}`;
      div.id = `node-${node.id}`;
      div.title = node.name;
      div.style.position = 'absolute';
      div.style.transform = 'translate(-50%, -50%)';

      const img = document.createElement('img');
      img.src = node.logo;
      img.alt = node.name;
      img.draggable = false;
      div.appendChild(img);

      div.addEventListener('mouseenter', () => {
        hoveredId = node.id;
        updateHighlights();
      });
      div.addEventListener('mouseleave', () => {
        hoveredId = null;
        updateHighlights();
      });

      ecoContainer.appendChild(div);
      nodeElements[node.id] = div;
    });

    // Render SVG connection lines
    const lineElements = [];
    techConnectionsData.forEach((conn, idx) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('class', 'connection-line');
      canvas.appendChild(line);
      lineElements.push(line);
    });

    // Add a single special dynamic hover line that connects node to center
    const hoverCenterLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    hoverCenterLine.setAttribute('class', 'connection-line hover-center-line');
    hoverCenterLine.style.display = 'none';
    canvas.appendChild(hoverCenterLine);

    // Render SVG particle flows (8 pieces)
    const particles = [];
    const particleElements = [];
    for (let i = 0; i < 8; i++) {
      const pCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pCircle.setAttribute('class', 'eco-particle');
      pCircle.setAttribute('r', '2');
      canvas.appendChild(pCircle);
      particleElements.push(pCircle);

      particles.push({
        lineIndex: Math.floor(Math.random() * techConnectionsData.length),
        progress: Math.random(),
        speed: 0.006 + Math.random() * 0.006,
        direction: Math.random() > 0.5 ? 1 : -1
      });
    }

    const updateHighlights = () => {
      if (!hoveredId || hoveredId === 'center') {
        // Reset styles when no node is hovered
        techNodesData.forEach(node => {
          nodeElements[node.id].className = `eco-node size-${node.size}`;
        });
        hubNode.className = 'eco-node node-center';
        lineElements.forEach(line => {
          line.setAttribute('class', 'connection-line');
        });
        hoverCenterLine.style.display = 'none';
        return;
      }

      // Highlight active node + connections
      hubNode.className = 'eco-node node-center highlighted';

      techNodesData.forEach(node => {
        const el = nodeElements[node.id];
        if (node.id === hoveredId) {
          el.className = `eco-node size-${node.size} highlighted`;
        } else {
          const isConnected = techConnectionsData.some(c =>
            (c.from === node.id && c.to === hoveredId) || (c.to === node.id && c.from === hoveredId)
          );
          el.className = isConnected
            ? `eco-node size-${node.size} highlighted`
            : `eco-node size-${node.size} dimmed`;
        }
      });

      // Highlight matching lines
      techConnectionsData.forEach((conn, index) => {
        const line = lineElements[index];
        const isHighlighted = (conn.from === hoveredId || conn.to === hoveredId);
        if (isHighlighted) {
          line.setAttribute('class', 'connection-line highlighted');
        } else {
          line.setAttribute('class', 'connection-line dimmed');
        }
      });
    };

    // Parallax update tick loop
    const tick = (timestamp) => {
      const containerWidth = ecoContainer.clientWidth;
      const containerHeight = ecoContainer.clientHeight;
      if (containerWidth === 0 || containerHeight === 0) {
        requestAnimationFrame(tick);
        return;
      }
      const centerX = containerWidth / 2;
      const centerY = containerHeight / 2;
      const time = timestamp * 0.001;

      // Mouse parallax smooth scroll
      mouseParallax.currentX += (mouseParallax.targetX - mouseParallax.currentX) * 0.08;
      mouseParallax.currentY += (mouseParallax.targetY - mouseParallax.currentY) * 0.08;

      const pxX = mouseParallax.currentX;
      const pxY = mouseParallax.currentY;

      // Ring radii scaling
      const isSmallScreen = window.innerWidth < 640;
      const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;

      // Calculate the maximum safe radius based on container size and icon margins
      const nodeMargin = isSmallScreen ? 24 : isTablet ? 30 : 36;
      const maxOuterRadius = Math.min(containerWidth, containerHeight) / 2 - nodeMargin;
      
      // Force outerRadius to exactly maxOuterRadius so it occupies the full safe space
      let outerRadius = maxOuterRadius;
      
      // Inner radius ratio creating clean, well-proportioned gap between center node and outer ring
      let innerRadius = maxOuterRadius * 0.54; 

      if (isSmallScreen) {
        innerRadius = maxOuterRadius * 0.50;
      } else if (isTablet) {
        innerRadius = maxOuterRadius * 0.52;
      }

      const innerRotation = time * 0.03;
      const outerRotation = time * -0.015;

      const computedPositions = {};
      computedPositions['center'] = { x: centerX, y: centerY };

      // Set Center Node position
      if (hubNode) {
        hubNode.style.left = `${centerX}px`;
        hubNode.style.top = `${centerY}px`;
      }

      // Position Inner Ring Nodes
      const innerCount = innerNodes.length;
      innerNodes.forEach((node, idx) => {
        const baseAngle = -Math.PI / 2 + (idx / innerCount) * Math.PI * 2;
        const angle = baseAngle + innerRotation;

        const params = nodeParams.find(p => p.id === node.id);
        const floatScale = isSmallScreen ? 2.5 : 6;
        const floatX = Math.sin(time * params.floatSpeed + params.floatOffset) * floatScale;
        const floatY = Math.cos(time * params.floatSpeed * 0.8 + params.floatOffset) * floatScale;

        const parallaxScale = isSmallScreen ? 5 : 12;
        const depthPxX = pxX * node.depth * parallaxScale;
        const depthPxY = pxY * node.depth * parallaxScale;

        const x = centerX + Math.cos(angle) * innerRadius + floatX + depthPxX;
        const y = centerY + Math.sin(angle) * innerRadius + floatY + depthPxY;

        computedPositions[node.id] = { x, y };

        const el = nodeElements[node.id];
        if (el) {
          el.style.left = `${x}px`;
          el.style.top = `${y}px`;
        }
      });

      // Position Outer Ring Nodes
      const outerCount = outerNodes.length;
      outerNodes.forEach((node, idx) => {
        const baseAngle = -Math.PI / 2 + (idx / outerCount) * Math.PI * 2;
        const angle = baseAngle + outerRotation;

        const params = nodeParams.find(p => p.id === node.id);
        const floatScale = isSmallScreen ? 2 : 5;
        const floatX = Math.sin(time * params.floatSpeed + params.floatOffset) * floatScale;
        const floatY = Math.cos(time * params.floatSpeed * 0.8 + params.floatOffset) * floatScale;

        const parallaxScale = isSmallScreen ? 6 : 18;
        const depthPxX = pxX * node.depth * parallaxScale;
        const depthPxY = pxY * node.depth * parallaxScale;

        const x = centerX + Math.cos(angle) * outerRadius + floatX + depthPxX;
        const y = centerY + Math.sin(angle) * outerRadius + floatY + depthPxY;

        computedPositions[node.id] = { x, y };

        const el = nodeElements[node.id];
        if (el) {
          el.style.left = `${x}px`;
          el.style.top = `${y}px`;
        }
      });

      // Update Connection Line coordinates in SVG
      techConnectionsData.forEach((conn, index) => {
        const fromPos = computedPositions[conn.from];
        const toPos = computedPositions[conn.to];
        const el = lineElements[index];

        if (fromPos && toPos && el) {
          el.setAttribute('x1', fromPos.x);
          el.setAttribute('y1', fromPos.y);
          el.setAttribute('x2', toPos.x);
          el.setAttribute('y2', toPos.y);
        }
      });

      // Hover hub connector line update
      if (hoveredId && hoveredId !== 'center') {
        const hoveredPos = computedPositions[hoveredId];
        const centerPos = computedPositions['center'];
        if (hoveredPos && centerPos) {
          hoverCenterLine.style.display = 'block';
          hoverCenterLine.setAttribute('x1', hoveredPos.x);
          hoverCenterLine.setAttribute('y1', hoveredPos.y);
          hoverCenterLine.setAttribute('x2', centerPos.x);
          hoverCenterLine.setAttribute('y2', centerPos.y);
        }
      } else {
        hoverCenterLine.style.display = 'none';
      }

      // Animate flowing data particles
      particles.forEach((p, index) => {
        const line = techConnectionsData[p.lineIndex];
        const fromPos = computedPositions[line.from];
        const toPos = computedPositions[line.to];
        const el = particleElements[index];

        if (fromPos && toPos && el) {
          p.progress += p.speed;
          if (p.progress >= 1.0) {
            p.progress = 0;
            p.lineIndex = Math.floor(Math.random() * techConnectionsData.length);
          }

          const startX = p.direction === 1 ? fromPos.x : toPos.x;
          const startY = p.direction === 1 ? fromPos.y : toPos.y;
          const endX = p.direction === 1 ? toPos.x : fromPos.x;
          const endY = p.direction === 1 ? toPos.y : fromPos.y;

          const px = startX + p.progress * (endX - startX);
          const py = startY + p.progress * (endY - startY);

          el.setAttribute('cx', px);
          el.setAttribute('cy', py);
        }
      });

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  /* ==========================================
     4. SERVICES FOLDER CARDS ANIMATION
     ========================================== */
  const servicesSec = document.getElementById('services');
  if (servicesSec) {
    const folderCards = servicesSec.querySelectorAll('.folder-card');
    if (folderCards.length > 0 && typeof gsap !== 'undefined') {
      gsap.from(folderCards, {
        scrollTrigger: {
          trigger: '.services-folders-grid',
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        duration: 0.85,
        y: 30,
        opacity: 0,
        stagger: 0.08,
        ease: 'power3.out'
      });
    }

    const cards = Array.from(servicesSec.querySelectorAll('.services-row'));
    if (cards.length > 0) {
      const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      let lastActiveIndex = null;
      let stickyTops = [];

      const updateStickyTops = () => {
        const isMobile = window.innerWidth <= 960;
        stickyTops = cards.map((card) => {
          const computedTop = parseFloat(window.getComputedStyle(card).top);
          return !isNaN(computedTop) ? computedTop : (isMobile ? 60 : 100);
        });
      };

      updateStickyTops();
      window.addEventListener('resize', updateStickyTops);

      const animateCards = () => {
        const isMobile = window.innerWidth <= 960;
        if (isMobile) {
          cards.forEach((card) => {
            if (card.style.transform !== '') card.style.transform = '';
            if (card.style.filter !== '') card.style.filter = '';
            if (card.style.backgroundColor !== '') card.style.backgroundColor = '';
            card.classList.remove('is-active');
          });
          requestAnimationFrame(animateCards);
          return;
        }

        let currentActiveIndex = 0;
        cards.forEach((card, index) => {
          const rect = card.getBoundingClientRect();
          const stickyTop = stickyTops[index] || 100;
          if (rect.top <= stickyTop + 200) {
            currentActiveIndex = index;
          }
        });

        cards.forEach((card, index) => {
          const rect = card.getBoundingClientRect();
          const stickyTop = stickyTops[index] || 100;

          if (index === currentActiveIndex) {
            card.classList.add('is-active');
            card.classList.add('is-passed');
          } else if (index < currentActiveIndex) {
            card.classList.remove('is-active');
            card.classList.add('is-passed');
          } else {
            card.classList.remove('is-active');
            card.classList.remove('is-passed');
          }

          if (rect.top <= stickyTop + 10) {
            let progress = 0;
            if (index < cards.length - 1) {
              const nextCard = cards[index + 1];
              const nextRect = nextCard.getBoundingClientRect();
              const overlap = stickyTop + rect.height - nextRect.top;
              progress = Math.max(0, Math.min(overlap / rect.height, 1));
            }
            const scale = 1 - (progress * 0.06);
            card.style.transform = `scale(${scale})`;
            card.style.backgroundColor = '#FFF';
          } else {
            card.style.transform = 'scale(1)';
            card.style.backgroundColor = '#FFF';
          }
        });

        if (currentActiveIndex !== lastActiveIndex) {
          cards.forEach((card, index) => {
            const video = card.querySelector('video');
            if (!video) return;
            if (index === currentActiveIndex) {
              video.play().catch(() => {});
            } else {
              video.pause();
            }
          });
          lastActiveIndex = currentActiveIndex;
        }

        requestAnimationFrame(animateCards);
      };

      requestAnimationFrame(animateCards);

      if (canHover) {
        cards.forEach(card => {
          const video = card.querySelector('video');
          if (video) {
            card.addEventListener('mouseenter', () => {
              video.play().catch(() => {});
            });
            card.addEventListener('mouseleave', () => {
              if (!card.classList.contains('is-active')) {
                video.pause();
              }
            });
          }
        });
      }
    }
  }

  /* ==========================================
     5. FEATURED PROJECTS CAROUSEL & MODAL
     ========================================== */
  const featuredSec = document.getElementById('portfolio');
  const previewOverlay = document.querySelector('.live-preview-overlay');
  
  const projectsData = [
    {
      id: 'estic',
      title: 'ESTIC DST',
      description: 'A unified national scientific database and portal that aggregates, catalogs, and indexes research publications, patents, and S&T metrics across Indian institutions.',
      solutionTitle: 'The Solution',
      solutionText: 'Built a high-performance portal linking major national research databases, integrating Elasticsearch query nodes, and implementing automated PDF cataloging.',
      stats: [
        { num: '+120%', lbl: 'Publications', icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>' },
        { num: '+85%', lbl: 'Query Speed', icon: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>' },
        { num: '35+', lbl: 'Institutions', icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>' }
      ],
      techPills: [
        { name: 'HTML5', stroke: '#E44D26', svg: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>' },
        { name: 'PHP', stroke: '#777BB4', svg: '<ellipse cx="12" cy="12" rx="10" ry="6"/>' },
        { name: 'MySQL', stroke: '#00758F', svg: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>' },
        { name: 'Elasticsearch', stroke: '#005571', svg: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>' }
      ],
      liveUrl: 'https://estic2026.in/',
      displayUrl: 'estic2026.in',
      screenshot: './assets/our-work/websites/estic-screenshot.webp',
      useIframe: false
    },
    {
      id: 'panfish',
      title: 'PANFISH',
      description: 'A B2B enterprise site for PANFISH, part of UNIORG (an SAP Gold Partner since 1974), presenting SAP S/4HANA Cloud, BTP, and Business One consulting services.',
      solutionTitle: 'The Solution',
      solutionText: 'Designed a scalable enterprise web portal showcasing ChronoScope, UDINA, and UBOTT product suites with structured SAP consulting service workflows.',
      stats: [
        { num: '+150%', lbl: 'Lead Volume', icon: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>' },
        { num: '+95%', lbl: 'Uptime', icon: '<polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 12 12 17 22 12"></polyline>' },
        { num: '50+', lbl: 'SAP Clients', icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>' }
      ],
      techPills: [
        { name: 'React', stroke: '#61DAFB', svg: '<circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="4"/>' },
        { name: 'Next.js', stroke: '#000000', svg: '<circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M15 15V9"/>' },
        { name: 'Tailwind CSS', stroke: '#38BDF8', svg: '<path d="M12 4.5C7 4.5 3.5 7.5 3.5 10.5c0 4 5.5 4.5 5.5 7 0 1.5-1.5 2.5-3.5 2.5"/>' },
        { name: 'Node.js', stroke: '#339933', svg: '<path d="M12 2L2 7v10l10 5 10-5V7L12 2z"/>' }
      ],
      liveUrl: 'https://panfish.tech/',
      displayUrl: 'panfish.tech/',
      screenshot: 'https://s.wordpress.com/mshots/v1/https%3A%2F%2Fpanfish.tech%2F?w=1200&h=800',
      useIframe: true
    },
    {
      id: 'cacm2026',
      title: 'CACM-2026',
      description: 'An event microsite for the Conference on Advanced Carbon Materials, hosted by The Indian Carbon Society — Hyderabad Chapter.',
      solutionTitle: 'The Solution',
      solutionText: 'Built a high-speed event portal featuring automated abstract submission, speaker timelines, ticketing workflows, and sponsor showcases.',
      stats: [
        { num: '500+', lbl: 'Delegates', icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle>' },
        { num: '100+', lbl: 'Papers', icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>' },
        { num: '20+', lbl: 'Sponsors', icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>' }
      ],
      techPills: [
        { name: 'HTML5', stroke: '#E44D26', svg: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>' },
        { name: 'CSS3', stroke: '#1572B6', svg: '<path d="M12 2L2 7l10 5 10-5-10-5z"/>' },
        { name: 'JavaScript', stroke: '#F7DF1E', svg: '<rect x="3" y="3" width="18" height="18" rx="2"/>' },
        { name: 'PHP', stroke: '#777BB4', svg: '<ellipse cx="12" cy="12" rx="10" ry="6"/>' }
      ],
      liveUrl: 'https://www.cacm2026.com/',
      displayUrl: 'cacm2026.com/',
      screenshot: 'https://s.wordpress.com/mshots/v1/https%3A%2F%2Fwww.cacm2026.com%2F?w=1200&h=800',
      useIframe: true
    },
    {
      id: 'summergreen',
      title: 'Summer Green Resorts',
      description: 'A premium resort in Hyderabad offering luxury accommodation, banquets, adventure activities, corporate events, weddings, and family getaways.',
      solutionTitle: 'The Solution',
      solutionText: 'Engineered a modern, visually immersive hospitality portal with direct booking capabilities, interactive resort showcase, and event inquiry workflows.',
      stats: [
        { num: '50+', lbl: 'Luxury Rooms', icon: '<polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>' },
        { num: '1000+', lbl: 'Events Hosted', icon: '<circle cx="12" cy="12" r="10"></circle>' },
        { num: '4.5★', lbl: 'Guest Rating', icon: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>' }
      ],
      techPills: [
        { name: 'HTML5', stroke: '#E44D26', svg: '<circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="4"/>' },
        { name: 'CSS3/Responsive', stroke: '#264DE4', svg: '<path d="M12 4.5C7 4.5 3.5 7.5 3.5 10.5c0 4 5.5 4.5 5.5 7 0 1.5-1.5 2.5-3.5 2.5"/>' },
        { name: 'JavaScript', stroke: '#F7DF1E', svg: '<polygon points="12 2 2 7 12 12 22 7 12 2"/>' }
      ],
      liveUrl: 'https://www.summergreenresort.com/',
      displayUrl: 'summergreenresort.com/',
      screenshot: './assets/home/featured/summer-green.webp',
      useIframe: false
    },
    {
      id: 'sherwood',
      title: 'Sherwood Public School',
      description: 'The official site for Sherwood Public School, an ICSE/ISC institution serving Nursery through Class XII since 1984.',
      solutionTitle: 'The Solution',
      solutionText: 'Developed a streamlined admissions portal and digital campus showcase enabling seamless enquiry workflows and interactive parent communications.',
      stats: [
        { num: '1000+', lbl: 'Students', icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle>' },
        { num: '40+', lbl: 'Years Legacy', icon: '<circle cx="12" cy="12" r="10"></circle>' },
        { num: '100%', lbl: 'Pass Rate', icon: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>' }
      ],
      techPills: [
        { name: 'HTML5', stroke: '#E44D26', svg: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>' },
        { name: 'PHP', stroke: '#777BB4', svg: '<ellipse cx="12" cy="12" rx="10" ry="6"/>' },
        { name: 'MySQL', stroke: '#00758F', svg: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>' }
      ],
      liveUrl: 'https://sherwoodpublicschool.edu.in/',
      displayUrl: 'sherwoodpublicschool.edu.in/',
      screenshot: 'https://s.wordpress.com/mshots/v1/https%3A%2F%2Fsherwoodpublicschool.edu.in%2F?w=1200&h=800',
      useIframe: true
    },
    {
      id: 'accel1',
      title: 'Accel1',
      description: 'A climate-tech marketing site for Accel1, presenting an integrated suite of AI-driven sustainability platforms.',
      solutionTitle: 'The Solution',
      solutionText: 'Architected a modern ESG data hub showcasing HydroTRACE, BioFORGE, and AccelTRACK with interactive real-time early warning telemetry previews.',
      stats: [
        { num: '10M+', lbl: 'Data Nodes', icon: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>' },
        { num: '99.9%', lbl: 'Accuracy', icon: '<polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>' },
        { num: '15+', lbl: 'Platforms', icon: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>' }
      ],
      techPills: [
        { name: 'React', stroke: '#61DAFB', svg: '<circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="4"/>' },
        { name: 'Next.js', stroke: '#000000', svg: '<circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M15 15V9"/>' },
        { name: 'Tailwind CSS', stroke: '#38BDF8', svg: '<path d="M12 4.5C7 4.5 3.5 7.5 3.5 10.5c0 4 5.5 4.5 5.5 7 0 1.5-1.5 2.5-3.5 2.5"/>' }
      ],
      liveUrl: 'https://www.accel1.com/',
      displayUrl: 'accel1.com/',
      screenshot: 'https://s.wordpress.com/mshots/v1/https%3A%2F%2Fwww.accel1.com%2F?w=1200&h=800',
      useIframe: true
    }
  ];

  // The old showcase markup (dots + prev/next nav) was replaced by the cards
  // carousel further down, so these are normally absent. They must still be
  // declared -- referencing them undeclared throws and kills the rest of this
  // handler.
  const dotsContainer = featuredSec ? featuredSec.querySelector('.featured-carousel-dots') : null;
  const prevBtn = featuredSec ? featuredSec.querySelector('.featured-nav-btn.prev') : null;
  const nextBtn = featuredSec ? featuredSec.querySelector('.featured-nav-btn.next') : null;

  if (featuredSec && dotsContainer && prevBtn && nextBtn) {
    let activeIndex = 0;

    const projectTitleEl = featuredSec.querySelector('.showcase-project-title');
    const projectDescEl = featuredSec.querySelector('.showcase-project-description');
    const solutionHeadingEl = featuredSec.querySelector('.solution-card-heading');
    const solutionTextEl = featuredSec.querySelector('.solution-card-text');
    const statsGridEl = featuredSec.querySelector('.showcase-stats-grid');
    const techContainerEl = featuredSec.querySelector('.tech-pill-container');
    const addressBarTextEl = featuredSec.querySelector('.showcase-address-url');
    const scrollContainerEl = featuredSec.querySelector('.showcase-browser-content');
    const viewLiveBtn = featuredSec.querySelector('.btn-live-experience-green');

    const updateProjectDisplay = () => {
      const activeProj = projectsData[activeIndex];

      // Update text fields
      if (projectTitleEl) projectTitleEl.textContent = activeProj.title;
      if (projectDescEl) projectDescEl.textContent = activeProj.description;
      if (solutionHeadingEl) solutionHeadingEl.textContent = activeProj.solutionTitle || 'The Solution';
      if (solutionTextEl) solutionTextEl.textContent = activeProj.solutionText;

      // Update Stats Grid
      if (statsGridEl && activeProj.stats) {
        statsGridEl.innerHTML = activeProj.stats.map(s => `
          <div class="showcase-stat-card">
            <div class="stat-badge-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#599632" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                ${s.icon}
              </svg>
            </div>
            <div class="stat-data">
              <span class="stat-num">${s.num}</span>
              <span class="stat-lbl">${s.lbl}</span>
            </div>
          </div>
        `).join('');
      }

      // Update Tech Pills
      if (techContainerEl && activeProj.techPills) {
        techContainerEl.innerHTML = activeProj.techPills.map(t => `
          <div class="tech-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="${t.stroke || '#85BD56'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              ${t.svg}
            </svg>
            <span>${t.name}</span>
          </div>
        `).join('');
      }

      // Update Address Bar & Live CTA Button
      if (addressBarTextEl) addressBarTextEl.textContent = activeProj.displayUrl;
      if (viewLiveBtn) {
        viewLiveBtn.setAttribute('href', activeProj.liveUrl);
        viewLiveBtn.setAttribute('data-id', activeProj.id);
        viewLiveBtn.setAttribute('data-url', activeProj.liveUrl);
        viewLiveBtn.setAttribute('data-domain', activeProj.displayUrl);
      }

      // Update Screenshot / Mock Content
      if (scrollContainerEl) {
        scrollContainerEl.innerHTML = '';
        if (activeProj.useIframe) {
          const iframe = document.createElement('iframe');
          iframe.src = activeProj.liveUrl;
          iframe.title = activeProj.title;
          iframe.className = 'browser-scroll-iframe';
          scrollContainerEl.appendChild(iframe);
        } else {
          const img = document.createElement('img');
          img.src = activeProj.screenshot;
          img.alt = activeProj.title;
          img.className = 'browser-scroll-image';
          scrollContainerEl.appendChild(img);
        }
      }

      // Update Carousel Dots
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.featured-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === activeIndex);
        });
      }
    };

    // Render Dot Navigation Elements
    dotsContainer.innerHTML = '';
    projectsData.forEach((proj, idx) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'featured-dot';
      button.setAttribute('aria-label', `View ${proj.title}`);
      button.addEventListener('click', () => {
        activeIndex = idx;
        updateProjectDisplay();
      });
      dotsContainer.appendChild(button);
    });

    prevBtn.addEventListener('click', () => {
      activeIndex = (activeIndex - 1 + projectsData.length) % projectsData.length;
      updateProjectDisplay();
    });

    nextBtn.addEventListener('click', () => {
      activeIndex = (activeIndex + 1) % projectsData.length;
      updateProjectDisplay();
    });

    // Init Display state
    updateProjectDisplay();

    // Trigger full experience iframe dialog overlay
    if (viewLiveBtn && previewOverlay) {
      const overlayUrlText = previewOverlay.querySelector('.live-preview-url');
      const openExternalBtn = previewOverlay.querySelector('.live-preview-open-btn');
      const closeBtn = previewOverlay.querySelector('.traffic-red');
      const previewBody = previewOverlay.querySelector('.live-preview-body');

      const openOverlay = () => {
        const activeProj = projectsData[activeIndex];
        overlayUrlText.textContent = activeProj.displayUrl;
        openExternalBtn.href = activeProj.liveUrl;
        
        previewBody.innerHTML = '';
        if (activeProj.useIframe) {
          const iframe = document.createElement('iframe');
          iframe.src = activeProj.liveUrl;
          iframe.title = `${activeProj.title} preview`;
          iframe.className = 'live-preview-iframe';
          previewBody.appendChild(iframe);
        } else {
          const img = document.createElement('img');
          img.src = activeProj.screenshot;
          img.alt = `${activeProj.title} preview`;
          img.className = 'live-preview-screenshot';
          previewBody.appendChild(img);
        }

        previewOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      };

      const closeOverlay = () => {
        previewOverlay.style.display = 'none';
        previewBody.innerHTML = '';
        document.body.style.overflow = '';
      };

      if (viewLiveBtn) {
        viewLiveBtn.addEventListener('click', (e) => {
          e.preventDefault();
          openOverlay();
        });
      }

      const darkFrame = featuredSec.querySelector('.showcase-dark-frame');
      if (darkFrame) {
        darkFrame.addEventListener('click', openOverlay);
      }

      if (closeBtn) closeBtn.addEventListener('click', closeOverlay);
      if (previewOverlay) previewOverlay.addEventListener('click', closeOverlay);

      const previewWindow = previewOverlay.querySelector('.live-preview-window');
      if (previewWindow) {
        previewWindow.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && previewOverlay.style.display === 'flex') {
          closeOverlay();
        }
      });
    }
  }

  /* ==========================================
     6. TESTIMONIALS YOUTUBE OVERLAY PLAYBACK
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

    // Helper functions for inline video playback directly inside the video card
    const closeInlineVideo = (card) => {
      if (!card) return;
      const container = card.querySelector('.inline-video-container');
      if (container) {
        container.remove();
      }
      card.classList.remove('is-playing-video');
      const overlay = card.querySelector('.video-card-overlay');
      if (overlay) {
        overlay.style.display = '';
      }
    };

    const closeAllInlineVideos = (exceptCard = null) => {
      testimonialsSec.querySelectorAll('.video-card.is-playing-video, .video-card .inline-video-container').forEach(el => {
        const card = el.classList.contains('video-card') ? el : el.closest('.video-card');
        if (card && card !== exceptCard) {
          closeInlineVideo(card);
        }
      });
    };

    // Infinite Step-based Carousel Navigation (3 cards at a step on desktop)
    const setupStepCarousel = (wrapper, row, prevBtn, nextBtn, cardSelector, onCardInit) => {
      if (!wrapper || !row || !prevBtn || !nextBtn) return () => {};

      const TRANSITION_STYLE = 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)';
      let numOriginal = 0;
      let currentIndex = 0;
      let isAnimating = false;
      let autoScrollTimer = null;
      let isPaused = false;

      const getCardsPerView = () => {
        if (window.innerWidth <= 768) return 1;
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
          delete clone.dataset.writtenEventsAttached;
          clone.classList.remove('is-playing-video');
          const existingContainer = clone.querySelector('.inline-video-container');
          if (existingContainer) existingContainer.remove();
          const overlay = clone.querySelector('.video-card-overlay');
          if (overlay) overlay.style.display = '';
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
          delete clone.dataset.writtenEventsAttached;
          clone.classList.remove('is-playing-video');
          const existingContainer = clone.querySelector('.inline-video-container');
          if (existingContainer) existingContainer.remove();
          const overlay = clone.querySelector('.video-card-overlay');
          if (overlay) overlay.style.display = '';
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
        const cardWidth = firstCard.getBoundingClientRect().width || 310;
        const gap = parseFloat(window.getComputedStyle(row).gap) || 22;
        const offset = Math.round(currentIndex * (cardWidth + gap));

        row.style.transition = animate ? TRANSITION_STYLE : 'none';
        row.style.transform = `translate3d(-${offset}px, 0, 0)`;

        // Stop any playing video if moving away from visible cards
        const cpv = getCardsPerView();
        const playingVideos = row.querySelectorAll('video.inline-video-player, iframe.inline-video-iframe, .inline-video-container');
        playingVideos.forEach(media => {
          const parent = media.closest(cardSelector);
          if (parent) {
            const cardIdx = allCards.indexOf(parent);
            if (cardIdx < currentIndex || cardIdx >= currentIndex + cpv) {
              closeInlineVideo(parent);
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
          void row.offsetHeight; // force reflow
        } else if (currentIndex < numOriginal) {
          row.style.transition = 'none';
          currentIndex += numOriginal;
          updatePosition(false);
          void row.offsetHeight; // force reflow
        }
      };

      row.addEventListener('transitionend', (e) => {
        if (e.target !== row || e.propertyName !== 'transform') return;
        row.classList.remove('is-sliding');
        checkBoundary();
        isAnimating = false;
      });

      const getStep = () => {
        return getCardsPerView();
      };

      const moveNext = () => {
        if (isAnimating || numOriginal <= 0) return;
        isAnimating = true;
        row.classList.add('is-sliding');
        currentIndex += getStep();
        updatePosition(true);

        setTimeout(() => {
          if (isAnimating) {
            row.classList.remove('is-sliding');
            checkBoundary();
            isAnimating = false;
          }
        }, 700);
      };

      const movePrev = () => {
        if (isAnimating || numOriginal <= 0) return;
        isAnimating = true;
        row.classList.add('is-sliding');
        currentIndex -= getStep();
        updatePosition(true);

        setTimeout(() => {
          if (isAnimating) {
            row.classList.remove('is-sliding');
            checkBoundary();
            isAnimating = false;
          }
        }, 700);
      };

      // Smooth auto-scroll every 5.0 seconds
      const startAutoScroll = () => {
        stopAutoScroll();
        autoScrollTimer = setInterval(() => {
          if (isPaused) return;
          // Don't auto-scroll if a video or iframe is currently playing inside this carousel
          const activeMedia = row.querySelector('video.inline-video-player, iframe.inline-video-iframe, .inline-video-container');
          if (activeMedia) return;

          moveNext();
        }, 5000);
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
        vimeoId: '1231934338',
        vimeoHash: 'c57e488781'
      },
      'anuj-gurwara': {
        title: 'Client Testimonial - Sherwood Public School (Mr. Anuj Gurwara)',
        vimeoId: '1231934155',
        vimeoHash: '4076544a5d'
      },
      'andhra-canteen': {
        title: 'Founders in Frame - Andhra Canteen (Ms. Hyma Kesineni)',
        vimeoId: '1231934154',
        vimeoHash: '882ccd0e91'
      },
      'clapkartel': {
        title: 'Founders in Frame - Clap Kartel (Mr. Raghu Tirumala)',
        vimeoId: '1231934203',
        vimeoHash: 'beac68efbb'
      },
      'ritebooks': {
        title: 'Client Testimonial - RiteBook Technologies (Mr. Raghavender Srirampur)',
        vimeoId: '1231934289',
        vimeoHash: 'e5919fe7e3'
      },
      'rithika-suits': {
        title: 'Founders in Frame - Rithika Suits (Ms. Natasha Malve)',
        vimeoId: '1231934318',
        vimeoHash: '86ae31087f'
      },
      'viyash': {
        title: 'Client Testimonial - Viyash Scientific Limited (Mr. Kiran Varma)',
        vimeoId: '1231934365',
        vimeoHash: '9a288e052b'
      },
      'b5-corp': {
        title: 'Client Testimonial - B5 Corporation (Mr. KVS Subramanyam)',
        vimeoId: '1231934156',
        vimeoHash: 'c91b59a553'
      },
      'alankar-studios': {
        title: 'Founders in Frame - Studio Alankar (Mr. Dhrumil Kumar)',
        vimeoId: '1231934158',
        vimeoHash: 'ed2617491a'
      },
      'panfish': {
        title: 'Client Testimonial - Panfish Solutions (Ms. Anuradha Rao)',
        vimeoId: '1231934286',
        vimeoHash: 'bdfb32785d'
      },
    };

    const localVideo = videoOverlay ? videoOverlay.querySelector('.video-preview-local-player') : null;

    const openVideoModal = (config) => {
      if (!videoOverlay || !config) return;

      if (titleText) titleText.textContent = config.title || 'Client Testimonial';
      if (noteText) noteText.textContent = config.note || '';

      if (config.videoSrc) {
        if (iframe) {
          iframe.style.display = 'none';
          iframe.src = '';
        }
        if (localVideo) {
          localVideo.style.display = 'block';
          localVideo.src = config.videoSrc;
          localVideo.currentTime = 0;
          localVideo.play().catch(() => {});
        }
      } else {
        if (localVideo) {
          localVideo.pause();
          localVideo.style.display = 'none';
          localVideo.src = '';
        }
        if (iframe) {
          iframe.style.display = 'block';
          let embedSrc = '';
          if (config.vimeoId) {
            const hashParam = config.vimeoHash ? `h=${config.vimeoHash}&` : '';
            embedSrc = `https://player.vimeo.com/video/${config.vimeoId}?${hashParam}autoplay=1&autopause=0&badge=0&title=0&byline=0&portrait=0`;
          } else if (config.youtubeId) {
            embedSrc = `https://www.youtube.com/embed/${config.youtubeId}?start=${config.start || 0}&autoplay=1&rel=0`;
          }
          iframe.src = embedSrc;
        }
      }

      videoOverlay.style.display = 'flex';
      void videoOverlay.offsetWidth;
      videoOverlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    };

    // Fast pre-warm/prefetch function for Vimeo player documents
    const prefetchVideo = (vimeoId, hash) => {
      if (!vimeoId) return;
      const linkId = `prefetch-vimeo-${vimeoId}`;
      if (document.getElementById(linkId)) return;
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'prefetch';
      link.as = 'document';
      const hashParam = hash ? `h=${hash}&` : '';
      link.href = `https://player.vimeo.com/video/${vimeoId}?${hashParam}autoplay=1&dnt=1&playsinline=1&app_id=548209`;
      document.head.appendChild(link);
    };

    // Pre-warm the first 3 visible videos when the testimonials section approaches the viewport
    if ('IntersectionObserver' in window && testimonialsSec) {
      const prewarmObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            ['sudha-analyticals', 'anuj-gurwara', 'andhra-canteen'].forEach(key => {
              const cfg = videoMap[key];
              if (cfg && cfg.vimeoId) prefetchVideo(cfg.vimeoId, cfg.vimeoHash);
            });
            prewarmObserver.disconnect();
          }
        });
      }, { rootMargin: '300px' });
      prewarmObserver.observe(testimonialsSec);
    }

    const playInlineVideo = (cardWrapper, config) => {
      if (!cardWrapper || !config) return;
      if (cardWrapper.classList.contains('is-playing-video')) return;

      closeAllInlineVideos(cardWrapper);

      const overlay = cardWrapper.querySelector('.video-card-overlay');
      cardWrapper.classList.add('is-playing-video');

      const container = document.createElement('div');
      container.className = 'inline-video-container';

      // Fast visual feedback: pulsating spinner + keep thumbnail visible until player is ready
      const loader = document.createElement('div');
      loader.className = 'inline-video-loading-indicator';
      loader.innerHTML = `
        <div class="inline-video-spinner"></div>
        <span>Loading video...</span>
      `;
      container.appendChild(loader);

      const revealMedia = (mediaEl) => {
        if (mediaEl) {
          mediaEl.style.opacity = '1';
          mediaEl.style.pointerEvents = 'auto';
        }
        loader.style.opacity = '0';
        setTimeout(() => {
          if (loader.parentNode) loader.remove();
          if (overlay) overlay.style.display = 'none';
        }, 180);
      };

      if (config.videoSrc) {
        const video = document.createElement('video');
        video.className = 'inline-video-player';
        video.src = config.videoSrc;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.style.opacity = '0';
        video.style.transition = 'opacity 0.25s ease';
        video.addEventListener('canplay', () => revealMedia(video), { once: true });
        video.addEventListener('ended', () => {
          closeInlineVideo(cardWrapper);
        });
        container.appendChild(video);
        video.play().catch(() => {});
        setTimeout(() => revealMedia(video), 1200);
      } else if (config.vimeoId) {
        const iframeEl = document.createElement('iframe');
        iframeEl.className = 'inline-video-iframe';
        const hashParam = config.vimeoHash ? `h=${config.vimeoHash}&` : '';
        // dnt=1 skips third-party tracking scripts, app_id=548209 loads fast from Vimeo edge CDN
        iframeEl.src = `https://player.vimeo.com/video/${config.vimeoId}?${hashParam}autoplay=1&dnt=1&playsinline=1&autopause=0&badge=0&title=0&byline=0&portrait=0&transparent=0&app_id=548209`;
        iframeEl.setAttribute('frameborder', '0');
        iframeEl.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
        iframeEl.setAttribute('allowfullscreen', 'true');
        iframeEl.setAttribute('loading', 'eager');
        iframeEl.style.opacity = '0';
        iframeEl.style.pointerEvents = 'none';
        iframeEl.style.transition = 'opacity 0.25s ease';

        iframeEl.addEventListener('load', () => revealMedia(iframeEl), { once: true });
        container.appendChild(iframeEl);

        // Fallback safety timeout so user is never stuck
        setTimeout(() => revealMedia(iframeEl), 1000);
      } else if (config.youtubeId) {
        const iframeEl = document.createElement('iframe');
        iframeEl.className = 'inline-video-iframe';
        iframeEl.src = `https://www.youtube.com/embed/${config.youtubeId}?start=${config.start || 0}&autoplay=1&playsinline=1&rel=0`;
        iframeEl.setAttribute('frameborder', '0');
        iframeEl.setAttribute('allow', 'autoplay; encrypted-media; fullscreen; picture-in-picture');
        iframeEl.setAttribute('allowfullscreen', 'true');
        iframeEl.setAttribute('loading', 'eager');
        iframeEl.style.opacity = '0';
        iframeEl.style.pointerEvents = 'none';
        iframeEl.style.transition = 'opacity 0.25s ease';
        iframeEl.addEventListener('load', () => revealMedia(iframeEl), { once: true });
        container.appendChild(iframeEl);
        setTimeout(() => revealMedia(iframeEl), 1000);
      }


      cardWrapper.appendChild(container);
    };

    const handlePlayVideo = (cardWrapper) => {
      if (!cardWrapper) return;
      if (cardWrapper.classList.contains('is-playing-video')) return;
      const key = cardWrapper.getAttribute('data-id');
      const config = videoMap[key];
      if (!config) return;
      playInlineVideo(cardWrapper, config);
    };

    const attachCardEvents = (cardWrapper) => {
      if (!cardWrapper || cardWrapper.dataset.cardEventsAttached) return;
      cardWrapper.dataset.cardEventsAttached = 'true';

      // Pre-warm on pointer enter (mouse hover or touch hover)
      cardWrapper.addEventListener('pointerenter', () => {
        const key = cardWrapper.getAttribute('data-id');
        const config = videoMap[key];
        if (config && config.vimeoId) {
          prefetchVideo(config.vimeoId, config.vimeoHash);
        }
      }, { passive: true, once: true });

      const playBtn = cardWrapper.querySelector('.play-button');
      if (playBtn) {
        playBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          handlePlayVideo(cardWrapper);
        });
      }

      cardWrapper.addEventListener('click', () => {
        if (cardWrapper.classList.contains('is-playing-video')) return;
        handlePlayVideo(cardWrapper);
      });
    };

    // Attach to existing cards
    testimonialsSec.querySelectorAll('.video-card').forEach(attachCardEvents);

    // Vimeo Dynamic Folder Sync
    const VIMEO_FOLDER_CONFIG = {
      token: '5d63bd959c426c041b02851ea5fb3971',
      userId: '254778851',
      folderId: '30738577',
      cacheKey: 'eparivartan_vimeo_testimonials_cache_v3',
      cacheDurationMs: 24 * 60 * 60 * 1000 // 24 hours cache in localStorage
    };

    const customThumbMap = {
      '1231934338': { key: 'sudha-analyticals', thumb: 'assets/testimonials/sudha-analyticals-thumb.webp', title: 'Sudha Analyticals - Mr. Srinivas Gullala' },
      '1231934155': { key: 'anuj-gurwara', thumb: 'assets/testimonials/anuj-gurwara-thumb.webp', title: 'Sherwood Public School - Mr. Anuj Gurwara' },
      '1231934154': { key: 'andhra-canteen', thumb: 'assets/testimonials/andhra-canteen-thumb.webp', title: 'Andhra Canteen - Ms. Hyma Kesineni' },
      '1231934203': { key: 'clapkartel', thumb: 'assets/testimonials/clapkartel-thumb.webp', title: 'Clap Kartel - Mr. Raghu Tirumala' },
      '1231934289': { key: 'ritebooks', thumb: 'assets/testimonials/ritebooks-thumb.webp', title: 'RiteBook Technologies - Mr. Raghavender Srirampur' },
      '1231934318': { key: 'rithika-suits', thumb: 'assets/testimonials/rithika-suits-thumb.webp', title: 'Rithika Suits - Ms. Natasha Malve' },
      '1231934365': { key: 'viyash', thumb: 'assets/testimonials/viyash-thumb.webp', title: 'Viyash Scientific Limited - Mr. Kiran Varma' },
      '1231934156': { key: 'b5-corp', thumb: 'assets/testimonials/b5-corp-thumb.webp', title: 'B5 Corporation - Mr. KVS Subramanyam' },
      '1231934158': { key: 'alankar-studios', thumb: 'assets/testimonials/alankar-studios-thumb.webp', title: 'Studio Alankar - Mr. Dhrumil Kumar' },
      '1231934286': { key: 'panfish', thumb: 'assets/testimonials/panfish-thumb.webp', title: 'Panfish Solutions - Ms. Anuradha Rao' },
      // Fallback mappings
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
        const urlParams = new URLSearchParams(window.location.search);
        const bypassCache = urlParams.has('nocache') || urlParams.has('refresh');

        if (!bypassCache) {
          const cached = localStorage.getItem(VIMEO_FOLDER_CONFIG.cacheKey);
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              if (Date.now() - parsed.timestamp < VIMEO_FOLDER_CONFIG.cacheDurationMs && Array.isArray(parsed.videos)) {
                vimeoVideos = parsed.videos;
              }
            } catch (_) {}
          }
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
            localStorage.setItem(VIMEO_FOLDER_CONFIG.cacheKey, JSON.stringify({
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
          const rawTitle = v.name || (preset ? preset.title : 'Client Testimonial');
          const safeTitle = rawTitle.replace(/"/g, '&quot;');

          videoMap[key] = {
            title: rawTitle,
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
                ${thumbUrl ? `<img src="${thumbUrl}" alt="${safeTitle}" class="video-card-bg-img" loading="lazy" />` : ''}
                <div class="play-button-wrapper">
                  <button type="button" class="play-button" aria-label="Play testimonial from ${safeTitle}">
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

    // Testimonials Unified Carousel Navigation Controls
    const carouselPrevBtn = testimonialsSec.querySelector('.testimonials-prev-btn');
    const carouselNextBtn = testimonialsSec.querySelector('.testimonials-next-btn');
    const carouselWrapper = testimonialsSec.querySelector('.testimonials-carousel-wrapper');
    const carouselRow = testimonialsSec.querySelector('.testimonials-carousel-row');

    // Written Review Pop-up Modal Setup
    const writtenOverlay = document.querySelector('.written-preview-overlay');
    let openWrittenModal = null;

    if (writtenOverlay) {
      const writtenCloseBtn = writtenOverlay.querySelector('.written-preview-close');
      const writtenModal = writtenOverlay.querySelector('.written-preview-modal');
      const modalText = writtenOverlay.querySelector('.written-preview-text');
      const modalAuthorName = writtenOverlay.querySelector('.written-preview-author-name');
      const modalAuthorMeta = writtenOverlay.querySelector('.written-preview-author-meta');
      const modalLogo = writtenOverlay.querySelector('.written-preview-logo');

      openWrittenModal = (card) => {
        const text = card.querySelector('.written-card-text')?.textContent?.trim() || '';
        const name = card.querySelector('.author-name')?.textContent?.trim() || '';
        const meta = card.querySelector('.author-meta')?.textContent?.trim() || '';
        const logo = card.querySelector('.company-logo')?.getAttribute('src') || '';
        const logoAlt = card.querySelector('.company-logo')?.getAttribute('alt') || '';

        if (modalText) modalText.textContent = text;
        if (modalAuthorName) modalAuthorName.textContent = name;
        if (modalAuthorMeta) modalAuthorMeta.textContent = meta;
        if (modalLogo) {
          if (logo) {
            modalLogo.src = logo;
            modalLogo.alt = logoAlt;
            modalLogo.style.display = 'block';
          } else {
            modalLogo.style.display = 'none';
          }
        }

        writtenOverlay.style.display = 'flex';
        void writtenOverlay.offsetWidth;
        writtenOverlay.classList.add('is-active');
        document.body.style.overflow = 'hidden';
      };

      const closeWritten = () => {
        writtenOverlay.classList.remove('is-active');
        setTimeout(() => {
          writtenOverlay.style.display = 'none';
          document.body.style.overflow = '';
        }, 400);
      };

      if (writtenCloseBtn) writtenCloseBtn.addEventListener('click', closeWritten);
      writtenOverlay.addEventListener('click', closeWritten);
      if (writtenModal) {
        writtenModal.addEventListener('click', (e) => e.stopPropagation());
      }
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && writtenOverlay.classList.contains('is-active')) {
          closeWritten();
        }
      });
    }

    const syncCardReadMore = (card) => {
      if (!card) return;
      const textEl = card.querySelector('.written-card-text');
      if (!textEl) return;
      let btn = card.querySelector('.written-card-read-more');
      const isClamped = card.classList.contains('has-read-more') || (textEl.scrollHeight > textEl.clientHeight + 2);
      if (isClamped) {
        card.classList.add('has-read-more');
        if (!btn) {
          btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'written-card-read-more';
          btn.setAttribute('aria-label', 'Read full review');
          btn.innerHTML = `Read More <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3L11 8L6 13"/></svg>`;
          card.appendChild(btn);
        }
      }
    };

    const attachWrittenEvents = (card) => {
      if (!card || card.dataset.writtenEventsAttached) return;
      card.dataset.writtenEventsAttached = 'true';
      syncCardReadMore(card);
      if (openWrittenModal) {
        card.addEventListener('click', () => openWrittenModal(card));
      }
    };

    testimonialsSec.querySelectorAll('.written-card').forEach(attachWrittenEvents);

    if (carouselRow && openWrittenModal) {
      carouselRow.addEventListener('click', (e) => {
        const card = e.target.closest('.written-card');
        if (card) openWrittenModal(card);
      });
    }

    const onUnifiedCardInit = (card) => {
      if (card.classList.contains('video-card')) {
        attachCardEvents(card);
      } else if (card.classList.contains('written-card')) {
        attachWrittenEvents(card);
      }
    };

    if (carouselPrevBtn && carouselNextBtn && carouselWrapper && carouselRow) {
      setupStepCarousel(carouselWrapper, carouselRow, carouselPrevBtn, carouselNextBtn, '.testimonial-card', onUnifiedCardInit);
    }

    const closeVideo = () => {
      if (!videoOverlay) return;
      videoOverlay.classList.remove('is-active');
      if (localVideo) {
        localVideo.pause();
      }
      setTimeout(() => {
        if (iframe) iframe.src = '';
        if (localVideo) {
          localVideo.src = '';
          localVideo.style.display = 'none';
        }
        videoOverlay.style.display = 'none';
        document.body.style.overflow = '';
      }, 400);
    };

    if (closeBtn) closeBtn.addEventListener('click', closeVideo);
    if (videoOverlay) {
      videoOverlay.addEventListener('click', closeVideo);
      const modal = videoOverlay.querySelector('.video-preview-modal');
      if (modal) {
        modal.addEventListener('click', (e) => e.stopPropagation());
      }
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllInlineVideos();
        if (videoOverlay && videoOverlay.classList.contains('is-active')) {
          closeVideo();
        }
      }
    });

    window.addEventListener('message', (e) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data && (data.event === 'ended' || data.event === 'finish')) {
          testimonialsSec.querySelectorAll('.video-card.is-playing-video').forEach(card => {
            const ifr = card.querySelector('iframe.inline-video-iframe');
            if (ifr && ifr.contentWindow === e.source) {
              closeInlineVideo(card);
            }
          });
        }
      } catch (_) {}
    });
  }

  /* ==========================================
     7. FAQS ACCORDION TOGGLES
     ========================================== */
  const faqsSec = document.getElementById('faqs');
  if (faqsSec && !faqsSec.dataset.faqInitialized) {
    faqsSec.dataset.faqInitialized = 'true';
    const items = faqsSec.querySelectorAll('.faq-item-card');
    const openPath = 'M7 11.5H16';
    const closedPath = 'M11.5 7V16M7 11.5H16';

    items.forEach(card => {
      card.addEventListener('click', () => {
        const isOpen = card.classList.contains('is-open');
        
        // Close all other elements
        items.forEach(item => {
          item.classList.remove('is-open');
          const path = item.querySelector('.faq-toggle-btn svg path');
          if (path) path.setAttribute('d', closedPath);
        });

        if (!isOpen) {
          card.classList.add('is-open');
          const path = card.querySelector('.faq-toggle-btn svg path');
          if (path) path.setAttribute('d', openPath);
        }
      });
    });
  }

  /* ==========================================
     8. CONTACT FORM HANDLER & INTEGRATIONS
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
    const isProduction = ['eparivartan.com', 'www.eparivartan.com'].includes(window.location.hostname);
    const RECAPTCHA_SITE_KEY = isProduction
      ? '6LdrhwoUAAAAAEAxk89vkEx3Oy6to5THBRDSfbGx' // Production key
      : '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Universal Google test key for localhost

    const recaptchaContainer = document.getElementById('contact-recaptcha');
    if (recaptchaContainer) {
      recaptchaContainer.setAttribute('data-sitekey', RECAPTCHA_SITE_KEY);
      recaptchaContainer.classList.add('g-recaptcha');
    }

    let recaptchaRendered = false;
    const renderRecaptchaWidget = () => {
      if (recaptchaRendered) return;
      const target = document.getElementById('contact-recaptcha');
      if (!target) return;
      
      if (target.children.length > 0 && target.querySelector('iframe')) {
        recaptchaRendered = true;
        return;
      }

      if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
        try {
          window.grecaptcha.render(target, {
            sitekey: RECAPTCHA_SITE_KEY,
          });
          recaptchaRendered = true;
        } catch (e) {
          if (String(e).toLowerCase().includes('already been rendered')) {
            recaptchaRendered = true;
          } else {
            console.warn('reCAPTCHA render notice: ', e);
          }
        }
      }
    };

    // Ensure Google API script is present
    if (!document.querySelector('script[src*="recaptcha/api.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    if (window.grecaptcha && typeof window.grecaptcha.ready === 'function') {
      window.grecaptcha.ready(renderRecaptchaWidget);
    }

    let recaptchaAttempts = 0;
    const recaptchaCheckInterval = setInterval(() => {
      recaptchaAttempts++;
      if (recaptchaRendered || recaptchaAttempts > 25) {
        clearInterval(recaptchaCheckInterval);
        return;
      }
      if (window.grecaptcha) {
        if (typeof window.grecaptcha.ready === 'function') {
          window.grecaptcha.ready(renderRecaptchaWidget);
        } else if (typeof window.grecaptcha.render === 'function') {
          renderRecaptchaWidget();
        }
      }
    }, 400);

    // Form Submissions API Integration
    const submitBtn = contactForm.querySelector('.contact-submit-btn');
    const toast = document.querySelector('.contact-toast-container');
    const toastClose = document.querySelector('.contact-toast-close');

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
      
      const isLocalHost = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
      const recaptchaResponse = window.grecaptcha ? window.grecaptcha.getResponse() : '';
      if (!recaptchaResponse && !isLocalHost) {
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
        const response = await fetch('./contact.php', {
          method: 'POST',
          body: formData
        });

        const isLocalHost = window.location.hostname === 'localhost' || 
                            window.location.hostname === '127.0.0.1' || 
                            window.location.protocol === 'file:';

        const responseText = await response.text();
        let result = null;
        try {
          result = JSON.parse(responseText);
        } catch (parseErr) {
          result = null;
        }

        if (!response.ok || !result || !result.success) {
          if (isLocalHost && (!result || !result.errors)) {
            result = { success: true };
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

    
  }

  // ==================== 3D COVERFLOW CAROUSEL JS ====================
  const coverflowTrack = document.getElementById('featuredCoverflowTrack');
  const coverflowPrevBtn = document.getElementById('coverflowPrevBtn');
  const coverflowNextBtn = document.getElementById('coverflowNextBtn');
  const coverflowDots = document.getElementById('featuredCardsDots');

  if (coverflowTrack) {
    const cards = Array.from(coverflowTrack.querySelectorAll('.featured-coverflow-card'));
    const totalCards = cards.length;
    let activeIdx = 0;

    const updateCoverflowState = () => {
      cards.forEach((card, idx) => {
        card.className = 'featured-coverflow-card';

        let diff = idx - activeIdx;

        // Circular wrap-around for infinite carousel loop
        if (diff > totalCards / 2) diff -= totalCards;
        if (diff < -totalCards / 2) diff += totalCards;

        if (diff === 0) {
          card.classList.add('active');
        } else if (diff === 1) {
          card.classList.add('next-1');
        } else if (diff === -1) {
          card.classList.add('prev-1');
        } else if (diff === 2) {
          card.classList.add('next-2');
        } else if (diff === -2) {
          card.classList.add('prev-2');
        } else if (diff > 2) {
          card.classList.add('hidden-right');
        } else {
          card.classList.add('hidden-left');
        }
      });

      if (coverflowDots) {
        const dots = coverflowDots.querySelectorAll('span');
        dots.forEach((dot, idx) => {
          if (idx === activeIdx) {
            dot.className = 'dot-pill active';
          } else {
            dot.className = 'dot-circle';
          }
        });
      }

      const activeCard = cards[activeIdx];
      const activeBtn = activeCard ? (activeCard.querySelector('.mobile-visit-btn') || activeCard.querySelector('.featured-card-view-btn')) : null;
      const mobileFixedBtn = document.getElementById('coverflowMobileVisitBtn');
      if (mobileFixedBtn && activeBtn) {
        const hrefVal = activeBtn.getAttribute('href');
        if (hrefVal) {
          mobileFixedBtn.setAttribute('href', hrefVal);
        }
      }
    };

    const goToCard = (index) => {
      activeIdx = (index + totalCards) % totalCards;
      updateCoverflowState();
    };

    if (coverflowNextBtn) {
      coverflowNextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        goToCard(activeIdx + 1);
      });
    }

    if (coverflowPrevBtn) {
      coverflowPrevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        goToCard(activeIdx - 1);
      });
    }

    if (coverflowDots) {
      const dots = coverflowDots.querySelectorAll('span');
      dots.forEach((dot, idx) => {
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          goToCard(idx);
        });
      });
    }

    // Allow clicking side cards to bring them to center
    cards.forEach((card, idx) => {
      card.addEventListener('click', (e) => {
        if (!card.classList.contains('active')) {
          e.preventDefault();
          goToCard(idx);
        }
      });
    });

    // Touch Swipe support
    let touchStartX = 0;

    coverflowTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    coverflowTrack.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 40) {
        goToCard(activeIdx + 1);
      } else if (touchEndX - touchStartX > 40) {
        goToCard(activeIdx - 1);
      }
    }, { passive: true });

    // Initial render
    updateCoverflowState();

    // Auto-play functionality
    let autoplayInterval;

    const startAutoplay = () => {
      stopAutoplay();
      autoplayInterval = setInterval(() => {
        goToCard(activeIdx + 1);
      }, 2000);
    };

    const stopAutoplay = () => {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
      }
    };

    // Pause autoplay on interaction
    const stage = document.getElementById('featuredCoverflowStage') || coverflowTrack;
    stage.addEventListener('mouseenter', stopAutoplay);
    stage.addEventListener('mouseleave', startAutoplay);
    stage.addEventListener('touchstart', stopAutoplay, { passive: true });
    stage.addEventListener('touchend', startAutoplay, { passive: true });

    // Start auto-play by default
    startAutoplay();
  }

  /* ==========================================
     Footer Group Accordion Toggles
     ========================================== */
  document.addEventListener('click', (e) => {
    const header = e.target.closest('.footer-group-header');
    if (header) {
      e.preventDefault();
      const parentGroup = header.closest('.footer-group');
      if (parentGroup) {
        const isOpen = parentGroup.classList.toggle('open');
        header.classList.toggle('active', isOpen);
      }
    }
  });

  /* ==========================================
     HERO SHOWCASE SCROLL & HOVER TRIGGER
     Trigger effect when scrolled into view/reached,
     while also preserving smooth hover and tap toggling
     ========================================== */
  const initHeroShowcaseObserver = () => {
    const showcaseContainers = document.querySelectorAll(
      '.web-dev-hero-showcase, .mobile-hero-showcase, #webDevShowcase, #mobileShowcase, .ecommerce-hero-showcase'
    );
    if (!showcaseContainers.length) return;

    const updateShowcaseState = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const isMobile = window.innerWidth <= 768;

      showcaseContainers.forEach((container) => {
        const wrapper = container.querySelector('.web-dev-showcase-wrapper, .ecommerce-showcase-wrapper') || container;
        const rect = container.getBoundingClientRect();

        if (isMobile) {
          // On mobile: when at top of hero (scrollY < 25), keep initial scaled-down state.
          // When scrolled down and showcase is in view, trigger smooth growing effect.
          const isAtTop = scrollY < 25;
          const isScrolledToHero = scrollY >= 25 && rect.top < vh * 0.88 && rect.bottom > 50;

          if (isScrolledToHero) {
            container.classList.add('is-in-view');
            wrapper.classList.add('is-visible');
          } else if (isAtTop || rect.top > vh) {
            container.classList.remove('is-in-view');
            wrapper.classList.remove('is-visible');
          }
        } else {
          // On desktop: trigger when scrolled into view
          const inView = rect.top < vh - 60 && rect.bottom > 60;
          if (inView) {
            container.classList.add('is-in-view');
            wrapper.classList.add('is-visible');
          } else {
            container.classList.remove('is-in-view');
            wrapper.classList.remove('is-visible');
          }
        }
      });
    };

    // Scroll and resize listeners with passive flag for performance
    window.addEventListener('scroll', updateShowcaseState, { passive: true });
    window.addEventListener('resize', updateShowcaseState, { passive: true });

    // Initial check
    updateShowcaseState();

    // Click/tap toggle fallback
    showcaseContainers.forEach((container) => {
      container.addEventListener('click', () => {
        const wrapper = container.querySelector('.web-dev-showcase-wrapper, .ecommerce-showcase-wrapper') || container;
        container.classList.toggle('is-in-view');
        wrapper.classList.toggle('is-visible');
      });
    });
  };

  /* ==========================================
     MOBILE HERO STACKED CARDS ANIMATION & INTERACTION
     ========================================== */
  const initHeroMobileCards = () => {
    const stage = document.querySelector('.hero-mobile-view .stage');
    if (!stage) return;

    // Trigger entrance fan-out when in view, then activate smooth continuous floating wave
    const startAnimations = () => {
      stage.classList.add('is-animated');
      setTimeout(() => {
        stage.classList.add('is-floating');
      }, 950);
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startAnimations();
            observer.unobserve(stage);
          }
        });
      }, { threshold: 0.1 });
      observer.observe(stage);
    } else {
      startAnimations();
    }

    // Tap-to-front toggle interaction
    stage.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      if (!card || !stage.contains(card)) {
        // Tapped outside card, return all cards to natural floating wave
        stage.querySelectorAll('.card').forEach(c => c.classList.remove('is-front'));
        return;
      }

      const isAlreadyFront = card.classList.contains('is-front');
      stage.querySelectorAll('.card').forEach(c => c.classList.remove('is-front'));

      if (!isAlreadyFront) {
        card.classList.add('is-front');
      }
    });
  };

  /* ==========================================
     GLOBAL PRESENCE COUNTRIES SCROLL OBSERVER
     Scroll starts only after reaching the section + 2 seconds delay
     ========================================== */
  const initPresenceMarqueeObserver = () => {
    const presenceSection = document.querySelector('#presence, .presence-section');
    const track = document.querySelector('.presence-countries-track');
    if (!presenceSection || !track) return;

    let timer = null;
    let hasStarted = false;

    const startScrolling = () => {
      if (hasStarted) return;
      hasStarted = true;
      track.classList.add('is-scrolling');
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!hasStarted && !timer) {
              timer = setTimeout(() => {
                startScrolling();
                observer.unobserve(presenceSection);
              }, 2000);
            }
          } else {
            if (!hasStarted && timer) {
              clearTimeout(timer);
              timer = null;
            }
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      });

      observer.observe(presenceSection);
    } else {
      setTimeout(startScrolling, 2000);
    }
  };

  initHeroShowcaseObserver();
  initHeroMobileCards();
  initPresenceMarqueeObserver();
};

if (document.readyState !== 'loading') {
  initIndexApp();
} else {
  document.addEventListener('DOMContentLoaded', initIndexApp);
}


// Sticky Navbar Animation Logic
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header-container');
  if (header) {
    const updateHeader = () => {
      document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    window.addEventListener('resize', updateHeader, { passive: true });
  }

  // Handle click on "View Our Work" buttons & "Our Work" header link to show ONLY Header Our Work Menu
  document.addEventListener('click', (e) => {
    // 1. Click on "View Our Work" button/link anywhere on page
    const btn = e.target.closest('a, button');
    if (btn && btn.textContent && btn.textContent.trim().toLowerCase().includes('view our work')) {
      const isDropdownOption = btn.closest('.dropdown-menu, .mobile-drawer');
      if (!isDropdownOption) {
        const href = btn.getAttribute('href');
        // If it's a real destination page link (like ./work-websites.html, ./work-ecommerce.html, ./work-webapps.html), allow normal navigation
        if (href && href !== '#' && !href.startsWith('#') && !href.startsWith('javascript:')) {
          return;
        }

        e.preventDefault();

        // On mobile, open mobile drawer to 'Our Work'
        if (window.innerWidth <= 1000) {
          if (typeof window.openMobileDrawerWithGroup === 'function') {
            window.openMobileDrawerWithGroup('Our Work');
          } else {
            const drawer = document.querySelector('.mobile-drawer');
            const backdrop = document.querySelector('.menu-backdrop');
            const menuBtn = document.querySelector('.menu-btn');
            if (drawer && backdrop) {
              drawer.classList.add('open');
              backdrop.classList.add('open');
              if (menuBtn) menuBtn.classList.add('active');
              document.body.classList.add('menu-open');
            }
          }
          return;
        }

        // Smooth scroll to top header on desktop
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Find "Our Work" nav item in header navigation and open its dropdown
        const navItems = document.querySelectorAll('.has-dropdown');
        navItems.forEach(item => {
          const link = item.querySelector('.nav-link, a');
          if (link && link.textContent.trim().toLowerCase().includes('our work')) {
            item.classList.add('is-open');
          } else {
            item.classList.remove('is-open');
          }
        });
        return;
      }
    }

    // 2. Click on top-level nav link with dropdown in header
    const clickedNavGroup = e.target.closest('.has-dropdown');
    const clickedNavLink = e.target.closest('.nav-link');

    if (clickedNavGroup && clickedNavLink) {
      const href = clickedNavLink.getAttribute('href');
      // If clicking "Search & AI Visibility" (or any link with a valid destination page), allow redirecting directly
      if (href && href !== '#' && !href.startsWith('javascript:')) {
        if (!e.metaKey && !e.ctrlKey && !e.shiftKey) {
          window.location.href = href;
        }
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      const isOpen = clickedNavGroup.classList.contains('is-open');
      
      document.querySelectorAll('.has-dropdown').forEach(item => {
        if (item !== clickedNavGroup) item.classList.remove('is-open');
      });

      if (!isOpen) {
        clickedNavGroup.classList.add('is-open');
      } else {
        clickedNavGroup.classList.remove('is-open');
      }
      return;
    }

    // 3. Clicking outside header navigation closes any open dropdown menu
    if (!e.target.closest('.header-container, .desktop-nav, .has-dropdown')) {
      document.querySelectorAll('.has-dropdown').forEach(item => {
        item.classList.remove('is-open');
      });
    }
  });
});
