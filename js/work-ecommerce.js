document.addEventListener('DOMContentLoaded', () => {
  const previewButtons = document.querySelectorAll('.preview-btn');
  const modal = document.getElementById('ecommerce-preview-modal');
  const previewDomain = document.getElementById('preview-domain');
  const previewOpenLink = document.getElementById('preview-open-link');
  const previewImage = document.getElementById('preview-image');
  const closeBtn = document.getElementById('preview-close-btn');

  function openModal(button) {
    const domain = button.getAttribute('data-domain');
    const url = button.getAttribute('data-url');
    const screenshot = button.getAttribute('data-screenshot');

    previewDomain.textContent = domain;
    previewOpenLink.href = url;
    previewImage.src = screenshot;
    previewImage.alt = domain + " preview";

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  previewButtons.forEach(btn => {
    btn.addEventListener('click', () => openModal(btn));
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Close on clicking outside the modal window
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
      closeModal();
    }
  });

  // Initialize GSAP scroll animations if ScrollTrigger is available
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate cards on scroll
    gsap.utils.toArray('.ecommerce-project-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });
    });
  }
});
