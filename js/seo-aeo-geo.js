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
        title: 'A customer asks a question.',
        html: `
          <div class="evolution-step-1">
            <div class="evolution-search-input-pill">
              <svg class="evolution-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <defs>
                  <linearGradient id="searchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#3B82F6"/>
                    <stop offset="100%" stop-color="#8B5CF6"/>
                  </linearGradient>
                </defs>
                <circle cx="10.5" cy="10.5" r="7" stroke="url(#searchGrad)" stroke-width="2.6"/>
                <path d="M16 16L21 21" stroke="url(#searchGrad)" stroke-width="2.6" stroke-linecap="round"/>
              </svg>
              <span class="evolution-search-query">best enterprise web platform company</span>
            </div>
            <p class="evolution-search-caption">A customer asks. Where does your business show up?</p>
          </div>
        `
      },
      {
        num: '02',
        title: 'SEO: your page climbs the results.',
        html: `
          <div class="evolution-step-2">
            <div class="evolution-pill pill-promoted">
              <div class="pill-left">
                <span class="pill-check-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                <span class="pill-label">Your website</span>
              </div>
              <div class="pill-right">
                <span class="pill-climb-icon" title="Rank climbing">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3L6 9.5H9.5V16H14.5V9.5H18L12 3Z" fill="white"/>
                    <rect x="6" y="19" width="12" height="2.2" rx="1.1" fill="white"/>
                  </svg>
                </span>
              </div>
            </div>

            <div class="evolution-pill pill-competitor">
              <span class="pill-radio-indicator"></span>
              <span class="pill-label">Competitor A</span>
            </div>

            <div class="evolution-pill pill-competitor">
              <span class="pill-radio-indicator"></span>
              <span class="pill-label">Directory listing</span>
            </div>

            <div class="evolution-pill pill-competitor">
              <span class="pill-radio-indicator"></span>
              <span class="pill-label">Competitor B</span>
            </div>
          </div>
        `
      },
      {
        num: '03',
        title: 'AEO: your content becomes the answer.',
        html: `
          <div class="evolution-step-3">
            <div class="evolution-answer-box">
              <span class="evolution-answer-badge">DIRECT ANSWER</span>
              <h3 class="evolution-answer-title">Modular frontend and API layers, structured data and fast, reliable performance.</h3>
              <div class="evolution-answer-tags-row">
                <span class="evolution-green-tag">FAQPage</span>
                <span class="evolution-green-tag">Organization</span>
                <span class="evolution-green-tag">Service</span>
              </div>
            </div>
          </div>
        `
      },
      {
        num: '04',
        title: 'GEO: AI recommends and cites you.',
        html: `
          <div class="evolution-step-4">
            <div class="evolution-ai-prompt">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" fill="#6366F1"/>
              </svg>
              <span>Recommend companies for enterprise UI/UX.</span>
            </div>

            <div class="evolution-ai-response">
              <p class="evolution-ai-response-text">
                For enterprise platforms and design, consider <span class="evolution-brand-chip">Your Brand.</span>
              </p>
              <div class="evolution-ai-citations">
                <span>[1] Website</span>
                <span>[2] Case studies</span>
                <span>[3] Portfolio</span>
              </div>
            </div>
          </div>
        `
      },
      {
        num: '05',
        title: 'Measure what matters: found, answered, recommended.',
        html: `
          <div class="evolution-step-5">
            <div class="evolution-kpi-card">
              <h3 class="evolution-kpi-title">SEO</h3>
              <p class="evolution-kpi-desc">Impressions and clicks</p>
              <div class="evolution-kpi-graph">
                <svg width="130" height="42" viewBox="0 0 130 42" fill="none">
                  <path d="M4 34C22 34 32 20 52 26C72 32 88 10 122 8" stroke="#059669" stroke-width="2.6" stroke-linecap="round"/>
                  <path d="M112 8H122V18" stroke="#059669" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>

            <div class="evolution-kpi-card">
              <h3 class="evolution-kpi-title">AEO</h3>
              <p class="evolution-kpi-desc">Answers and snippets</p>
              <div class="evolution-kpi-graph">
                <svg width="130" height="42" viewBox="0 0 130 42" fill="none">
                  <path d="M4 34C22 34 32 20 52 26C72 32 88 10 122 8" stroke="#059669" stroke-width="2.6" stroke-linecap="round"/>
                  <path d="M112 8H122V18" stroke="#059669" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>

            <div class="evolution-kpi-card">
              <h3 class="evolution-kpi-title">GEO</h3>
              <p class="evolution-kpi-desc">AI mentions and citations</p>
              <div class="evolution-kpi-graph">
                <svg width="130" height="42" viewBox="0 0 130 42" fill="none">
                  <path d="M4 34C22 34 32 20 52 26C72 32 88 10 122 8" stroke="#059669" stroke-width="2.6" stroke-linecap="round"/>
                  <path d="M112 8H122V18" stroke="#059669" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        `
      }
    ];

    let currentStepIndex = 0; // Default to Step 01 (matches Screenshot 1)

    function renderStep(index) {
      const step = evolutionSteps[index];
      if (!step) return;

      // Update button visibility (hide prev on Step 01)
      if (evolutionPrevBtn) {
        if (index === 0) {
          evolutionPrevBtn.style.visibility = 'hidden';
          evolutionPrevBtn.style.pointerEvents = 'none';
        } else {
          evolutionPrevBtn.style.visibility = 'visible';
          evolutionPrevBtn.style.pointerEvents = 'auto';
        }
      }

      // Animate transition
      evolutionPillStack.style.opacity = '0';
      evolutionPillStack.style.transform = 'translateY(6px)';

      setTimeout(() => {
        // Update text
        evolutionStepNum.textContent = step.num;
        evolutionStepTitle.textContent = step.title;

        // Render step HTML
        evolutionPillStack.innerHTML = step.html;

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
        if (currentStepIndex > 0) {
          currentStepIndex--;
          renderStep(currentStepIndex);
        }
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

    // Initialize Step 01
    renderStep(0);
  }
  }
});
