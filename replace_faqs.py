import re

html_file = "/Users/tharunteja/Desktop/Working/parivartan-html/index.html"

with open(html_file, 'r') as f:
    content = f.read()

faqs = [
    {"q": "What technology services does eParivartan provide?", "a": "eParivartan provides UI/UX design, corporate and enterprise website development, e-commerce development, custom web applications, enterprise applications, mobile app development, CMS development, API integrations, technical SEO, AEO and GEO services. We also provide ongoing technology support and maintenance for digital services."},
    {"q": "Does eParivartan develop custom software and enterprise applications?", "a": "Yes. We design and develop custom software based on specific business processes and requirements. This includes business portals, dashboards, workflow systems, management platforms, custom CMS solutions, APIs, integrations and other web-based enterprise applications."},
    {"q": "Does eParivartan develop corporate, enterprise and government websites?", "a": "Yes. eParivartan has experience designing and developing websites and web and mobile platforms for businesses, institutions and government organisations. Our work includes corporate websites, government portals, institutional websites, multilingual platforms, conference websites and complex content-driven digital systems."},
    {"q": "Can eParivartan redesign or modernise an existing website or application?", "a": "Yes. We can evaluate an existing website or application and redesign its user experience, interface, technology architecture, performance and content structure. Depending on the requirement, we can modernise the platform or rebuild it using a more suitable technology stack."},
    {"q": "Which technologies does eParivartan work with?", "a": "Our technology stack includes React, JavaScript, TypeScript, PHP, Python, Flutter, WordPress, Shopify, MySQL, PostgreSQL, MongoDB and other modern frameworks, databases and development tools. We select the technology stack based on each project's requirements, scalability, security, and long-term maintainability."},
    {"q": "Do you work with international clients?", "a": "Yes. eParivartan works with clients in India and international markets, with technology solutions delivered to businesses and organisations across 20+ countries. Our team can manage projects remotely across several locations and time zones, from discovery and design through development, deployment and ongoing support."},
    {"q": "What are AEO and GEO, and why do businesses need them?", "a": "AEO (Answer Engine Optimisation) helps structure your website and content so search and answer engines can understand your business clearly and use your information to answer user questions.<br><br>GEO (Generative Engine Optimisation) focuses on improving how AI-powered platforms such as ChatGPT, Gemini, Perplexity, and other generative search experiences understand and discover your brand, expertise, and content.<br><br>Traditional SEO helps businesses become visible in search engines. AEO and GEO extend that visibility into the growing world of AI-powered search and answers."},
    {"q": "Do you provide SEO along with website development?", "a": "Yes. We build websites with search visibility in mind from the beginning, including technical SEO, site architecture, performance, structured data and content structure. We also provide ongoing SEO, AEO and GEO services to improve visibility across traditional search engines and emerging AI-powered discovery platforms."},
    {"q": "Do you provide ongoing support after a website or application is launched?", "a": "Yes. We provide ongoing maintenance and technology support for websites, applications and digital platforms. Depending on the project, this can include hosting support, security updates, backups, performance monitoring, technical maintenance, enhancements and ongoing development."},
    {"q": "Does eParivartan provide social media, digital marketing and branding services?", "a": "Yes. Swipe Social delivers social media management, branding, content creation, creative campaigns, and performance marketing."},
    {"q": "How is eParivartan different from a typical web development company?", "a": "eParivartan combines over two decades of technology experience with design, development and long-term digital support. Rather than approaching every requirement as a standalone website project, we look at the underlying business need and recommend the right combination of user experience, technology, architecture, integrations and ongoing support."}
]

def generate_faq_html(faq, idx):
    hidden_class = ' faq-hidden" style="display: none;"' if idx >= 6 else '"'
    is_open = ' is-open' if idx == 0 else ''
    
    return f'''
            <div class="faq-item-card{is_open}{hidden_class}>
              <div class="faq-question-row">
                <h3 class="faq-question-text">{faq['q']}</h3>
                <button class="faq-toggle-btn" aria-label="Toggle Answer">
                 <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
                    <circle cx="11.5" cy="11.5" r="10" fill="#000" />
                    <path d="M11.5 7V16M7 11.5H16" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
              <div class="faq-answer-row">
                <p class="faq-answer-text">{faq['a']}</p>
              </div>
            </div>'''

left_col = ""
right_col = ""

for i, faq in enumerate(faqs):
    # i is 0-indexed.
    # 0, 2, 4, 6, 8, 10 -> left (1,3,5,7,9,11)
    # 1, 3, 5, 7, 9 -> right (2,4,6,8,10)
    html = generate_faq_html(faq, i)
    if i % 2 == 0:
        left_col += html
    else:
        right_col += html

new_section = f'''  <section class="faqs-section" id="faqs">
    <div class="faqs-container">
      
      <!-- FAQs Header -->
      <div class="faqs-header">
        <div class="faqs-header-left">
          <div class="faqs-tagline">
           <svg width="8" height="12" viewBox="0 0 10 14" fill="none" style="opacity: 0.35">
              <circle cx="2" cy="2" r="1.2" fill="#69686E" />
              <circle cx="5" cy="4.5" r="1.2" fill="#69686E" />
              <circle cx="8" cy="7" r="1.2" fill="#69686E" />
              <circle cx="5" cy="9.5" r="1.2" fill="#69686E" />
              <circle cx="2" cy="12" r="1.2" fill="#69686E" />
            </svg>
            <span>06 — FAQs</span>
           <svg width="8" height="12" viewBox="0 0 10 14" fill="none" style="opacity: 0.35">
              <circle cx="8" cy="2" r="1.2" fill="#69686E" />
              <circle cx="5" cy="4.5" r="1.2" fill="#69686E" />
              <circle cx="2" cy="7" r="1.2" fill="#69686E" />
              <circle cx="5" cy="9.5" r="1.2" fill="#69686E" />
              <circle cx="8" cy="12" r="1.2" fill="#69686E" />
            </svg>
          </div>
          <h2 class="faqs-main-heading">
            What businesses ask us before we start building.
          </h2>
        </div>
        <div class="faqs-header-right">
          <p class="faqs-header-desc">
            From choosing the right technology to understanding custom development, AI search and ongoing support, here are answers to some of the questions businesses ask before working with Parivartan.
          </p>
        </div>
      </div>

      <!-- FAQ Accordion Layout Box -->
      <div class="faqs-outer-card">
        <div class="faqs-inner-grid">
          
          <!-- Column Left -->
          <div class="faqs-column">{left_col}
          </div>

          <!-- Column Right -->
          <div class="faqs-column">{right_col}
          </div>
        </div>
        
        <div class="faqs-view-more" style="text-align: center; margin-top: 40px;">
          <button class="hero-btn" onclick="document.querySelectorAll('.faq-hidden').forEach(el => el.style.display = 'block'); this.style.display='none';">
            View More FAQs
          </button>
        </div>
      </div>
    </div>
  </section>'''

# Replace using regex
pattern = re.compile(r'  <section class="faqs-section" id="faqs">.*?</section>', re.DOTALL)
new_content = pattern.sub(new_section, content)

with open(html_file, 'w') as f:
    f.write(new_content)

print("Done replacing HTML")
