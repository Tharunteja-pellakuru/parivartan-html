/**
 * UI/UX Design Page Scripts - eParivartan
 * Handles FAQ accordion interactions and scroll animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. FAQ Accordion Interaction ---
  const faqItems = document.querySelectorAll('.uiux-faq-item');
  
  faqItems.forEach((item) => {
    const trigger = item.querySelector('.uiux-faq-trigger');
    const content = item.querySelector('.uiux-faq-content');
    
    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other items for clean accordion behavior
        faqItems.forEach((otherItem) => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const otherContent = otherItem.querySelector('.uiux-faq-content');
            if (otherContent) {
              otherContent.style.maxHeight = null;
            }
          }
        });
        
        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          content.style.maxHeight = null;
        } else {
          item.classList.add('active');
          content.style.maxHeight = `${content.scrollHeight + 32}px`;
        }
      });
    }
  });

  // Open first FAQ item by default
  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    const firstContent = firstItem.querySelector('.uiux-faq-content');
    firstItem.classList.add('active');
    if (firstContent) {
      firstContent.style.maxHeight = `${firstContent.scrollHeight + 32}px`;
    }
  }

  // --- 2. GSAP Scroll Animations if available ---
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Stagger platform cards
    const platformCards = document.querySelectorAll('.uiux-platform-card');
    if (platformCards.length > 0) {
      gsap.from(platformCards, {
        scrollTrigger: {
          trigger: '.uiux-platforms-grid',
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        duration: 0.7,
        y: 30,
        opacity: 0,
        stagger: 0.1,
        ease: 'power2.out'
      });
    }

    // Stagger process cards
    const processCards = document.querySelectorAll('.uiux-process-card');
    if (processCards.length > 0) {
      gsap.from(processCards, {
        scrollTrigger: {
          trigger: '.uiux-process-grid',
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        duration: 0.7,
        y: 25,
        opacity: 0,
        stagger: 0.08,
        ease: 'power2.out'
      });
    }

    // Fade in compare cards
    const compareCards = document.querySelectorAll('.uiux-compare-card');
    if (compareCards.length > 0) {
      gsap.from(compareCards, {
        scrollTrigger: {
          trigger: '.uiux-compare-grid',
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        duration: 0.8,
        y: 30,
        opacity: 0,
        stagger: 0.15,
        ease: 'power2.out'
      });
    }
  }
});
