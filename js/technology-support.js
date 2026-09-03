/**
 * Technology Support Page Scripts - eParivartan
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
    if (href && href.includes('technology-support.html')) {
      link.classList.add('active');
    }
  });

  // 3. Subtle Card Hover Micro-tilt on Desktop
  const cards = document.querySelectorAll('.tech-card, .tech-model-card');
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease';
    });
  });
});
