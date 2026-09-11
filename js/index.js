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
      screenshot: './assets/our-work/websites/estic-screenshot.png',
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
      id: 'creaprojects',
      title: 'Crea Projects',
      description: 'A portfolio site for Crea Projects, a design studio spanning residential, commercial, hospitality, and institutional architecture.',
      solutionTitle: 'The Solution',
      solutionText: 'Created a high-impact, visual-first portfolio architecture celebrating signature projects like Oceanique and Ente Keralam with fluid motion transitions.',
      stats: [
        { num: '100+', lbl: 'Projects', icon: '<polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>' },
        { num: '20+', lbl: 'Years Exp', icon: '<circle cx="12" cy="12" r="10"></circle>' },
        { num: '+200%', lbl: 'Inquiries', icon: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>' }
      ],
      techPills: [
        { name: 'React', stroke: '#61DAFB', svg: '<circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="4"/>' },
        { name: 'Tailwind CSS', stroke: '#38BDF8', svg: '<path d="M12 4.5C7 4.5 3.5 7.5 3.5 10.5c0 4 5.5 4.5 5.5 7 0 1.5-1.5 2.5-3.5 2.5"/>' },
        { name: 'GSAP', stroke: '#88CE02', svg: '<polygon points="12 2 2 7 12 12 22 7 12 2"/>' }
      ],
      liveUrl: 'https://creaprojects.in/',
      displayUrl: 'creaprojects.in/',
      screenshot: 'https://s.wordpress.com/mshots/v1/https%3A%2F%2Fcreaprojects.in%2F?w=1200&h=800',
      useIframe: true
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

  if (testimonialsSec && videoOverlay) {
    const playButtons = testimonialsSec.querySelectorAll('.play-button');
    const closeBtn = videoOverlay.querySelector('.video-preview-close');
    const iframe = videoOverlay.querySelector('.video-preview-player');
    const titleText = videoOverlay.querySelector('.video-preview-caption-title');
    const noteText = videoOverlay.querySelector('.video-preview-caption-note');

    // Helper to setup carousel navigation with automatic visual disabled states on end cards
    const setupCarouselNav = (wrapper, prevBtn, nextBtn, stepCalc) => {
      if (!wrapper || !prevBtn || !nextBtn) return;

      const updateButtonsState = () => {
        const scrollLeft = wrapper.scrollLeft;
        const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;

        const isAtStart = scrollLeft <= 5;
        const isAtEnd = scrollLeft >= maxScroll - 5;

        prevBtn.disabled = isAtStart;
        nextBtn.disabled = isAtEnd;

        if (isAtStart) {
          prevBtn.classList.add('disabled');
        } else {
          prevBtn.classList.remove('disabled');
        }

        if (isAtEnd) {
          nextBtn.classList.add('disabled');
        } else {
          nextBtn.classList.remove('disabled');
        }
      };

      prevBtn.addEventListener('click', () => {
        const step = typeof stepCalc === 'function' ? stepCalc() : stepCalc;
        wrapper.scrollBy({ left: -step, behavior: 'smooth' });
      });

      nextBtn.addEventListener('click', () => {
        const step = typeof stepCalc === 'function' ? stepCalc() : stepCalc;
        wrapper.scrollBy({ left: step, behavior: 'smooth' });
      });

      wrapper.addEventListener('scroll', updateButtonsState, { passive: true });
      window.addEventListener('resize', updateButtonsState);

      updateButtonsState();
      setTimeout(updateButtonsState, 200);
      setTimeout(updateButtonsState, 800);
    };

    // Video Testimonials Carousel Navigation Controls
    const videoPrevBtn = testimonialsSec.querySelector('.testimonials-header-right .testimonials-prev-btn');
    const videoNextBtn = testimonialsSec.querySelector('.testimonials-header-right .testimonials-next-btn');
    const videoWrapper = testimonialsSec.querySelector('.video-testimonials-wrapper');

    if (videoPrevBtn && videoNextBtn && videoWrapper) {
      const getVideoStep = () => {
        const card = videoWrapper.querySelector('.video-card');
        const row = videoWrapper.querySelector('.video-testimonials-row');
        const gap = row ? (parseInt(window.getComputedStyle(row).gap) || 16) : 16;
        return card ? (card.offsetWidth + gap) : 312;
      };
      setupCarouselNav(videoWrapper, videoPrevBtn, videoNextBtn, getVideoStep);
    }

    // Written Testimonials Carousel Navigation Controls
    const writtenPrevBtn = testimonialsSec.querySelector('.written-prev-btn');
    const writtenNextBtn = testimonialsSec.querySelector('.written-next-btn');
    const writtenWrapper = testimonialsSec.querySelector('.written-testimonials-wrapper');

    if (writtenPrevBtn && writtenNextBtn && writtenWrapper) {
      const getWrittenStep = () => {
        const card = writtenWrapper.querySelector('.written-card');
        const row = writtenWrapper.querySelector('.written-testimonials-row');
        const gap = row ? (parseInt(window.getComputedStyle(row).gap) || 16) : 16;
        return card ? (card.offsetWidth + gap) : 424;
      };
      setupCarouselNav(writtenWrapper, writtenPrevBtn, writtenNextBtn, getWrittenStep);
    }

    const videoMap = {
      'rithika-suits': {
        title: 'The Journey Behind Rithika Suits with Arun Malve | Founders in Frame',
        youtubeId: 'UCm6J1nXzBk',
        start: 313
      },
      'subramanyam': {
        title: 'Client Testimonial',
        youtubeId: 'ZlFzLXwgvtk',
        start: 466
      },
      'stabaka': {
        title: 'Building the Brand Stabaka',
        youtubeId: 'L30rtzNLQoY',
        start: 0,
        note: 'This interview is not a testimonial. It focuses on the journey of building the Stabaka brand.'
      },
      'accel1': {
        title: 'Accel1 Founder Testimonial',
        youtubeId: 'bt96tscmCw0',
        start: 46
      },
      'decade-journey': {
        title: 'A Decade of Professional Relationship',
        youtubeId: 'QaQAyjqGxSI',
        start: 151
      },
      'vimeo-testimonial': {
        title: '700 SPF Machete',
        vimeoId: '1061296672'
      }
    };

    playButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Find which testimonial video based on markup wrappers
        const cardWrapper = btn.closest('.video-card');
        if (!cardWrapper) return;
        
        // Find card key/id
        const key = cardWrapper.getAttribute('data-id');
        const config = videoMap[key];
        if (!config) return;

        // Stop & clean up any other inline video currently playing
        document.querySelectorAll('.video-card iframe.inline-video-iframe').forEach(existingIframe => {
          const parentCard = existingIframe.closest('.video-card');
          if (parentCard && parentCard !== cardWrapper) {
            existingIframe.remove();
            const overlay = parentCard.querySelector('.video-card-overlay');
            if (overlay) overlay.style.display = 'block';
          }
        });

        // Hide card overlay and inject iframe inside card
        const overlay = cardWrapper.querySelector('.video-card-overlay');
        let embedSrc = '';
        if (config.vimeoId) {
          embedSrc = `https://player.vimeo.com/video/${config.vimeoId}?autoplay=1&autopause=0&badge=0&autofocus=0`;
        } else if (config.youtubeId) {
          embedSrc = `https://www.youtube.com/embed/${config.youtubeId}?start=${config.start || 0}&autoplay=1&rel=0`;
        }

        let iframeEl = cardWrapper.querySelector('iframe.inline-video-iframe');
        if (!iframeEl) {
          iframeEl = document.createElement('iframe');
          iframeEl.className = 'inline-video-iframe';
          iframeEl.src = embedSrc;
          iframeEl.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
          iframeEl.setAttribute('allowfullscreen', 'true');
          iframeEl.style.cssText = 'width: 100%; height: 100%; position: absolute; top: 0; left: 0; border: none; border-radius: 12px; z-index: 10; background: #000;';
          cardWrapper.appendChild(iframeEl);
        } else {
          iframeEl.src = embedSrc;
          iframeEl.style.display = 'block';
        }

        if (overlay) {
          overlay.style.display = 'none';
        }
      });
    });

    const closeVideo = () => {
      videoOverlay.style.display = 'none';
      iframe.src = '';
      document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeVideo);
    videoOverlay.addEventListener('click', closeVideo);
    
    videoOverlay.querySelector('.video-preview-modal').addEventListener('click', (e) => {
      e.stopPropagation();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoOverlay.style.display === 'flex') {
        closeVideo();
      }
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
      const website = document.getElementById('website').value.trim();
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
    const showcases = document.querySelectorAll('.web-dev-hero-showcase, .mobile-hero-showcase, #webDevShowcase, #mobileShowcase');
    if (!showcases.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Delay slightly (180ms) so user catches the initial 3D view before it smoothly straightens
            setTimeout(() => {
              if (entry.target) {
                entry.target.classList.add('is-in-view');
              }
            }, 180);
          } else {
            // Remove when leaving so it re-triggers smoothly on re-entry
            entry.target.classList.remove('is-in-view');
          }
        });
      }, {
        threshold: 0.2,
        rootMargin: '0px 0px -8% 0px'
      });

      showcases.forEach(el => observer.observe(el));
    } else {
      // Fallback: trigger immediately if IntersectionObserver is not available
      showcases.forEach(el => el.classList.add('is-in-view'));
    }

    // Interactive Click/Tap Toggle (allows user to flip between 3D and flat on click/tap)
    showcases.forEach(el => {
      el.addEventListener('click', () => {
        el.classList.toggle('is-in-view');
      });
    });
  };

  initHeroShowcaseObserver();
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
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }
});
