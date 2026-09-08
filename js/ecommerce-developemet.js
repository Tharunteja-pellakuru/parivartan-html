/**
 * E-commerce Development Page Scripts - eParivartan
 * Smooth anchor scrolling, active nav highlights, and interactive hooks
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Smooth Anchor Navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // 2. Active Dropdown / Drawer Submenu Highlight
  const currentPath = window.location.pathname.split('/').pop();
  document.querySelectorAll('.dropdown-item, .drawer-submenu-item').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && (href.includes('ecommerce-developemet.html') || href.includes('ecommerce-development.html'))) {
      link.classList.add('active');
    }
  });

  // 3. Subtle Card Hover Micro-tilt on Desktop
  const platformCards = document.querySelectorAll('.ecommerce-platform-card');
  platformCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease';
    });
  });

  // 4. Hero Showcase Grow-on-Scroll Animation
  const heroShowcase = document.querySelector('.ecommerce-showcase-wrapper');
  if (heroShowcase) {
    const showcaseObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            heroShowcase.classList.add('is-visible');
            showcaseObserver.unobserve(heroShowcase);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
      }
    );
    showcaseObserver.observe(heroShowcase);
  }
});
