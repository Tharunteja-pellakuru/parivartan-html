/**
 * Custom Applications Page Scripts - eParivartan
 * Smooth anchor scrolling, interactive UI hooks, and page initialization
 */

document.addEventListener('DOMContentLoaded', () => {
  // Smooth Anchor Navigation
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

  // Active link indicator
  const currentPath = window.location.pathname.split('/').pop();
  document.querySelectorAll('.dropdown-item, .drawer-submenu-item').forEach((link) => {
    if (link.getAttribute('href') && link.getAttribute('href').includes('custom-applications.html')) {
      link.classList.add('active');
    }
  });

  // Process Evolution interactive step switching
  const stepCards = document.querySelectorAll('.evolution-step-card');
  const previewTitle = document.getElementById('evolution-active-title');
  const previewCaption = document.getElementById('evolution-active-caption');

  if (stepCards.length > 0) {
    stepCards.forEach((card) => {
      card.addEventListener('click', function () {
        stepCards.forEach((c) => c.classList.remove('is-active'));
        this.classList.add('is-active');

        const title = this.getAttribute('data-title');
        const caption = this.getAttribute('data-caption');

        if (previewTitle && title) {
          previewTitle.textContent = title;
        }
        if (previewCaption && caption) {
          previewCaption.textContent = caption;
        }
      });
    });
  }
});
