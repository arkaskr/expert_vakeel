import React, { useEffect, useRef, memo, useCallback } from 'react'
import CTA from '../components/CTA'
import DownloadButtons from '../components/DownloadButtons'
import smartphoneImage from '../assets/GIF1.gif'
import gif2Image from '../assets/GIF2.gif'
import image1 from '../assets/images 1.png'
import image2 from '../assets/images 2.png'
import image4 from '../assets/images 4.png'
import image5 from '../assets/images 5.png'
import ellipse10 from '../assets/Ellipse 10.png'
import ellipse11 from '../assets/Ellipse 11.png'
import ellipse12 from '../assets/Ellipse 12.png'
import ellipse13 from '../assets/Ellipse 13.png'
import ellipse14 from '../assets/Ellipse 14.png'
import ellipse15 from '../assets/Ellipse 15.png'

const HowItWorks: React.FC = memo(() => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const holdTimerRef = useRef<number | null>(null)

  const initializeAutoScroll = useCallback(() => {
    // Auto-scroll disabled intentionally to keep the section fixed
    return () => {}
  }, [])

  const handleNext = useCallback(() => {
    const viewport = scrollRef.current
    if (!viewport) return
    const scroller = viewport.firstElementChild as HTMLElement | null
    const firstCard = scroller?.querySelector('.feature-card-horizontal') as HTMLElement | null
    if (!firstCard) {
      viewport.scrollBy({ left: viewport.clientWidth, behavior: 'smooth' })
      return
    }
    const cardWidth = firstCard.getBoundingClientRect().width
    const gap = scroller ? parseFloat(getComputedStyle(scroller).columnGap || getComputedStyle(scroller).gap || '16') : 16
    viewport.scrollBy({ left: cardWidth + gap, behavior: 'smooth' })
  }, [])

  const handlePrev = useCallback(() => {
    const viewport = scrollRef.current
    if (!viewport) return
    const scroller = viewport.firstElementChild as HTMLElement | null
    const firstCard = scroller?.querySelector('.feature-card-horizontal') as HTMLElement | null
    const cardWidth = firstCard?.getBoundingClientRect().width || viewport.clientWidth
    const gap = scroller ? parseFloat(getComputedStyle(scroller).columnGap || getComputedStyle(scroller).gap || '16') : 16
    viewport.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' })
  }, [])

  const handlePressStart = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    // continuous scroll while holding the button
    const step = () => {
      if (!holdTimerRef.current) return
      el.scrollLeft += 12
      holdTimerRef.current = window.requestAnimationFrame(step)
    }
    if (!holdTimerRef.current) {
      holdTimerRef.current = window.requestAnimationFrame(step)
    }
  }, [])

  const handlePressStartLeft = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const step = () => {
      if (!holdTimerRef.current) return
      el.scrollLeft -= 12
      holdTimerRef.current = window.requestAnimationFrame(step)
    }
    if (!holdTimerRef.current) {
      holdTimerRef.current = window.requestAnimationFrame(step)
    }
  }, [])

  const handlePressEnd = useCallback(() => {
    if (holdTimerRef.current) {
      window.cancelAnimationFrame(holdTimerRef.current)
      holdTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    const cleanup = initializeAutoScroll()
    return cleanup
  }, [initializeAutoScroll])

  return (
    <div className="home-page howitworks-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container-fluid">
          <div className="hero-content stack-responsive">
            <div className="hero-text">
              <h1 className="hero-title heading-responsive">
                <span>India's</span> <span className="hero-highlight">Most Trusted</span><span> Legal Community App</span>
                
              </h1>
              <p className="hero-subtitle text-responsive">
                Connect with verified lawyers, collaborate on legal matters, share insights, and grow your legal career — all in one powerful app.
              </p>

              <DownloadButtons className="download-buttons" />
            </div>

            <div className="hero-visual flex-center">
              <div className="phone-mockup">
                <img
                  src={smartphoneImage}
                  alt="Legal Network App on Smartphone"
                  className="smartphone-image img-responsive"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Middle Section */}
      <section className="section community-section">
        <div className="container-fluid">
          <div className="community-header text-center">
            <div className="community-content">
              <h2 className="section-title heading-responsive">The Legal Community</h2>
              <p className="section-subtitle text-responsive">— Reimagined for the Digital Era</p>
              <button className="btn btn-secondary btn-large">Get Started</button>
            </div>
          </div>
      {/* Features Section */}

          <div className="features-grid grid-responsive-2 gap-responsive">
            {/* Row 1 */}
            <div className="feature-card">
              <p className="feature-title">Create & Customize Your Profile</p>
              <p className="feature-description">
                Sign up easily, add your details, area of practice, and experience — and you're ready to get discovered by thousands of legal professionals.
              </p>
            </div>

            <div className="feature-card">
              <p className="feature-title">Find & Connect with Lawyers</p>
              <p className="feature-description">
                Search and connect with other lawyers based on specialization, services, court, city, and gender. Build your professional network effortlessly.
              </p>
            </div>

            {/* Row 2 */}
            <div className="feature-card">
              <p className="feature-title">Chat & Collaborate</p>
              <p className="feature-description">
                Instantly start conversations with other lawyers to discuss cases, exchange insights, or seek advice. Real connections. Real growth.
              </p>
            </div>

            <div className="feature-card">
              <p className="feature-title">Legal News & Updates</p>
              <p className="feature-description">
                Access the latest legal news and judgments from verified sources. Stay informed and share your thoughts by liking, commenting, or sharing.
              </p>
            </div>

            {/* Row 3 */}
            <div className="feature-card">
              <p className="feature-title">Ask / Answer Legal Queries</p>
              <p className="feature-description">
                Post your legal questions or help others by answering theirs. Collaborate with other lawyers and the Legal Network team to grow your expertise and credibility.
              </p>
            </div>

            <div className="feature-card">
              <p className="feature-title">Smart Legal Diary with eCourts Integration</p>
              <p className="feature-description">
                Organize and track your legal cases seamlessly. Receive real-time case updates and hearing reminders directly from eCourts — ensuring you never miss a deadline.
              </p>
            </div>

            {/* Row 4 - Left card only */}
            <div className="feature-card">
              <p className="feature-title">Connected with Expert Vakeel</p>
              <p className="feature-description">
                Lawyers registered on Legal Network are also listed on Expert Vakeel, a client-facing platform where people searching for legal help can contact lawyers directly, chat instantly, and hire the right legal expert. This dual connection gives lawyers more visibility, leads, and opportunities to grow their practice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="section security-section">
        <div className="container-fluid">
          <div className="security-content">
            <div className="security-visual">
            <img 
              src={gif2Image} 
              alt="Legal Network App"
              className="cta-smartphone-image"
              loading="lazy"
              decoding="async"
            />
            </div>
            
            <div className="security-text">
              <h2 className="security-title">
                Verified, Secured &<br />Encrypted.
              </h2>
              <p className="security-subtitle">
                Join thousands of legal professionals already networking and collaborating digitally.
              </p>
              
              <div className="security-cta">
                <button className="btn btn-secondary btn-large">Get Started</button>
              </div>
              
              <div className="security-features">
                <div className="security-feature">
                  <div className="security-checkmark">✓</div>
                  <p>Verified Lawyer Community</p>
                </div>
                <div className="security-feature">
                  <div className="security-checkmark">✓</div>
                  <p>Official eCourts API Integration</p>
                </div>
                <div className="security-feature">
                  <div className="security-checkmark">✓</div>
                  <p>Seamless Mobile Experience</p>
                </div>
                <div className="security-feature">
                  <div className="security-checkmark">✓</div>
                  <p>Secure Communication</p>
                </div>
                <div className="security-feature">
                  <div className="security-checkmark">✓</div>
                  <p>Enhanced Visibility through Expert Vakeel</p>
                </div>
                <div className="security-feature">
                  <div className="security-checkmark">✓</div>
                  <p>Designed for India's Legal Ecosystem</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Relevant Section */}
      <section className="section more-relevant-section">
        <div className="container-fluid">
          <h2 className="section-title">
            <span className="heading-gray">Something</span> <span className="heading-blue">More Relevant</span>
          </h2>
          <p className="section-subtitle">Your Legal Practice, Now Digital — Network, Collaborate, and Grow Faster.</p>
          
          <div className="cards-container">
            <div className="cards-viewport" ref={scrollRef}>
              <div className="cards-scroll static">
              <div className="feature-card-horizontal">
                <div className="card-icon">
                  <img src={image1} alt="Verified Lawyers" className="card-icon-image" />
                </div>
                <p className="card-description">Verified Lawyers & Law Firms Community</p>
                <p className="card-description">
                  Join a trusted network of verified and authentic legal professionals from across India.
                </p>
              </div>
              
              <div className="feature-card-horizontal highlighted">
                <div className="card-icon">
                  <img src={image2} alt="Mobile Experience" className="card-icon-image" />
                </div>
                <p className="card-description">Seamless Mobile Experience</p>
                <p className="card-description">
                  Access all your legal tools – networking, news, and case tracking – in one easy-to-use mobile app.
                </p>
              </div>
              
              <div className="feature-card-horizontal">
                <div className="card-icon">
                  <img src={image4} alt="Secure Communication" className="card-icon-image" />
                </div>
                <p className="card-description">Secure Communication</p>
                <p className="card-description">
                  Chat and collaborate confidently with end-to-end protected conversations between verified lawyers.
                </p>
              </div>
              
              <div className="feature-card-horizontal">
                <div className="card-icon">
                  <img src={image5} alt="Expert Vakeel" className="card-icon-image" />
                </div>
                <p className="card-description">Enhanced Visibility through Expert Vakeel</p>
                <p className="card-description">
                  Get discovered by clients and grow your practice through our connected Expert Vakeel platform.
                </p>
              </div>
              
              <div className="feature-card-horizontal">
                <div className="card-icon">
                  <img src={image1} alt="Designed for India" className="card-icon-image" />
                </div>
                <p className="card-description">Designed for India</p>
                <p className="card-description">
                  Built specifically for India to simplify, digitalize, and empower legal professionals.
                </p>
              </div>
              </div>
            </div>
            <button
              type="button"
              className="cards-arrow-button left"
              aria-label="Previous"
              onClick={handlePrev}
              onMouseDown={handlePressStartLeft}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              onTouchStart={handlePressStartLeft}
              onTouchEnd={handlePressEnd}
            >
              ←
            </button>
            <button
              type="button"
              className="cards-arrow-button"
              aria-label="Next"
              onClick={handleNext}
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              onTouchStart={handlePressStart}
              onTouchEnd={handlePressEnd}
            >
              →
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section testimonials-section">
        <div className="container-fluid">
          <div className="testimonials-header">
            <h2 className="testimonials-title">What Users Are Saying</h2>
            <p className="testimonials-subtitle">Our beloved users</p>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-profile">
                <div className="profile-image">
                  <img src={ellipse10} alt="Adv. Priya Sinha" className="profile-image-img" />
                </div>
              </div>
              <div className="testimonial-content">
                <h3 className="testimonial-name">Adv. Priya Sinha, Delhi High Court</h3>
                <p className="testimonial-quote">
                  "Legal Network made it easier for me to collaborate with other lawyers across cities. The eCourts integration is a game-changer!"
                </p>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-profile">
                <div className="profile-image">
                  <img src={ellipse11} alt="Adv. Rohit Mehta" className="profile-image-img" />
                </div>
              </div>
              <div className="testimonial-content">
                <h3 className="testimonial-name">Adv. Rohit Mehta, Mumbai</h3>
                <p className="testimonial-quote">
                  "I started getting new case leads from Expert Vakeel after joining Legal Network. It's truly connecting the legal community."
                </p>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-profile">
                <div className="profile-image">
                  <img src={ellipse12} alt="Adv. Kavita Reddy" className="profile-image-img" />
                </div>
              </div>
              <div className="testimonial-content">
                <h3 className="testimonial-name">Adv. Kavita Reddy - Hyderabad</h3>
                <p className="testimonial-quote">
                  "The Legal Diary feature is a blessing. Getting automatic case updates from eCourts saves me time and keeps my daily schedule organized"
                </p>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-profile">
                <div className="profile-image">
                  <img src={ellipse13} alt="Adv. Ramesh Thakur" className="profile-image-img" />
                </div>
              </div>
              <div className="testimonial-content">
                <h3 className="testimonial-name">Adv. Ramesh Thakur - Lucknow</h3>
                <p className="testimonial-quote">
                  "Legal Network helped me connect with senior lawyers in my specialization. The chat and query sections are perfect for learning and professional growth"
                </p>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-profile">
                <div className="profile-image">
                  <img src={ellipse14} alt="Adv. Sneha Kapoor" className="profile-image-img" />
                </div>
              </div>
              <div className="testimonial-content">
                <h3 className="testimonial-name">Adv. Sneha Kapoor - Chandigarh</h3>
                <p className="testimonial-quote">
                  "I love the legal news feed! It keeps me updated with important judgments and current affairs. Plus, I can share and discuss with colleagues easily."
                </p>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-profile">
                <div className="profile-image">
                  <img src={ellipse15} alt="Adv. Arjun Menon" className="profile-image-img" />
                </div>
              </div>
              <div className="testimonial-content">
                <h3 className="testimonial-name">Adv. Arjun Menon - Kochi</h3>
                <p className="testimonial-quote">
                  "The integration with Expert Vakeel is a smart move. It has helped me get genuine case leads and build long-term client relationships"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Component */}
      <CTA />
    </div>
  )
})

HowItWorks.displayName = 'HowItWorks'

export default HowItWorks