/* ===== BLOG DETAILS PAGE JS ===== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- GSAP Scroll Animations ----
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Fade-in header elements
    gsap.from('.bd-tagline', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
    });

    gsap.from('.bd-title', {
      y: 30,
      opacity: 0,
      duration: 0.7,
      delay: 0.15,
      ease: 'power2.out',
    });

    gsap.from('.bd-subtitle', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.25,
      ease: 'power2.out',
    });

    gsap.from('.bd-meta-row', {
      y: 15,
      opacity: 0,
      duration: 0.5,
      delay: 0.35,
      ease: 'power2.out',
    });

    gsap.from('.bd-hero-image', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      delay: 0.4,
      ease: 'power2.out',
    });

    // Article sections fade-in on scroll
    document.querySelectorAll('.bd-body .bd-section').forEach((section) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      });
    });

    // Split images animate in
    document.querySelectorAll('.bd-split-images').forEach((row) => {
      gsap.from(row.children, {
        scrollTrigger: {
          trigger: row,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
      });
    });

    // CTA section
    gsap.from('.cta-outer-box', {
      scrollTrigger: {
        trigger: '.cta-section',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
    });

    // Related blogs cards
    gsap.from('.blog-card', {
      scrollTrigger: {
        trigger: '.blogs-grid',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power2.out',
    });
  }

  /* ===== Sticky Sections Menu (TOC) Scroll-Spy & Smooth Navigation ===== */
  function initTocScrollSpy() {
    const toc = document.querySelector('.toc');
    if (!toc) return;
    const links = Array.from(toc.querySelectorAll('a'));
    const headings = Array.from(document.querySelectorAll('.article-body [id]'));

    if (!links.length || !headings.length) return;

    let isClickScrolling = false;
    let scrollTimeout = null;

    function setActiveLink(activeId) {
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#' + activeId) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }

    // 1. Click Navigation: immediate active state & smooth scroll with header offset
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        // Update active state immediately on click
        setActiveLink(target.id);

        isClickScrolling = true;
        clearTimeout(scrollTimeout);

        // Header height + padding offset (leaves clear view below sticky header)
        const header = document.querySelector('header.header-container');
        const headerHeight = header ? header.offsetHeight : 96;
        const offset = headerHeight + 24;

        const targetTop = target.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });

        // Update URL hash cleanly without jumping
        if (window.history && window.history.pushState) {
          window.history.pushState(null, null, href);
        }

        // Allow scroll listener to resume after smooth scroll settles
        scrollTimeout = setTimeout(() => {
          isClickScrolling = false;
        }, 800);
      });
    });

    // 2. Scroll-Spy: detect which section is currently in view
    function onScroll() {
      if (isClickScrolling) return;

      const header = document.querySelector('header.header-container');
      const headerHeight = header ? header.offsetHeight : 96;
      const threshold = headerHeight + 60;

      // Check if scrolled near the bottom of the article
      const article = document.querySelector('.article-card') || document.querySelector('article');
      if (article) {
        const articleRect = article.getBoundingClientRect();
        if (articleRect.bottom <= window.innerHeight) {
          setActiveLink(headings[headings.length - 1].id);
          return;
        }
      }

      // Find the last heading whose top has reached or passed the threshold
      let currentId = headings[0].id;
      for (let i = 0; i < headings.length; i++) {
        const rect = headings[i].getBoundingClientRect();
        if (rect.top <= threshold) {
          currentId = headings[i].id;
        } else {
          break;
        }
      }

      setActiveLink(currentId);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // Run on initial load
    onScroll();
  }

  initTocScrollSpy();
});
