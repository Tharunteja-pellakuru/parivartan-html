/**
 * SEO, AEO & GEO Service Page Scripts - eParivartan
 * Smooth anchor scrolling and interactive features
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

  // ==================== Evolution of Discovery Interactive Carousel ====================
  const evolutionPrevBtn = document.getElementById('evolutionPrevBtn');
  const evolutionNextBtn = document.getElementById('evolutionNextBtn');
  const evolutionPillStack = document.getElementById('evolutionPillStack');
  const evolutionStepNum = document.getElementById('evolutionStepNum');
  const evolutionStepTitle = document.getElementById('evolutionStepTitle');
  const evolutionProgressBar = document.getElementById('evolutionProgressBar');

  if (evolutionPillStack && evolutionStepNum && evolutionStepTitle) {
    const evolutionSteps = [
      {
        num: '01',
        title: 'Traditional indexing: your site competes on basic keywords.',
        pills: [
          { label: 'Competitor A', type: 'competitor' },
          { label: 'Directory listing', type: 'competitor' },
          { label: 'Competitor B', type: 'competitor' },
          { label: 'Your website (Page 2+)', type: 'competitor' }
        ]
      },
      {
        num: '02',
        title: 'SEO: your page climbs the results.',
        pills: [
          { label: 'Your website', type: 'promoted', icon: 'climb' },
          { label: 'Competitor A', type: 'competitor' },
          { label: 'Directory listing', type: 'competitor' },
          { label: 'Competitor B', type: 'competitor' }
        ]
      },
      {
        num: '03',
        title: 'AEO: answer engines highlight your entity directly.',
        pills: [
          { label: 'Your website: Featured Snippet Answer', type: 'promoted', icon: 'climb' },
          { label: 'Organic search result 1', type: 'competitor' },
          { label: 'Organic search result 2', type: 'competitor' },
          { label: 'Competitor B', type: 'competitor' }
        ]
      },
      {
        num: '04',
        title: 'GEO: AI models cite your brand as the primary source.',
        pills: [
          { label: 'Your brand: Cited by ChatGPT, Gemini & Perplexity', type: 'promoted', icon: 'climb' },
          { label: 'Secondary citation source', type: 'competitor' },
          { label: 'Industry directory', type: 'competitor' },
          { label: 'General competitor', type: 'competitor' }
        ]
      },
      {
        num: '05',
        title: 'Unified Discovery: total visibility across Google & AI engines.',
        pills: [
          { label: 'Your website: Omnipresent across Google & AI Answers', type: 'promoted', icon: 'climb' },
          { label: 'Single-channel competitor', type: 'competitor' },
          { label: 'Secondary directory', type: 'competitor' },
          { label: 'Competitor B', type: 'competitor' }
        ]
      }
    ];

    let currentStepIndex = 1; // Default to Step 02 (matching screenshot)

    function renderStep(index) {
      const step = evolutionSteps[index];
      if (!step) return;

      // Animate transition
      evolutionPillStack.style.opacity = '0';
      evolutionPillStack.style.transform = 'translateY(6px)';

      setTimeout(() => {
        // Update text
        evolutionStepNum.textContent = step.num;
        evolutionStepTitle.textContent = step.title;

        // Render pills
        evolutionPillStack.innerHTML = step.pills.map((pill) => {
          if (pill.type === 'promoted') {
            return `
              <div class="evolution-pill pill-promoted">
                <div class="pill-left">
                  <span class="pill-check-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                  <span class="pill-label">${pill.label}</span>
                </div>
                <div class="pill-right">
                  <span class="pill-climb-icon" title="Rank climbing">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 4L6 10h4v6h4v-6h4z" fill="white" stroke="none"/>
                      <line x1="6" y1="20" x2="18" y2="20" stroke="white" stroke-width="2.2"/>
                    </svg>
                  </span>
                </div>
              </div>
            `;
          } else {
            return `
              <div class="evolution-pill pill-competitor">
                <span class="pill-radio-indicator"></span>
                <span class="pill-label">${pill.label}</span>
              </div>
            `;
          }
        }).join('');

        // Update progress bar segments
        if (evolutionProgressBar) {
          const segments = evolutionProgressBar.querySelectorAll('.evolution-progress-segment');
          segments.forEach((seg, sIdx) => {
            if (sIdx <= index) {
              seg.classList.add('active');
            } else {
              seg.classList.remove('active');
            }
          });
        }

        evolutionPillStack.style.opacity = '1';
        evolutionPillStack.style.transform = 'translateY(0)';
      }, 160);
    }

    if (evolutionPrevBtn) {
      evolutionPrevBtn.addEventListener('click', () => {
        currentStepIndex = (currentStepIndex - 1 + evolutionSteps.length) % evolutionSteps.length;
        renderStep(currentStepIndex);
      });
    }

    if (evolutionNextBtn) {
      evolutionNextBtn.addEventListener('click', () => {
        currentStepIndex = (currentStepIndex + 1) % evolutionSteps.length;
        renderStep(currentStepIndex);
      });
    }

    if (evolutionProgressBar) {
      evolutionProgressBar.querySelectorAll('.evolution-progress-segment').forEach((seg) => {
        seg.addEventListener('click', () => {
          const targetIndex = parseInt(seg.getAttribute('data-index'), 10);
          if (!isNaN(targetIndex)) {
            currentStepIndex = targetIndex;
            renderStep(currentStepIndex);
          }
        });
      });
    }
  }
});
