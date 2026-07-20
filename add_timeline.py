import re

html_content = """
  <!-- ==================== TIMELINE ==================== -->
  <section class="timeline-section" id="timeline">
    <div class="timeline-container">
      
      <!-- Section Header -->
      <div class="timeline-header">
        <div class="timeline-tagline">
          <svg width="8" height="12" viewBox="0 0 10 14" fill="none" style="opacity: 0.35">
            <circle cx="2" cy="2" r="1.2" fill="#69686E" />
            <circle cx="5" cy="4.5" r="1.2" fill="#69686E" />
            <circle cx="8" cy="7" r="1.2" fill="#69686E" />
            <circle cx="5" cy="9.5" r="1.2" fill="#69686E" />
            <circle cx="2" cy="12" r="1.2" fill="#69686E" />
          </svg>
          <span>OUR JOURNEY</span>
          <svg width="8" height="12" viewBox="0 0 10 14" fill="none" style="opacity: 0.35">
            <circle cx="8" cy="2" r="1.2" fill="#69686E" />
            <circle cx="5" cy="4.5" r="1.2" fill="#69686E" />
            <circle cx="2" cy="7" r="1.2" fill="#69686E" />
            <circle cx="5" cy="9.5" r="1.2" fill="#69686E" />
            <circle cx="8" cy="12" r="1.2" fill="#69686E" />
          </svg>
        </div>
        <h2 class="timeline-main-heading">
          A History of Growth and Trust
        </h2>
      </div>

      <!-- Timeline Wrapper -->
      <div class="timeline-wrapper">
        <div class="timeline-center-line"></div>

        <div class="timeline-item">
          <div class="timeline-year-box">2002</div>
          <div class="timeline-dot"></div>
          <div class="timeline-content-card">
            <h3 class="timeline-title">It began at home.</h3>
            <p class="timeline-desc">Parivartan began in a dining hall with curiosity, ambition, and the belief that good work speaks louder than big setups.</p>
          </div>
        </div>

        <div class="timeline-item right">
          <div class="timeline-year-box">2006</div>
          <div class="timeline-dot"></div>
          <div class="timeline-content-card">
            <h3 class="timeline-title">First shared office space.</h3>
            <p class="timeline-desc">A small but significant step toward becoming a real, growing team.</p>
          </div>
        </div>

        <div class="timeline-item">
          <div class="timeline-year-box">2007</div>
          <div class="timeline-dot"></div>
          <div class="timeline-content-card">
            <h3 class="timeline-title">Application development takes shape.</h3>
            <p class="timeline-desc">The foundations of our technology and software capabilities were laid.</p>
          </div>
        </div>

        <div class="timeline-item right">
          <div class="timeline-year-box">2008</div>
          <div class="timeline-dot"></div>
          <div class="timeline-content-card">
            <h3 class="timeline-title">First government project.</h3>
            <p class="timeline-desc">A milestone that brought responsibility, scale, and long-term trust.</p>
          </div>
        </div>

        <div class="timeline-item">
          <div class="timeline-year-box">2012</div>
          <div class="timeline-dot"></div>
          <div class="timeline-content-card">
            <h3 class="timeline-title">A defining year of growth.</h3>
            <p class="timeline-desc">Major client wins across healthcare and enterprise sectors, including Care Hospitals, Green Gold, Makuta, and ARCI. This year also marked the completion of our first decade of work.</p>
          </div>
        </div>

        <div class="timeline-item right">
          <div class="timeline-year-box">2014</div>
          <div class="timeline-dot"></div>
          <div class="timeline-content-card">
            <h3 class="timeline-title">3,000+ projects delivered.</h3>
            <p class="timeline-desc">Consistency, partnerships, and repeat trust became our biggest validation.</p>
          </div>
        </div>

        <div class="timeline-item">
          <div class="timeline-year-box">2018</div>
          <div class="timeline-dot"></div>
          <div class="timeline-content-card">
            <h3 class="timeline-title">The digital shift begins.</h3>
            <p class="timeline-desc">We expanded strongly into digital-first thinking, platforms, and experiences.</p>
          </div>
        </div>

        <div class="timeline-item right">
          <div class="timeline-year-box">2020</div>
          <div class="timeline-dot"></div>
          <div class="timeline-content-card">
            <h3 class="timeline-title">Work didn’t stop; it adapted. (The work from home era began)</h3>
            <p class="timeline-desc">The team transitioned seamlessly to working from home, staying connected and committed.</p>
          </div>
        </div>

        <div class="timeline-item">
          <div class="timeline-year-box">2022</div>
          <div class="timeline-dot"></div>
          <div class="timeline-content-card">
            <h3 class="timeline-title">Two decades of Parivartan.</h3>
            <p class="timeline-desc">Twenty years of evolving with technology, clients, and ideas.</p>
          </div>
        </div>

        <div class="timeline-item right">
          <div class="timeline-year-box">2023</div>
          <div class="timeline-dot"></div>
          <div class="timeline-content-card">
            <h3 class="timeline-title">Recognising excellence and expanding capabilities.</h3>
            <p class="timeline-desc">The Parivartan Excellence Awards were launched, and our mobile app development team was formed.</p>
          </div>
        </div>

        <div class="timeline-item">
          <div class="timeline-year-box">2024</div>
          <div class="timeline-dot"></div>
          <div class="timeline-content-card">
            <h3 class="timeline-title">5,000+ projects completed.</h3>
            <p class="timeline-desc">A reflection of sustained effort, long-term relationships, and trust earned over time.</p>
          </div>
        </div>

        <div class="timeline-item right">
          <div class="timeline-year-box">2025</div>
          <div class="timeline-dot"></div>
          <div class="timeline-content-card">
            <h3 class="timeline-title">Still growing and still building.</h3>
            <p class="timeline-desc">Parivartan continues to evolve, with national-level visibility including work associated with the ESTIC Conference, and many new chapters ahead.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
"""

