import re

html_file = "/Users/tharunteja/Desktop/Working/parivartan-html/index.html"

with open(html_file, 'r') as f:
    content = f.read()

# Current footer-service-list block is from lines 2142 to 2240
# We will just replace it using regex.

new_quick_links = """          <ul class="footer-service-list">
            <!-- 1. Home -->
            <li class="footer-service-item">
              <div class="service-icon-box">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#599632" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4H9v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
                </svg>
              </div>
              <a href="./index.html">Home</a>
            </li>

            <!-- 2. What We Build -->
            <li class="footer-service-item footer-group">
              <div class="footer-group-header">
                <div class="footer-group-title-wrapper">
                  <div class="service-icon-box">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#599632" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                      <polyline points="2 17 12 22 22 17"/>
                      <polyline points="2 12 12 17 22 12"/>
                    </svg>
                  </div>
                  <span>What We Build</span>
                </div>
               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#75BF46" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="footer-chevron">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
              <ul class="footer-sublist">
                <li><a href="./index.html">UI/UX Design</a></li>
                <li><a href="./work-websites.html">Web Development</a></li>
                <li><a href="./work-webapps.html">Custom Applications</a></li>
                <li><a href="./app-development.html">Mobile App Development</a></li>
                <li><a href="./work-ecommerce.html">E-commerce Development</a></li>
              </ul>
            </li>

            <!-- 3. Search & AI Visibility -->
            <li class="footer-service-item footer-group">
              <div class="footer-group-header">
                <div class="footer-group-title-wrapper">
                  <div class="service-icon-box">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#599632" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                  </div>
                  <span>Search & AI Visibility</span>
                </div>
               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#75BF46" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="footer-chevron">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
              <ul class="footer-sublist">
                <li><a href="./index.html">SEO</a></li>
                <li><a href="./index.html">AEO</a></li>
                <li><a href="./index.html">GEO</a></li>
                <li><a href="./index.html">AI Search Visibility</a></li>
              </ul>
            </li>

            <!-- 4. Our Work -->
            <li class="footer-service-item footer-group">
              <div class="footer-group-header">
                <div class="footer-group-title-wrapper">
                  <div class="service-icon-box">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#599632" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M9 7V5.5C9 4.67 9.67 4 10.5 4h3c.83 0 1.5.67 1.5 1.5V7"/>
                      <rect x="3.5" y="7" width="17" height="12" rx="2.2"/>
                      <path d="M3.5 12.5h17M10.5 12.5v1.6h3v-1.6"/>
                    </svg>
                  </div>
                  <span>Our Work</span>
                </div>
               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#75BF46" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="footer-chevron">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
              <ul class="footer-sublist">
                <li><a href="./work-websites.html">Websites</a></li>
                <li><a href="./work-webapps.html">Custom Applications</a></li>
                <li><a href="./app-development.html">Mobile Apps</a></li>
                <li><a href="./work-ecommerce.html">E-commerce</a></li>
              </ul>
            </li>

            <!-- 5. About Parivartan -->
            <li class="footer-service-item footer-group">
              <div class="footer-group-header">
                <div class="footer-group-title-wrapper">
                  <div class="service-icon-box">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#599632" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 20.5s-7.2-4.4-9.6-8.9C.9 8.3 2.6 4.9 5.9 4.4c2-.3 4 .6 5 2.2 1-1.6 3-2.5 5-2.2 3.3.5 5 3.9 3.5 7.2-2.4 4.5-9.6 8.9-9.6 8.9Z"/>
                    </svg>
                  </div>
                  <span>About Parivartan</span>
                </div>
               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#75BF46" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="footer-chevron">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
              <ul class="footer-sublist">
                <li><a href="./story.html">Our Story</a></li>
                <li><a href="./clients.html">Our Clients</a></li>
                <li><a href="./life.html">Life at Parivartan</a></li>
              </ul>
            </li>

            <!-- 6. Insights -->
            <li class="footer-service-item footer-group">
              <div class="footer-group-header">
                <div class="footer-group-title-wrapper">
                  <div class="service-icon-box">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#599632" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                  </div>
                  <span>Insights</span>
                </div>
               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#75BF46" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="footer-chevron">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
              <ul class="footer-sublist">
                <li><a href="./blogs.html">Articles / Insights</a></li>
                <li><a href="./founders-in-frame.html">Founders in Frame</a></li>
              </ul>
            </li>

            <!-- 7. Recognition -->
            <li class="footer-service-item footer-group">
              <div class="footer-group-header">
                <div class="footer-group-title-wrapper">
                  <div class="service-icon-box">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#599632" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="8" r="7"/>
                      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
                    </svg>
                  </div>
                  <span>Recognition</span>
                </div>
               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#75BF46" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="footer-chevron">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
              <ul class="footer-sublist">
                <li><a href="./media.html">Media Features</a></li>
                <li><a href="./awards.html">Parivartan Excellence Awards</a></li>
              </ul>
            </li>

            <!-- 8. Contact -->
            <li class="footer-service-item">
              <div class="service-icon-box">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#599632" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 3.5h2.7l1.3 3.8-1.9 1.6c.9 2.1 2.5 3.7 4.6 4.6l1.6-1.9 3.8 1.3V16c0 1.66-1.34 3-3 3C9.4 19 5 14.6 5 9c0-1.66 1.34-3 3-3H6z"/>
                </svg>
              </div>
              <a href="./contact.html">Contact</a>
            </li>
          </ul>"""

pattern = re.compile(r'          <ul class="footer-service-list">.*?</ul>\n        </div>\n\n        <!-- Column 3: Services -->', re.DOTALL)
new_content = pattern.sub(new_quick_links + '\n        </div>\n\n        <!-- Column 3: Services -->', content)

with open(html_file, 'w') as f:
    f.write(new_content)

print("Done")
