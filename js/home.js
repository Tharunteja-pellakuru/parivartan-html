document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================
     1. GLOBAL ANIMATION LAYER (GSAP REVEALS)
     ========================================== */
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      // Reveal every section and footer as it scrolls in (excluding services section which has sticky cards)
      const revealTargets = gsap.utils.toArray('section, footer').filter(el => !el.classList.contains('services-section') && el.id !== 'services' && !el.querySelector('.services-row'));
      revealTargets.forEach(el => {
        // Slide-up + fade for every other section.
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

  if (menuBtn && menuBackdrop && mobileDrawer) {
    const toggleMenu = () => {
      const isOpen = menuBtn.classList.toggle('active');
      menuBackdrop.classList.toggle('open', isOpen);
      mobileDrawer.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuBtn.addEventListener('click', toggleMenu);
    menuBackdrop.addEventListener('click', toggleMenu);

    // Close menu drawer on navigation link clicks (hash navigation)
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        menuBackdrop.classList.remove('open');
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Accordion group Inside mobile drawer (Our Work submenus)
    const toggleBtn = mobileDrawer.querySelector('.dropdown-toggle-btn');
    const itemGroup = mobileDrawer.querySelector('.drawer-menu-item-group');
    if (toggleBtn && itemGroup) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isExpanded = itemGroup.classList.toggle('expanded');
        toggleBtn.setAttribute('aria-expanded', isExpanded);
      });
    }
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
      { id: 'html', name: 'HTML5', size: 'small', ring: 'inner', depth: 0.6, logo: './assets/home/tech/html5.svg' },
      { id: 'css', name: 'CSS3', size: 'small', ring: 'inner', depth: 0.6, logo: './assets/home/tech/css.svg' },
      { id: 'javascript', name: 'JavaScript', size: 'small', ring: 'inner', depth: 0.5, logo: './assets/home/tech/javascript.svg' },
      { id: 'typescript', name: 'TypeScript', size: 'small', ring: 'inner', depth: 0.5, logo: './assets/home/tech/typescript.svg' },
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
      { from: 'center', to: 'react' }, { from: 'center', to: 'nodejs' },
      { from: 'center', to: 'python' }, { from: 'center', to: 'wordpress' }, { from: 'center', to: 'flutter' },
      { from: 'react', to: 'javascript' }, { from: 'react', to: 'typescript' },
      { from: 'javascript', to: 'html' }, { from: 'css', to: 'html' },
      { from: 'react', to: 'css' }, { from: 'react', to: 'tailwind' }, { from: 'react', to: 'bootstrap' },
      { from: 'css', to: 'tailwind' }, { from: 'css', to: 'bootstrap' },
      { from: 'react', to: 'figma' }, { from: 'html', to: 'figma' },
      { from: 'react', to: 'redux' }, { from: 'javascript', to: 'redux' },
      { from: 'nodejs', to: 'express' }, { from: 'nodejs', to: 'mongodb' },
      { from: 'express', to: 'mongodb' }, { from: 'nodejs', to: 'typescript' },
      { from: 'react', to: 'firebase' }, { from: 'flutter', to: 'firebase' },
      { from: 'python', to: 'django' }, { from: 'python', to: 'postgresql' },
      { from: 'django', to: 'postgresql' }, { from: 'postgresql', to: 'mongodb' },
      { from: 'python', to: 'sqlite' }, { from: 'wordpress', to: 'php' },
      { from: 'wordpress', to: 'mysql' }, { from: 'php', to: 'mysql' },
      { from: 'wordpress', to: 'shopify' }, { from: 'shopify', to: 'mysql' },
      { from: 'php', to: 'xampp' }, { from: 'mysql', to: 'xampp' },
      { from: 'wordpress', to: 'woocommerce' }, { from: 'shopify', to: 'woocommerce' },
      { from: 'github', to: 'react' }, { from: 'github', to: 'nodejs' },
      { from: 'github', to: 'vscode' }, { from: 'javascript', to: 'vscode' },
      { from: 'github', to: 'figma' }, { from: 'flutter', to: 'kotlin' },
      { from: 'flutter', to: 'xcode' }, { from: 'kotlin', to: 'xcode' },
      { from: 'mysql', to: 'sqlite' }, { from: 'nodejs', to: 'goland' }
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
      const baseRadius = Math.min(containerWidth, containerHeight);
      const isSmallScreen = window.innerWidth < 640;
      const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;

      let innerRadius = baseRadius * 0.37;
      let outerRadius = baseRadius * 0.55;

      if (isSmallScreen) {
        innerRadius = baseRadius * 0.30;
        outerRadius = baseRadius * 0.45;
      } else if (isTablet) {
        innerRadius = baseRadius * 0.32;
        outerRadius = baseRadius * 0.50;
      }

      // Max bounds validation to prevent viewport overflows
      const nodeMargin = isSmallScreen ? 26 : isTablet ? 32 : 34;
      const maxOuterRadius = Math.min(containerWidth, containerHeight) / 2 - nodeMargin;
      if (outerRadius > maxOuterRadius) {
        const scale = Math.max(maxOuterRadius / outerRadius, 0.5);
        outerRadius *= scale;
        innerRadius *= scale;
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
     4. SERVICES OVERLAPPING CARD DECK SCROLL
     ========================================== */
  const servicesSec = document.getElementById('services');
  if (servicesSec) {
    const cards = Array.from(servicesSec.querySelectorAll('.services-row'));
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let lastActiveIndex = null;

    // Read the computed CSS `top` for every card — matches React's updateStickyTops().
    let stickyTops = [];

    const updateStickyTops = () => {
      const isMobile = window.innerWidth <= 960;
      stickyTops = cards.map((card) => {
        const computedTop = parseFloat(window.getComputedStyle(card).top);
        if (!isNaN(computedTop)) {
          return computedTop;
        }
        return isMobile ? 60 : 100;
      });
    };

    updateStickyTops();
    window.addEventListener('resize', updateStickyTops);

    const animateCards = () => {
      const isMobile = window.innerWidth <= 960;

      // On mobile, disable the scale-down stacking animation entirely — the cards
      // simply slide over one another via sticky positioning, matching the React build.
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

      // Desktop: determine which card is currently pinned
      let currentActiveIndex = null;
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const stickyTop = stickyTops[index] || 100;
        if (rect.top <= stickyTop + 10) {
          currentActiveIndex = index;
        }
      });

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const stickyTop = stickyTops[index] || 100;

        if (index === currentActiveIndex) {
          card.classList.add('is-active');
        } else {
          card.classList.remove('is-active');
        }

        // Adding 10px tolerance for subpixel render scaling
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
          card.style.filter = '';
          card.style.backgroundColor = '#FFF';
        } else {
          card.style.transform = 'scale(1)';
          card.style.filter = '';
          card.style.backgroundColor = '#FFF';
        }
      });

      // On touch devices there is no hover, so the pinned card drives its video.
      if (!canHover && currentActiveIndex !== lastActiveIndex) {
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

    // Play/Pause Services Video mockups on hover
    if (canHover) {
      cards.forEach(card => {
        const video = card.querySelector('video');
        if (video) {
          card.addEventListener('mouseenter', () => {
            video.currentTime = 0;
            video.play().catch(() => {});
          });
          card.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
          });
        }
      });
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
      liveUrl: 'https://estic.dst.gov.in/',
      displayUrl: 'estic.dst.gov.in/',
      screenshot: './assets/home/estic_screenshot.png',
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

  if (featuredSec) {
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
    
    const dotsContainer = featuredSec.querySelector('.featured-carousel-dots');
    const prevBtn = featuredSec.querySelector('.featured-nav-btn.prev');
    const nextBtn = featuredSec.querySelector('.featured-nav-btn.next');

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
      const dots = dotsContainer.querySelectorAll('.featured-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeIndex);
      });
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
      }
    };

    playButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Find which testimonial video based on markup wrappers
        const cardWrapper = btn.closest('.video-card');
        if (!cardWrapper) return;
        
        // Find card key/id
        const key = cardWrapper.getAttribute('data-id');
        const config = videoMap[key];
        if (!config) return;

        titleText.textContent = config.title;
        noteText.textContent = config.note || '';
        
        iframe.src = `https://www.youtube.com/embed/${config.youtubeId}?start=${config.start}&autoplay=1&rel=0`;
        videoOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
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
  if (faqsSec) {
    const items = faqsSec.querySelectorAll('.faq-item-card');

    items.forEach(card => {
      card.addEventListener('click', () => {
        const isOpen = card.classList.contains('is-open');
        
        // Close all other elements
        items.forEach(item => {
          item.classList.remove('is-open');
          const path = item.querySelector('.faq-toggle-btn svg path');
          if (path) path.setAttribute('d', 'M11.5 7V16M7 11.5H16');
        });

        if (!isOpen) {
          card.classList.add('is-open');
          const path = card.querySelector('.faq-toggle-btn svg path');
          if (path) path.setAttribute('d', 'M7 11.5H16');
        }
      });
    });
  }

  /* ==========================================
     8. CONTACT FORM HANDLER & INTEGRATIONS
     ========================================== */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const servicesList = [
      'UI/UX Design',
      'Web Development',
      'App Development',
      'AEO Services',
      'GEO Services',
      'SEO Services',
    ];

    // Build Custom Dropdown Menu triggers
    const trigger = contactForm.querySelector('.contact-custom-dropdown-trigger');
    const container = contactForm.querySelector('.contact-custom-dropdown-container');
    const hiddenInput = contactForm.querySelector('input[name="service"]');
    const selectedDisplay = trigger.querySelector('.contact-dropdown-selected-value');

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
        selectedDisplay.textContent = service;
        selectedDisplay.classList.remove('placeholder');
        ul.style.display = 'none';
        trigger.classList.remove('active');
        trigger.querySelector('.contact-dropdown-chevron').classList.remove('open');
      });
      ul.appendChild(li);
    });
    container.appendChild(ul);

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = ul.style.display === 'block';
      ul.style.display = isOpen ? 'none' : 'block';
      trigger.classList.toggle('active', !isOpen);
      trigger.querySelector('.contact-dropdown-chevron').classList.toggle('open', !isOpen);
    });

    document.addEventListener('click', () => {
      ul.style.display = 'none';
      trigger.classList.remove('active');
      trigger.querySelector('.contact-dropdown-chevron').classList.remove('open');
    });

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
      toast.classList.add('is-visible');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('is-visible');
      }, 5000);
    };

    if (toastClose) {
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

      // Form payload
      const payload = {
        fullName,
        phone,
        email,
        website,
        service,
        message
      };

      try {
        const [emailSuccess] = await Promise.all([
          // 1. Send admin notification email
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
          throw new Error('Email notification sending failed');
        }

        // Reset form inputs
        contactForm.reset();
        hiddenInput.value = '';
        selectedDisplay.textContent = 'Select service';
        selectedDisplay.classList.add('placeholder');
        if (window.grecaptcha) window.grecaptcha.reset();

        showToast();
      } catch (err) {
        console.error('Submission failed: ', err);
        displayFormStatus('Something went wrong. Please try again or reach us directly.', true);
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
      <div style="background-color: #f5f6f8; padding: 40px 20px; font-family: 'Outfit', sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e1e1e3; border-radius: 12px;">
          <tr>
            <td style="background-color: #1e4620; padding: 30px; text-align: center; border-radius: 11px 11px 0 0;">
              <img src="https://www.eparivartan.com/images/logo.svg" alt="parivartan" style="height: 40px;" />
              <div style="color: #f2be22; font-size: 18px; font-weight: 700; margin-top: 15px; text-transform: uppercase;">New Sales Enquiry</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 35px;">
              <p style="color: #4a4a4a; font-size: 15px; line-height: 1.6;">New inquiry submitted via the contact form on eparivartan.com.</p>
              <table border="0" cellpadding="10" cellspacing="0" width="100%" style="border: 1px solid #e1e1e3; border-radius: 8px;">
                <tr><td width="30%"><strong>Name</strong></td><td>${data.fullName}</td></tr>
                <tr><td><strong>Email</strong></td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
                <tr><td><strong>Phone</strong></td><td>${data.phone}</td></tr>
                <tr><td><strong>Service</strong></td><td>${data.service}</td></tr>
                <tr><td><strong>Website</strong></td><td>${data.website || '—'}</td></tr>
                <tr><td><strong>Message</strong></td><td>${data.message.replace(/\n/g, '<br/>')}</td></tr>
              </table>
              <div style="text-align: center; margin-top: 30px;">
                <a href="mailto:${data.email}" style="background-color: #4C9A2A; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reply to ${data.fullName} &rarr;</a>
              </div>
            </td>
          </tr>
        </table>
      </div>`;
    }

    function getClientEmailHtml(data) {
      return `
      <div style="background-color: #f5f6f8; padding: 40px 20px; font-family: 'Outfit', sans-serif;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e1e1e3; border-radius: 12px;">
          <tr>
            <td style="background-color: #1e4620; padding: 30px; text-align: center; border-radius: 11px 11px 0 0;">
              <img src="https://www.eparivartan.com/images/logo.svg" alt="parivartan" style="height: 40px;" />
              <div style="color: #f2be22; font-size: 18px; font-weight: 700; margin-top: 15px; text-transform: uppercase;">Enquiry Received</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 35px;">
              <h2 style="color: #1e4620; font-size: 20px;">Thanks for reaching out, ${data.fullName}!</h2>
              <p style="color: #4a4a4a; font-size: 15px; line-height: 1.6;">We have received your enquiry about <strong>${data.service}</strong>. A member of our team will get back to you shortly.</p>
              <table border="0" cellpadding="10" cellspacing="0" width="100%" style="border: 1px solid #e1e1e3; border-radius: 8px;">
                <tr><td width="30%"><strong>Name</strong></td><td>${data.fullName}</td></tr>
                <tr><td><strong>Service</strong></td><td>${data.service}</td></tr>
                <tr><td><strong>Message</strong></td><td>${data.message.replace(/\n/g, '<br/>')}</td></tr>
              </table>
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://eparivartan.com" style="background-color: #4C9A2A; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Visit eParivartan &rarr;</a>
              </div>
            </td>
          </tr>
        </table>
      </div>`;
    }
  }
});
