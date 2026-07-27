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
});