css_content = """
/* ==================== TIMELINE SECTION ==================== */
.timeline-section {
  padding: 120px 48px;
  background: #FFFFFF;
  position: relative;
  overflow: hidden;
}

.timeline-container {
  max-width: 1320px;
  margin: 0 auto;
  position: relative;
}

.timeline-header {
  text-align: center;
  margin-bottom: 80px;
}

.timeline-tagline {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: #F8F8F8;
  padding: 8px 16px;
  border-radius: 40px;
  margin-bottom: 24px;
}

.timeline-tagline span {
  color: #69686E;
  font-family: Satoshi, 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.timeline-main-heading {
  color: #060612;
  font-family: Satoshi, 'Inter', sans-serif;
  font-size: 52px;
  font-weight: 500;
  line-height: 62px;
  margin: 0;
  max-width: 700px;
  margin: 0 auto;
}

.timeline-wrapper {
  position: relative;
  width: 100%;
  padding: 40px 0;
}

.timeline-center-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  background: #EAEAEA;
  transform: translateX(-50%);
}

.timeline-item {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 50%;
  padding-right: 60px;
  position: relative;
  margin-bottom: 60px;
  box-sizing: border-box;
}

.timeline-item.right {
  align-self: flex-end;
  justify-content: flex-start;
  margin-left: 50%;
  padding-right: 0;
  padding-left: 60px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-dot {
  position: absolute;
  right: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background: #FFFFFF;
  border: 3px solid #85BD56;
  border-radius: 50%;
  z-index: 2;
}

.timeline-item.right .timeline-dot {
  right: auto;
  left: -8px;
}

.timeline-year-box {
  position: absolute;
  right: -140px;
  top: 50%;
  transform: translateY(-50%);
  color: #85BD56;
  font-family: 'Eras Md BT', 'Outfit', sans-serif;
  font-size: 32px;
  font-weight: 700;
  opacity: 0.8;
}

.timeline-item.right .timeline-year-box {
  right: auto;
  left: -140px;
}

.timeline-content-card {
  background: #FAFAFA;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  text-align: left;
  position: relative;
  border: 1px solid #F0F0F0;
  max-width: 480px;
  width: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.timeline-content-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.05);
  border-color: #E0E0E0;
}

.timeline-title {
  color: #060612;
  font-family: Satoshi, 'Inter', sans-serif;
  font-size: 22px;
  font-weight: 600;
  line-height: 32px;
  margin: 0 0 12px 0;
}

.timeline-desc {
  color: #69686E;
  font-family: Satoshi, 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
  margin: 0;
}

@media (max-width: 992px) {
  .timeline-section {
    padding: 80px 24px;
  }
  
  .timeline-main-heading {
    font-size: 38px;
    line-height: 48px;
  }

  .timeline-center-line {
    left: 20px;
  }

  .timeline-item {
    width: 100%;
    padding-left: 60px;
    padding-right: 0;
    justify-content: flex-start;
  }
  
  .timeline-item.right {
    margin-left: 0;
  }

  .timeline-dot, .timeline-item.right .timeline-dot {
    left: 12px;
    right: auto;
  }
  
  .timeline-year-box, .timeline-item.right .timeline-year-box {
    position: relative;
    right: auto;
    left: auto;
    top: auto;
    transform: none;
    display: inline-block;
    margin-bottom: 16px;
    font-size: 24px;
  }
  
  .timeline-content-card {
    max-width: 100%;
    padding: 32px 24px;
  }
}
"""

with open("story.html", "r") as f:
    html = f.read()

# Insert before TESTIMONIALS
html = html.replace("<!-- ==================== TESTIMONIALS ==================== -->", html_content + "\n<!-- ==================== TESTIMONIALS ==================== -->")

with open("story.html", "w") as f:
    f.write(html)

with open("css/story.css", "a") as f:
    f.write(css_content)

print("Timeline added successfully.")
