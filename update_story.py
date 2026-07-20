import re

with open('story.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Meta Tags
content = re.sub(r'<title>.*?</title>', '<title>Our Story | Parivartan – Designing Meaningful Change Since 2002</title>', content)
content = re.sub(r'<meta name="description" content=".*?">', '<meta name="description" content="Discover the story behind Parivartan. From a belief in meaningful change to building brands, platforms, and stories that evolve with time. Designing transformation since 2002.">\n  <meta name="keywords" content="Parivartan story, about Parivartan, branding agency story, digital transformation company, creative agency India, brand evolution, corporate branding studio">\n  <meta property="og:description" content="Parivartan is built on one belief: real change cannot be forced - it must be designed. This is our story of transformation, people, and purpose.">', content)

# 2. Build the new body content
new_body = """
  <!-- ==================== ABOUT HERO ==================== -->
  <section class="about-hero-section">
    <div class="about-hero-container">
      <div class="about-hero-tagline">
        <svg width="8" height="12" viewBox="0 0 10 14" fill="none" style="opacity: 0.35"><circle cx="2" cy="2" r="1.2" fill="#69686E" /><circle cx="5" cy="4.5" r="1.2" fill="#69686E" /><circle cx="8" cy="7" r="1.2" fill="#69686E" /><circle cx="5" cy="9.5" r="1.2" fill="#69686E" /><circle cx="2" cy="12" r="1.2" fill="#69686E" /></svg>
        <span>OUR STORY</span>
        <svg width="8" height="12" viewBox="0 0 10 14" fill="none" style="opacity: 0.35"><circle cx="8" cy="2" r="1.2" fill="#69686E" /><circle cx="5" cy="4.5" r="1.2" fill="#69686E" /><circle cx="2" cy="7" r="1.2" fill="#69686E" /><circle cx="5" cy="9.5" r="1.2" fill="#69686E" /><circle cx="8" cy="12" r="1.2" fill="#69686E" /></svg>
      </div>

      <h1 class="about-hero-title">
        Our <span class="green">Story</span>
      </h1>

      <div class="about-hero-card-frame">
        <div class="about-hero-card">
          <div class="about-hero-inner-card">
            <div class="about-hero-card-left">
              <h2 class="about-hero-card-heading" style="font-size: 36px; line-height: 48px;">
                Designing change that lasts.
              </h2>

              <div class="about-hero-card-desc-group">
                <p>Change alone is not the objective. What truly matters is the transformation of how the world sees you, your work, your business, your spirit. <span class="green-highlight">Parivartan</span>, as we call it.</p>
                <p>Over the years, one belief has guided everything we do: Just being different might not be original. But being original ensures being different.</p>
                <p>Trends change. Tools evolve. Platforms come and go. Originality, however, comes from clarity of thought, purpose, and intent.</p>
                <p>At Parivartan, we don’t chase change for the sake of it. We design change that feels natural, thoughtful, and built to last.</p>
              </div>
            </div>

            <div class="about-hero-card-right">
              <div class="about-hero-image" style="background-image: url('./assets/story/about-hero.jpg');" role="img" aria-label="Parivartan Team Group Portrait"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================== OUR STORY ==================== -->
  <section class="about-story-section">
    <div class="about-story-container">
      <div class="about-story-tagline">
        <svg width="8" height="12" viewBox="0 0 10 14" fill="none" style="opacity: 0.35"><circle cx="2" cy="2" r="1.2" fill="#69686E" /><circle cx="5" cy="4.5" r="1.2" fill="#69686E" /><circle cx="8" cy="7" r="1.2" fill="#69686E" /><circle cx="5" cy="9.5" r="1.2" fill="#69686E" /><circle cx="2" cy="12" r="1.2" fill="#69686E" /></svg>
        <span>MEANING</span>
        <svg width="8" height="12" viewBox="0 0 10 14" fill="none" style="opacity: 0.35"><circle cx="8" cy="2" r="1.2" fill="#69686E" /><circle cx="5" cy="4.5" r="1.2" fill="#69686E" /><circle cx="2" cy="7" r="1.2" fill="#69686E" /><circle cx="5" cy="9.5" r="1.2" fill="#69686E" /><circle cx="8" cy="12" r="1.2" fill="#69686E" /></svg>
      </div>

      <h2 class="about-story-heading" style="max-width: 900px; margin: 0 auto 64px auto;">
        What Parivartan Really Means
      </h2>

      <div class="about-story-content-grid" style="grid-template-columns: 1fr;">
        <div class="about-story-grid-right" style="max-width: 800px; margin: 0 auto; text-align: center;">
          <p style="font-size: 18px; line-height: 32px; color: #69686E;">
            Parivartan is a Sanskrit word for change, but not cosmetic change, short-term noise, or forced reinvention. It represents the kind of change you’re ready for, often before you consciously realise it. The kind that allows brands to evolve, grow, and emerge stronger without losing who they are at the core. This is the change we believe in, and this is the change we design.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================== ABOUT LEAF ==================== -->
  <section class="about-leaf-section" style="padding: 100px 0;">
    <div class="about-leaf-container">
      <div class="about-leaf-grid">
        <div class="about-leaf-left">
          <div class="about-story-tagline" style="justify-content: flex-start;">
            <svg width="8" height="12" viewBox="0 0 10 14" fill="none" style="opacity: 0.35"><circle cx="2" cy="2" r="1.2" fill="#69686E" /><circle cx="5" cy="4.5" r="1.2" fill="#69686E" /><circle cx="8" cy="7" r="1.2" fill="#69686E" /><circle cx="5" cy="9.5" r="1.2" fill="#69686E" /><circle cx="2" cy="12" r="1.2" fill="#69686E" /></svg>
            <span>THE LEAF</span>
          </div>
          <h2 class="about-leaf-title">A Symbol of Change</h2>
          
          <h3 style="font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 500; color: #060612; margin-bottom: 24px;">More than a logo. A philosophy.</h3>
          <p class="about-leaf-intro" style="font-size: 16px; font-weight: 400; color: #69686E; line-height: 28px;">
            The leaf in our logo is not a design element. It is a metaphor.<br><br>
            A leaf moves through cycles - birth, growth, fall, and regeneration.<br>
            Just like brands. Just like businesses. Just like ideas.<br><br>
            Every organisation evolves. Our role is not to rush that evolution, but to guide it thoughtfully, making sure each phase feels authentic, relevant, and true to its purpose.<br><br>
            That guidance begins with understanding. Understanding your business. Your audience. Your challenges. Your ambitions.<br><br>
            Only then do we design systems, stories, platforms, and identities that grow with time, not break under it.
          </p>
        </div>

        <div class="about-leaf-right">
          <div class="about-leaf-outer-card">
            <div class="about-leaf-inner-card">
              <img src="./assets/story/Parivartan-Leaf.png" alt="Parivartan Leaf Visual Symbolism" class="leaf-symbol-image" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================== ABOUT TEAM ==================== -->
  <section class="about-team-section">
    <div class="about-team-container">
      <div class="about-team-header">
        <div class="about-team-tagline">
          <svg width="8" height="12" viewBox="0 0 10 14" fill="none" style="opacity: 0.35"><circle cx="2" cy="2" r="1.2" fill="#69686E" /><circle cx="5" cy="4.5" r="1.2" fill="#69686E" /><circle cx="8" cy="7" r="1.2" fill="#69686E" /><circle cx="5" cy="9.5" r="1.2" fill="#69686E" /><circle cx="2" cy="12" r="1.2" fill="#69686E" /></svg>
          <span>THE TEAM</span>
          <svg width="8" height="12" viewBox="0 0 10 14" fill="none" style="opacity: 0.35"><circle cx="8" cy="2" r="1.2" fill="#69686E" /><circle cx="5" cy="4.5" r="1.2" fill="#69686E" /><circle cx="2" cy="7" r="1.2" fill="#69686E" /><circle cx="5" cy="9.5" r="1.2" fill="#69686E" /><circle cx="8" cy="12" r="1.2" fill="#69686E" /></svg>
        </div>
        <h2 class="about-team-title">The People Behind Parivartan</h2>
        <h3 style="font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 500; color: #69686E; margin-bottom: 24px; text-align: center;">A team. A craft. A shared purpose.</h3>
        <p class="about-team-desc">
          There are teams and then there is Team Parivartan.<br>
          Designers. Developers. Strategists. Filmmakers. Marketers.<br>
          But more than titles, we are problem-solvers and creators.<br>
          Artists at heart. Technologists by practice.<br><br>
          When you work with Parivartan, you don’t work with departments.<br>
          You work with people who take ownership of ideas, outcomes, and long-term impact.
        </p>
      </div>

      <div class="about-team-grid">
        
        <!-- Member 1: Anand -->
        <div class="about-team-row layout-text-right">
          <div class="team-image-column">
            <div class="team-image-outer-card">
              <div class="team-image-card" style="background-image: url('./assets/story/Anand.png')">
                <div class="team-image-label-card">
                  <div class="label-text-container">
                    <span class="member-designation">Founder & CEO</span>
                    <div class="member-label-divider"></div>
                    <div class="member-name-row">
                      <h3 class="member-name">Anand Pohankar</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="team-text-column">
            <div class="member-description-paragraphs">
              <p class="member-desc-p">
                <strong>Defining line:</strong> Vision-driven, people-first, and relentlessly curious.
              </p>
              <p class="member-desc-p">
                Anand founded Parivartan with a belief that meaningful change begins with understanding. He brings clarity to complexity, blends design with business thinking, and leads with empathy and intent. For Anand, relationships matter as much as results, and long-term impact matters more than short-term wins.
              </p>
            </div>
          </div>
        </div>

        <!-- Member 2: Chaitanya -->
        <div class="about-team-row layout-text-left">
          <div class="team-image-column">
            <div class="team-image-outer-card">
              <div class="team-image-card" style="background-image: url('./assets/story/Chaitanya.png')">
                <div class="team-image-label-card">
                  <div class="label-text-container">
                    <span class="member-designation">Chief Technology Officer</span>
                    <div class="member-label-divider"></div>
                    <div class="member-name-row">
                      <h3 class="member-name">Chaitanya N</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="team-text-column">
            <div class="member-description-paragraphs">
              <p class="member-desc-p">
                <strong>Defining line:</strong> The quiet force behind everything that works seamlessly.
              </p>
              <p class="member-desc-p">
                Chaitanya anchors Parivartan’s technology thinking with depth and calm precision. He brings structure, foresight, and stability to every platform and system we build. Known for his measured approach and sharp execution, he ensures technology always supports the idea, never overshadows it.
              </p>
            </div>
          </div>
        </div>

        <!-- Member 3: Jagruti -->
        <div class="about-team-row layout-text-right">
          <div class="team-image-column">
            <div class="team-image-outer-card">
              <div class="team-image-card" style="background-image: url('./assets/story/Jagruti.png')">
                <div class="team-image-label-card">
                  <div class="label-text-container">
                    <span class="member-designation">Client Relations</span>
                    <div class="member-label-divider"></div>
                    <div class="member-name-row">
                      <h3 class="member-name">Jagruti Pohankar</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="team-text-column">
            <div class="member-description-paragraphs">
              <p class="member-desc-p">
                <strong>Defining line:</strong> The bridge between expectations and execution.
              </p>
              <p class="member-desc-p">
                Jagruti is the connective thread between clients and teams at Parivartan. With a natural ability to listen, align, and reassure, she ensures every engagement runs smoothly. Her strength lies in turning conversations into clarity and projects into long-term partnerships.
              </p>
            </div>
          </div>
        </div>

        <!-- Member 4: Pradeep -->
        <div class="about-team-row layout-text-left">
          <div class="team-image-column">
            <div class="team-image-outer-card">
              <div class="team-image-card" style="background-image: url('./assets/story/Pradeep.png')">
                <div class="team-image-label-card">
                  <div class="label-text-container">
                    <span class="member-designation">Team Lead</span>
                    <div class="member-label-divider"></div>
                    <div class="member-name-row">
                      <h3 class="member-name">Pradeep</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="team-text-column">
            <div class="member-description-paragraphs">
              <p class="member-desc-p">
                <strong>Defining line:</strong> Steady leadership with an eye for detail.
              </p>
              <p class="member-desc-p">
                Pradeep leads with consistency and quiet confidence. He balances team coordination with hands-on execution, ensuring quality across projects and people. His calm presence and structured thinking keep teams focused, aligned, and moving forward.
              </p>
            </div>
          </div>
        </div>

        <!-- Member 5: Jagadeesh -->
        <div class="about-team-row layout-text-right">
          <div class="team-image-column">
            <div class="team-image-outer-card">
              <div class="team-image-card" style="background-image: url('./assets/story/Jagadeesh.jpg'); background-color: #EFEFEF; background-size: cover;">
                <div class="team-image-label-card">
                  <div class="label-text-container">
                    <span class="member-designation">Programming Team Lead</span>
                    <div class="member-label-divider"></div>
                    <div class="member-name-row">
                      <h3 class="member-name">Jagadeesh</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="team-text-column">
            <div class="member-description-paragraphs">
              <p class="member-desc-p">
                <strong>Defining line:</strong> Precision-driven and solution-oriented.
              </p>
              <p class="member-desc-p">
                Jagadeesh approaches programming with discipline and depth. He focuses on building robust, scalable systems while guiding teams to think beyond code. His strength lies in breaking down complexity and delivering solutions that stand the test of time.
              </p>
            </div>
          </div>
        </div>

        <!-- Member 6: Sandeep -->
        <div class="about-team-row layout-text-left">
          <div class="team-image-column">
            <div class="team-image-outer-card">
              <div class="team-image-card" style="background-image: url('./assets/story/Sandeep.jpg'); background-color: #EFEFEF; background-size: cover;">
                <div class="team-image-label-card">
                  <div class="label-text-container">
                    <span class="member-designation">Senior Programmer</span>
                    <div class="member-label-divider"></div>
                    <div class="member-name-row">
                      <h3 class="member-name">Sandeep</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="team-text-column">
            <div class="member-description-paragraphs">
              <p class="member-desc-p">
                <strong>Defining line:</strong> Reliability built through experience.
              </p>
              <p class="member-desc-p">
                Sandeep brings patience, precision, and consistency to every build. He is known for his dependable approach and strong technical grounding, ensuring systems are stable, performant, and thoughtfully implemented.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- ==================== TIMELINE SECTION ==================== -->
  <section class="timeline-section" style="padding: 100px 0; background: #FAFAFA;">
    <div class="about-story-container" style="max-width: 1000px; margin: 0 auto; text-align: center;">
      <h2 style="font-family: 'Outfit', sans-serif; font-size: 32px; font-weight: 500; color: #060612; margin-bottom: 24px;">Our Journey</h2>
      <p style="font-family: 'Satoshi', sans-serif; font-size: 18px; line-height: 32px; color: #69686E; margin-bottom: 64px;">
        Every story is shaped by moments. Ours is shaped by the work we’ve done, the people we’ve partnered with, and the milestones that quietly defined our journey.
      </p>

      <div style="text-align: left; position: relative; padding-left: 32px; border-left: 2px solid #E1E1E1;">
        <!-- Timeline items -->
        <div style="margin-bottom: 40px; position: relative;">
          <span style="position: absolute; left: -41px; top: 4px; width: 16px; height: 16px; border-radius: 50%; background: #85BD56; border: 3px solid #FFF; box-shadow: 0 0 0 2px #E1E1E1;"></span>
          <h3 style="font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 600; color: #060612; margin-bottom: 8px;"><span style="color: #85BD56; margin-right: 8px;">2002</span> It began at home.</h3>
          <p style="font-family: 'Satoshi', sans-serif; font-size: 16px; color: #69686E; line-height: 26px;">Parivartan began in a dining hall with curiosity, ambition, and the belief that good work speaks louder than big setups.</p>
        </div>

        <div style="margin-bottom: 40px; position: relative;">
          <span style="position: absolute; left: -41px; top: 4px; width: 16px; height: 16px; border-radius: 50%; background: #FFF; border: 3px solid #85BD56;"></span>
          <h3 style="font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 600; color: #060612; margin-bottom: 8px;"><span style="color: #85BD56; margin-right: 8px;">2006</span> First shared office space.</h3>
          <p style="font-family: 'Satoshi', sans-serif; font-size: 16px; color: #69686E; line-height: 26px;">A small but significant step toward becoming a real, growing team.</p>
        </div>

        <div style="margin-bottom: 40px; position: relative;">
          <span style="position: absolute; left: -41px; top: 4px; width: 16px; height: 16px; border-radius: 50%; background: #FFF; border: 3px solid #85BD56;"></span>
          <h3 style="font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 600; color: #060612; margin-bottom: 8px;"><span style="color: #85BD56; margin-right: 8px;">2007</span> Application development takes shape.</h3>
          <p style="font-family: 'Satoshi', sans-serif; font-size: 16px; color: #69686E; line-height: 26px;">The foundations of our technology and software capabilities were laid.</p>
        </div>

        <div style="margin-bottom: 40px; position: relative;">
          <span style="position: absolute; left: -41px; top: 4px; width: 16px; height: 16px; border-radius: 50%; background: #FFF; border: 3px solid #85BD56;"></span>
          <h3 style="font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 600; color: #060612; margin-bottom: 8px;"><span style="color: #85BD56; margin-right: 8px;">2008</span> First government project.</h3>
          <p style="font-family: 'Satoshi', sans-serif; font-size: 16px; color: #69686E; line-height: 26px;">A milestone that brought responsibility, scale, and long-term trust.</p>
        </div>

        <div style="margin-bottom: 40px; position: relative;">
          <span style="position: absolute; left: -41px; top: 4px; width: 16px; height: 16px; border-radius: 50%; background: #FFF; border: 3px solid #85BD56;"></span>
          <h3 style="font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 600; color: #060612; margin-bottom: 8px;"><span style="color: #85BD56; margin-right: 8px;">2012</span> A defining year of growth.</h3>
          <p style="font-family: 'Satoshi', sans-serif; font-size: 16px; color: #69686E; line-height: 26px;">Major client wins across healthcare and enterprise sectors, including Care Hospitals, Green Gold, Makuta, and ARCI. This year also marked the completion of our first decade of work.</p>
        </div>

        <div style="margin-bottom: 40px; position: relative;">
          <span style="position: absolute; left: -41px; top: 4px; width: 16px; height: 16px; border-radius: 50%; background: #FFF; border: 3px solid #85BD56;"></span>
          <h3 style="font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 600; color: #060612; margin-bottom: 8px;"><span style="color: #85BD56; margin-right: 8px;">2014</span> 3,000+ projects delivered.</h3>
          <p style="font-family: 'Satoshi', sans-serif; font-size: 16px; color: #69686E; line-height: 26px;">Consistency, partnerships, and repeat trust became our biggest validation.</p>
        </div>

        <div style="margin-bottom: 40px; position: relative;">
          <span style="position: absolute; left: -41px; top: 4px; width: 16px; height: 16px; border-radius: 50%; background: #FFF; border: 3px solid #85BD56;"></span>
          <h3 style="font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 600; color: #060612; margin-bottom: 8px;"><span style="color: #85BD56; margin-right: 8px;">2018</span> The digital shift begins.</h3>
          <p style="font-family: 'Satoshi', sans-serif; font-size: 16px; color: #69686E; line-height: 26px;">We expanded strongly into digital-first thinking, platforms, and experiences.</p>
        </div>

        <div style="margin-bottom: 40px; position: relative;">
          <span style="position: absolute; left: -41px; top: 4px; width: 16px; height: 16px; border-radius: 50%; background: #FFF; border: 3px solid #85BD56;"></span>
          <h3 style="font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 600; color: #060612; margin-bottom: 8px;"><span style="color: #85BD56; margin-right: 8px;">2020</span> Work didn’t stop; it adapted.</h3>
          <p style="font-family: 'Satoshi', sans-serif; font-size: 16px; color: #69686E; line-height: 26px;">The team transitioned seamlessly to working from home, staying connected and committed.</p>
        </div>

        <div style="margin-bottom: 40px; position: relative;">
          <span style="position: absolute; left: -41px; top: 4px; width: 16px; height: 16px; border-radius: 50%; background: #FFF; border: 3px solid #85BD56;"></span>
          <h3 style="font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 600; color: #060612; margin-bottom: 8px;"><span style="color: #85BD56; margin-right: 8px;">2022</span> Two decades of Parivartan.</h3>
          <p style="font-family: 'Satoshi', sans-serif; font-size: 16px; color: #69686E; line-height: 26px;">Twenty years of evolving with technology, clients, and ideas.</p>
        </div>

        <div style="margin-bottom: 40px; position: relative;">
          <span style="position: absolute; left: -41px; top: 4px; width: 16px; height: 16px; border-radius: 50%; background: #FFF; border: 3px solid #85BD56;"></span>
          <h3 style="font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 600; color: #060612; margin-bottom: 8px;"><span style="color: #85BD56; margin-right: 8px;">2023</span> Recognising excellence and expanding capabilities.</h3>
          <p style="font-family: 'Satoshi', sans-serif; font-size: 16px; color: #69686E; line-height: 26px;">The Parivartan Excellence Awards were launched, and our mobile app development team was formed.</p>
        </div>

        <div style="margin-bottom: 40px; position: relative;">
          <span style="position: absolute; left: -41px; top: 4px; width: 16px; height: 16px; border-radius: 50%; background: #FFF; border: 3px solid #85BD56;"></span>
          <h3 style="font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 600; color: #060612; margin-bottom: 8px;"><span style="color: #85BD56; margin-right: 8px;">2024</span> 5,000+ projects completed.</h3>
          <p style="font-family: 'Satoshi', sans-serif; font-size: 16px; color: #69686E; line-height: 26px;">A reflection of sustained effort, long-term relationships, and trust earned over time.</p>
        </div>

        <div style="position: relative;">
          <span style="position: absolute; left: -41px; top: 4px; width: 16px; height: 16px; border-radius: 50%; background: #85BD56; border: 3px solid #FFF; box-shadow: 0 0 0 2px #E1E1E1;"></span>
          <h3 style="font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 600; color: #060612; margin-bottom: 8px;"><span style="color: #85BD56; margin-right: 8px;">2025</span> Still growing and still building.</h3>
          <p style="font-family: 'Satoshi', sans-serif; font-size: 16px; color: #69686E; line-height: 26px;">Parivartan continues to evolve, with national-level visibility including work associated with the ESTIC Conference, and many new chapters ahead.</p>
        </div>

      </div>

      <div style="margin-top: 80px; padding-top: 40px; border-top: 1px solid #E1E1E1;">
        <p style="font-family: 'Satoshi', sans-serif; font-size: 20px; font-style: italic; color: #3D5247; line-height: 32px;">
          "This timeline isn’t about milestones alone. It’s about staying relevant, staying curious, and continuing to design change that lasts."
        </p>
      </div>

    </div>
  </section>
"""

# Find start and end indices for replacement
start_marker = '<!-- ==================== ABOUT HERO ==================== -->'
end_marker = '<!-- ==================== TESTIMONIALS ==================== -->'

if start_marker in content and end_marker in content:
    start_idx = content.index(start_marker)
    end_idx = content.index(end_marker)
    
    # We will also remove Testimonials because it wasn't requested, and the flow ends with Closing Statement which leads naturally to CTA.
    # Wait, the CTA section is right after Testimonials.
    cta_marker = '<!-- ==================== CTA COLLABORATE ==================== -->'
    if cta_marker in content:
        end_idx = content.index(cta_marker)
        
    final_content = content[:start_idx] + new_body + '\n  ' + content[end_idx:]
    
    with open('story.html', 'w', encoding='utf-8') as f:
        f.write(final_content)
    print("Updated story.html successfully!")
else:
    print("Markers not found!")

